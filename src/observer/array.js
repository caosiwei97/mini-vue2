import { def } from '../utils'

const arrayProto = Array.prototype

export const arrayMethods = Object.create(arrayProto)

// 需要拦截的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

methodsToPatch.forEach((method) => {
  // 原始方法（装饰器模式不会影响原先功能）
  const original = arrayProto[method]

  // 调用重写后的数组方法
  def(arrayMethods, method, function mutator(...args) {
    // 先调用原来的方法
    const ret = original.apply(this, args)
    const ob = this.__ob__
    // 再处理拦截（类似于装饰器模式中的 after）
    console.log('数组拦截')
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
      default:
        break
    }
    // 新插入元素后，重新遍历数组元素设置为响应式数据
    if (inserted) {
      ob.observeArray(inserted)
    }

    // 通知视图更新
    ob.dep.notify()

    return ret
  })
})
