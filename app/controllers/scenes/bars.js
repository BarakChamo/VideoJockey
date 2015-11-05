import Scene from 'controllers/Scene'

export default class BarsScene extends Scene {
	render(ts, analysis) {
		const scale = this.ctx.canvas.height / 256

		let pointWidth = this.ctx.canvas.width / (analysis.frequencyBinCount )
		
		this.ctx.save()
			this.ctx.beginPath()
			this.ctx.moveTo(0, this.ctx.canvas.height / 2.0)
			for (let i = 0; i < analysis.frequencyBinCount ; i++) {
				this.ctx.lineTo(i * pointWidth, this.ctx.canvas.height - analysis.frequency[i] / 256.0 * this.ctx.canvas.height )
			}

			this.ctx.strokeStyle = 'lightblue'
			this.ctx.stroke()
		this.ctx.restore()
	}
}