export default class AudioSourceController {
  constructor(ctx, output, params) {
  	this.output = output
  	this.ctx = ctx
  }

  start() {

  }

  pause() {

  }

  stop() {
  	this.pause()
  }

  load() {

  }

  parse() {

  }

  destroy() {
  	this.stop()
  	this.source.disconnect(this.output)
  }
}