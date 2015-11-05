import Source from '../Source'

// SoundCloud API Endpoints
// http://api.soundcloud.com/tracks/210487347/stream?client_id={client_id}
// http://api.soundcloud.com/tracks/210487347.json?client_id={client_id}
http://api.soundcloud.com/tracks?q={search_term}&client_id={client_id}

const client = '23463cedd4103cea3a1439223051aaa3'

export default class SoundCloud extends Source {
	constructor(ctx, output, params) {
		super(ctx, params)

		const audio = new Audio()

		audio.crossOrigin = 'anonymous'
		audio.src = `http://api.soundcloud.com/tracks/${ params.track }/stream?client_id=${ client }`


		this.source = ctx.createMediaElementSource(audio)

		this.source.connect(output)
	}

	play() {
		this.source.mediaElement.play()
	}

	pause() {
		this.source.mediaElement.pause()
	}
}