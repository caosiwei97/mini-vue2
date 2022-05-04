import { mergeOptions } from '../utils'

// 拓展 Vue 本身
export function initGlobalApi(Vue) {
  // 存放全局配置，每个组件初始化都会与该 options 进行合并
  // component, filter, directive
  Vue.options = {}

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)

    return this
  }
}
