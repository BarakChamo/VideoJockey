/*
	Stage manager

	Orchestration handler for audio source and visual scene sync.
*/ 

import EventEmitter from 'eventemitter3'

import audio from './Audio'
import midi  from './MIDI'

const RAF = (requestAnimationFrame || webkitRequestAnimationFrame)

class StageController extends EventEmitter {
	constructor(){
		super()

		this.scenes = []
	}

	run() {
		this.frame(0)
	}

	frame(ts) {
		// run audio analysis
		audio.analyse()

		// Emit a new frame with the latest analysis data
		this.emit('frame', ts)

		// Re-run frame
		RAF(ts => this.frame(ts))
	}

	addScene(scene) {
		if(this.scenes.indexOf(scene) < 0) this.scenes.push(scene)
	}
}

// Export singleton
export default new StageController