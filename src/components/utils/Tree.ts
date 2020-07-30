const arrayToTree = (list: any) => {
  const parseChildren = (list: any, parent: any) => {
    list.forEach((item: any) => {
      if (item.parentId === parent.id) {
        item.depth = parent.depth + 1
        item.children = item.children || []
        parent.children.push(item)
        parseChildren(list, item)
      }
    })
    return parent
  }
  return parseChildren(list, {
    id: -1,
    name: 'root',
    children: [],
    depth: -1,
  })
}
const treeToArray = (tree: any) => {
  const parseChildren = (parent: any, result: any) => {
    if (!parent.children) { return result }
    parent.children.forEach((item: any) => {
      result.push(item)
      parseChildren(item, result)
      delete item.children
    })
    return result
  }
  return parseChildren(tree, [])
}
const treeToJson = (tree: any) => {
  const parse = (item: any, result: any) => {
    const rule = item.rule ? ('|' + item.rule) : ''
    let value = item.value
    if (typeof value === 'string' && (value[0] === '[' || value.indexOf('function(') === 0)) {
      value = tryToCalculateValue(value)
    }
    switch (item.type) {
      case 'String':
        result[item.name + rule] = value
        break
      case 'Int': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') { value = 1 } // 如果未填初始值，则默认为 1
        const parsedInt = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsedInt)) { value = parsedInt }
        result[item.name + rule] = value
        break
      case 'Long': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') { value = 1 } // 如果未填初始值，则默认为 1
        const parsedLong = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsedLong)) { value = parsedLong }
        result[item.name + rule] = value
        break
      case 'Boolean': // √ 处理字符串 'true|false'，以及没有输入值的情况
        if (value === 'true') { value = true }
        if (value === 'false') { value = false }
        if (value === '0') { value = false }
        value = !!value
        result[item.name + rule] = value
        break
      case 'Short': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') { value = 1 } // 如果未填初始值，则默认为 1
        const parsedShort = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsedShort)) { value = parsedShort }
        result[item.name + rule] = value
        break
      case 'Byte': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') { value = 1 } // 如果未填初始值，则默认为 1
        const parsedByte = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsedByte)) { value = parsedByte }
        result[item.name + rule] = value
        break
      case 'Double': // √ BUG Number 如果没有输入初始值，会导致值变成字符串，所以需要对每种类型做特殊的初始值处理
        if (value === '') { value = 1 } // 如果未填初始值，则默认为 1
        const parsedDouble = parseFloat(value) // 尝试解析初始值，如果失败，则填什么是什么（字符串）
        if (!isNaN(parsedDouble)) { value = parsedDouble }
        result[item.name + rule] = value
        break
      case 'Object':
        if (item.value) {
          try {
            // eslint-disable-next-line
            result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
          } catch (e) {
            result[item.name + rule] = item.value
          }
        } else {
          result[item.name + rule] = {}
          item.children.forEach((child: any) => {
            parse(child, result[item.name + rule])
          })
        }
        break
      case 'List':
        if (item.value) {
          try {
            // eslint-disable-next-line
            result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
          } catch (e) {
            result[item.name + rule] = item.value
          }
        } else {
          result[item.name + rule] = item.children.length ? [{}] : []
          item.children.forEach((child: any) => {
            parse(child, result[item.name + rule][0])
          })
        }
        break
      case 'Set':
          if (item.value) {
            try {
              // eslint-disable-next-line
              result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
            } catch (e) {
              result[item.name + rule] = item.value
            }
          } else {
            result[item.name + rule] = item.children.length ? [{}] : []
            item.children.forEach((child: any) => {
              parse(child, result[item.name + rule][0])
            })
          }
          break
      case 'Map':
          if (item.value) {
            try {
              // eslint-disable-next-line
              result[item.name + rule] = eval(`(${item.value})`) // eslint-disable-line no-eval
            } catch (e) {
              result[item.name + rule] = item.value
            }
          } else {
            result[item.name + rule] = {}
            item.children.forEach((child: any) => {
              parse(child, result[item.name + rule])
            })
          }
          break
      default:
        result[item.name + rule] = item.value
    }
  }

  function tryToCalculateValue(val: any) {
    try {
      // eslint-disable-next-line
      const v = eval('({ "val" :' + val + '})')
      return v.val
    } catch (ex) {
      console.error(ex)
      return val
    }
  }
  const result = {}
  tree.children.forEach((child: any) => {
    parse(child, result)
  })
  return result
}

export default {
  arrayToTree,
  treeToArray,
  treeToJson: (tree: any) => {
    try {
      return treeToJson(tree)
    } catch (e) {
      return e.message
    }
  },
  sort: (list: any) => {
    return treeToArray(arrayToTree(list))
  },
}
