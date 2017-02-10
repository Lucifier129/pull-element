function extend(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i]
		for (var key in source) {
			target[key] = source[key]
		}
	}
	return target
}

function isThenable(obj) {
	return obj != null && typeof obj.then === 'function'
}

function isNumber(obj) {
	return typeof obj === 'number' && !isNaN(obj)
}

function isObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

function isFunction(obj) {
	return typeof obj === 'function'
}

function getScrollInfo(scroller) {
	var scrollTop = scroller.scrollTop
	var scrollLeft = scroller.scrollLeft
	var offsetWidth = scroller.offsetWidth
	var offsetHeight = scroller.offsetHeight
	var scrollWidth = scroller.scrollWidth
	var scrollHeight = scroller.scrollHeight
	var scrollBaseInfo = {
		scrollTop: scrollTop,
		scrollLeft: scrollLeft,
		offsetWidth: offsetWidth,
		offsetHeight: offsetHeight,
		scrollWidth: scrollWidth,
		scrollHeight: scrollHeight,
	}
	return extend(scrollBaseInfo, getScrollEndingInfo(scrollBaseInfo))
}

function getGlobalScrllInfo(document) {
	var documentElement = document.documentElement
	var clientWidth = documentElement.clientWidth
	var clientHeight = documentElement.clientHeight
	var scrollWidth = documentElement.scrollWidth
	var scrollHeight = documentElement.scrollHeight
	var scrollTop = document.body.scrollTop || documentElement.scrollTop
	var scrollLeft = document.body.scrollLeft || documentElement.scrollLeft

	var scrollBaseInfo = {
		scrollTop: scrollTop,
		scrollLeft: scrollLeft,
		scrollWidth: scrollWidth,
		scrollHeight: scrollHeight,
		// alias clientWidth to offsetWidth, the same as clientHeight
		offsetWidth: clientWidth,
		offsetHeight: clientHeight,
	}
	return extend(scrollBaseInfo, getScrollEndingInfo(scrollBaseInfo))
}

function getScrollEndingInfo(scrollInfo) {
	return {
		isTop: scrollInfo.scrollTop <= 0,
		isBottom: scrollInfo.offsetHeight + scrollInfo.scrollTop >= scrollInfo.scrollHeight,
		isLeft: scrollInfo.scrollLeft <= 0,
		isRight: scrollInfo.offsetWidth + scrollInfo.scrollLeft >= scrollInfo.scrollWidth,
	}
}

function getTranslateStyle(obj) {
	var translateValue = 'translate(' + obj.x + 'px,' + obj.y + 'px)'
	return {
		'transform': translateValue,
		'-webkit-transform': translateValue,
	}
}

function getElem(elem, context) {
	if (typeof elem === 'string') {
		return (context || document).querySelector(elem)
	}
	return elem
}

function addEvent(elem, type, handler) {
	elem.addEventListener(type, handler)
}

function removeEvent(elem, type, handler) {
	elem.removeEventListener(type, handler)
}

function checkEdge(scrollInfo) {
	return scrollInfo.isTop || scrollInfo.isBottom || scrollInfo.isLeft || scrollTop.isRight
}

function getCoor(event) {
	var targetEvent = event.touches && event.touches.length ? event.touches[0] : event
	return {
		x: targetEvent.clientX,
		y: targetEvent.clientY,
	}
}

var staticScrollStatus = {
	isTop: true,
	isLeft: true,
	isBottom: true,
	isRight: true,
}

var defaultState = {
	scrollTop: 0,
	scrollLeft: 0,
	scrollWidth: 0,
	scrollHeight: 0,
	offsetWidth: 0,
	offsetHeight: 0,
	isTop: false,
	isLeft: false,
	isBottom: false,
	isRight: false,
	startX: 0,
	startY: 0,
	moveX: 0,
	moveY: 0,
	offsetX: 0,
	offsetY: 0,
	directionX: '',
	directionY: '',
}

function VirtualViewport(options) {
	this.props = extend({}, VirtualViewport.defaults, options)
	this.state = extend({}, defaultState)
	this.isPreventDefault = false
	this.isTouching = false
	this.handleStart = this.handleStart.bind(this)
	this.handleMove = this.handleMove.bind(this)
	this.handleEnd = this.handleEnd.bind(this)
	this.animateToOrigin = this.animateToOrigin.bind(this)
}

extend(VirtualViewport.prototype, {
	init: function () {
		var props = this.props
		var doc = this.document = window.document
		var target = this.target = getElem(props.target)
		var scroller = this.scroller = props.scroller ? getElem(props.scroller) : target
		this.isGlobalScroller = scroller === doc.body || scroller === window || scroller === doc
		this.addEvent()
	},
	destroy: function () {
		this.removeEvent()
		this.document = null
		this.target = null
		this.scroller = null
	},
	damp: function (valueX, valueY) {
		var damp = this.props.damp
		var props = this.props
		var state = this.state
		var weightX = props.weightX
		var weightY = props.weightY
		var directionX = state.directionX
		var directionY = state.directionY

		if (directionX && directionY) {
			if (weightX) {
				valueY = 0
				valueX = valueX / damp[directionX]
			}
		}


		var props = this.props
		var state = this.state
		var dampX = VirtualViewport.defaults.damp
		var dampY = VirtualViewport.defaults.damp

		if (state.isTop && isNumber(props.damp.top)) {
			dampY = props.damp.top
		} else if (state.isBottom && isNumber(props.damp.bottom)) {
			dampY = props.damp.bottom
		}
		if (state.isLeft && isNumber(props.damp.left)) {
			dampX = props.damp.left
		} else if (state.isRight && isNumber(props.damp.right)) {
			dampX = props.damp.right
		}

		return { x: dampX, y: dampY }
	},
	setTranslate: function (position) {
		var translateStyle = getTranslateStyle(position)
		var transitionStyle = {
			transition: '',
		}
		extend(this.target.style, transitionStyle, translateStyle)
	},
	animateTo: function (position, otherStyle) {
		var translateStyle = getTranslateStyle(position)
		var transitionStyle = {
			transition: `transform 0.3s ease-out`,
		}
		extend(this.target.style, transitionStyle, translateStyle, otherStyle)
	},
	animateToOrigin: function (otherStyle) {
		var position = {
			x: 0,
			y: 0,
		}
		this.animateTo(position, otherStyle)
		this.isPreventDefault = false
	},
	preventDefault: function () {
		this.isPreventDefault = true
	},
	cancelPreventDefault: function() {
		this.isPreventDefault = false
	},
	addEvent: function () {
		addEvent(this.target, 'touchstart', this.handleStart)
	},
	removeEvent: function () {
		removeEvent(this.target, 'touchstart', this.handleStart)
	},
	getScrollInfo: function () {
		var scrollInfo = null
		if (this.isGlobalScroller) {
			scrollInfo = getGlobalScrllInfo(this.document)
		} else {
			scrollInfo = getScrollInfo(this.scroller)
		}
		if (this.props.isStatic) {
			scrollInfo = extend(scrollInfo, staticScrollStatus)
		}
		return scrollInfo
	},
	stopPropagationIfNeed: function (event) {
		if (this.props.stopPropagation) {
			event.stopPropagation()
		}
	},
	trigger: function (type, event) {
		var listener = this.props[type]
		if (!listener) {
			return
		}
		var syntheticEvent = extend({
			nativeEvent: event
		}, this.state)
		return listener.call(this, syntheticEvent)
	},
	handleStart: function (event) {
		if (this.isPreventDefault || this.isTouching) {
			return
		}
		var coor = getCoor(event)
		var scrollInfo = this.getScrollInfo()
		this.isPreventDefault = false
		this.state = extend({}, defaultState, scrollInfo, {
			startX: coor.x,
			startY: coor.y,
		})
		var result = this.trigger('onTouchStart', event)
		var isPreventDefault = result === false || this.isPreventDefault
		if (isPreventDefault) {
			this.isPreventDefault = false
			return
		}
		this.stopPropagationIfNeed(event)
		this.isTouching = true
		addEvent(this.document, 'touchmove', this.handleMove)
		addEvent(this.document, 'touchend', this.handleEnd)
	},
	handleMove: function (event) {
		var coor = getCoor(event)
		var state = this.state
		var startX = state.startX
		var startY = state.startY
		var moveX = coor.x
		var moveY = coor.y
		var offsetX = moveX - startX
		var offsetY = moveY - startY
		var directionX = ''
		var directionY = ''

		if (state.isLeft && offsetX > 0) {
			directionX = 'left'
		} else if (state.isRight && offsetX < 0) {
			directionX = 'right'
		}

		if (state.isTop && y > 0) {
			directionY = 'top'
		} else if (state.isBottom && y < 0) {
			directionY = 'bottom'
		}

		extend(this.state, {
			moveX: moveX,
			moveY: moveY,
			offsetX: offsetX,
			offsetY: offsetY,
			directionX: directionX,
			directionY: directionY,
		})

		var result = this.trigger('onTouchMove', event)
		if (result === false || this.isPreventDefault) {
			this.isPreventDefault = false
			return
		}

		if (directionX || directionY) {
			event.preventDefault()
			var position = this.damp(offsetX, offsetY)
			this.setTranslate(position)
		}
	},
	handleEnd: function (event) {
		this.isTouching = false
		removeEvent(this.document, 'touchmove', this.handleMove)
		removeEvent(this.document, 'touchend', this.handleEnd)

		var result = this.trigger('onTouchEnd', event)
		var isPreventDefault = result === false || this.isPreventDefault
		if (isThenable(result)) {
			this.isPreventDefault = true
			result.then(this.animateToOrigin)
		} else if (!isPreventDefault) {
			this.animateToOrigin()
		}
	},
})

VirtualViewport.defaults = {
	target: 'body',
	scroller: '',
	stopPropagation: true,
	damp: 1.6,
	weightX: 0,
	weightY: 1,
}