import Watcher from './observer/watcher'
import { nextTick } from './utils'
import { patch } from './vdom/patch'

export function lifecycleMixin(Vue) {
  // 更新视图
  Vue.prototype._update = function (vnode) {
    const vm = this

    vm.$el = patch(vm.$el, vnode)
  }

  // 异步更新
  Vue.prototype.$nextTick = nextTick
}

// 更新函数，数据变化后再次调用此函数
export function mountComponent(vm, el) {
  // 通过 render 生成虚拟 DOM -> 真实 DOM
  let updateComponent = () => {
    // 每次更新都会去调用 render 方法生成虚拟DOM
    // update 会去对比新旧虚拟 DOM，进行差异化更新
    vm._update(vm._render())
  }

  // 每个组件都有一个渲染 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('视图更新')
    },
    true,
  ) // 渲染 Watcher
}
