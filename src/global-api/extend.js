import { mergeOptions } from '../utils'

export function initExtend(Vue) {
  Vue.extend = function (opts = {}) {
    // 原型继承
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options)
    }

    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    // 与父类选项进行合并
    Sub.options = mergeOptions(Super.options, opts)

    return Sub
  }
}
