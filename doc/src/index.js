import Viewport from '../../src/virtual-viewport'
import './main.css'

const list = `
<p id="info" style="position:relative;z-index:10px;width:100%;height:70px;background:grey;color:#fff;z-index: 11;overflow:hidden;text-align:center;">
	you can drag me in x-axis
</p>
<div class="wrapper" style="position:relative;text-align: center;">
	<div class="pull_refresh" style="position:absolute; top:-70px; left:0; width:100%; height: 40px;">
		<div class="pull">
			<div id="arrow" class="arrow">
	            <img src="http://alloyteam.github.io/AlloyTouch/refresh/pull_refresh/asset/arrow.png"><br />
	        </div>
		</div>
		 <div class="loading" style="margin-top:30px">
            <svg width='40px' height='40px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default">
                <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(0 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(30 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(60 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(90 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(120 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(150 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(180 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(210 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(240 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(270 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(300 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s' repeatCount='indefinite' />
                </rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(330 50 50) translate(0 -30)'>
                    <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s' repeatCount='indefinite' />
                </rect></svg>
        </div>
	</div>
	<div class="list" style="user-select:none;text-align: center; line-height:40px">
		${Array.from({length: 100}).map(
			(_, index) => `<div style="height:40px; border-top:1px solid #eaeaea">${index}</div>`
		).join('')}
	</div>
	<div style="text-align: center; width:100%; height: 40px; color:#fff; background:red; line-height:40px;">
		上拉刷新还没做
	</div>
</div>
`

const rootElem = document.getElementById('root')

rootElem.innerHTML = list

const info = document.getElementById('info')

const bigList = Array.from({length: 100}, (_, index) => `<div>${index}</div>`)


 const arrow = document.querySelector("#arrow")
 const pull_refresh = document.querySelector(".pull_refresh")

const viewport = new VirtualViewport({
    target: '.wrapper',
    scroller: 'body',
    onTouchMove({ offset }) {
        if (offset.y > 140) {
            arrow.classList.add('arrow_up')
        } else {
            arrow.classList.remove('arrow_up')
        }
    },
    onTouchEnd({ offset }) {
        if (offset.y > 140) {
            this.animateTo({x: 0, y: 40})
            pull_refresh.classList.add("refreshing")
            return mockRequest()
        }
        arrow.classList.remove('arrow_up')
    }
})

function mockRequest(viewport) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            arrow.classList.remove("arrow_up");
            pull_refresh.classList.remove("refreshing");
            updateList()
            resolve()
        }, 1000);
    })
}


let count = 1

function updateList() {
    let list = document.querySelector('.list')
    let curCount = count++
    Array.from(list.children).forEach((node, index) => node.textContent = index + curCount)
}

viewport.init()

const viewport1 = new VirtualViewport({
    target: '#info',
    isStatic: true,
    damp: 1,
    weightY: 0,
    weightX: 1
})

viewport1.init()