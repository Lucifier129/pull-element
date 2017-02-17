import React, { Component } from 'react'
import PullElement from '../../'
import Loading from './loading'
import delay from './delay'
import arrowImg from './arrow.png'

export default class PullToRefresh extends Component {
	componentDidMount() {
		let component = this
		let { top, bottom, arrow, target } = this.refs
		let loading = top.querySelector('.loading')
		let pullElement = new PullElement({
		    target: target,
		    scroller: 'body',
		    detectScroll: true,
		    onPullUp({ translateY }) {
		        bottom.style.display = 'block'
		        bottom.style.height = Math.min(-translateY, 40) + 'px'
		    },
		    onPullDown({ translateY }) {
		    	let method = translateY > 100 ? 'add' : 'remove'
		        arrow.classList[method]('arrow_up')
		    },
		    async onPullDownEnd({ translateY }) {
		        if (translateY <= 100) {
		            return
		        }
		        top.classList.add("refreshing")
		        loading.style.display = 'block'
		        this.preventDefault()
		        this.animateTo({x: 0, y: 40})
		        await delay(1000)
		        await this.animateToOrigin()
		        component.forceUpdate()
		        top.classList.remove("refreshing")
		        loading.style.display = 'none'
		    },
		     onOrigin({ direction }) {
		        if (direction === 'bottom') {
		            bottom.style.display = 'none'
		            bottom.style.height = '0'
		        }
		    },
		})

		pullElement.init()
		this.pullElement = pullElement
	}
	componentWillUnmount() {
		if (this.pullElement) {
			this.pullElement.destroy()
		}
	}


	render() {
		let { PullLoading, RandomList } = this
		return (
			<div className="app">
	            <div className="info" >header</div>
	            <div className="wrapper" ref="target">
	            	<div className="pull_refresh" ref="top">
		                <div className="pull">
		                    <div ref="arrow" className="arrow">
		                        <img src={arrowImg} />
		                        <br />
		                    </div>
		                </div>
		                 <Loading />
		            </div>
	                <div className="list">
		                {
		                    Array.from({length: 30}).map((_, index) => {
		                    	let value = Math.random() * 100
		                    	return <PullLeft key={value}>{value}</PullLeft>
		                    })
		                }
		            </div>
	                <div ref="bottom" style={{ display: 'none', height: 0}}>
		            <Loading />
		            </div>
	            </div>
	        </div>
        )
	}
}

class PullLeft extends Component {
	componentDidMount() {
		let { content, item } = this.refs
		let pullElement = new PullElement({
			target: content,
			scroller: item,
			stopPropagation: false,
			isStatic: true,
			onPullLeft({ translateX }) {
				translateX = -translateX
				if (translateX > 200) {
					this.preventDefault()
				}
			},
			async onPullLeftEnd({ translateX, scrollWidth }) {
				translateX = -translateX
				if (translateX > 100) {
					this.preventDefault()
					this.animateTo({ x: -100, y: 0})
				}
			},
		})
		pullElement.init()
		this.pullElement = pullElement
	}
	componentWillUnmount() {
		if (this.pullElement) {
			this.pullElement.destroy()
		}
	}
	handleClick = event => {
		this.pullElement.animateToOrigin()
	}
	render() {
		return (
			<div className="item" ref="item">
				<div className="content" ref="content">
					{this.props.children}
					<div className="close-button" onClick={this.handleClick}>
						animateToOrigin
					</div>
				</div>
			</div>
		)
	}
}