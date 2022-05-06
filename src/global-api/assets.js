export function initAssetRegisters(Vue) {
  // 定义全局组件
  Vue.component = function (id, definition) {
    // 每个组件是一个新的类，继承父类(根Vue)
    definition = this.options._base.extend(definition)

    // 所有全局组件都记录在 components 对象
    Vue.options.components[id] = definition
  }
}
