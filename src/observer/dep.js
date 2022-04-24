let id = 0

class Dep {
  static target = null

  constructor() {
    this.id = id++
    this.subs = [] // 存放 watcher
  }

  // 通知 watcher 存放 dep
  depend() {
    // 存放 watcher，watcher 存 dep
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}

export function pushTarget(wacher) {
  Dep.target = wacher
}

export function popTarget(wacher) {
  Dep.target = null
}

export default Dep
