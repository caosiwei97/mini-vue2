import Dep from './observer/dep'
import { observe } from './observer/index'
import Watcher from './observer/watcher'
import { hasOwn, isFunction } from './utils'

export function initState(vm) {
  const opts = vm.$options

  if (opts.data) {
    initData(vm)
  }

  if (opts.watch) {
    initWatch(vm, opts.watch)
  }

  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
}

export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    // 创建用户 Watcher
    options.user = true
    new Watcher(this, key, handler, options)
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

function initWatch(vm, watch) {
  for (const key in watch) {
    if (hasOwn(watch, key)) {
      const fn = watch[key]

      if (Array.isArray(fn)) {
        for (let i = 0; i < fn.length; i++) {
          createWatcher(vm, key, fn[i])
        }
      } else {
        createWatcher(vm, key, fn)
      }
    }
  }
}

function initComputed(vm, computed) {
  const watchers = (vm._computedWatchers = {})

  for (const key in computed) {
    if (hasOwn(computed, key)) {
      const fnOrObj = computed[key]

      let getter = typeof fnOrObj === 'function' ? fnOrObj : fnOrObj.get

      // 将 watcher 与属性做映射
      watchers[key] = new Watcher(vm, getter, () => {}, {
        lazy: true,
      })

      // 将属性放到 vm 上
      defineComputed(vm, key, fnOrObj)
    }
  }
}

function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler)
}

function defineComputed(vm, key, userDef) {
  let sharedProperty = {}

  sharedProperty.get = createComputedGetter(key)
  sharedProperty.set =
    typeof userDef === 'object' ? userDef.set : function () {}

  Object.defineProperty(vm, key, sharedProperty)
}

function createComputedGetter(key) {
  return function computedGetter() {
    // 拿到当前属性的 Watcher
    let watcher = this._computedWatchers[key]

    // 如果是脏值则计算
    if (watcher.dirty) {
      watcher.evaluate()
    }

    // 如果取完值，Dep.target 还有值，需要继续向上收集依赖
    if (Dep.target) {
      watcher.depend() // watcher 对应多个 dep
    }

    return watcher.value
  }
}
