import { nextTick } from '../utils'

let queue = []
let has = {} // 存放的 watcher
let pending = false

// 清空队列
function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    // 批量更新
    queue[i].run()
  }
  // 清空队列
  queue.length = 0
  has = {}
  pending = false // 标识本次更新完毕
}

export function queueWatcher(watcher) {
  const id = watcher.id

  if (!has[id]) {
    // 存放当前渲染 watcher，并且做去重操作（防止同一个 Watcher）
    queue.push(watcher)
    has[id] = true
  }

  // 防抖（防止短时间内多次更新）
  if (!pending) {
    // 下一个宏任务统一执行更新
    nextTick(flushSchedulerQueue, 0)
    pending = true
  }
}
