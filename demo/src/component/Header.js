import React from 'react'
import goBack from '../util/goBack'


export default function Header() {
	return (
		<div className="navbar">
            <div className="navbar-inner navbar-on-center">
                <div className="left sliding">
                    <a href="javascript:;" className="back link" onClick={goBack}>
                        <i className="icon icon-back"></i>
                        <span>Back</span>
                    </a>
                </div>
                <div className="center sliding">Pull-Element</div>
                <div className="right">
                	<a href="#" className="open-panel link icon-only">
                		<i className="icon icon-bars"></i>
                	</a>
                </div>
            </div>
        </div>
	)
}