export function isFunction(fn) {
  return typeof fn === 'function'
}

export function isObject(value) {
  return typeof value === 'object' && value !== null
}

// 定义一个属性，默认不可枚举
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// 存放内部 next 回调和用户传进来的回调，保证执行顺序
const cbs = []
let wating = false

export function nextTick(cb) {
  cbs.push(cb)

  if (!wating) {
    queueMicrotask(flushCallbacks, 0)
    wating = true
  }
}

function flushCallbacks() {
  cbs.forEach((cb) => cb())
  wating = false
}
