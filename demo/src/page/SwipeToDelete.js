import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Header from '../component/Header'
import PullElement from '../../../'
import delay from '../util/delay'

export default class StatefulSwipeToDeletePage extends Component {
	render() {
		return (
			<SwipeToDeletePage
				{...this.props}
				{...this.state}
			/>
		)
	}
}

function SwipeToDeletePage() {
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
				            	<SwipeToDeleteItem text="Swipe left on me please" />
				            	<SwipeToDeleteItem text="Swipe left on me please" />
				            	<SwipeToDeleteItem text="Swipe left on me please" />
				            	<SwipeToDeleteItem text="Swipe left on me please" />
				            	<SwipeToDeleteItem text="Swipe left on me please" />
				            	<SwipeToDeleteItem text="Swipe left on me please" />
				            </ul>
				        </div>
				    </div>
		        </div>
	        </div>
	    </div>
	</div>
	)
}

class SwipeToDeleteItem extends Component {
	state = {
		isShowAction: false
	}
	componentDidMount() {
		let component = this
		let { container } = this.refs
		this.pullElement = new PullElement({
			target: container,
			isStatic: true,
			wait: false,
			onPullLeft() {},
			onPullLeftEnd({ translateX }) {
				if (-translateX >= 109) {
					this.preventDefault()
					this.animateTo(-109, 0)
					component.setState({
						isShowAction: true
					})
				} 
			}
		})
		this.pullElement.init()
	}
	componentWillUnmount() {
		this.pullElement.destroy()
	}
	handleAction = () => {
		this.handleGoBack()
		if (this.props.onAction) {
			this.props.onAction(this.props)
		}
	}
	handleGoBack = () => {
		if (!this.state.isShowAction) {
			return
		}
		this.pullElement.animateToOrigin()
		this.setState({
			isShowAction: false
		})
	}
	render() {
		let { text } = this.props
		return (
			
			<li className="swipeout">
				<div ref="container">
	                <div className="item-content swipeout-content">
	                    <div className="item-media">
	                    	<i className="icon icon-red">S</i>
	                    </div>
	                    <div className="item-inner">
	                        <div className="item-title">{text}</div>
	                    </div>
	                </div>
	                <div className="swipeout-actions-right">
	                	<a href="javascript:;" className="swipeout-delete" onClick={this.handleAction}>
	                		Back
	                	</a>
	                </div>
	             </div>
            </li>
		)
	}
}