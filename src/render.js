import { createElement, createTextElement } from './vdom/index'

export function renderMixin(Vue) {
  Vue.prototype._c = function (tag, data, children) {
    return createElement(this, ...arguments)
  }

  Vue.prototype._v = function (text) {
    return createTextElement(this, text)
  }

  Vue.prototype._s = function (val) {
    return typeof val === 'object' ? JSON.stringify(val) : val
  }

  Vue.prototype._render = function () {
    const vm = this
    const render = vm.$options.render
    const vnode = render.call(vm)

    return vnode
  }
}
