export function patch(oldVnode, vnode) {
  // 组件
  if (!oldVnode) {
    return createElm(vnode)
  }

  // 初次更新，oldVnode 是元素
  if (oldVnode.nodeType === 1) {
    // 使用 vnode 生成 真实 DOM
    let parentEle = oldVnode.parentNode

    let elm = createElm(vnode) // 根据虚拟节点创建元素

    parentEle.insertBefore(elm, oldVnode.nextSibling)
    parentEle.removeChild(oldVnode)

    return elm
  }

  // 两个 vnode 比较：

  // 1.标签不同，新节点替换老节点
  if (oldVnode.tag !== vnode.tag) {
    return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
  }

  // 3.标签相同的情况：

  let el = (vnode.el = oldVnode.el) // 表示当前新节点复用老节点

  // 3.0 都是文本节点，比较文本内容
  if (vnode.tag == undefined) {
    // 新的文本替代老的文本
    if (oldVnode.text !== vnode.text) {
      el.textContent = vnode.text
    }

    return el
  }

  // 3.1.比较属性
  patchProps(vnode, oldVnode.data)

  // 3.3 比较儿子
  let oldChildren = oldVnode.children || []
  let newChildren = vnode.children || []

  // 双方都有儿子
  if (oldChildren.length && newChildren.length) {
    // 同层比较
    patchChildren(el, oldChildren, newChildren)
  } else if (newChildren.length) {
    // 老的没儿子，新的有儿子
    newChildren.forEach((newChild) => {
      const child = createElm(newChild)
      el.appendChild(child)
    })
  } else if (oldChildren.length) {
    // 老的有儿子，新的没儿子
    el.innerHTML = ''
  }
}

function patchChildren(el, oldChildren, newChildren) {
  // 双指针 比较
  // 旧的开始和结束的索引及其vnode
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[oldStartIndex]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  // 新的开始和结束的索引及其vnode
  let newStartIndex = 0
  let newStartVnode = newChildren[newStartIndex]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  const makeIndexByKey = (children) => {
    return children.reduce((acc, cur, index) => {
      if (cur.key) {
        acc[cur.key] = index
      }
      return acc
    }, {})
  }

  // 生成映射表 key - index
  const keyMap = makeIndexByKey(oldChildren)

  // 双指针从两端到中间迭代, 有一个结束了就结束了
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    }
    // 头头比较：两个开始节点对比
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾比较：两个结束节点比较
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 老头 - 新尾
      patch(oldStartVnode, newEndVnode)

      // 移动真实节点
      el.insertBefore(oldStartVnode.el, oldStartVnode.el.nextSibling)

      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]

      // 移动元素
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 新头 - 老尾
      patch(oldEndVnode, newStartVnode)

      el.insertBefore(oldEndVnode.el, oldStartVnode.el)

      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 乱序比对 - 核心 (只操作新的指针)
      const moveIndex = keyMap[newStartVnode.key] // 从新的往老的找
      if (moveIndex == undefined) {
        // 直接插入老的节点最前面
        el.insertBefore(createElm(newEndVnode), oldStartVnode.el)
      } else {
        // 要移动的老节点
        const moveNode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null // 标识原来位置上节点已经被移动走了
        el.insertBefore(moveNode.el, oldStartVnode.el)
        patch(moveNode, newStartVnode) // 移动后进行比对
      }

      // 移动新节点
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  // 迭代完，用户还增加了
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 判断增加的是加在前面还是后面
      // 取后一个元素作为参照物，使用insertBefore进行元素插入
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null
      el.insertBefore(createElm(newChildren[i]), anchor)
      // 为 null 的情况等价于下面
      // el.appendChild(createElm(newChildren[i]))
    }
  }

  // 迭代完，用户删除了
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      oldChildren[i] && el.removeChild(oldChildren[i].el)
    }
  }
}

// 判断是否为同一个vnode
function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

// 创建真实节点
function patchProps(vnode, oldProps) {
  let newProps = vnode?.data || {}
  let el = vnode.el
  let newStyle = newProps?.style || {}
  let oldStyle = oldProps?.style || {}

  // 新的没有，干掉

  // 新的样式没有，老的有
  if (oldProps) {
    // 样式处理
    Object.keys(oldStyle).forEach((styleName) => {
      if (!newStyle[styleName]) {
        el.style[styleName] = ''
      }
    })

    // 新的属性没有，老的有
    Object.keys(oldProps).forEach((prop) => {
      if (!newProps[prop]) {
        el.removeAttribute(prop)
      }
    })
  }

  Object.entries(newProps).forEach(([key, value]) => {
    if (key === 'style') {
      Object.keys(value).forEach((styleName) => {
        el.style[styleName] = value[styleName]
      })
    } else {
      el.setAttribute(key, value)
    }
  })
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
export function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode

  if (typeof tag === 'string') {
    // 组件
    if (createComponent(vnode)) {
      // 组件创建
      return vnode.componentInstance.$el
    }

    vnode.el = document.createElement(tag)

    // 添加属性
    patchProps(vnode)

    // 创建子节点
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}
