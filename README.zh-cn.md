# pull-element

流畅的触摸拖动元素的交互效果，无依赖、轻量且高性能，支持上下左右所有方向。

## 功能特性

- 轻量，压缩后仅 6kb
- 高性能，复用原生滚动行为，达到 60fps
- 无依赖，原生 javascript 编写
- 灵活，支持上下左右所有方向

## 文档
[中文](./README.zh-cn.md) [English](./READMEmd)

## 使用方式

使用 npm 下载

```shell
npm install --save pull-element
```

```javascript
// ES2015
import PullElement from 'pull-element'

// commonjs
var PullElement = require('pull-element')
```

使用 script 标签

```html
<script src="pull-element.js"></script>
<script>
	var pullElement = new PullElement({})
</script>
```

## 使用案例

注意：以下 DEMO 受到了 [framework7](http://framework7.io/kitchen-sink-ios/) 的启发。

- Playgound: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/Playground.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#playground)
- Pull To Refresh: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/PullToRefresh.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#pull-to-refresh)
- Swipe To Show Action: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SwipeToShowAction.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#swipe-to-show-action)
- Animated Tabs: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/AnimatedTabs.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#animated-tabs)
- Swipeable Tabs: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SwipeableTabs.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#swipeable-tabs)
- Slider Horizontal: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SliderHorizontal.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#slider-horizontal)
- Vertical Swiper: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/VerticalSwiper.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#vertical-swiper)
- Space Between Slides: [源码](https://github.com/Lucifier129/pull-element/blob/master/demo/src/page/SpaceBetweenSlides.js)，[DEMO](https://lucifier129.github.io/pull-element/demo/build/#space-between-slides)

## 用法

### new PullElement(options)

PullElement 是一个构造函数，接受一个 options 配置项参数，使用 new 关键字进行实例化。

实例化后，调用 init 方法进行初始化。

```javascript
var pullElement = new PullElement(options)
pullElement.init()
```

## options 参数的配置项

### options.target: selector|element

被拖动的目标，可以是选择器，也可以是元素；默认值为 'body'。 

target 元素就是被设置 transform|translate 效果的 dom 对象。

### options.scroller: selector|element

滚动对象，可以是选择器，也可以是元素。如果不配置，默认复用 target 元素作为 scroller。

这个选项在设置了 `detectScroll: true` 或 `detectScrollOnStart: true` 之后，才有作用。

只有滚动到边缘之后，才开始拖动元素。

### options.trigger: selector|element

触发对象，可以是选择器，也可以是元素。如果不配置，默认复用 target 元素作为 trigger。

只有触摸 trigger 区域，才会触发拖动元素的效果。

### options.damping: number|function

拖动元素的阻尼系数，可以是数字，也可以是函数，默认值为 1.6。

设用户拖动长度为 x， damping 系数为 y，则元素的拖动长度 d 的计算方式为：d = x/y。

如果 damping 为函数，则 d = y(x)。

### options.pullUp: boolean

是否开启上拉拖动效果，默认为 false。

### options.pullDown: boolean

是否开启下拉拖动效果，默认为 false。

### options.pullLeft: boolean

是否开启左拉拖动效果，默认为 false。

### options.pullRight: boolean

是否开启右拉拖动效果，默认为 false。

### options.detectScroll: boolean

是否开启监听滚动特性，默认为 false。

开启后，只有检测 scroller 元素滚动到边缘之后，才开始拖动元素。

### options.detectScrollOnStart: boolean

是否开启在 touchStart 时检测滚动状态的特性，默认为 false。

detectScroll 配置既在 touchStart 时检测，也在 touchMove 时检测；当 detectScroll 为 false，detectScrollOnStart 为 true 时，将只在 touchStart 时检测滚动状态。

### options.stopPropagation: boolean

是否在 touchStart 时停止事件冒泡，默认为 false。

该配置项的作用在于，嵌套两个 pull-element 效果时，子元素可以独立，其拖动效果不影响父元素。

### options.drag: boolean
 
是否开启自由拖动效果，默认为 false。

开启后，target 元素的拖动不再只能是 X 轴或 Y 轴（默认行为是：其中一个轴的 translate 值被设置为 0），它将在 X 轴和 Y 轴都有偏移效果。

### options.transitionDuration: string

target 元素回归原点的过渡时长，默认为 0.3s。

结束拖动，即释放 target 元素时，target 元素将默认滚动回原点。

### options.transitionTimingFunction: string

target 元素回归原点的过渡函数，默认为 ease-out。

结束拖动，即释放 target 元素时，target 元素将默认滚动回原点。

### options.wait: boolean

是否在拖动结束时，等待回归原点后才允许再次拖动，默认为 true。

如果设置为 false，在过渡回原点时，也可以被重新拖动。

### options.onPull{Direction}: function

开启并响应某个方向的拖动事件，Direction 可以为 Up|Down|Left|Right。

接受一个参数：data。data 参数包含两个字段，translateX 和 translateY，分别是 X 轴和 Y 轴的偏移值，该值已经经过了 damping 的折算。

如果在该方法里调用 this.preventDefault() 方法，将阻止默认行为，即 target 元素在此次事件里不会被设置偏移。

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

开启并响应某个方向的拖动结束事件，Direction 可以为 Up|Down|Left|Right。

接受一个参数：data。data 参数包含两个字段，translateX 和 translateY，分别是 X 轴和 Y 轴的偏移值，该值已经经过了 damping 的折算。

如果在该方法里调用 this.preventDefault() 方法，将阻止默认行为，即 target 元素不会自动过渡回原点。

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

## 实例方法

### pullElement.init()

初始化 PullElement 实例，该方法将绑定 touch 事件。

### pullElement.destroy()

销毁 PullElement 事例，该方法将解除 touch事件。

### pullElement.enable()

开启对 touch 事件的响应能力，即绑定 touch 事件。在 init 方法里会调用。

可以用该方法主动开启 touch 绑定。

### pullElement.disable()

关闭对 touch 事件的响应能力，即解除 touch 事件。在 destroy 方法里会调用。

可以用该方法主动关闭 touch 绑定。

### pullElement.setTranslate(translateX, translateY)

设置 target 元素的偏移值，参数 translateX 和 translateY 都是 number 数值类型。

该方法用于在调用 this.preventDefault() 方法后，手动设置偏移值。

### pullElement.animateTo(translateX, translateY, callback)

以过渡的动画形式设置偏移值，前两个参数跟 setTranslate 方法一致，第三个参数为动画结束后触发的 callback 函数。

该方法在支持 promise 的浏览器里会返回 promise。

### pullElement.animateToOrigin(callback)

以过渡的动画形式回归到原点，第一个参数为动画结束后触发的 callback 函数。

该方法在支持 promise 的浏览器里会返回 promise。

注意，如果 `options.wait` 为 `true`，在 `onPull{Direction}End` 里调用 `this.preventDefault()` 后，必须在某个时机手动调用 `this.animateToOrigin()` 才可以结束等待状态，否则元素将一直在等待回归原点，不再响应 touch 事件。

### pullElement.preventDefault()

阻止默认行为。该方法必须在 onPull{Direction} 和 onPull{Direction}End 配置项里执行。

当在 onPull{Direction} 里执行时，所阻止的默认行为是 `this.setTranslate(translateX, translateY)`

当在 onPull{Direction}End 里执行时，所阻止的默认行为是 `this.animateToOrigin()`


## License
License: MIT (See LICENSE file for details)