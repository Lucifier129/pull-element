import React, { Component } from 'react'
import Header from '../component/Header'
import PullElement from '../../../'
import delay from '../util/delay'

export default function Playground() {
	return (
	<div className="views">
	    <div className="view view-main">
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
	state = {
		damping: 1.6,
		pullUp: true,
		pullDown: true,
		pullLeft: true,
		pullRight: true,
		detectScroll: true,
		detectScrollOnStart: false,
		detectScrollOnMove: false,
		drag: false,
		transitionDuration: '0.3s',
		transitionTimingFunction: 'ease-out',
	}
	addPullElement() {
		if (this.pullElement) {
			this.pullElement.destroy()
		}
		let { target, content } = this.refs
		let options = {
			...this.state,
			damping: Number(this.state.damping)
		}
		let pullElement = new PullElement({
			target: target,
			...options,
		})
		pullElement.init()
		this.pullElement = pullElement
	}
	componentDidMount() {
		this.addPullElement()
	}
	componentDidUpdate() {
		this.addPullElement()
	}
	componentWillUnmount() {
		this.pullElement.destroy()
	}
	handleChange = ({ currentTarget }) => {
		let { name, value, checked, type } = currentTarget
		this.setState({
			[name]: type === 'checkbox' ? checked : value,
		}) 
	}
	render() {
		return (
			<div ref="target" className="list-block" style={{ height: '100%', padding: '0 10px', overflow: 'auto' }}>
				<div className="page-content" ref="content" style={{ height: '120%' }}>
				    <div className="content-block-title">Pull Element options</div>
				    <form className="list-block">
				        <ul>
				            <TextInput
				            	label="transition-duration"
				            	name="transitionDuration"
				            	value={this.state.transitionDuration}
				            	onChange={this.handleChange}
				            />
				            <SelectInput
				            	label="transition-timing-function"
				            	name="transitionTimingFunction"
				            	value={this.state.transitionTimingFunction}
				            	onChange={this.handleChange}
				            	options={['ease-in', 'ease-out', 'ease-in-out', 'linear', 'ease']}
				            />
				            <TextInput
				            	label="damping"
				            	name="damping"
				            	value={this.state.damping}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="pullUp"
				            	name="pullUp"
				            	checked={this.state.pullUp}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="pullDown"
				            	name="pullDown"
				            	checked={this.state.pullDown}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="pullLeft"
				            	name="pullLeft"
				            	checked={this.state.pullLeft}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="pullRight"
				            	name="pullRight"
				            	checked={this.state.pullRight}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="detectScroll"
				            	name="detectScroll"
				            	checked={this.state.detectScroll}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="detectScrollOnStart"
				            	name="detectScrollOnStart"
				            	checked={this.state.detectScrollOnStart}
				            	onChange={this.handleChange}
				            />
				            <Checkbox
				            	label="drag"
				            	name="drag"
				            	checked={this.state.drag}
				            	onChange={this.handleChange}
				            />
				        </ul>
				    </form>
				</div>
			</div>
		)
	}
}


function TextInput({ label, type="text", name, value, placeholder, onChange }) {
	return (
		<li>
            <div className="item-content">
                <div className="item-inner">
                    <div className="item-title label" style={{ width: '50%' }}>{label}</div>
                    <div className="item-input">
                        <input
                        	type="text"
                        	name={name}
                        	placeholder={placeholder}
                        	value={value}
                        	onChange={onChange}
                        />
                    </div>
                </div>
            </div>
        </li>
	)
}

function SelectInput({ label, name, value, onChange, options }) {
	return (
		<li>
            <div className="item-content">
                <div className="item-inner">
                    <div className="item-title label" style={{ width: '50%' }}>{label}</div>
                    <div className="item-input">
                        <select name={name} value={value} onChange={onChange}>
                        {
                        	options.map(option => (
                        		<option value={option}>{option}</option>
                        	))
                        }
                        </select>
                    </div>
                </div>
            </div>
        </li>
	)
}

function Checkbox({ label, checked, name, value, onChange }) {
	return (
		<li>
            <div className="item-content">
                <div className="item-inner">
                    <div className="item-title label" style={{ width: '50%' }}>{label}</div>
                    <div className="item-input">
                        <label className="label-switch">
                            <input type="checkbox" name={name} checked={checked} onChange={onChange} />
                            <div className="checkbox"></div>
                        </label>
                    </div>
                </div>
            </div>
        </li>
	)
}