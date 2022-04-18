// 将模板转化为 render 函数

import { gernerate } from './generate'
import { parserHTML } from './parser'

// html 字符串解析成对应的 ast
export function compilerToFunction(template) {
  // debugger
  let root = parserHTML(template)
  let code = gernerate(root)
  // 生成 render 函数
  return new Function(`with(this){return ${code}}`)
}
