import { def, hasOwn, isObject } from '../utils'
import { arrayMethods } from './array'
import Dep from './dep'

class Observer {
  constructor(data) {
    this.dep = new Dep() // 数组依赖，给数组更新

    def(data, '__ob__', this)

    if (Array.isArray(data)) {
      // 数组劫持 - 装饰器模式（AOP)
      data.__proto__ = arrayMethods
      // 遍历数组成员，如果是对象则继续设置响应式
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }

  defineReactive(data, key, value) {
    const dep = new Dep()
    // value 可能也是对象/数组
    let childOb = observe(value)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 需要 watcher 和 dep 关联起来
        // 模板里访问了属性
        if (Dep.target) {
          dep.depend() // 通知 dep 存储 watcher
          if (childOb) {
            childOb.dep.depend() // 让数组 or 对象也记住 Watcher
            // 嵌套数组
            if (Array.isArray(value)) {
              dependArray(value)
            }
          }
        }

        return value
      },
      set(newVal) {
        if (newVal === value) {
          return
        }
        value = newVal
        // value 可能也是对象
        observe(newVal)
        // 更新视图
        dep.notify()
      },
    })
  }
}

export function observe(data) {
  // 不是对象不进行响应式处理
  if (!isObject(data)) {
    return
  }

  let ob

  if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
    ob = data.__ob__
  }

  // 响应式处理
  ob = new Observer(data)

  return ob
}

function dependArray(array) {
  for (let i = 0; i < array.length; i++) {
    // 数组里的数组
    const current = array[i]

    current?.__ob__?.dep?.depend()

    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}
