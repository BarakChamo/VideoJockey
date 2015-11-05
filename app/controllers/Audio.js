import sources from './sources/'

// Cross-browser fixes
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
window.AudioContext    = AudioContext || webkitAudioContext

let ctx = new AudioContext()

// Vocoder parameters
const analysisRate = 100,
      startFreq    = 55,
      endFreq      = 7040,
      fftSize      = 1024,
      vocoderBands = 28 // or 14 if this gets to heavy

// Audio Analysis
const minAmp     = -100, // Default: -100
      maxAmp     = 0,    // Default: -30
      smoothing  = 0.85, // Default: 0.8
      minFreq    = 40,
      maxFreq    = 20000,
      minVal     = 135

// Beat detection
const beatHoldTime  = 15,   // num of frames to hold a beat (Default: 15)
      beatDecayRate = 0.97, // beat decay rate per frame
      beatMinVol    = 0.25, // minimum vol to consider a beat
      beatLevelUp   = 1.10  // Beat threashold after detection

// Pitch detection
const minSamples = 0

function convertToMono( input ) {
  let splitter = ctx.createChannelSplitter(2),
      merger   = ctx.createChannelMerger(2)

  input.connect( splitter )

  splitter.connect( merger, 0, 0 )
  splitter.connect( merger, 0, 1 )
  
  return merger
}

// AUDIO CONTROLLER
class AudioController {
  constructor(patch) {
    this.ctx = ctx

    this.callbacks = []

    /*
      Audio
    */ 

    this.output = ctx.createGain()
    this.output.connect(ctx.destination)

    /*
      Analyser
    */ 

    // Initialize analyser
    this.analyser = ctx.createAnalyser()
    this.analyser.smoothingTimeConstant = smoothing
    
    // Decibel floor and ceiling
    this.analyser.minDecibels = minAmp
    this.analyser.maxDecibels = maxAmp

    // The higher this is, the more data we have (slows down processing)
    this.analyser.fftSize = fftSize

    // Connect analyser
    this.output.connect(this.analyser)

    // Frequency analysis data
    this.analysis = {
      frequency:  new Uint8Array(this.analyser.frequencyBinCount),
      timeDomain: new Float32Array(this.analyser.frequencyBinCount),
      frequencyBinCount: 0,
      zeroCrossing: 0,
      beatLevel: 0,
      pitch: {
        frequency: 0,
        note: 0
      }
    }

    // Kickstart analysis
    this.analyse()
  }

  onAnalysis(fn){
    this.callbacks.push(fn)
  }

  loadSource(type, params) {
    // Destroy previous source
    this.source && this.source.destroy()
    this.source =  undefined

    // Load new audio source for analysis
    this.source = new sources[type](ctx, this.output, params)
  }

  play() {
    this.source && this.source.play()
  }

  pause() {
    this.source && this.source.pause()
  }

  stop() {
    this.source && this.source.stop()
  }

  noteToFreq(d) {
    // https://en.wikipedia.org/wiki/MIDI_Tuning_Standard
    return Math.pow( 2, (( d - 69 ) / 12) ) * 440
  }

  analyse() {
    // setTimeout(() => {
      
    // Web Audio Analysis
    this.analyser.getFloatTimeDomainData(this.analysis.timeDomain)
    this.analyser.getByteFrequencyData( this.analysis.frequency)

    // Update frequencyBinCount
    this.analysis.frequencyBinCount = this.analyser.frequencyBinCount

    // Detect zero crossing
    this.analysis.zeroCrossing = this.zeroCrossing()

    // Detect beat level
    this.analysis.beatLevel = this.beatDetection()

    // Detect pitch
    const pitch = this.pitchDetection()

    if(pitch !== -1){      
      this.analysis.pitch.frequency = pitch
      this.analysis.pitch.note =  Math.round( 12 * (Math.log( pitch / 440 ) / Math.log(2) ) ) + 69
    }

    return this.analysis

      // this.analyse()
    // }, 1000 / analysisRate)
  }
  
  zeroCrossing() {
    let i = 0,
        l = this.analyser.frequencyBinCount,
        last_zero = -1,
        t

    // advance until we're zero or negative
    while ( ( i < l ) && ( this.analysis.frequency[i] > 128 ) ) i++

    // Check for buffer overflow
    if (i >= l) return 0

    // advance until we're above minVal, keeping track of last zero.
    while (( i < l ) && ( ( t = this.analysis.frequency[i] ) < minVal ) ) {

      if (t >= 128) {
        if (last_zero === -1) last_zero = i
      } else {
        last_zero = -1
      }

      i++
    }

    // we may have jumped over minVal in one sample.
    if (last_zero === -1) last_zero = i

    // We didn't find any positive zero crossings
    if (i === l) return 0

    // The first sample might be a zero.  If so, return it.
    if (last_zero === 0) return 0

    return last_zero
  }

  beatDetection() {
    this.beatCutOff = this.beatCutOff || 0
    this.beatTime   = this.beatTime   || 0

    // Calculate average level across frame
    const level = this.analysis.frequency.reduce((p, c) => p + c, 0) / this.analysis.frequency.length

    // if BEAT!
    if (level > this.beatCutOff){
      // Re-assign beat cutoff to up the threashold
      this.beatCutOff = level * beatLevelUp

      // Start counting beat frames
      this.beatTime = 0

      // Beat!
      return level

    } else {      
      if (this.beatTime <= beatHoldTime){
        this.beatTime ++
      }else{
        this.beatCutOff = Math.max( this.beatCutOff * beatDecayRate, beatMinVol )
      }

      // No beat
      return 0
    }
  }

  pitchDetection() {
    const maxSamples = Math.floor(this.analysis.timeDomain.length/2)

    let best_offset = -1,
        best_correlation = 0,
        rms = 0,
        foundGoodCorrelation = false,
        correlations = new Array(maxSamples)

    for (var i = 0; i < this.analysis.timeDomain.length; i++) rms += this.analysis.timeDomain[i] * this.analysis.timeDomain[i]

    rms = Math.sqrt(rms/this.analysis.timeDomain.length)
    if (rms<0.01) return -1 // not enough signal

    let lastCorrelation = 1
    for (var offset = minSamples; offset < maxSamples; offset++) {
      let correlation = 0

      for (var i = 0; i < maxSamples; i++) correlation += Math.abs((this.analysis.timeDomain[i])-(this.analysis.timeDomain[i+offset]))

      correlation = 1 - (correlation/maxSamples)
      correlations[offset] = correlation // store it, for the tweaking we need to do below.

      if ((correlation > 0.9) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true

        if (correlation > best_correlation) {
          best_correlation = correlation
          best_offset = offset
        }
      } else if (foundGoodCorrelation) {
        // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
        // Now we need to tweak the offset - by interpolating between the values to the left and right of the
        // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
        // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
        // (anti-aliased) offset.

        // we know best_offset >=1, 
        // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
        // we can't drop into this clause until the following pass (else if).
        const shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset]
        return ctx.sampleRate / (best_offset + ( 8 * shift))
      }

      lastCorrelation = correlation
    }

    if (best_correlation > 0.01) ctx.sampleRate/best_offset

    // No significant pitch found
    return -1
  }
}

// Export singleton
export default new AudioController()