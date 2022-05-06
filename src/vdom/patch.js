export function patch(oldVnode, vnode) {
  debugger
  // 组件
  if (!oldVnode) {
    return createElm(vnode)
  }

  if (oldVnode.nodeType === 1) {
    // 使用 vnode 生成 真实 DOM
    let parentEle = oldVnode.parentNode

    let elm = createElm(vnode) // 根据虚拟节点创建元素

    parentEle.insertBefore(elm, oldVnode.nextSibling)
    parentEle.removeChild(oldVnode)

    return elm
  }
}

function createComponent(vnode) {
  let i = vnode.data // { hook: init() {...} }

  // 判断 init 是否存在同时赋值函数给 i ，有就存储函数，没有就是 undefined
  // 等价于 if(i?.hook?.init) => i.hook.init()
  // 骚操作即判断了属性是否存在，也不需要一层层 .
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }

  if (vnode.componentInstance) {
    return true
  }
}

// 根据 vnode 创建真实 DOM
function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode

  if (typeof tag === 'string') {
    // 组件
    if (createComponent(vnode)) {
      // 组件创建
      return vnode.componentInstance.$el
    }

    vnode.el = document.createElement(tag)

    // 创建子节点
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}
