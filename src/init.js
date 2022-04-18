import { compilerToFunction } from './compiler/index'
import { mountComponent } from './lifecycle'
import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    // 对数据进行初始化: data props computed watch
    initState(vm)

    // 挂载将数据挂载到这个模板
    if (vm.$options.$el) {
      vm.$mount(vm.$options.$el)
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
        let render = compilerToFunction(template)
        options.render = render
      }
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
    console.log(options.render)

    // 挂载组件
    mountComponent(vm, el)
  }
}
