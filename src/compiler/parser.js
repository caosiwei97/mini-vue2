const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*` // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <aa:xx></aa:xx> 捕获标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签
const startTagClose = /^\s*(\/?)>/ // 匹配闭合标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
// 匹配属性 a=b a="b" a='b'
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配 {{aaa}}
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

export function parserHTML(html) {
  let root = null // 树的根
  let stack = []
  // 解析 HTML：开始标签、结束标签、文本
  while (html) {
    let textEnd = html.indexOf('<') // 当前解析的开头

    // 可能是开始标签也可能是结束标签
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() // 解析开始标签

      if (startTagMatch) {
        // 处理开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag)

      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1]) // 解析结束标签
        continue
      }
    }

    // 处理文本
    let text

    if (textEnd > 0) {
      text = html.slice(0, textEnd)
    }

    if (text) {
      chars(text)
      advance(text.length)
    }
  }

  // 将解析后的结果组装成一个栈，构建树
  function start(tagName, attributes) {
    let parent = stack[stack.length - 1]
    let ele = createASTElement(tagName, attributes)

    // 设置树根
    if (!root) {
      root = ele
    }

    // 标记当前遍历的父亲
    if (parent) {
      ele.parent = parent
      parent.children.push(ele)
    }

    stack.push(ele)
  }

  function chars(text) {
    let parent = stack[stack.length - 1]
    text = text.replace(/\s+/g, '')

    if (text) {
      parent.children.push({
        type: TEXT_TYPE,
        text,
      })
    }
  }

  function end(tagName) {
    let last = stack.pop()

    if (last.tag !== tagName) {
      throw new Error('标签闭合错误')
    }
  }

  function advance(len) {
    html = html.slice(len)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }

      // 删除标签
      advance(start[0].length)

      let end, attr
      // 没遇到结束标签就一直匹配
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
        advance(attr[0].length)
      }

      if (end) {
        advance(end[0].length)
      }

      return match
    }

    return false
  }

  // 创建 AST
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    }
  }

  return root
}
