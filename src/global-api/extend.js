import { mergeOptions } from "../utils"

export function initExtend(Vue) {
  Vue.extend = function(opts) {
    // 原型继承
    const Super = this
    const Sub = function VueComponent() {
      this._init()
    }

    Sub.prototype = Object.create(Super)
    Sub.prototype.constructor = Sub
    // 与父类选项进行合并
    Sub.options = mergeOptions(Super.options, opts)

    return Sub
  }
}