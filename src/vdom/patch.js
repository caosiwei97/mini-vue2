export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType === 1) {
    // 使用 vnode 生成 真实 DOM
    let parentEle = oldVnode.parentNode

    let elm = createElm(vnode) // 根据虚拟节点创建元素

    parentEle.insertBefore(elm, oldVnode.nextSibling)
    parentEle.removeChild(oldVnode)

    return elm
  }
}

function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode

  if (typeof tag === 'string') {
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
