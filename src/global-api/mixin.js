import { mergeOptions } from "../utils"

export function initMixin(Vue) {
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)

    return this
  }
}