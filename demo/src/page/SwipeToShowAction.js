import React, { Component } from 'react'
import Header from '../component/Header'
import PullElement from '../../../'
import delay from '../util/delay'

export default function Root() {
	return (
	<div className="views">
	    <div className="view view-main" data-page="index">
	        <Header />
	        <div className="pages navbar-through toolbar-through">
	        	<div className="page page-on-center">
		        	<div className="page-content">
				        <div className="content-block">
				            <p>Swipe out actions on list elements. It allows you to call hidden menu for each list element where you can put default ready-to use delete button or any other buttons for some required actions. </p>
				        </div>
				        <div className="content-block-title">Swipe to show hidden action</div>
				        <div className="list-block">
				            <ul>
				            	<SwipeToShowAction text="Swipe left on me please" />
					            <SwipeToShowTowActions text="Swipe left on me for more actions" />
					            <SwipeToShowActionOnRight text="Swipe right on me please" />
					            <li className="swipeout">
									<div>
						                <div className="item-content swipeout-content">
						                    <div className="item-media">
						                    	<i className="icon icon-red">S</i>
						                    </div>
						                    <div className="item-inner" style={{ minHeight: 50 }}>
						                        <div className="item-title">I can't swipe to show action</div>
						                    </div>
						                </div>
						             </div>
					            </li>
				            </ul>
				        </div>
				        <div className="content-block-title">On both sides with overswipes</div>
				        <div className="list-block media-list">
				        	<ul>
				        		<SwipeToShowActionOnBothSide />
				        	</ul>
				        </div>
				    </div>
		        </div>
	        </div>
	    </div>
	</div>
	)
}

class SwipeToShowAction extends Component {
	addPullElement() {
		this.pullElement = new PullElement({
			target: this.refs.container,
			wait: false,
			onPullRight({ translateX }) {
				if (translateX >= 0) {
					this.preventDefault()
					this.setTranslate(0, 0)
				}
			},
			onPullLeft({ translateX }) {
				if (-translateX > 109) {
					this.preventDefault()
					this.setTranslate(-109, 0)
				} 
			},
			onPullLeftEnd({ translateX }) {
				if (-translateX >= 30) {
					this.preventDefault()
					this.animateTo(-109, 0)
				} 
			}
		})
		this.pullElement.init()
	}
	removePullElement() {
		this.pullElement.destroy()
	}
	addOuterTouchStartListener() {
		document.addEventListener('touchstart', this.handleOuterTouchStart)
	}
	removeOuterTouchStartListener() {
		document.removeEventListener('touchstart', this.handleOuterTouchStart)
	}
	handleAction = ({ currentTarget }) => {
		alert(currentTarget.textContent)
		this.pullElement.animateToOrigin()
	}
	handleOuterTouchStart = ({ target }) => {
		let node = this.refs.node
		if (node !== target && !node.contains(target)) {
			this.pullElement.animateToOrigin()
		}
	}
	componentDidMount() {
		this.addPullElement()
		this.addOuterTouchStartListener()
	}
	componentWillUnmount() {
		this.removePullElement()
		this.removeOuterTouchStartListener()
	}
	render() {
		let { text } = this.props
		return (
			<li className="swipeout" ref="node">
				<div ref="container">
	                <div className="item-content swipeout-content">
	                    <div className="item-media">
	                    	<i className="icon icon-red">S</i>
	                    </div>
	                    <div className="item-inner" style={{ minHeight: 50 }}>
	                        <div className="item-title">{text}</div>
	                    </div>
	                </div>
	                <div className="swipeout-actions-right">
	                	<a
	                		href="javascript:;"
	                		className="swipeout-delete"
	                		onClick={this.handleAction}
	                	>
	                		Delete
	                	</a>
	                </div>
	             </div>
            </li>
		)
	}
}


class SwipeToShowTowActions extends Component {
	addPullElement() {
		this.pullElement = new PullElement({
			target: this.refs.container,
			wait: false,
			pullRight: true,
			onPullLeftEnd({ translateX }) {
				if (-translateX >= 50) {
					this.preventDefault()
					this.animateTo(-207, 0)
				} 
			}
		})
		this.pullElement.init()
	}
	removePullElement() {
		this.pullElement.destroy()
	}
	addOuterTouchStartListener() {
		document.addEventListener('touchstart', this.handleOuterTouchStart)
	}
	removeOuterTouchStartListener() {
		document.removeEventListener('touchstart', this.handleOuterTouchStart)
	}
	handleAction = ({ currentTarget }) => {
		alert(currentTarget.textContent)
		this.pullElement.animateToOrigin()
	}
	handleOuterTouchStart = ({ target }) => {
		let node = this.refs.node
		if (node !== target && !node.contains(target)) {
			this.pullElement.animateToOrigin()
		}
	}
	componentDidMount() {
		this.addPullElement()
		this.addOuterTouchStartListener()
	}
	componentWillUnmount() {
		this.removePullElement()
		this.removeOuterTouchStartListener()
	}
	render() {
		let { text } = this.props
		return (
			<li className="swipeout transitioning" ref="node">
				<div ref="container">
				    <div className="item-content swipeout-content">
				        <div className="item-media"><i className="icon icon-red">S</i></div>
				        <div className="item-inner" style={{ minHeight: 50 }}>
				            <div className="item-title">{text}</div>
				        </div>
				    </div>
				    <div className="swipeout-actions-right">
				    	<a href="javascript:;" className="demo-actions" onClick={this.handleAction}>More</a>
				    	<a href="javascript:;" className="swipeout-delete" onClick={this.handleAction}>Delete</a>
				    </div>
				</div>
			</li>
		)
	}
}

class SwipeToShowActionOnRight extends Component {
	addPullElement() {
		this.pullElement = new PullElement({
			target: this.refs.container,
			wait: false,
			pullLeft: true,
			onPullRightEnd({ translateX }) {
				if (translateX >= 50) {
					this.preventDefault()
					this.animateTo(225, 0)
				}
			}
		})
		this.pullElement.init()
	}
	removePullElement() {
		this.pullElement.destroy()
	}
	addOuterTouchStartListener() {
		document.addEventListener('touchstart', this.handleOuterTouchStart)
	}
	removeOuterTouchStartListener() {
		document.removeEventListener('touchstart', this.handleOuterTouchStart)
	}
	handleOuterTouchStart = ({ target }) => {
		let node = this.refs.node
		if (node !== target && !node.contains(target)) {
			this.pullElement.animateToOrigin()
		}
	}
	handleAction = ({ currentTarget }) => {
		alert(currentTarget.textContent)
		this.pullElement.animateToOrigin()
	}
	componentDidMount() {
		this.addPullElement()
		this.addOuterTouchStartListener()
	}
	componentWillUnmount() {
		this.removePullElement()
		this.removeOuterTouchStartListener()
	}
	render() {
		let { text } = this.props
		return (
			<li className="swipeout swipeout-opened transitioning" ref="node">
			    <div ref="container">
			        <div className="item-content swipeout-content">
			            <div className="item-media"><i className="icon icon-red">S</i></div>
			            <div className="item-inner" style={{ minHeight: 50 }}>
			                <div className="item-title">{text}</div>
			            </div>
			        </div>
			        <div className="swipeout-actions-left swipeout-actions-opened">
			        	<a
			        		href="javascript:;"
			        		className="bg-blue demo-forward"
			        		onClick={this.handleAction}
			        	>
			        		Reply
			        	</a>
			        	<a
			        		href="javascript:;"
			        		className="bg-green demo-reply"
			        		onClick={this.handleAction}
			        	>
			        		Forward
			        	</a>
			        </div>
			    </div>
			</li>
		)
	}
}



class SwipeToShowActionOnBothSide extends Component {
	addPullElement() {
		this.pullElement = new PullElement({
			target: this.refs.container,
			wait: false,
			onPullLeftEnd({ translateX }) {
				if (-translateX >= 50) {
					this.preventDefault()
					this.animateTo(-305, 0)
				}
			},
			onPullRightEnd({ translateX }) {
				if (translateX >= 50) {
					this.preventDefault()
					this.animateTo(225, 0)
				}
			},
		})
		this.pullElement.init()
	}
	removePullElement() {
		this.pullElement.destroy()
	}
	addOuterTouchStartListener() {
		document.addEventListener('touchstart', this.handleOuterTouchStart)
	}
	removeOuterTouchStartListener() {
		document.removeEventListener('touchstart', this.handleOuterTouchStart)
	}
	handleOuterTouchStart = ({ target }) => {
		let node = this.refs.node
		if (node !== target && !node.contains(target)) {
			this.pullElement.animateToOrigin()
		}
	}
	handleAction = ({ currentTarget }) => {
		alert(currentTarget.textContent)
		this.pullElement.animateToOrigin()
	}
	componentDidMount() {
		this.addPullElement()
		this.addOuterTouchStartListener()
	}
	componentWillUnmount() {
		this.removePullElement()
		this.removeOuterTouchStartListener()
	}
	render() {
		return (
			<li className="swipeout transitioning" ref="node">
			    <div ref="container">
			        <div className="swipeout-content">
			            <a href="javascript:;" className="item-link item-content">
			                <div className="item-inner" style={{ minHeight: 50 }}>
			                    <div className="item-title-row">
			                        <div className="item-title">Facebook</div>
			                        <div className="item-after">17:14</div>
			                    </div>
			                    <div className="item-subtitle">New messages from John Doe</div>
			                    <div className="item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.</div>
			                </div>
			            </a>
			        </div>
			        <div className="swipeout-actions-left">
			            <a href="javascript:;" className="bg-green swipeout-overswipe demo-reply" onClick={this.handleAction}>
				    		Reply
				    	</a>
			            <a href="javascript:;" className="demo-forward bg-blue" onClick={this.handleAction}>
				    		Forward
				    	</a>
			        </div>
			        <div className="swipeout-actions-right">
			            <a href="javascript:;" className="demo-actions" onClick={this.handleAction}>
				    		More
				    	</a>
			            <a href="javascript:;" className="demo-mark bg-orange" onClick={this.handleAction}>
				    		Mark
				    	</a>
			            <a href="javascript:;" className="swipeout-delete swipeout-overswipe" onClick={this.handleAction}>
				    		Delete
				    	</a>
			        </div>
			    </div>
			</li>
		)
	}
}