import { LIFECYCLE_HOOKS } from './shared/constants'

const strats = {}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})

strats.data =
  strats.watch =
  strats.computed =
    function mergeDataOrFn(parentVal, childVal) {
      return { ...parentVal, ...childVal }
    }
// 生命周期钩子合并
function mergeHook(parentVal, childVal) {
  let res

  if (!childVal) {
    // 儿子没有
    res = parentVal
  } else {
    // 儿子有，爸爸没有
    if (!parentVal) {
      res = Array.isArray(childVal) ? childVal : [childVal]
    } else {
      // 儿子爸爸都有
      res = parentVal.concat(childVal)
    }
  }

  return res
}

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

export function mergeOptions(parent, child) {
  const options = {}

  // 遍历父亲的 key 进行合并
  for (const key in parent) {
    mergeFiled(key)
  }

  // 遍历儿子的 key 且父亲没有的 key
  for (const key in child) {
    if (!hasOwn(parent, key)) {
      mergeFiled(key)
    }
  }

  function mergeFiled(key) {
    // 找到当前配置的策略
    const strat = strats[key]

    options[key] = strat(parent[key], child[key])
  }

  return options
}
