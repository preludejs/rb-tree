import * as RbTree from '../cjs/rb-tree.js'
import * as Arrays from '@prelude/array'

test('basic values', () => {
  const tree = RbTree.of(RbTree.Cmp.strings, (_: string) => _)
  RbTree.insert(tree, 'foo')
  RbTree.insert(tree, 'bar')
  RbTree.insert(tree, 'baz')
  RbTree.assert(tree)
  expect(RbTree.has(tree, 'foo')).toBe(true)
  expect(RbTree.has(tree, 'bar')).toBe(true)
  expect(RbTree.has(tree, 'baz')).toBe(true)
  expect(RbTree.has(tree, 'bak')).toBe(false)
  RbTree.delete(tree, 'foo')
  RbTree.assert(tree)
  expect(RbTree.has(tree, 'foo')).toBe(false)
  expect(RbTree.has(tree, 'bar')).toBe(true)
  expect(RbTree.has(tree, 'baz')).toBe(true)
})

test('complex elements', () => {
  type E = { key: string, value: unknown }
  const tree = RbTree.of(RbTree.Cmp.strings, (_: E) => _.key)
  RbTree.insert(tree, { key: 'foo', value: 'FOO' })
  expect(RbTree.has(tree, 'foo')).toBe(true)
  expect(RbTree.has(tree, 'bar')).toBe(false)
  RbTree.assert(tree)
})

test('random numbers', () => {
  const rb = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
  for (let i = 0; i < 100; i++) {
    RbTree.insert(rb, Math.random())
  }
  let last = 0
  for (const _ of RbTree.each(rb)) {
    expect(_).toBeGreaterThanOrEqual(last)
    last = _
  }
})

test('permutations', () => {
  const n = 9
  for (const values of Arrays.permutations(Arrays.indices(n))) {
    const rb = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
    for (const value of values) {
      RbTree.insert(rb, value)
    }
    RbTree.assert(rb)
    expect(RbTree.count(rb)).toBe(n)
  }
})

describe('pop', () => {

  const n = 1_000
  const rb = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
  const xs: number[] = []

  test(`insert ${n}`, () => {
    for (let i = 0; i < n; i++) {
      RbTree.insert(rb, Math.random())
      RbTree.assert(rb)
      if (rb.root?.s !== i + 1) {
        throw new Error(`${rb.root?.s} != ${i + 1}`)
      }
    }
  })

  test('pop all', () => {
    while (true) {
      const [ _ ] = RbTree.maybeShiftCount(rb)
      RbTree.assert(rb)
      if (_ === undefined) {
        break
      }
      xs.push(_)
    }
    expect(xs.length).toBe(n)
  })

  test('assert non descending', () => {
    for (let i = 1; i < xs.length; i++) {
      if (xs[i] <= xs[i - 1]) {
        throw new Error(`${xs[i]} <= ${xs[i - 1]}`)
      }
    }
  })
})

describe('deletes', () => {
  const n = 1_000
  const rb = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
  const xs: number[] = []

  test(`insert ${n}`, () => {
    for (let i = 0; i < n; i++) {
      const value = Math.random()
      xs.push(value)
      RbTree.insert(rb, value)
      RbTree.assert(rb)
    }
  })

  test('deletions', () => {
    expect(RbTree.count(rb)).toBe(n)
    for (let i = 0; i < n; i++) {
      const value = Arrays.deleteSwapRandom(xs)
      expect(RbTree.has(rb, value)).toBe(true)
      RbTree.delete(rb, value)
      RbTree.assert(rb)
      expect(RbTree.has(rb, value)).toBe(false)
      expect(RbTree.count(rb)).toBe(n - (i + 1))
    }
    expect(RbTree.count(rb)).toBe(0)
  })

})

describe('range count', () => {

  const n = 10_000
  const rb = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
  const xs = Arrays.of(n, _ => _ + 1)

  test('insert', () => {
    for (const x of xs) {
      RbTree.insert(rb, x)
    }
    RbTree.assert(rb)
    expect(Array.from(RbTree.each(rb))).toEqual(Arrays.of(n, _ => _ + 1))
  })

  test('range', () => {
    expect(RbTree.count(rb, { $l: 2.9 })).toBe(2)
    expect(RbTree.count(rb, { $le: 3.1 })).toBe(3)
    expect(RbTree.count(rb, { $l: 3.1 })).toBe(3)
    expect(RbTree.count(rb, { $le: 0 })).toBe(0)
    expect(RbTree.count(rb, { $l: 0 })).toBe(0)
    expect(RbTree.count(rb, { $le: n + 1 })).toBe(n)
    expect(RbTree.count(rb, { $l: n + 1 })).toBe(n)
    expect(RbTree.count(rb, { $r: 0 })).toBe(n)
    expect(RbTree.count(rb, { $r: 1 })).toBe(n - 1)
    expect(RbTree.count(rb, { $re: 1 })).toBe(n)
    expect(RbTree.count(rb, { $r: 1.5 })).toBe(n - 1)
    expect(RbTree.count(rb, { $re: 1.5 })).toBe(n - 1)
    expect(RbTree.count(rb, { $r: 3.5, $l: 7.1 })).toBe(4)
    for (let i = 1; i < n; i++) {
      expect(RbTree.count(rb, { $l: i })).toBe(i - 1)
      expect(RbTree.count(rb, { $le: i })).toBe(i)
      expect(RbTree.count(rb, { $r: i })).toBe(n - i)
      expect(RbTree.count(rb, { $re: i })).toBe(n - (i - 1))
    }
  })

})
