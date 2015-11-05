/*
	Setup Scenes
*/

// Import all scene definitions
import Scenes from 'controllers/scenes'

let last
const canvas = document.getElementById('preview'),
			ctx 	 = canvas.getContext('2d')

// Initialize scene instances
const scenes = Scenes(ctx)

function setCanvas(){
	canvas.width  = window.innerWidth
	canvas.height = window.innerHeight
	canvas.style.width   = window.innerWidth  + 'px'
	canvas.style.height  = window.innerHeight + 'px'
}

window.onresize = setCanvas


/*
	Rendering Loop
*/

function render(ts) {
	// Clear canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

	// Beat finder
	ctx.fillRect(50, 50, window.ANALYSIS.beatLevel, window.ANALYSIS.beatLevel)

	// Loop over all active scenes and render
	for (let scene of SCENES) scenes[scene].render(ts, window.ANALYSIS)
}


/*
	Listen For Data
*/

window.addEventListener('message', m => render(m.data), false)