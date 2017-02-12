/*!
 * virtual-viewport.js
 * (c) 2017 Jade Gu
 * Released under the MIT License.
 */
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		global.VirtualViewport = factory();
}(this, function() {
	'use strict';

	function extend(target) {
		var args = arguments
		var argsLen = args.length
		for (var i = 1; i < argsLen; i++) {
			var source = args[i]
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
			isScrollTopEnd: scrollInfo.scrollTop <= 0,
			isScrollBottomEnd: scrollInfo.offsetHeight + scrollInfo.scrollTop >= scrollInfo.scrollHeight,
			isScrollLeftEnd: scrollInfo.scrollLeft <= 0,
			isScrollRightEnd: scrollInfo.offsetWidth + scrollInfo.scrollLeft >= scrollInfo.scrollWidth,
		}
	}

	function getTranslateStyle(position) {
		var translateValue = 'translate(' + position.x + 'px,' + position.y + 'px)'
		return {
			'transform': translateValue,
			'-webkit-transform': translateValue,
		}
	}

	function getElem(elem) {
		return typeof elem === 'string' ? document.querySelector(elem) : elem
	}

	function addEvent(elem, type, handler) {
		elem.addEventListener(type, handler)
	}

	function removeEvent(elem, type, handler) {
		elem.removeEventListener(type, handler)
	}

	function getCoor(event) {
		var targetEvent = event.touches ? event.touches[0] : event
		return {
			x: targetEvent.clientX,
			y: targetEvent.clientY,
		}
	}

	function getDampingValue(damping, defaultDamping) {
		return isNumber(damping) || isFunction(damping) ? damping : defaultDamping
	}

	var staticScrollStatus = {
		isScrollTopEnd: true,
		isScrollLeftEnd: true,
		isScrollBottomEnd: true,
		isScrollRightEnd: true,
	}

	var defaultState = {
		scrollTop: 0,
		scrollLeft: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		offsetWidth: 0,
		offsetHeight: 0,
		isScrollTopEnd: false,
		isScrollLeftEnd: false,
		isScrollBottomEnd: false,
		isScrollRightEnd: false,
		startX: 0,
		startY: 0,
		moveX: 0,
		moveY: 0,
		offsetX: 0,
		offsetY: 0,
		translateX: 0,
		translateY: 0,
		directionX: '',
		directionY: '',
		axis: '',
	}

	var defaultProps = {
		target: 'body',
		scroller: '',
		trigger: '',
		damping: 1.6,
		stopPropagation: true,
		top: true,
		bottom: false,
		left: false,
		right: false,
		isStatic: false,
		drag: false,
		detectScroll: false,
		transitionProperty: 'transform',
		transitionDuration: '0.3s',
		transitionTimingFunction: 'ease-out',
	}

	function VirtualViewport(options) {
		this.props = extend({}, defaultProps, options)
		this.state = extend({}, defaultState)
		this.isTouching = false
		this.handleStart = this.handleStart.bind(this)
		this.handleMove = this.handleMove.bind(this)
		this.handleEnd = this.handleEnd.bind(this)
		this.animateToOrigin = this.animateToOrigin.bind(this)
	}

	extend(VirtualViewport.prototype, {
		init: function() {
			var props = this.props
			var doc = this.document = window.document
			var target = this.target = getElem(props.target)
			var scroller = this.scroller = props.scroller ? getElem(props.scroller) : target
			this.trigger = props.trigger ? getElem(props.trigger) : target
			this.isGlobalScroller = scroller === doc.body || scroller === window || scroller === doc
			this.setDampingProp()
			this.enable()
		},
		destroy: function() {
			this.disable()
			this.document = null
			this.target = null
			this.scroller = null
			this.trigger = null
		},
		setDampingProp: function() {
			var damping = this.props.damping
			if (isNumber(damping) || isFunction(damping)) {
				this.props.damping = {
					left: damping,
					right: damping,
					top: damping,
					bottom: damping,
				}
			} else if (isObject(damping)) {
				var defaultDamping = defaultProps.damping
				this.props.damping = {
					left: getDampingValue(damping.left, defaultDamping),
					right: getDampingValue(damping.right, defaultDamping),
					top: getDampingValue(damping.top, defaultDamping),
					bottom: getDampingValue(damping.bottom, defaultDamping),
				}
			}
		},
		setTranslate: function(position) {
			var translateStyle = getTranslateStyle(position)
			var transitionStyle = {
				transition: '',
			}
			extend(this.target.style, transitionStyle, translateStyle)
		},
		animateTo: function(position, otherStyle) {
			var props = this.props
			var translateStyle = getTranslateStyle(position)
			var transitionStyle = {
				transitionProperty: props.transitionProperty,
				transitionDuration: props.transitionDuration,
				transitionTimingFunction: props.transitionTimingFunction,
			}
			extend(this.target.style, transitionStyle, translateStyle, otherStyle)
		},
		animateToOrigin: function(otherStyle) {
			var position = {
				x: 0,
				y: 0,
			}
			this.animateTo(position, otherStyle)
		},
		enable: function() {
			addEvent(this.trigger, 'touchstart', this.handleStart)
			addEvent(this.document, 'touchmove', this.handleMove)
			addEvent(this.document, 'touchend', this.handleEnd)
		},
		disable: function() {
			removeEvent(this.trigger, 'touchstart', this.handleStart)
			removeEvent(this.document, 'touchmove', this.handleMove)
			removeEvent(this.document, 'touchend', this.handleEnd)
		},
		getScrollInfo: function() {
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
		stopPropagationIfNeed: function(event) {
			if (this.props.stopPropagation) {
				event.stopPropagation()
			}
		},
		emit: function(type, event) {
			var listener = this.props[type]
			if (!isFunction(listener)) {
				return
			}
			var syntheticEvent = extend({
				nativeEvent: event
			}, this.state)
			return listener.call(this, syntheticEvent)
		},
		getDampingValue: function(value, damping) {
			if (isFunction(damping)) {
				return damping(value)
			}
			if (isNumber(damping)) {
				return value / damping
			}
			return value
		},
		handleStart: function(event) {
			if (this.isTouching) {
				return
			}
			var coor = getCoor(event)
			this.state = extend({}, defaultState, this.getScrollInfo(), {
				startX: coor.x,
				startY: coor.y,
			})
			var result = this.emit('onTouchStart', event)
			if (result === false) {
				return
			}
			this.stopPropagationIfNeed(event)
			this.isTouching = true
		},
		handleMove: function(event) {
			if (!this.isTouching) {
				return
			}
			var coor = getCoor(event)
			var props = this.props
			var state = this.state
			var startX = state.startX
			var startY = state.startY
			var moveX = coor.x
			var moveY = coor.y
			var offsetX = moveX - startX
			var offsetY = moveY - startY
			var axis = state.axis
			var directionX = state.directionX
			var directionY = state.directionY
			var isScrollLeftEnd = state.isScrollLeftEnd
			var isScrollRightEnd = state.isScrollRightEnd
			var isScrollTopEnd = state.isScrollTopEnd
			var isScrollBottomEnd = state.isScrollBottomEnd

			if (props.detectScroll) {
				extend(this.state, this.getScrollInfo())
			}

			// first time hit the a axis ending
			if (!isScrollLeftEnd && state.isScrollLeftEnd || !isScrollRightEnd && state.isScrollRightEnd) {
				startX = moveX
				offsetX = 0
				directionX = ''
				event.preventDefault()
			}

			// first time hit the y axis ending
			if (!isScrollTopEnd && state.isScrollTopEnd || !isScrollBottomEnd && state.isScrollBottomEnd) {
				startY = moveY
				offsetY = 0
				directionY = ''
				event.preventDefault()
			}

			var translateX = 0
			var translateY = 0
			var damping = props.damping

			if (state.isScrollLeftEnd && offsetX > 0) {
				directionX = 'left'
				translateX = this.getDampingValue(offsetX, damping.left)
			} else if (state.isScrollRightEnd && offsetX < 0) {
				directionX = 'right'
				translateX = this.getDampingValue(offsetX, damping.right)
			}

			if (state.isScrollTopEnd && offsetY > 0) {
				directionY = 'top'
				translateY = this.getDampingValue(offsetY, damping.top)
			} else if (state.isScrollBottomEnd && offsetY < 0) {
				directionY = 'bottom'
				translateY = this.getDampingValue(offsetY, damping.bottom)
			}

			if (!axis) {
				axis = Math.abs(offsetY) >= Math.abs(offsetX) ? 'y' : 'x'
			}

			extend(this.state, {
				startX: startX,
				startY: startY,
				moveX: moveX,
				moveY: moveY,
				offsetX: offsetX,
				offsetY: offsetY,
				directionX: directionX,
				directionY: directionY,
				translateX: translateX,
				translateY: translateY,
				axis: axis,
			})

			var result = this.emit('onTouchMove', event)
			if (result === false) {
				return
			}

			if (!directionX && !directionY) {
				return
			}

			if (!props.drag) {
				if (axis === 'y' && props[directionY]) {
					translateX = 0
				} else if (axis === 'x' && props[directionX]) {
					translateY = 0
				} else {
					return
				}
			}

			event.preventDefault()
			this.setTranslate({
				x: translateX,
				y: translateY,
			})
		},
		handleEnd: function(event) {
			if (!this.isTouching) {
				return
			}
			this.isTouching = false

			var result = this.emit('onTouchEnd', event)
			if (result === false) {
				return
			}

			var state = this.state
			if (state.directionX || state.directionY) {
				if (isThenable(result)) {
					result.then(this.animateToOrigin)
				} else {
					this.animateToOrigin()
				}
			}
		},
	})

	return VirtualViewport
}));