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
		var targetEvent = event.touches[0]
		return {
			x: targetEvent.clientX,
			y: targetEvent.clientY,
		}
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

	function getTranslateStyle(translateX, translateY) {
		var translateValue = 'translate(' + translateX + 'px,' + translateY + 'px)'
		return {
			transform: translateValue,
			webkitTransform: translateValue,
		}
	}

	var staticScrollStatus = {
		isScrollTopEnd: true,
		isScrollLeftEnd: true,
		isScrollBottomEnd: true,
		isScrollRightEnd: true,
	}

	var emptyStyle = {
		transition: '',
		transform: '',
		webkitTransform: '',
		webkitTransition: '',
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
		clientX: 0,
		clientY: 0,
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
		wait: true,
		top: false,
		bottom: false,
		left: false,
		right: false,
		isStatic: false,
		drag: false,
		detectScroll: false,
		stopPropagation: false,
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
		this.isWaiting = false
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
			this.props = extend({}, defaultProps, this.options)
			this.enable()
		},
		destroy: function() {
			this.disable()
		},
		setTranslate: function(translateX, translateY) {
			var translateStyle = getTranslateStyle(translateX, translateY)
			var transitionStyle = {
				transition: '',
				webkitTransition: '',
			}
			extend(this.target.style, transitionStyle, translateStyle)
		},
		animateTo: function(translateX, translateY, callback) {
			var state = this.state
			var props = this.props
			var target = this.target
			var translateStyle = getTranslateStyle(translateX, translateY)
			var transitionStyle = {
				transitionProperty: props.transitionProperty,
				transitionDuration: props.transitionDuration,
				transitionTimingFunction: props.transitionTimingFunction,
				webkitTransitionProperty: props.transitionProperty,
				webkitTransitionDuration: props.transitionDuration,
				webkitTransitionTimingFunction: props.transitionTimingFunction,
			}
			/**
			* in some browser, transitionend dose'nt work as expected
			* use setTimeout instead
			*/
			var transitionDuration = Number(props.transitionDuration.replace(/[^.\d]+/g, ''))

			// transform 1s to 1000ms
			if (/[\d\.]+s$/.test(props.transitionDuration)) {
				transitionDuration = transitionDuration * 1000
			}

			var createTransitionEndHandler = function(resolve) {
				var isCalled = false
				var handleTransitionEnd = function() {
					if (!isCalled) {
						isCalled = true
						callback && callback()
						resolve && resolve()
					}
				}
				extend(target.style, transitionStyle, translateStyle)
				setTimeout(handleTransitionEnd, transitionDuration)
			}

			state.translateX = translateX
			state.translateY = translateY
			
			if (isSupportPromise) {
				return new Promise(createTransitionEndHandler)
			}
			createTransitionEndHandler()
		},
		animateToOrigin: function(callback) {
			var context = this
			var finalCallback = function() {
				context.isWaiting = false
				extend(context.target.style, emptyStyle)
				extend(context.state, {
					direction: '',
					axis: '',
					translateX: 0,
					translateY: 0,
				})
				context.isWaiting = false
				callback && callback()
			}
			this.isWaiting = true
			return this.animateTo(0, 0, finalCallback)
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
			if (!props.isStatic && props.detectScroll) {
				extend(this.state, this.getScrollInfo())
			}
		},
		isActiveDirection: function(direction) {
			var props = this.props
			return props[eventMap[direction]] || props[eventMap[direction] + 'End'] || props[direction]
		},
		emit: function(type, event) {
			var listener = this.props[type]
			if (!isFunction(listener)) {
				return
			}
			return listener.call(this, this.state, event)
		},
		handleTouchStart: function(event) {
			if (this.isTouching || this.isWaiting) {
				return
			}
			var coor = getCoor(event)
			extend(this.state, this.getScrollInfo(), {
				clientX: coor.x,
				clientY: coor.y,
				axis: '',
				direction: '',
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
			var clientX = coor.x
			var clientY = coor.y
			var deltaX = clientX - state.clientX
			var deltaY = clientY - state.clientY
			var translateX = state.translateX
			var translateY = state.translateY
			var axis = state.axis
			var direction = state.direction

			this.detectScrollIfNeed()

			// only check the axis once
			if (!axis) {
				axis = Math.abs(deltaY) >= Math.abs(deltaX) ? 'y' : 'x'
			}

			// only check the direction once
			if (!direction) {
				if (axis === 'y') {
					if (state.isScrollTopEnd && deltaY > 0) {
						direction = 'top'
					} else if (state.isScrollBottomEnd && deltaY < 0) {
						direction = 'bottom'
					}
				} else if (axis === 'x') {
					if (state.isScrollLeftEnd && deltaX > 0) {
						direction = 'left'
					} else if (state.isScrollRightEnd && deltaX < 0) {
						direction = 'right'
					}
				}
			}

			var isActiveDirection = this.isActiveDirection(direction)

			if (isActiveDirection) {
				translateX += transformValueByDamping(deltaX, props.damping)
				translateY += transformValueByDamping(deltaY, props.damping)
			}
			
			extend(this.state, {
				clientX: clientX,
				clientY: clientY,
				translateX: translateX,
				translateY: translateY,
				direction: direction,
				axis: axis,
			})

			if (!isActiveDirection) {
				return
			}

			if (!props.drag) {
				if (axis === 'y') {
					translateX = 0
				} else if (axis === 'x') {
					translateY = 0
				}
			}

			this.emit(eventMap[direction], event)
			if (this.isPreventDefault) {
				this.isPreventDefault = false
				return
			}

			if (props.wait) {
				this.isWaiting = true
			}
			event.preventDefault()
			this.setTranslate(translateX, translateY)
		},
		handleTouchEnd: function(event) {
			if (!this.isTouching) {
				return
			}
			this.isTouching = false

			var direction = this.state.direction
			if (!direction || !this.isActiveDirection(direction)) {
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