import React from 'react'
import ReactDOM from 'react-dom'
import Viewport from '../../'
import './main.css'

function App() {
    return (
        <div className="app">
            <div className="info" >
                you can drag me in x-axis
                <div style={{width:'200%'}}>adf</div>
            </div>
            <div className="wrapper">
            <div className="pull_refresh">
                        <div className="pull">
                            <div id="arrow" className="arrow">
                                <img src="http://alloyteam.github.io/AlloyTouch/refresh/pull_refresh/asset/arrow.png" />
                                <br />
                            </div>
                        </div>
                         <div className="loading">
                            <svg width='40px' height='40px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="uil-default">
                                <rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect><rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#00a9f2' transform='rotate(0 50 50) translate(0 -30)'>
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
                <div className="list">
                    {
                        Array.from({length: 30}).map(
                            (_, index) => <div className="item">{index}</div>
                        )
                    }
                </div>
                <div className="pull-up">
                    上拉刷新还没做
                </div>
            </div>
        </div>
    )
}

const rootElem = document.getElementById('root')

ReactDOM.render(<App />, rootElem)


const arrow = document.querySelector("#arrow")
const pull_refresh = document.querySelector(".pull_refresh")
const pull_up =  document.querySelector('.pull-up')

const viewport = new Viewport({
    target: '.wrapper',
    scroller: 'body',
    detectScroll: true,
    fixed: true,
    onPullUp({ translateY }) {
        Object.assign(pull_up.style, {
            transition: '',
            height: Math.min(Math.abs(translateY), 40) + 'px',
        })
    },
    onPullUpEnd() {
       
    },
    onOrigin({ type }) {
        console.log(type)
        Object.assign(pull_up.style, {
            transition: '',
            height: 0,
        })
    },
    onPullDown({ offsetY }) {
        if (offsetY > 100) {
            arrow.classList.add('arrow_up')
        } else {
            arrow.classList.remove('arrow_up')
        }
    },
    async onPullDownEnd({ offsetY }) {
       if (offsetY > 100) {
            this.preventDefault()
            pull_refresh.classList.add("refreshing")
            this.animateTo({x: 0, y: 40})
            this.disable()
            await mockRequest()
            await this.animateToOrigin()
            this.enable()
        } else {
            arrow.classList.remove('arrow_up')
        }
    },
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
    let list = document.querySelectorAll('.list .item')
    let curCount = count++
    Array.from(list).forEach((node, index) => node.textContent = index + curCount)
}

viewport.init()

const viewport1 = new Viewport({
    target: '.info',
    // isStatic: true,
    damp: 1,
    detectScroll: true,
    right: true,
})

viewport1.init()

 function damping(value) {
     var step = [20, 40, 60, 80, 100];
     var rate = [0.5, 0.4, 0.3, 0.2, 0.1];

     var scaleedValue = value;
     var valueStepIndex = step.length;

     while (valueStepIndex--) {
         if (value > step[valueStepIndex]) {
             scaleedValue = (value - step[valueStepIndex]) * rate[valueStepIndex];
             for (var i = valueStepIndex; i > 0; i--) {
                 scaleedValue += (step[i] - step[i - 1]) * rate[i - 1];
             }
             scaleedValue += step[0] * 1;
             break;
         }
     }

     return scaleedValue;
 };
