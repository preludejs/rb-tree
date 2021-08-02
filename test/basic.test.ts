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
