import * as $ from '@prelude/parser'

const lparen =
  $.literal('(')

const rparen =
  $.literal(')')

const literal =
  $.map($.union(
    $.literal('R'),
    $.literal('BB'),
    $.literal('B'),
    $.literal('EE'),
    $.literal('E'),
  ), value => ({ type: 'Literal' as const, value }))

type Literal =
  $.ResultOfParser<typeof literal>

const variable =
  $.map($.charRange('az'), value => ({ type: 'Variable' as const, value }))

type Variable =
  $.ResultOfParser<typeof variable>

const functionName =
  $.union(
    $.literal('balance'),
    $.literal('rotate'),
    $.literal('blacken'),
    $.literal('redden'),
    $.literal('T')
  )

const function_ =
  input =>
    $.map($.sequence(
      functionName,
      $.ws1,
      $.separated1($.ws1, expression)
    ), _ => ({ type: 'Function' as const, name: _[0], params: _[2] }))(input)

const assignment =
  input =>
    $.map($.sequence(
      expression,
      $.ws1,
      $.literal('='),
      $.ws1,
      expression
    ), _ => ({ type: 'Assignment' as const, lhs: _[0], rhs: _[4] }))(input)

type Expression =
  | Literal
  | Variable
  | { type: 'Function', name: 'balance' | 'rotate' | 'blacken' | 'redden' | 'T', params: Expression[] }
  | { type: 'Assignment', lhs: Expression, rhs: Expression }

const expression: $.Parser<Expression> =
  input =>
    $.union(
      function_,
      literal,
      assignment,
      variable,
      $.sorrounded(lparen, rparen, expression),
    )(input)

type Node = Expression

class Render {
  root: Node
  constructor(root: Node) {
    this.root = root
  }
  Literal(node: Literal, _path: string[]): string {
    switch (node.value) {
      case 'R': return '1'
      case 'B': return '2'
      case 'BB': return '3'
      case 'E': return 'null'
      case 'EE': return 'undefined'
      default:
        throw new Error(node.value)
    }
  }
  render(node: Node = this.root, path: string[] = []) {
    if (!this[node.type]) {
      throw new Error('Not found ' + node.type)
    }
    return this[node.type]?.(node, path)
  }
}

class RenderReturn extends Render {
  Assignment(node: Node & { type: 'Assignment' }, path: string[]) {
    return this.render(node.rhs, path)
  }
  Function(node: Node & { type: 'Function' }, path: string[]) {
    const params = `${node.params.map((param, i) => this.render(param, [ ...path, i.toString() ])).join(', ')}`
    return node.name === 'T' ?
      `mk(${params})` :
      `${node.name}(${params})`
  }
  Variable(variable: Variable, _path: string[]) {
    const aux =
      (node: Node, path: string[]) => {
        switch (node.type) {
          case 'Assignment':
            return aux(node.lhs, path)
          case 'Function':
            for (let i = 0; i < node.params.length; i++) {
              const maybeResult = aux(node.params[i], [ ...path, i.toString() ])
              if (maybeResult) {
                return maybeResult
              }
            }
            break
          case 'Variable':
            if (node.value === variable.value) {
              return path
            }
            break
        }
      }
    const result = aux(this.root, [])
    if (!result) {
      throw new Error(`Variable ${variable.value} not found.`)
    }
    return `_${result.map(_ => `[${_}]`).join('')}`
  }
}

class RenderCase extends Render {
  Assignment(node: Node & { type: 'Assignment' }, path: string[]) {
    return this.render(node.lhs, path)
  }
  Variable(_node: Node & { type: 'Variable' }, _path: string[]) {
    return
  }
  Function(node: Node & { type: 'Function' }, path: string[]) {
    return node.params
      .map((param, i) => this.render(param, [ ...path, i.toString() ]))
      .filter(Boolean)
      .join(' && ')
  }
  Literal(node: Literal, path: string[]): string {
    return '_' + path.map(_ => `?.[${_}]`).join('') + ' === ' + super.Literal(node, path)
  }
}

const lines = [
  '(balance B (T R (T R a x b) y c) z d) = T R (T B a x b) y (T B c z d)',
  '(balance B (T R a x (T R b y c)) z d) = T R (T B a x b) y (T B c z d)',
  '(balance B a x (T R (T R b y c) z d)) = T R (T B a x b) y (T B c z d)',
  '(balance B a x (T R b y (T R c z d))) = T R (T B a x b) y (T B c z d)',
  '(balance BB a x (T R (T R b y c) z d)) = T B (T B a x b) y (T B c z d)',
  '(balance BB (T R a x (T R b y c)) z d) = T B (T B a x b) y (T B c z d)',

  '(rotate R (T BB a x b) y (T B c z d)) = balance B (T R (T B a x b) y c) z d',
  '(rotate R EE y (T B c z d)) = balance B (T R E y c) z d',
  '(rotate R (T B a x b) y (T BB c z d)) = balance B a x (T R b y (T B c z d))',
  '(rotate R (T B a x b) y EE) = balance B a x (T R b y E)',
  '(rotate B (T BB a x b) y (T B c z d)) = balance BB (T R (T B a x b) y c) z d',
  '(rotate B EE y (T B c z d)) = balance BB (T R E y c) z d',
  '(rotate B (T B a x b) y (T BB c z d)) = balance BB a x (T R b y (T B c z d))',
  '(rotate B (T B a x b) y EE) = balance BB a x (T R b y E)',
  '(rotate B (T BB a w b) x (T R (T B c y d) z e)) = T B (balance B (T R (T B a w b) x c) y d) z e',
  '(rotate B EE x (T R (T B c y d) z e)) = T B (balance B (T R E x c) y d) z e',
  '(rotate B (T R a w (T B b x c)) y (T BB d z e)) = T B a w (balance B b x (T R c y (T B d z e)))',
  '(rotate B (T R a w (T B b x c)) y EE) = T B a w (balance B b x (T R c y E))',

  '(blacken (T R (T R a x b) y c)) = T B (T R a x b) y c',
  '(blacken (T R a x (T R b y c))) = T B a x (T R b y c)',

  '(redden (T B (T B a x b) y (T B c z d))) = T R (T B a x b) y (T B c z d)'
]
for (const line of lines) {
  console.log()
  console.log('//', line)
  const ast = $.exhaustive(expression)(line)
  const renderer = new RenderReturn(ast)
  const caseRenderer = new RenderCase(ast)
  console.log(`case ${caseRenderer.render()}:`)
  console.log('  return', renderer.render())
  // console.log(line)
  // console.log(JSON.stringify(ast, null, 2))
}
