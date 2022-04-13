import { observe } from './observer/index'
import { isFunction } from './utils'

export function initState(vm) {
  const opts = vm.$options

  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return source[key]
    },
    set(newVal) {
      if (newVal === source[key]) {
        return
      }

      source[key] = newVal
    },
  })
}

function initData(vm) {
  let data = vm.$options.data

  // 此时 data 与 vm 没有关系，需要定义一个 _data 来建立引用关系
  data = vm._data = isFunction(data) ? data.call(vm) : data

  // 将属性代理到 vm，通过 this.×× 获取 this._data 上的数据
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      proxy(vm, data, key)
    }
  }
  // 设置响应式
  observe(data)
}
