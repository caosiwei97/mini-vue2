import { compilerToFunction } from './compiler/index'
import { initGlobalApi } from './global-api/index'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { stateMixin } from './state'
import { createElm, patch } from './vdom/patch'

function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue) // _render
lifecycleMixin(Vue) // _update
stateMixin(Vue)

// 拓展全局 Vue
initGlobalApi(Vue)

// let oldTemp = `<ul>
//   <li key="C">C</li>
//   <li key="A">A</li>
//   <li key="B">B</li>
//   <li key="D">D</li>
// </ul>`
// let newTemp = `<ul>
//   <li key="B">B</li>
//   <li key="C">C</li>
//   <li key="D">D</li>
//     <li key="A">A</li>
// </ul>`

// let oldVm = new Vue({
//   data: {
//     msg: 'hello world',
//   },
// })

// const oldRender = compilerToFunction(oldTemp)
// const oldVnode = oldRender.call(oldVm)

// document.body.appendChild(createElm(oldVnode))

// let newVm = new Vue({
//   data: {
//     msg2: 'hello',
//   },
// })

// const newRender = compilerToFunction(newTemp)
// const newVnode = newRender.call(newVm)

// setTimeout(() => {
//   patch(oldVnode, newVnode)
// }, 2000)

export default Vue
