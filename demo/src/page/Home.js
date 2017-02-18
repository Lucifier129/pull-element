import React, { Component } from 'react'
import Header from '../component/Header'

export default function Menu({ hash }) {
	return (
	<div className="views">
	    <div className="view view-main" data-page="index">
	        <Header />
	        <div className="pages navbar-through toolbar-through">
	            <div data-page="index" className="page page-on-center">
	                <div className="page-content">
	                    <div className="content-block-title">Welcome To Pull-Element</div>
	                    <div className="content-block">
	                    	<a href="https://github.com/Lucifier129/pull-element" className="button">About Pull-Element</a>
	                    </div>
	                    <div className="content-block-title">Pull-Element Kitchen Sink</div>
	                    <div className="list-block">
	                    	<ul>
	                    		<ListItem href="#pull-to-refresh" text="Pull To Refresh" iconText="P" />
	                    	</ul>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>

	)
}


function ListItem({
	href = 'javascript:;',
	text = '',
	iconText = '',
}) {
	return (
		<li>
			<a href={href} className="item-link">
				<div className="item-content">
					<div className="item-media">
						<i className="icon icon-red">{iconText}</i>
					</div>
					<div className="item-inner">
						<div className="item-title">{text}</div>
					</div>
				</div>
			</a>
		</li>
	)
}