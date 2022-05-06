import { LIFECYCLE_HOOKS } from './shared/constants'

const strats = {}

// 默认合并策略
const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
}

// 生命周期钩子的合并策略
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})

strats.data =
  strats.watch =
  strats.computed =
    function mergeDataOrFn(parentVal, childVal) {
      return { ...parentVal, ...childVal }
    }

// 组件选项合并：每个组件选项对象的原型都指向 Vue.options.components
// 这就是为啥能在子组件使用全局组件的原因
strats.components = function (parentVal, childVal) {
  const options = Object.create(parentVal)

  if (childVal) {
    for (const key in childVal) {
      if (hasOwn(childVal, key)) {
        options[key] = childVal[key]
      }
    }
  }

  return options
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

  // 遍历儿子的 key 且父亲没有的 key ==> 主要防止重复合并
  for (const key in child) {
    if (!hasOwn(parent, key)) {
      mergeFiled(key)
    }
  }

  function mergeFiled(key) {
    // 找到当前配置的策略
    const strat = strats[key] || defaultStrat

    options[key] = strat(parent[key], child[key])
  }

  return options
}

// 判断是否 HTML 标签
export function isReservedTag(str) {
  const tagStr = 'a,div,span,p,img,button,ul,li,h2'
  // 源码根据 ',' 生成映射表
  return tagStr.includes(str)
}
