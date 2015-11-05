import Bars 		from './bars'
import Circle 	from './circle'
import Waveform from './waveform'

export default function scenes(ctx){
	return {
		bars:   	new Bars(ctx),
		circle: 	new Circle(ctx),
		waveform: new Waveform(ctx)
	}	
}

