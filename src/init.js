import { compilerToFunction } from './compiler/index'
import { callHook, mountComponent } from './lifecycle'
import { initState } from './state'
import { mergeOptions } from './utils'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    // 合并配置：这里用 vm.constructor.options 比较好，可以获取组件的构造函数选项
    vm.$options = mergeOptions(vm.constructor.options, options)

    callHook(vm, 'beforeCreate')
    // 对数据进行初始化: data props computed watch
    initState(vm)
    callHook(vm, 'created')

    // 挂载将数据挂载到这个模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    vm.$el = el

    // 把模板转化成 render 函数 => 虚拟 DOM => 产生真实节点 => 更新
    if (!options.render) {
      // 没有 render 取 template
      let template = options.template
      // 没有 template 取 el
      if (!template && el) {
        template = el.outerHTML
      }

      let render = compilerToFunction(template)
      options.render = render
    }

    // ;(function anonymous() {
    //   with (this) {
    //     return _c(
    //       'div',
    //       { id: 'app', style: { color: 'red', background: 'blue' } },
    //       _c('h2', {}, _v('hello' + _s(title) + 'wolrd')),
    //       _c('p', {}, _v(_s(bar.baz))),
    //     )
    //   }
    // })
    // console.log(options.render)

    // 挂载组件
    return mountComponent(vm, el)
  }
}
