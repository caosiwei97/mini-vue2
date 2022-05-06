import { isObject, isReservedTag } from '../utils'

export function createElement(vm, tag, data = {}, ...children) {
  // 如果是组件，应该渲染一个组件的 vnode
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children, undefined)
  }

  const Ctor = vm.$options.components[tag]

  return createComponent(vm, tag, data, data.key, children, Ctor)
}

// 创建组件的 VNode
function createComponent(vm, tag, data, key, children, Ctor) {
  // 组件定义在 components 选项里，是一个对象
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }

  data.hook = {
    init(vnode) {
      const vm = (vnode.componentInstance = new Ctor({ _isComponent: true }))

      vm.$el = vm.$mount()
    },
  }

  return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
    Ctor,
    children,
  })
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  }
}
