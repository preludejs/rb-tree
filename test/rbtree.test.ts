import * as RbTree from '../rb-tree.js'
import * as Arrays from '@prelude/array'

test('basic values', () => {
  const rb = RbTree.of(RbTree.Cmp.strings, (_: string) => _)
  RbTree.insert(rb, 'foo')
  RbTree.insert(rb, 'bar')
  RbTree.insert(rb, 'baz')
  expect(RbTree.has(rb, 'foo')).toBe(true)
  expect(RbTree.has(rb, 'bar')).toBe(true)
  expect(RbTree.has(rb, 'baz')).toBe(true)
  expect(RbTree.has(rb, 'bak')).toBe(false)
  RbTree.delete(rb, 'foo')
  expect(RbTree.has(rb, 'foo')).toBe(false)
  expect(RbTree.has(rb, 'bar')).toBe(true)
  expect(RbTree.has(rb, 'baz')).toBe(true)
})

test('complex elements', () => {
  type E = { key: string, value: unknown }
  const tree = RbTree.of(RbTree.Cmp.strings, (_: E) => _.key)
  RbTree.insert(tree, { key: 'foo', value: 'FOO' })
  expect(RbTree.has(tree, 'foo')).toBe(true)
  expect(RbTree.has(tree, 'bar')).toBe(false)
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

describe('pop', () => {

  const n = 1_000
  const rb = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
  const xs: number[] = []

  test(`insert ${n}`, () => {
    for (let i = 0; i < n; i++) {
      RbTree.insert(rb, Math.random())
      if (rb.root?.n !== i + 1) {
        throw new Error(`${rb.root?.n} != ${i + 1}`)
      }
    }
  })

  test('pop all', () => {
    while (true) {
      const _ = RbTree.maybeShift(rb)
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
    }
  })

  test('deletions', () => {
    expect(RbTree.count(rb)).toBe(n)
    for (let i = 0; i < n; i++) {
      const value = Arrays.deleteSwapRandom(xs)
      expect(RbTree.has(rb, value)).toBe(true)
      RbTree.delete(rb, value)
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
    for (let i = 1; i < n; i++) {
      expect(RbTree.count(rb, { $l: i })).toBe(i - 1)
      expect(RbTree.count(rb, { $le: i })).toBe(i)
      expect(RbTree.count(rb, { $r: i })).toBe(n - i)
      expect(RbTree.count(rb, { $re: i })).toBe(n - (i - 1))
    }
  })

})
