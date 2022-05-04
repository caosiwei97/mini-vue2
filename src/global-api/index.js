import { initExtend } from './extend';
import { initAssetRegisters } from './assets';
import { initMixin } from './mixin';
import { ASSET_TYPES } from '../shared/constants';

// 拓展 Vue 本身
export function initGlobalApi(Vue) {
  // 存放全局配置，每个组件初始化都会与该 options 进行合并
  // component, filter, directive
  Vue.options = Object.create(null)

  Vue.options._base = Vue // 存放顶端父类
  
  // 初始化 'components','directives','filters'，放到options
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // TODO 添加内置组件 keep-alive

  // Vue.mixin
  initMixin(Vue)
  // Vue.extend
  initExtend(Vue)
  // Vue.component Vue.filter Vue.directive
  initAssetRegisters(Vue)
}
