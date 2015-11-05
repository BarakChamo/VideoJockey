import 'styles/components/preview.scss'

import ReactDOM from 'react-dom'
import audio    from 'controllers/Audio'
import stage    from 'controllers/Stage'

export default class Preview extends Component {
  shouldComponentUpdate(nextProps) {
    // Get updates

    // Never re-render canvas, we'll lose the context
    return false
  }

  componentDidMount() {
    const frame = ReactDOM.findDOMNode(this).getElementsByTagName('iframe')[0]
    // frame.contentWindow.postMessage
    frame.onload = e => this.ready(frame)
  }

  startPreview(ctx) {

  }

  ready(frame) {
    // Link audio analysis to preview frame's window -- (DOES THIS COPY OR REFERENCE?!?)
    frame.contentWindow.ANALYSIS = audio.analysis
    frame.contentWindow.SCENES = stage.scenes

    // Listen for new frames
    stage.on('frame', ts => frame.contentWindow.postMessage(ts, '*'))
  }

  render() {
    return (
      <div className="preview">
        <div className="open-preview" onClick={e => window.openPreview()}>⤢</div>
        <iframe src="preview.html"></iframe>
      </div>
    )
  }
}