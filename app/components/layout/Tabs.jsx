import 'styles/components/tabs.scss'
import ReactDOM from 'react-dom'

export default class Preview extends Component {
	componentWillMount() {
		this.setState({active: 0})
	}

	tab(e, tab){
		e.stopPropagation()
		e.preventDefault()

		// Re-render tabs
		this.setState({active: tab})
	}

	render() {
		const tabLables   = []
		const tabContents = []
console.log(this.state)
		// Map all tabs
		this.props.children.map((child, i) => {
			const active = this.state.active === i ? 'active' : ''

			tabLables.push(
				<li className='nav-item' key={`${ child.props.tab }-label`}>
					<a href='#' className={`nav-link ${ active }`} onClick={e => this.tab(e, i)}>{child.props.tab}</a>
				</li>
			)

			tabContents.push(<div role='tabpanel' className={`tab-pane ${ active }`} key={`${ child.props.tab }-tab`}>{ child }</div>)
		})

		return (
			<div className='tabs'>
				<ul className='nav nav-tabs'>{ tabLables }</ul>
				<div className='tab-content'>{ tabContents }</div>
			</div>
		)
	}
}