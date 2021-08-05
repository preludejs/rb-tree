import * as Bag from '../bag'

test('simple', () => {
  const bag = Bag.of(Bag.Cmp.strings)
  Bag.add(bag, 'foo')
  Bag.add(bag, 'bar')
  Bag.add(bag, 'bar')
  Bag.add(bag, 'bar')
  expect(Bag.get(bag, 'foo')).toBe(1)
  expect(Bag.get(bag, 'bar')).toBe(3)
  expect(Bag.get(bag, 'baz')).toBe(0)
})
