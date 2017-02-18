/*!
 * @license
 * pull-element.js v1.0.0
 * (c) 2017 Jade Gu
 * Released under the MIT License.
 * https://github.com/Lucifier129/pull-element
 */
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		global.PullElement = factory();
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
			transform: translateValue,
			webkitTransform: translateValue,
		}
	}

	function getElem(elem) {
		return typeof elem === 'string' ? document.querySelector(elem) : elem
	}

	function addEvent(elem, type, handler) {
		elem && elem.addEventListener(type, handler)
	}

	function removeEvent(elem, type, handler) {
		elem && elem.removeEventListener(type, handler)
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

	function transformValueByDamping(value, damping) {
		if (isFunction(damping)) {
			return damping(value)
		}
		if (isNumber(damping)) {
			return value / damping
		}
		return value
	}

	var staticScrollStatus = {
		isScrollTopEnd: true,
		isScrollLeftEnd: true,
		isScrollBottomEnd: true,
		isScrollRightEnd: true,
	}

	var eventMap = {
		top: 'onPullDown',
		bottom: 'onPullUp',
		left: 'onPullRight',
		right: 'onPullLeft',
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
		direction: '',
		axis: '',
	}

	var defaultProps = {
		target: 'body',
		scroller: '',
		trigger: '',
		damping: 1.6,
		top: false,
		bottom: false,
		left: false,
		right: false,
		isStatic: false,
		drag: false,
		detectScroll: false,
		fixed: true,
		stopPropagation: true,
		transitionProperty: 'transform',
		transitionDuration: '0.3s',
		transitionTimingFunction: 'ease-out',
	}

	var isSupportPromise = typeof Promise === 'function'

	function PullElement(options) {
		this.options = options
		this.state = extend({}, defaultState)
		this.props = null
		this.document = null
		this.target = null
		this.scroller = null
		this.trigger = null
		this.isTouching = false
		this.isPreventDefault = false
		this.isWaitForBackToOrigin = false
		this.preventDefault = this.preventDefault.bind(this)
		this.handleTouchStart = this.handleTouchStart.bind(this)
		this.handleTouchMove = this.handleTouchMove.bind(this)
		this.handleTouchEnd = this.handleTouchEnd.bind(this)
	}

	extend(PullElement.prototype, {
		init: function() {
			var options = this.options
			var doc = this.document = window.document
			var target = this.target = getElem(options.target)
			var scroller = this.scroller = options.scroller ? getElem(options.scroller) : target
			this.trigger = options.trigger ? getElem(options.trigger) : target
			this.isGlobalScroller = scroller === doc.body || scroller === window || scroller === doc
			this.props = extend({}, defaultProps, this.options, {
				damping: this.getDamping()
			})
			this.enable()
		},
		destroy: function() {
			this.disable()
			this.props = null
			this.document = null
			this.target = null
			this.scroller = null
			this.trigger = null
		},
		getDamping: function() {
			var defaultDamping = defaultProps.damping
			var dampingOption = this.options.damping
			var damping = null
			if (isObject(dampingOption)) {
				damping = {
					left: getDampingValue(dampingOption.left, defaultDamping),
					right: getDampingValue(dampingOption.right, defaultDamping),
					top: getDampingValue(dampingOption.top, defaultDamping),
					bottom: getDampingValue(dampingOption.bottom, defaultDamping),
				}
			} else {
				var dampingValue = getDampingValue(dampingOption, defaultDamping)
				damping = {
					left: dampingValue,
					right: dampingValue,
					top: dampingValue,
					bottom: dampingValue,
				}
			}
			return damping
		},
		setTranslate: function(position, otherStyle) {
			if (!this.target) {
				return
			}
			var translateStyle = getTranslateStyle(position)
			var transitionStyle = {
				transition: '',
				webkitTransition: '',
			}
			extend(this.target.style, transitionStyle, translateStyle, otherStyle)
		},
		animateTo: function(position, otherStyle, callback) {
			if (!this.target) {
				return
			}
			if (isFunction(otherStyle)) {
				callback = otherStyle
				otherStyle = null
			}
			var target = this.target
			var props = this.props
			var translateStyle = getTranslateStyle(position)
			var transitionStyle = {
				transitionProperty: props.transitionProperty,
				transitionDuration: props.transitionDuration,
				transitionTimingFunction: props.transitionTimingFunction,
				webkitTransitionProperty: props.transitionProperty,
				webkitTransitionDuration: props.transitionDuration,
				webkitTransitionTimingFunction: props.transitionTimingFunction,
			}
			var addTransitionEndListener = function(resolve) {
				var isCalled = false
				var handleTransitionEnd = function() {
					if (isCalled) {
						return
					}
					isCalled = true
					callback && callback()
					resolve && resolve()
					removeEvent(target, 'transitionend', handleTransitionEnd)
					removeEvent(target, 'webkitTransitionEnd',handleTransitionEnd)
				}
				addEvent(target, 'transitionend', handleTransitionEnd)
				addEvent(target, 'webkitTransitionEnd',handleTransitionEnd)
				extend(target.style, transitionStyle, translateStyle, otherStyle)
				// in some browser, transitionend dose'nt work as expected
				var transitionDuration = Number(props.transitionDuration.replace(/[^.\d]+/g, ''))
				// transform 1s to 1000ms
				if (/[\d\.]+s$/.test(props.transitionDuration)) {
					transitionDuration = transitionDuration * 1000
				}
				setTimeout(handleTransitionEnd, transitionDuration)
			}
			if (isSupportPromise) {
				return new Promise(addTransitionEndListener)
			}
			addTransitionEndListener()
		},
		animateToOrigin: function(otherStyle, callback) {
			if (!this.target) {
				return
			}
			if (isFunction(otherStyle)) {
				callback = otherStyle
				otherStyle = null
			}
			var context = this
			var finalCallback = function(event) {
				context.clearFixedStyleIfNeed()
				context.isWaitForBackToOrigin = false
				callback && callback(event)
				context.emit('onOrigin', event)		
			}
			return this.animateTo({ x: 0, y: 0 }, otherStyle, finalCallback)
		},
		enable: function() {
			addEvent(this.trigger, 'touchstart', this.handleTouchStart)
			addEvent(this.document, 'touchmove', this.handleTouchMove)
			addEvent(this.document, 'touchend', this.handleTouchEnd)
		},
		disable: function() {
			removeEvent(this.trigger, 'touchstart', this.handleTouchStart)
			removeEvent(this.document, 'touchmove', this.handleTouchMove)
			removeEvent(this.document, 'touchend', this.handleTouchEnd)
		},
		preventDefault: function() {
			this.isPreventDefault = true
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
		detectScrollIfNeed: function() {
			var props = this.props

			if (props.isStatic || !props.detectScroll) {
				return
			}

			var state = this.state
			var list = []

			// only update the property which is needed
			if (!state.isScrollLeftEnd && (props.left || props.onPullRight)) {
				list.push('isScrollLeftEnd')
			}
			if (!state.isScrollRightEnd && (props.right || props.onPullLeft)) {
				list.push('isScrollRightEnd')
			}
			if (!state.isScrollTopEnd && (props.top || props.onPullDown)) {
				list.push('isScrollTopEnd')
			}
			if (!state.isScrollBottomEnd && (props.bottom || props.onPullUp)) {
				list.push('isScrollBottomEnd')
			}
			if (!list.length) {
				return
			}

			var currentScrollInfo = this.getScrollInfo()
			for (var i = 0; i < list.length; i++) {
				var name = list[i]
				state[name] = currentScrollInfo[name]
			}
		},
		setFixedStyleIfNeed: function() {
			var props = this.props
			var state = this.state
			if (!props.isStatic && props.fixed && state.direction === 'bottom') {
				extend(this.scroller.style, {
					height: state.scrollHeight + 'px',
					overflow: 'hidden',
				})
			}
		},
		clearFixedStyleIfNeed: function() {
			var props = this.props
			var state = this.state
			if (!props.isStatic && props.fixed && state.direction === 'bottom') {
				extend(this.scroller.style, {
					height: '',
					overflow: '',
				})
			}
		},
		emit: function(type, event) {
			var listener = this.props[type]
			if (!isFunction(listener)) {
				return
			}
			return listener.call(this, this.state, event)
		},
		handleTouchStart: function(event) {
			if (this.isTouching || this.isWaitForBackToOrigin) {
				return
			}
			var coor = getCoor(event)
			this.state = extend({}, defaultState, this.getScrollInfo(), {
				startX: coor.x,
				startY: coor.y,
			})
			this.stopPropagationIfNeed(event)
			this.isTouching = true
		},
		handleTouchMove: function(event) {
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
			var direction = state.direction
			var isScrollTopEnd = state.isScrollTopEnd
			var isScrollBottomEnd = state.isScrollBottomEnd
			var isScrollLeftEnd = state.isScrollLeftEnd
			var isScrollRightEnd = state.isScrollRightEnd

			this.detectScrollIfNeed()

			// first hit the x axis ending
			if (!isScrollLeftEnd && state.isScrollLeftEnd || !isScrollRightEnd && state.isScrollRightEnd) {
				offsetX = 0
				startX = moveX
				direction = ''
			}

			// first hit the y axis ending
			if (!isScrollTopEnd && state.isScrollTopEnd || !isScrollBottomEnd && state.isScrollBottomEnd) {
				offsetY = 0
				startY = moveY
				direction = ''
			}

			// only check the axis once time
			if (!axis) {
				axis = Math.abs(offsetY) >= Math.abs(offsetX) ? 'y' : 'x'
			}

			// only check the direction once time
			if (!direction) {
				if (axis === 'y') {
					if (state.isScrollTopEnd && offsetY > 0) {
						direction = 'top'
					} else if (state.isScrollBottomEnd && offsetY < 0) {
						direction = 'bottom'
					}
				} else if (axis === 'x') {
					if (state.isScrollLeftEnd && offsetX > 0) {
						direction = 'left'
					} else if (state.isScrollRightEnd && offsetX < 0) {
						direction = 'right'
					}
				}
			}

			var damping = props.damping
			var translateX = transformValueByDamping(offsetX, damping[direction])
			var translateY = transformValueByDamping(offsetY, damping[direction])

			extend(this.state, {
				startX: startX,
				startY: startY,
				moveX: moveX,
				moveY: moveY,
				offsetX: offsetX,
				offsetY: offsetY,
				translateX: translateX,
				translateY: translateY,
				direction: direction,
				axis: axis,
			})

			if (!direction) {
				return
			}

			if (!props.drag) {
				if (props[eventMap[direction]] || props[direction]) {
					if (axis === 'y') {
						translateX = 0
					} else if (axis === 'x') {
						translateY = 0
					}
				} else {
					return
				}
			}

			this.emit(eventMap[direction], event)
			if (this.isPreventDefault) {
				this.isPreventDefault = false
				return
			}

			event.preventDefault()

			this.isWaitForBackToOrigin = true
			this.setFixedStyleIfNeed()
			this.setTranslate({
				x: translateX,
				y: translateY,
			})
			
		},
		handleTouchEnd: function(event) {
			if (!this.isTouching) {
				return
			}
			var direction = this.state.direction
			this.isTouching = false
			if (!direction) {
				return
			}
			this.emit(eventMap[direction] + 'End', event)
			if (this.isPreventDefault) {
				this.isPreventDefault = false
				return
			}
			this.animateToOrigin()
		},
	})

	return PullElement
}));