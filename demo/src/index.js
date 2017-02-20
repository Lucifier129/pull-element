import React from 'react'
import ReactDOM from 'react-dom'
import Home from './page/Home'
import PullToRefresh from './page/PullToRefresh'
import SwipeToShowAction from './page/SwipeToShowAction'



const components = {
	'/': Home,
	'pull-to-refresh': PullToRefresh,
	'swipe-to-show-action': SwipeToShowAction,
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