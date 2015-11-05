import Scene from 'controllers/Scene'

export default class BarsScene extends Scene {
	render(ts, analysis) {
		const scale = this.ctx.canvas.height

		let pointWidth = this.ctx.canvas.width / (analysis.frequencyBinCount )
		
		this.ctx.save()
	      // Draw waveform
	      this.ctx.beginPath()

	        this.ctx.moveTo( 0, scale / 2 + (analysis.timeDomain[analysis.zeroCrossing]) * scale / 2)
	      
	        for (var i=analysis.zeroCrossing, j=0; ( j < this.ctx.canvas.width ) && ( i < analysis.frequencyBinCount ); i++, j++) {
	          this.ctx.lineTo( j,analysis.timeDomain[i] * scale / 2 + scale / 2)
	        }

			this.ctx.strokeStyle = 'yellow'
			this.ctx.stroke()
		this.ctx.restore()
	}
}