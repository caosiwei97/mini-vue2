import { def, hasOwn, isObject } from '../utils'
import { arrayMethods } from './array'

class Observer {
  constructor(data) {
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
    // value 可能也是对象
    observe(value)

    Object.defineProperty(data, key, {
      get() {
        console.log('getter 触发', value)
        return value
      },
      set(newVal) {
        if (newVal === value) {
          return
        }

        // value 可能也是对象
        observe(newValue)
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
}
