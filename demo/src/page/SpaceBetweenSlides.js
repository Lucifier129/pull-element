import React, { Component } from 'react'
import PullElement from '../../../'

export default class SpaceBetweenSlides extends Component {
	componentDidMount() {
		let component = this
		let { target } = this.refs
		let clientWidth = target.clientWidth
		let activeIndex = 0
		let handlePullEnd = function({ translateX }) {
			this.preventDefault()
			let diff = activeIndex + translateX / (clientWidth + 50)
			if (diff > 0.2) {
				activeIndex -= 1
			} else if (diff < -0.2) {
				activeIndex += 1
			}
			if (activeIndex < 0){
				activeIndex = 0
			} else if (activeIndex > 9) {
				activeIndex = 9
			}
			component.switchSlide(activeIndex)
		}
		this.pullElement = new PullElement({
			target: target,
			isStatic: true,
			wait: false,
			onPullLeftEnd: handlePullEnd,
			onPullRightEnd: handlePullEnd,
		})
		this.pullElement.init()
	}
	componentWillUnmount() {
		this.pullElement.destroy()
	}
	switchSlide(index) {
		this.animateTo(index)
		this.switchAtiveStatus(index)
	}
	animateTo(index) {
		let { target } = this.refs
		let translateX = -(target.clientWidth + 50) * index
		this.pullElement.animateTo(translateX, 0)
	}
	switchAtiveStatus(activeIndex) {
		let tabItems = Array.from(this.refs.paginations.querySelectorAll('.swiper-pagination-bullet'))
		tabItems.forEach((elem, index) => {
			if (activeIndex === index) {
				elem.classList.add('swiper-pagination-bullet-active')
			} else {
				elem.classList.remove('swiper-pagination-bullet-active')
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
					        <div className="center sliding">Space Between Slides</div>
					        <div className="right"><a href="#/" className="open-panel link icon-only"><i className="icon icon-bars"></i></a></div>
					    </div>
					</div>
					<div className="pages navbar-through">
					    <div data-page="swiper-horizontal" className="page page-on-center">
					        <div className="page-content">
					            <div className="swiper-container swiper-init ks-demo-slider swiper-container-horizontal">
					                <div className="swiper-pagination swiper-pagination-bullets" ref="paginations">
					                	<span className="swiper-pagination-bullet swiper-pagination-bullet-active"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                	<span className="swiper-pagination-bullet"></span>
					                </div>
					                <div className="swiper-wrapper" ref="target">
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 1</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 2</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 3</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 4</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 5</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 6</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 7</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 8</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 9</div>
					                    <div className="swiper-slide" style={{ marginRight: 50 }}>Slide 10</div>
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