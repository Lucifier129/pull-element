import React, { Component } from 'react'
import Header from '../component/Header'
import PullElement from '../../../'
import delay from '../util/delay'

export default function PullToRefresh({ hash }) {
	return (
	<div className="views">
	    <div className="view view-main" data-page="index">
	        <Header />
	        <div className="pages navbar-through toolbar-through">
	        	<div className="page page-on-center">
		        	<Content />
		        </div>
	        </div>
	    </div>
	</div>
	)
}


class Content extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [
				this.fetchData(),
				this.fetchData(),
				this.fetchData()
			]
		}
	}
	fetchData() {
		let songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication']
		let authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers']
		let picURL = 'http://lorempixel.com/88/88/abstract/' + Math.round(Math.random() * 10)
		let song = songs[Math.floor(Math.random() * songs.length)]
		let author = authors[Math.floor(Math.random() * authors.length)]
		return { picURL, song, author }
	}
	async fetchDataAsync(time = 1000) {
		await delay(time)
		return this.fetchData()
	}
	async refresh() {
		let newItem = await this.fetchDataAsync()
		this.setState({
			data: [newItem].concat(this.state.data)
		})
	}
	componentDidMount() {
		let component = this
		let { target, content } = this.refs
		let pullElement = new PullElement({
			target: target,
			scroller: content,
			detectScroll: true,
			onPullDown({ translateY }) {
				let classList = content.classList
				if (translateY > 45) {
					classList.remove('pull-down')
					classList.add('pull-up')
				} else {
					classList.add('pull-down')
					classList.remove('pull-up')
				}
			},
			async onPullDownEnd({ translateY }) {
				let classList = content.classList
				classList.remove('pull-down')
				classList.remove('pull-up')
				if (translateY > 45) {
					this.preventDefault()
					classList.add('refreshing')
					this.animateTo(0, 0)
					await component.refresh()
					classList.remove('refreshing')
					this.animateToOrigin()
				}
			}
		})
		pullElement.init()
		this.pullElement = pullElement
	}
	componentWillUnmount() {
		this.pullElement.destroy()
	}
	render() {
		return (
			<div ref="target" style={{ width: '100%', height: '100%' }}>
			<div className="page-content pull-to-refresh-content transitioning" ref="content">
			    <div className="pull-to-refresh-layer">
			        <div className="preloader"></div>
			        <div className="pull-to-refresh-arrow"></div>
			    </div>
			    <div className="list-block media-list">
			        <ul>
			        {
			    		this.state.data.map(item => {
			    			return (
			    				<li className="item-content" key={item.picURL + item.song + item.author}>
					                <div className="item-media">
					                	<img src={item.picURL} width="44" />
					                </div>
					                <div className="item-inner">
					                    <div className="item-title-row">
					                        <div className="item-title">{item.song}</div>
					                    </div>
					                    <div className="item-subtitle">{item.author}</div>
					                </div>
					            </li>
			    			)
			    		})
			        }
			        </ul>
			        <div className="list-block-label">
			            <p>
			            	Just pull page down to let the magic happen.
			                <br />
			                Note that pull-to-refresh feature is optimised for touch and native scrolling so it may not work on desktop browser.
			            </p>
			        </div>
			    </div>
			</div>
			</div>
		)
	}
}