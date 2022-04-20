import { popTarget, pushTarget } from './dep'

let id = 0

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn // updateComponent
    this.cb = cb
    this.options = options
    this.getter = exprOrFn
    this.id = id++
    this.deps = []
    this.depsId = new Set()
    this.get() // 默认初始化
  }

  get() {
    // 每个属性收集自己的 Watcher，一个 Watcher 可以对应多个属性
    pushTarget(this)
    this.getter()
    popTarget()
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
    this.get()
  }
}

export default Watcher
