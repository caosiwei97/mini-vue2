import { patch } from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this

    patch(vm.$el, vnode)
  }
}

// 更新函数，数据变化后再次调用此函数
export function mountComponent(vm, el) {
  // 通过 render 生成虚拟 DOM -> 真实 DOM
  let updateComponent = () => {
    // 每次更新都会去调用 render 方法生成虚拟DOM
    // update 会去对比新旧虚拟 DOM，进行差异化更新
    vm._update(vm._render())
  }

  updateComponent()
}
