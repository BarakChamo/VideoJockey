import ReactDOM from 'react-dom'
import audio    from 'controllers/Audio'
import stage    from 'controllers/Stage'
import Tabs 	from './layout/Tabs'

export default class Preview extends Component {
  render() {
    return (
      <div className="player">
      	<Tabs>
      		<div tab='SoundCloud'>
      			SoundCloud
  			</div>
      		<div tab='YouTube'>
      			YouTube
  			</div>
      		<div tab='Input'>
      			Input
  			</div>
      		<div tab='File'>
      			Tab 4
  			</div>
      	</Tabs>
      </div>
    )
  }
}