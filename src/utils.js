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
