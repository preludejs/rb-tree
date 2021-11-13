import * as Bag from '../cjs/bag.js'

test('simple', () => {
  const bag = Bag.of(Bag.Cmp.strings)
  Bag.add(bag, 'foo')
  Bag.add(bag, 'bar')
  Bag.add(bag, 'bar')
  Bag.add(bag, 'bar')
  expect(Bag.get(bag, 'foo')).toBe(1)
  expect(Bag.get(bag, 'bar')).toBe(3)
  expect(Bag.get(bag, 'baz')).toBe(-0)
  Bag.add(bag, 'bar', 2)
  expect(Bag.get(bag, 'bar')).toBe(5)
  expect(Bag.remove(bag, 'bar', 2)).toBe(3)
  expect(Bag.get(bag, 'bar')).toBe(3)
  expect(Bag.remove(bag, 'bar', 4)).toBe(-1)
  expect(Bag.get(bag, 'bar')).toBe(-0)
})
