import React from 'react'
import ReactDOM from 'react-dom'
import './main.css'
import PullToRefresh from './pull-to-refresh'

const rootElem = document.getElementById('root')

const component = {
    'pull-to-refresh': PullToRefresh,
}

function renderView() {
    let App = component[location.hash] || component['pull-to-refresh']
    ReactDOM.render(<App />, rootElem)
}

window.addEventListener('hashchange', renderView())
