import 'styles/desktop.scss'

// Controllers
import   stage   from 'controllers/Stage'
import   audio   from 'controllers/Audio'
import   MIDI    from 'controllers/MIDI'

// React stuff
import Flux       from './Flux'
import ReactDOM   from 'react-dom'
import Component  from 'flummox/component'

// Components
import Preview    from 'components/Preview'
import Player     from 'components/Player'


/*
	Initialize Flux
*/

let flux = new Flux()


/*
	Initialize View
*/ 

/*
	Structure to implement:
		* Audio Player (search and transport)

		* Clip Coniguration panels
		* Preview
*/

ReactDOM.render(
	<Component flux={flux}>
		<div className="container-fluid app-container">
			<div className="row app-row">
				<div className="col-xs-4 app-section-container">
					<div className="col-xs-4 app-section-container-inner">
						/* Composition */
					</div>
				</div>
				<div className="col-xs-8 app-section-container">
					<div className="col-xs-8 app-section-container-inner">
						/* Clips */
					</div>
				</div>
			</div>
			<div className="row app-row">
				<div className="col-xs-4 app-section-container">
					<div className="col-xs-4 app-section-container-inner">
						<Player/>
					</div>
				</div>
				<div className="col-xs-4 app-section-container">
					<div className="col-xs-4 app-section-container-inner">
						/* Clip Parameters */
					</div>
				</div>
				<div className="col-xs-4 app-section-container">
					<div className="col-xs-4 app-section-container-inner">
						<Preview/>
					</div>
				</div>
			</div>
		</div>
	</Component>,
	document.getElementById('container')
)


/*
	Global preview handler
*/ 

function openPreview() {
	let frame = window.open('/preview.html', 'vjPreviewFrame', "width=400, height=400")



	// Link audio analysis to preview frame's window -- (DOES THIS COPY OR REFERENCE?!?)
	frame.ANALYSIS = audio.analysis
	frame.SCENES   = stage.scenes

	const handler = ts => {
		if (frame.closed) {
			stage.off('frame', handler)
			return frame = undefined
		}
		
		frame.postMessage(ts, '*')
	}

	// Listen for new frames
	stage.on('frame',  handler)

	return frame
}

/*
	Kickstart
*/ 

// JACK U - 210487347
// DADA LIFE - 131322689
// Django Django - 30175361

// Start audio
audio.loadSource('soundcloud', {track: 30175361})
audio.play(100000)

// Set scenes
stage.addScene('bars')
stage.addScene('waveform')
stage.addScene('circle')

// Open preview
window.openPreview = openPreview

// Start stage
stage.run()

