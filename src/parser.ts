import * as $ from '@prelude/parser'
import { inspect } from 'util'

/** Red. */
export const R = '1'

/** Black. */
export const B = '2'

/** Black-black. */
export const BB = '3'

export const E = 'null'

export const iC = '0'
export const iL = '1'
export const iV = '2'
export const iN = '3'
export const iR = '4'
export const iS = '5'

const red =
  $.map($.literal('R'), () => ({ type: 'Literal', value: R } as const))

const black =
  $.map($.literal('B'), () => ({ type: 'Literal', value: B } as const))

const blackBlack =
  $.map($.literal('BB'), () => ({ type: 'Literal', value: BB } as const))

const empty =
  $.map($.literal('E'), () => ({ type: 'Literal', value: E } as const))

const color =
  $.union(
    red,
    blackBlack,
    black
  )

const variable =
  $.map($.charRange('az'), value => ({ type: 'Variable' as const, value }))

type Color =
  | { type: 'Literal', value: typeof R | typeof B | typeof BB }

type Variable =
  { type: 'Variable', value: string }

type Empty =
  | { type: 'Literal', value: typeof E }

type TreeConstructor =
  | { type: 'Tree', color: Color, lhs: Tree, value: Variable, rhs: Tree }

type TreeFunction =
  | { type: 'Tree', function: string, color: Color, lhs: Tree, value: Variable, rhs: Tree }

type Tree =
  | Empty
  | TreeConstructor
  | Variable
  | TreeFunction

const treeConstructor: $.Parser<TreeConstructor> =
  input =>
    $.map($.sequence(
      $.literal('T'),
      $.ws1,
      color,
      $.ws1,
      tree,
      $.ws1,
      variable,
      $.ws1,
      tree
    ), _ => ({ type: 'Tree' as const, color: _[2], lhs: _[4], value: _[6], rhs: _[8] }))(input)

const treeCapture: $.Parser<TreeConstructor> =
  input =>
    $.map($.sequence(
      color,
      $.ws1,
      tree,
      $.ws1,
      variable,
      $.ws1,
      tree
    ), _ => ({ type: 'Tree' as const, color: _[0], lhs: _[2], value: _[4], rhs: _[6] }))(input)

const treeFunction: $.Parser<TreeFunction> =
  input =>
  $.map($.sequence(
    function_,
    $.ws1,
    color,
    $.ws1,
    tree,
    $.ws1,
    variable,
    $.ws1,
    tree
  ), _ => ({ type: 'Tree' as const, function: _[0], color: _[2], lhs: _[4], value: _[6], rhs: _[8] }))(input)

const treeParens: $.Parser<Tree> =
  input =>
    $.sorrounded($.literal('('), $.literal(')'), tree)(input)

const tree: $.Parser<Tree> =
  input =>
    $.union(
      treeFunction,
      empty,
      treeConstructor,
      treeCapture,
      treeParens,
      variable
    )(input)

const function_ =
  $.union(
    $.literal('balance'),
    $.literal('rotate')
  )

const pattern =
  $.map($.sequence(
    function_,
    $.ws1,
    tree
  ), _ => ({ type: 'Pattern', function: _[0], tree: _[2] }))

type Match =
  | { type: 'Match', lhs: Tree, rhs: Tree }

const match: $.Parser<Match> =
  $.map($.sequence(
    pattern,
    $.ws1,
    $.literal('='),
    $.ws1,
    tree
  ), _ => ({ type: 'Match', lhs: _[0].tree, rhs: _[4] }))

type Node =
  | Tree
  | Match
  | Color

const parse =
  $.exhaustive(match)

// const ast =
//   parse(
//     'balance B (T R (T R a x b) y c) z d = T R (T B a x b) y (T B c z d)'
//   )

const accessorAux =
  (node: Node, variable: string, path: string[] = []) => {
    switch (node.type) {
      case 'Match':
        return accessorAux(node.lhs, variable, path)
      case 'Variable':
        if (node.value === variable) {
          return path
        }
        return undefined
      case 'Tree':
        return (
          accessorAux(node.lhs, variable, [ ...path, iL ]) ||
          accessorAux(node.value, variable, [ ...path, iV ]) ||
          accessorAux(node.rhs, variable, [ ...path, iR ])
        )
      default:
        throw new Error(`Don't know ${node}`)
    }
  }

const accessor =
  (node: Node, variable: string) => {
    const r = accessorAux(node, variable, [])
    if (!r) {
      throw new Error(`Variable ${variable} not found`)
    }
    return `_` + r.map(_ => `[${_}]`).join('')
  }

const production =
  (node: Node, root: Node) => {
    switch (node.type) {

      case 'Match':
        return production(node.rhs, root)
      case 'Literal':
        return node.value
      case 'Variable':
        return accessor(root, node.value)
      case 'Tree': {
        const c = production(node.color, root)
        const lhs = production(node.lhs, root)
        const value = production(node.value, root)
        const rhs = production(node.rhs, root)
        return `[${c}, ${lhs}, ${value}, ${rhs}]`
      }

      default:
        throw new Error(`Don't know how to produce ${node}`)

    }
  }

const renderPath =
  (path: string[]) =>
    path.map(_ => `[${_}]`).join('')

const renderAnd =
  (...list: string[]) =>
    '_' + list.filter(Boolean).join(' && ')

const renderCase =
  (node: Node, path: string[]) => {
    switch (node.type) {
      case 'Match':
        return renderCase(node.lhs, path)
      case 'Literal':
        return `${renderPath(path)} === ${node.value}`
      case 'Variable':
        return undefined
      case 'Tree':
        return renderAnd(
          renderCase(node.color, [ ...path, iC ]),
          renderCase(node.lhs, [ ...path, iL ]),
          renderCase(node.value, [ ...path, iV ]),
          renderCase(node.rhs, [ ...path, iR ])
        )
      default:
        throw new Error(`Don't know ${inspect(node)}`)
    }
  }

const renderMatch =
  (node: Node) => {
    switch (node.type) {
      case 'Match':
        return [
          `case ${renderCase(node.lhs, [])}:`,
          `  return ${production(node.rhs, node)}`
        ].join('\n')
      default:
        throw new Error(`Only match, got ${inspect(node)}`)
    }
  }

// console.log(accessor(ast, 'y'))

// console.log(JSON.stringify(ast, null, 2))
// console.log(parse('B a z d'))
// console.log(parse('T R E y E'))

// console.log(production(ast, ast))
// console.log(renderCase(ast, []))
// console.log(renderMatch(ast))

console.log($.exhaustive(treeFunction)('balance B (T R (T B a x b) y c) z d'))

{
  console.log('BALANCE:')
  const lines = [
    'balance B (T R (T R a x b) y c) z d = T R (T B a x b) y (T B c z d)',
    'balance B (T R a x (T R b y c)) z d = T R (T B a x b) y (T B c z d)',
    'balance B a x (T R (T R b y c) z d) = T R (T B a x b) y (T B c z d)',
    'balance B a x (T R b y (T R c z d)) = T R (T B a x b) y (T B c z d)',
    'balance BB a x (T R (T R b y c) z d) = T B (T B a x b) y (T B c z d)',
    'balance BB (T R a x (T R b y c)) z d = T B (T B a x b) y (T B c z d)'
  ]
  for (const line of lines) {
    const ast = parse(line)
    console.log('// ' + line)
    console.log(renderMatch(ast))
    console.log()
  }
  console.log('// balance color a x b = T color a x b')
  console.log('default:')
  console.log('  return _')
}

{
  console.log('ROTATE:')
  const lines = [
    'rotate R (T BB a x b) y (T B c z d) = balance B (T R (T B a x b) y c) z d',
    'rotate R EE y (T B c z d) = balance B (T R E y c) z d',
    'rotate R (T B a x b) y (T BB c z d) = balance B a x (T R b y (T B c z d))',
    'rotate R (T B a x b) y EE = balance B a x (T R b y E)',
    'rotate B (T BB a x b) y (T B c z d) = balance BB (T R (T B a x b) y c) z d',
    'rotate B EE y (T B c z d) = balance BB (T R E y c) z d',
    'rotate B (T B a x b) y (T BB c z d) = balance BB a x (T R b y (T B c z d))',
    'rotate B (T B a x b) y EE = balance BB a x (T R b y E)',
    'rotate B (T BB a w b) x (T R (T B c y d) z e) = T B (balance B (T R (T B a w b) x c) y d) z e',
    'rotate B EE x (T R (T B c y d) z e) = T B (balance B (T R E x c) y d) z e',
    'rotate B (T R a w (T B b x c)) y (T BB d z e) = T B a w (balance B b x (T R c y (T B d z e)))',
    'rotate B (T R a w (T B b x c)) y EE = T B a w (balance B b x (T R c y E))'
  ]
  for (const line of lines) {
    console.log('line', line)
    const ast = parse(line)
    console.log('// ' + line)
    console.log(renderMatch(ast))
    console.log()
  }
  console.log('// rotate color a x b = T color a x b')
  console.log('default:')
  console.log('  return _')
}

// const ee =
//   $.literal('EE')
