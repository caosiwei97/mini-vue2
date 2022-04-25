import { popTarget, pushTarget } from './dep'
import { queueWatcher } from './scheduler'

let id = 0

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn // 可能是 updateComponent，或者一个字符串（watch对象的key）
    this.cb = cb // watch 的 回调 or 渲染后的回调
    this.options = options
    this.getter =
      typeof exprOrFn === 'string'
        ? function () {
            // 'bar.baz'  => vm[bar][baz]
            let keys = exprOrFn.split('.') // ['bar', 'baz']
            let curKey
            let obj = this.vm

            while ((curKey = keys.shift())) {
              // 这个地方会去触发 data 属性的依赖收集，把当前 Watcher 存到 dep
              obj = obj[curKey]
            }

            return obj
          }
        : exprOrFn
    this.id = id++ // 标识 watcher 的唯一性
    this.deps = [] // 存放 dep 对象
    this.depsId = new Set() // 存放唯一 depId，标识 dep 的唯一性
    this.user = !!options.user // 标识是否为用户 Watcher

    this.value = this.get() // 默认初始化, 拿到初始值
  }

  get() {
    // 每个属性收集自己的 Watcher，一个 Watcher 可以对应多个属性
    pushTarget(this)
    const value = this.getter()
    popTarget()

    return value
  }

  addDep(dep) {
    let id = dep.id

    // watcher 里面存过了当前属性的 dep就不处理
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  update() {
    // 多次更新数据时，最后只做一次更新
    // 所以需要先缓存当前渲染 Watcher -> 异步更新
    queueWatcher(this)
  }

  // 数据更新的时候调用
  run() {
    const newValue = this.get()
    const oldValue = this.value

    this.value = newValue
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
}

export default Watcher
