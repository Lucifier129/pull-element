# pull-element

Lightweight, high-performance and smooth pull element effect that support all directions

## Features

- Lightweight, 6kb
- High performance, native scrolling, 60fps
- No dependent, just vanilla.js
- flexible, support `top|right|down|left` all the directions

## Documentation
[中文](./README.zh-cn.md)

## Installtion

With npm

```shell
npm install --save pull-element
```

How to import `pull-element`

```javascript
// ES2015 style
import PullElement from 'pull-element'

// commonjs style
var PullElement = require('pull-element')
```

With script tag

```html
<script src="pull-element.js"></script>
<script>
	var pullElement = new PullElement({})
</script>
```

## DEMO

Note: these demo were inspired by [framework7](http://framework7.io/kitchen-sink-ios/)

- Playgound: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/Playground.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#playground)
- Pull To Refresh: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/PullToRefresh.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#pull-to-refresh)
- Swipe To Show Action: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SwipeToShowAction.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#swipe-to-show-action)
- Animated Tabs: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/AnimatedTabs.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#animated-tabs)
- Swipeable Tabs: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SwipeableTabs.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#swipeable-tabs)
- Slider Horizontal: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SliderHorizontal.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#slider-horizontal)
- Vertical Swiper: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/VerticalSwiper.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#vertical-swiper)
- Space Between Slides: [view-source](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SpaceBetweenSlides.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#space-between-slides)

## API

### new PullElement(options)

PullElement is a constructor function, receive an argument `options` which should be an object.

Use the keyword `new` to get its instance, and then call the `init` method to initialize.

```javascript
var pullElement = new PullElement(options)
pullElement.init()
```

## Options

### options.target: selector|element

`target` can be a selector or a dom-element, the default value is `'body'`

`target` is used to be the target who will be seted `transform|translate` style when user is touching.

### options.scroller: selector|element

`scroller` can be a selector or a dom-element, if it's empty, then the `target` will be the `scroller`

This option must works with other options `detectScroll|detectScrollOnStart`.

If one of `detectScroll|detectScrollOnStart` is `true`, the `target` will only translate when `scroller` reach the ending.

### options.trigger: selector|element

`trigger` can be a selector or a dom-element, if it's empty, then the `target` will be the `trigger`.

When user is touching the `trigger`, it occur the pull element effect. 

### options.damping: number|function

`damping` can be a number or a function, the default value is `1.6`.

If the duration of touch is `x`, and the `damping` is `y`, then the `translate` d is: `d = x/y`.

If `damping` is a function ,then d is: `d = y(x)`.

### options.pullUp: boolean

Enable pulling element up, the default value is `false`.

### options.pullDown: boolean

Enable pulling element down, the default value is `false`.

### options.pullLeft: boolean

Enable pulling element left, the default value is `false`.

### options.pullRight: boolean

Enable pulling element right, the default value is `false`.

### options.detectScroll: boolean

Enable detect scroller status, the default value is `false`.

When `detectScroll` is `true`, it will start pulling element when the `scroller` reached the ending.

If this option is `true`, it will detech scroll status on both `touchstart` and `touchmove`.

### options.detectScrollOnStart: boolean

Enable detech scroller status on `touchstart`, the default value is `false`.

If this option is `true`, and `detectScroll` option is `false`,  it will only detech scroll status on `touchstart` event.

### options.stopPropagation: boolean

Enable `stopPropagation` on `touchstart`, the default value is `false`

This option is used to support nesting pull-element effect.

### options.drag: boolean

Enable drag effect, the default value is `fasle`

The default behavior of pulling element is only one axis, and the other axis will be seted to zero.

If this option is `true`, the `target` will translate in both x-axis and y-axis.

### options.transitionDuration: string

The duration of transition, the default value is `0.3s`

When user stop touching, the default behavior is that `target` animate to the origin.

### options.transitionTimingFunction: string

The timing function of transition, the default value is `ease-out`

When user stop touching, the default behavior is that `target` animate to the origin.

### options.wait: boolean

Enable wait for animating to the origin, the default value is `true`.

When user stop touching, the default behavior is that `target` animate to the origin, the `trigger` will not response the touching event in this time.

If this options is `false`, user can touch the `trigger` again.

### options.onPull{Direction}: function

Enable and response the `Direction` of pulling, `Direction` can be one of `Up|Down|Left|Right`.

The `function` will receive one argument `data` when user pulling the elment.

`data` is an object. it has two property `translateX|translateY`, both of them were calculated by `damping`.

If the `function` has called method `this.preventDefault()`, it will prevent the default behavior. In this case, `target` will not be seted `translate` style.

```javascript
var pullElement = new PullElement({
	onPullUp: function(data) {
		var translateX = data.translateX
		var translateY = data.translateY
		this.preventDefault()
	}
})
pullElement.init()
```

### options.onPull{Direction}End: function

Enable the `Direction` of pulling, and response the event of stop pulling, `Direction` can be one of `Up|Down|Left|Right`.

The `function` will receive one argument `data` when user pulling the elment.

`data` is an object. it has two property `translateX|translateY`, both of them were calculated by `damping`.

If the `function` has called method `this.preventDefault()`, it will prevent the default behavior. In this case, `target` will not animate to origin.

```javascript
var pullElement = new PullElement({
	onPullUpEnd: function(data) {
		var translateX = data.translateX
		var translateY = data.translateY
		this.preventDefault()
	}
})
pullElement.init()
```

## Methods

### pullElement.init()

Initialize the pull-element effect, and add touch event listeners.

### pullElement.destroy()

Destroy the instance of `PullElement`, and remove touch event listeners.

### pullElement.enable()

Add touch event listeners.

### pullElement.disable()

Remove touch event listeners.

### pullElement.setTranslate(translateX, translateY)

Set `translate style` of `target`, `translateX` and `translateY` must be number.

You can use this method to set `translate style` directly after calling `this.preventDefault()`.

### pullElement.animateTo(translateX, translateY, callback)

Animate to some where, `translateX` and `translateY` is the same type in `setTranslate`.

The third argument `callback` is a function, it will be invoked when animation has been over.

If `es6-promise` is supported, this method will return a promise, so you can use `async/await` or `then` method to handle the ending of animation.

### pullElement.animateToOrigin(callback)

Animate to origin, it's equal to `this.animateTo(0, 0, callback)`, but more, see below.

If option `wait` is `true`, it will call `animateToOrigin` automatically after `pull{Direction}End`(Note: If you call `this.preventDefault` in it, you should call `this.animateToOrigin` manually to stop waiting).

### pullElement.preventDefault()

Prevent the default behavior. This method should only be invoked by function `onPull{Direction}` or `onPull{Direction}End`

When this method is invoked by `onPull{Direction}`, the default behavior is `this.setTranslate(translateX, translateY)`.

When this method is invoked by `onPull{Direction}End`, the default behavior is `this.animateToOrigin()`.

## License
License: MIT (See LICENSE file for details)