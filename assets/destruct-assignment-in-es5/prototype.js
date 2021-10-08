/*
 *
 * structure arrTreeNode {
 *   id: number;
 *   parentId: number;
 *   type: string; // {'var', 'array', 'undefind', 'restArr'}
 *   varName: string; // just for type === 'var'
 *   children?: Array; // just for type === 'array'
 *   closed?: boolean; // just for type === 'array'
 * }
 */

// constants
const undefinedCombo = ['[,', ',,', ',]']

// stores
const varNameHash = {}
let treeNodeStack = {
  store: [],
  hash: {},
  _rootNode: {
    id: 0
  },
  childNodeOf: {}
}

// utils
function getValidNode (nodePayload) {
  if (!nodePayload.hasOwnProperty('id')) {
    throw `tree node must has 'id'`
  }
  if (!nodePayload.hasOwnProperty('type')) {
    throw `tree node must has 'type'`
  }

  switch (nodePayload.type) {
    case 'array':
      if (!nodePayload.hasOwnProperty('closed')) {
        throw `array type node must has 'closed'`
      }
      if (!nodePayload.hasOwnProperty('children')) {
        throw `array type node must has 'children'`
      }
      break
    case 'var':
      if (!nodePayload.hasOwnProperty('varName')) {
        throw `var type node must has 'varName'`
      }
      break
    case 'undefined':
      break
    // case '.':
    //   break
  }

  return nodePayload
}

function insertAsc (ascList = [], node) {
  const maxNode = ascList[ascList.length - 1] || null
  const minNode = ascList[0] || null
  if (!ascList.length) {
    ascList.push(node)
  } else {
    if (node.id < minNode.id) {
      ascList.unshift(node)
    } else if (node.id > maxNode.id) {
      ascList.push(node)
    } else {
      throw 'impossible!'
    }
  }
}

function treeifyStackStore (nodeStack) {
  // let curNode = null
  let treeRoot = nodeStack.getTreeNodeByUId(1)

  function recursive (node) {
    if (node.parentId >= 0) {
      const parentNode = nodeStack.getTreeNodeByUId(node.parentId)
      if (!parentNode) return
      parentNode.children = parentNode.children || []
      // asc insertion
      insertAsc(parentNode.children, node)
    }
  }

  nodeStack.store.forEach(function (node) {
    recursive(node)
  })

  console.log('treeifyStackStore: \n', jsontify(treeRoot))

  return treeRoot.children
}

function matchAssignInSameLevel (leveledArrList, leveledLexedTree, options) {
  const refs = options.refs || {}
  const depth = options.depth || 0
  const pIndex = options.pIndex || 0

  leveledArrList.forEach(function (item, index) {
    const lexedNode = leveledLexedTree[index]

    // allow missing of lexedNode, that means no assignment for `item` in leveledArrList
    if (!lexedNode) {
      console.log('[missing lexedNode]', jsontify(item), jsontify(leveledLexedTree.type))
      return
      // throw `incorrect lexedNode in ${index} of this level`
    }

    switch (lexedNode.type) {
      case 'var':
        refs[lexedNode.varName] = item
        break
      case 'array':
        if (!(item instanceof Array)) {
          console.log('[not array]', jsontify(item), jsontify(lexedNode))
          throw `expected on array but it's not`
        }
        matchAssignInSameLevel(item, lexedNode.children, {refs})
        break
      case 'undefined':
        // skip
        break
    }
  })
}

// main
treeNodeStack.stackin = function (node) {
  this.store.push(node)
  this.hash[node.id] = node
}

treeNodeStack.findLatestArrType = function () {
  const filteredList = this.store.filter(function (_, index, arr) {
    return _.type === 'array'
  })
  return filteredList[filteredList.length - 1] || null
}
treeNodeStack.findLatestOpenArrType = function () {
  const filteredList = this.store.filter(function (_, index, arr) {
    return _.type === 'array' && !_.closed
  })
  return filteredList[filteredList.length - 1] || null
}
treeNodeStack.stackoutLatestArrType = function () {
  let nodeIndex = null, arrNode = null
  this.store.forEach(function (_, index, arr) {
    const node = treeNodeStack.store[len - 1 - index]
    if (node.type === 'array' ) {
      nodeIndex = len - 1 - index
      arrNode = node
    }
  })

  if (arrNode) {
    this.store = this.store.slice(0, nodeIndex).concat(this.store.slice(nodeIndex + 1))
  }

  return arrNode
}
treeNodeStack.appendToLastedUnclosedArrType = function (childNode) {
  const latestArrTypeNode = this.findLatestOpenArrType()
  if (!latestArrTypeNode) {
    throw 'cant found latestArrTypeNode'
  }

  childNode.depth = latestArrTypeNode.depth + 1
  childNode.parentId = latestArrTypeNode.id
  this.store.push(childNode)
  this.hash[childNode.id] = childNode
}
treeNodeStack.getTreeNodeByUId = function (id) {
  if (!id) return this._rootNode
  return this.hash[id]
}

let nodeIdCounter = 1
function getTreeNodeUId () {
  return nodeIdCounter++
}

function checkVarName (varName) {
  if (varNameHash.hasOwnProperty(varName)) {
    throw `repeat varName '${varName}'`
  } else {
    varNameHash[varName] = true
  }
}

function checkUndefined (lastChar, char) {
  if (~undefinedCombo.indexOf(lastChar + char)) {
    treeNodeStack.appendToLastedUnclosedArrType(getValidNode({
      id: getTreeNodeUId(),
      depth: 0,
      type: 'undefined'
    }))
  }
}

let treeRootNode = null
function formatter_lexer (formmatter = '') {
  let matching_variable_name = false
  formmatter = formmatter.replace(/\s/g, '')

  for (let i in formmatter) {
    const lastChar = formmatter[i - 1] || null
    const char = formmatter[i]

    if (i === (0+'') && char !== '[') {
      throw 'formatter must start with ['
    } else if (i === (formmatter.length - 1) + '' && char !== ']') {
      throw 'formatter must end with ]'
    }

    switch (char) {
      case '[':
        // 检测 formatter 的边界
        const newArrTypeNode = getValidNode({
          id: getTreeNodeUId(),
          depth: 0,
          type: 'array',
          children: [],
          closed: false
        })
        if (!treeRootNode) {
          newArrTypeNode.parentId = 0,
          treeRootNode = newArrTypeNode
        } else {
          const pNode = treeNodeStack.findLatestOpenArrType()
          if (!pNode) {
            throw 'there should be one pNode'
          }

          newArrTypeNode.parentId = pNode.id
        }
        treeNodeStack.stackin(newArrTypeNode)
        console.log('lex-[ ---- \n', treeNodeStack.store)
        break
      case ',':
        checkUndefined(lastChar, char)
      case ' ':
        if (matching_variable_name) {
          checkVarName(matching_variable_name)
          treeNodeStack.appendToLastedUnclosedArrType(getValidNode({
            id: getTreeNodeUId(),
            depth: 0,
            type: 'var',
            varName: matching_variable_name
          }))
          console.log('lex-stop-words\n', matching_variable_name, treeNodeStack.store)
          matching_variable_name = false
        }
        break
      case ']':
        checkUndefined(lastChar, char)
        const arrNode = treeNodeStack.findLatestOpenArrType()

        if (!arrNode) {
          throw 'there should be one arrNode!'
        }

        if (!arrNode.closed) {
          if (matching_variable_name) {
            checkVarName(matching_variable_name)
            treeNodeStack.appendToLastedUnclosedArrType(getValidNode({
              id: getTreeNodeUId(),
              depth: arrNode.depth + 1,
              type: 'var',
              varName: matching_variable_name
            }))
            arrNode.closed = true
            matching_variable_name = false
          }
        } else if (i === formmatter.length - 1) { // throw exception
          throw 'there should be one open arrNode!'
        }

        console.log('lex-]', treeNodeStack.store)
        break
      default:
        // 区分变量首和变量中尾
        if (/[A-Z_\$0-9]/i.test(char)) {
          matching_variable_name = matching_variable_name || ''
          matching_variable_name += char
        }
        console.log('lex-default', matching_variable_name)
        break
    }
  }
}

// test cases

function jsontify (content) {
  return JSON.stringify(content, null, '\t')
}

function testLexer () {
  const testArr = [1, [2, 3], 4]
  /* good testFormatter :start */
  // const testFormatter = '[a, [b], d]'
  // const testFormatter = '[_, [b], c]'
  const testFormatter = '[a]'
  // const testFormatter = '[a, [b], c]'
  // const testFormatter = '[a,]'
  // const testFormatter = '[a,   ]'
  /* good testFormatter :end */

  /* bad testFormatter :start */
  // const testFormatter = '[_, ,[b, [d]], c]'
  // const testFormatter = '[_, ,[b], c]'
  // const testFormatter = '[a, b],'
  // const testFormatter = ',[a, b]'
  // const testFormatter = '[a, a]'
  // const testFormatter = '[a,    a]'
  /* bad testFormatter :end */
  formatter_lexer(testFormatter)
  console.log('result:treeNodeStack\n', jsontify(treeNodeStack.hash))
  const lexedTree = treeifyStackStore(treeNodeStack)

  const refs = {}
  matchAssignInSameLevel(testArr, lexedTree, {refs})

  console.log('result:refs\n', jsontify(refs))
  return refs
}

testLexer()
