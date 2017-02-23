import React, { Component } from 'react'
import PullElement from '../../../'

export default class AnimatedTabs extends Component {
	componentDidMount() {
		let { target, tabs } = this.refs
		this.pullElement = new PullElement({
			target: target,
		})
		this.pullElement.init()
		this.pullElement.disable()
	}
	componentWillUnmount() {
		this.pullElement.destroy()
	}
	handleSwitchTab = ({currentTarget}) => {
		let { tabs, target } = this.refs
		Array.from(tabs.querySelectorAll('.tab-link')).forEach((elem, index) => {
			if (elem !== currentTarget) {
				elem.classList.remove('active')
			} else {
				elem.classList.add('active')
				this.pullElement.animateTo(-target.clientWidth * index, 0)
			}
		})
	}
	render() {
		return (
			<div className="views">
		    	<div className="view view-main">
			    	<div className="navbar">
				    <div className="navbar-inner">
				        <div className="left sliding"><a href="#/" className="back link"><i className="icon icon-back"></i><span>Back</span></a></div>
				        <div className="center sliding">Animated Tabs</div>
				        <div className="right"><a href="#/" className="link open-panel icon-only"><i className="icon icon-bars"></i></a></div>
				        <div className="subnavbar sliding">
				            <div className="buttons-row" ref="tabs">
				            	<a href="javascript:;" className="button active tab-link" onClick={this.handleSwitchTab}>Tab 1</a>
				            	<a href="javascript:;" className="button tab-link" onClick={this.handleSwitchTab}>Tab 2</a>
				            	<a href="javascript:;" className="button tab-link" onClick={this.handleSwitchTab}>Tab 3</a>
				            </div>
				        </div>
				    </div>
				</div>
				<div className="pages navbar-through">
				    <div data-page="tabs-animated" className="page with-subnavbar">
				        <div className="tabs-animated-wrap">
				        		<style type="text/css" dangerouslySetInnerHTML={{__html:`
				        			.tabs-animated-wrap>.tabs {
				        				 -webkit-transition-duration: 0ms;
    									 transition-duration: 0ms;
				        			}
				        		`}} />
				            	<div className="tabs" ref="target">
					                <div id="tab1" className="page-content tab">
					                    <div className="content-block">
					                        <p>This is tab 1 content</p>
					                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum mi quis felis scelerisque faucibus. Aliquam ut commodo justo. Mauris vitae pharetra arcu. Sed tincidunt dui et nibh auctor pretium. Nam accumsan fermentum sem. Suspendisse potenti. Nulla sed orci malesuada, pellentesque elit vitae, cursus lorem. Praesent et vehicula sapien, ut rhoncus quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae mi nec lorem aliquet venenatis quis nec nibh. Aenean sit amet leo ligula. Fusce in massa et nisl dictum ultricies et vitae dui. Sed sagittis quis diam sed lobortis. Donec in massa pharetra, tristique purus vitae, consequat mauris. Aliquam tellus ante, pharetra in mattis ut, dictum quis erat.</p>
					                        <p>Ut ac lobortis lacus, non pellentesque arcu. Quisque sodales sapien malesuada, condimentum nunc at, viverra lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eu pulvinar turpis, id tristique quam. Aenean venenatis molestie diam, sit amet condimentum nisl pretium id. Donec diam tortor, mollis in vehicula id, vehicula consectetur nulla. Quisque posuere rutrum mauris, eu rutrum turpis blandit at. Proin volutpat tortor sit amet metus porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut dapibus posuere dictum.</p>
					                    </div>
					                </div>
					                <div id="tab2" className="page-content tab">
					                    <div className="content-block">
					                        <p>This is tab 2 content</p>
					                        <p>Ut ac lobortis lacus, non pellentesque arcu. Quisque sodales sapien malesuada, condimentum nunc at, viverra lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eu pulvinar turpis, id tristique quam. Aenean venenatis molestie diam, sit amet condimentum nisl pretium id. Donec diam tortor, mollis in vehicula id, vehicula consectetur nulla. Quisque posuere rutrum mauris, eu rutrum turpis blandit at. Proin volutpat tortor sit amet metus porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut dapibus posuere dictum.</p>
					                        <p>Fusce luctus turpis nunc, id porta orci blandit eget. Aenean sodales quam nec diam varius, in ornare ipsum condimentum. Aenean eleifend, nulla sit amet volutpat adipiscing, ligula nulla pharetra risus, vitae consequat leo tortor eu nunc. Vivamus at fringilla metus. Duis neque lectus, sagittis in volutpat a, pretium vel turpis. Nam accumsan auctor libero, quis sodales felis faucibus quis. Etiam vestibulum sed nisl vel aliquet. Aliquam pellentesque leo a lacus ultricies scelerisque. Vestibulum vestibulum fermentum tincidunt. Proin eleifend metus non quam pretium, eu vehicula ipsum egestas. Nam eget nibh enim. Etiam sem leo, pellentesque a elit vel, egestas rhoncus enim. Morbi ultricies adipiscing tortor, vitae condimentum lacus hendrerit nec. Phasellus laoreet leo quis purus elementum, ut fringilla justo eleifend. Nunc ultricies a sapien vitae auctor. Aliquam id erat elementum, laoreet est et, dapibus ligula.</p>
					                    </div>
					                </div>
					                <div id="tab3" className="page-content tab">
					                    <div className="content-block">
					                        <p>This is tab 3 content</p>
					                        <p>Nulla gravida libero eget lobortis iaculis. In sed elit eu nibh adipiscing faucibus. Sed ac accumsan lacus. In ut diam quis turpis fringilla volutpat. In ultrices dignissim consequat. Cras pretium tortor et lorem condimentum posuere. Nulla facilisi. Suspendisse pretium egestas lacus ac laoreet. Mauris rhoncus quis ipsum quis tristique. Vivamus ultricies urna quis nunc egestas, in euismod turpis fringilla. Nam tellus massa, vehicula eu sapien non, dapibus tempor lorem. Fusce placerat orci arcu, eu dignissim enim porttitor vel. Nullam porttitor vel dolor sed feugiat. Suspendisse potenti. Maecenas ac mattis odio. Sed vel ultricies lacus, sed posuere libero.</p>
					                        <p>Nulla gravida libero eget lobortis iaculis. In sed elit eu nibh adipiscing faucibus. Sed ac accumsan lacus. In ut diam quis turpis fringilla volutpat. In ultrices dignissim consequat. Cras pretium tortor et lorem condimentum posuere. Nulla facilisi. Suspendisse pretium egestas lacus ac laoreet. Mauris rhoncus quis ipsum quis tristique. Vivamus ultricies urna quis nunc egestas, in euismod turpis fringilla. Nam tellus massa, vehicula eu sapien non, dapibus tempor lorem. Fusce placerat orci arcu, eu dignissim enim porttitor vel. Nullam porttitor vel dolor sed feugiat. Suspendisse potenti. Maecenas ac mattis odio. Sed vel ultricies lacus, sed posuere libero.</p>
					                    </div>
					                </div>
					            </div>
				        </div>
				    </div>
				</div>
		    	</div>
		    </div>
		)
	}
}