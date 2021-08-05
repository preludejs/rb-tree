import * as RbTree from '../rb-tree.js'

test('basic', () => {
  const rb = RbTree.of(RbTree.Cmp.strings)
  RbTree.insert(rb, 'foo')
  RbTree.insert(rb, 'bar')
  RbTree.insert(rb, 'baz')
  expect(RbTree.has(rb, 'foo')).toBe(true)
  expect(RbTree.has(rb, 'bar')).toBe(true)
  expect(RbTree.has(rb, 'baz')).toBe(true)
  expect(RbTree.has(rb, 'bak')).toBe(false)
})

test('random numbers', () => {
  const rb = RbTree.of(RbTree.Cmp.numbers)
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

  const n = 1_000_000
  const rb = RbTree.of(RbTree.Cmp.numbers)
  const xs: number[] = []

  test(`insert ${n}`, () => {
    for (let i = 0; i < n; i++) {
      RbTree.insert(rb, Math.random())
    }
  })

  test('pop all', () => {
    while (true) {
      const _ = RbTree.maybePop(rb)
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
