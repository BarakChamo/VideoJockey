import Scene from 'controllers/Scene'

export default class CircleScene extends Scene {
	render(ts, analysis) {
		let midX = this.ctx.canvas.width / 2.0
		let midY = this.ctx.canvas.height / 2.0

		this.ctx.save()
			this.ctx.beginPath()

				let n_data = analysis.frequency.length - 128
				let scale = midY * 5
				let amp,angleR
				
				if (analysis.frequency) {
					for (let i = 0; i < n_data; i++) {
						angleR = i / n_data * 2 * Math.PI + Math.PI/2
						amp = Math.pow(analysis.frequency[i], 0.75)
						this.ctx.moveTo(midX, midY)
						this.ctx.lineTo(midX + Math.cos(angleR) * amp / 256.0 * scale, midY + Math.sin(angleR) * amp / 256.0 * scale)
					}
				}

			this.ctx.strokeStyle = 'lightgreen'
			this.ctx.stroke()
		this.ctx.restore()
	}
}