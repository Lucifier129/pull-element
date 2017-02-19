import React from 'react'
import ReactDOM from 'react-dom'
import Home from './page/Home'
import PullToRefresh from './page/PullToRefresh'
import SwipeToDelete from './page/SwipeToDelete'



const components = {
	'/': Home,
	'pull-to-refresh': PullToRefresh,
	'swipe-to-delete': SwipeToDelete,
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