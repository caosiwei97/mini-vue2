export function initAssetRegisters(Vue) {
  // 定义全局组件
  Vue.component = function (id, definition) {
    // 每个组件是一个新的类，继承父类(根Vue)
    definition = this.options._base.extend(definition)

    Vue.options.components[id] = definition
  }
}
