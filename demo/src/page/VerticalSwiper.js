import React, { Component } from 'react'
import PullElement from '../../../'

export default class VerticalSwiper extends Component {
	componentDidMount() {
		let component = this
		let { target } = this.refs
		let clientHeight = target.clientHeight
		let activeIndex = 0
		let handlePullEnd = function({ translateY }) {
			this.preventDefault()
			let prevTranslateY = -activeIndex * clientHeight
			let diff = translateY - prevTranslateY
			if (diff > 50) {
				activeIndex -= 1
			} else if (diff < -50) {
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
			onPullUpEnd: handlePullEnd,
			onPullDownEnd: handlePullEnd,
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
		let translateY = -target.clientHeight * index
		this.pullElement.animateTo(0, translateY)
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
					        <div className="center sliding">Vertical Swiper</div>
					        <div className="right"><a href="#/" className="open-panel link icon-only"><i className="icon icon-bars"></i></a></div>
					    </div>
					</div>
					<div className="pages navbar-through">
					    <div className="page page-on-center">
					        <div className="page-content">
					            <div className="swiper-container swiper-init ks-demo-slider swiper-container-vertical">
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
					                    <div className="swiper-slide">Slide 1</div>
					                    <div className="swiper-slide">Slide 2</div>
					                    <div className="swiper-slide">Slide 3</div>
					                    <div className="swiper-slide">Slide 4</div>
					                    <div className="swiper-slide">Slide 5</div>
					                    <div className="swiper-slide">Slide 6</div>
					                    <div className="swiper-slide">Slide 7</div>
					                    <div className="swiper-slide">Slide 8</div>
					                    <div className="swiper-slide">Slide 9</div>
					                    <div className="swiper-slide">Slide 10</div>
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