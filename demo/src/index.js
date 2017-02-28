import React from 'react'
import ReactDOM from 'react-dom'
import Home from './page/Home'
import PullToRefresh from './page/PullToRefresh'
import SwipeToShowAction from './page/SwipeToShowAction'
import AnimatedTabs from './page/AnimatedTabs'
import SwipeableTabs from './page/SwipeableTabs'
import SliderHorizontal from './page/SliderHorizontal'
import VerticalSwiper from './page/VerticalSwiper'
import SpaceBetweenSlides from './page/SpaceBetweenSlides'
import Playground from './page/Playground'

Array.from = Array.from || ((obj) => Array.prototype.slice.call(obj))

const components = {
	'/': Home,
	'playground': Playground,
	'pull-to-refresh': PullToRefresh,
	'swipe-to-show-action': SwipeToShowAction,
	'animated-tabs': AnimatedTabs,
	'swipeable-tabs': SwipeableTabs,
	'slider-horizontal': SliderHorizontal,
	'vertical-swiper': VerticalSwiper,
	'space-between-slides': SpaceBetweenSlides,
}

function renderView() {
	let Target = components[location.hash.substr(1)] || Home
    ReactDOM.render(
    	<Target />,
    	document.getElementById('root')
    )
}

window.addEventListener('hashchange', renderView)
renderView()