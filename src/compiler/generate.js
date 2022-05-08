// [{name: 'id', value: 'app'}]
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配 {{aaa}}

function genProps(attrs) {
  let str = ''

  attrs.forEach(({ name, value }) => {
    // 处理 style:"color: red; background: blue" => { color: 'red',  background: blue }
    if (name === 'style') {
      let styleObj = {}
      value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        styleObj[key?.trim()] = value?.trim()
      })
      value = styleObj
    }

    str += `${name}:${JSON.stringify(value)},`
  })

  return str.slice(0, -1)
}

function genChildren(el) {
  let children = el.children

  if (!children) {
    return false
  }

  return children.map((child) => gen(child)).join(',')
}

function gen(el) {
  if (el.type === 1) {
    return gernerate(el)
  }

  if (el.type === 3) {
    let text = el.text
    // 判断是否有插值
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }

    // hello {{arr}} world =>  'hello' + arr + 'world'
    let tokens = []
    let match
    let lastIndex = (defaultTagRE.lastIndex = 0)

    while ((match = defaultTagRE.exec(text))) {
      let index = match.index

      // hello
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }

      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    console.log(`_v(${tokens.join('+')})`)

    return `_v(${tokens.join('+')})`
  }
}

// 生成 render _c('div', {id: 'app'}, _c('span', {}, 'hello'))
export function gernerate(el) {
  let children = genChildren(el)
  // 遍历 tree，将树拼接成可执行的代码字符串
  let code = `_c(
      ${JSON.stringify(el.tag)},
      ${el.attrs.length ? `{${genProps(el.attrs)}}` : JSON.stringify({})}
      ${children ? `,${children}` : ''}
  )`

  return code
}
