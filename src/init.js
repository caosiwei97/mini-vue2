import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    // 对数据进行初始化: data props computed watch
    initState(vm)
  }
}
