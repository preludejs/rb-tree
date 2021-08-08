import * as Map_ from '../map.js'

test('simple', () => {
  const map = Map_.of<string, number>(Map_.Cmp.strings)
  expect(Map_.has(map, 'one')).toBe(false)
  expect(() => Map_.get(map, 'one')).toThrow('Key \'one\' not found.')
  expect(Map_.maybeGet(map, 'one')).toBe(undefined)
  Map_.set(map, 'one', 1)
  expect(Map_.has(map, 'one')).toBe(true)
  expect(Map_.get(map, 'one')).toBe(1)
  expect(Map_.maybeGet(map, 'one')).toBe(1)
  Map_.set(map, 'two', 2)
  Map_.set(map, 'three', 3)
  Map_.set(map, 'four', 4)
  Map_.set(map, 'five', 5)
  Map_.set(map, 'six', 6)
  expect(Array.from(Map_.keys(map))).toEqual([
    'five',
    'four',
    'one',
    'six',
    'three',
    'two'
  ])
  expect(Array.from(Map_.values(map))).toEqual([
    5,
    4,
    1,
    6,
    3,
    2
  ])
  expect(Array.from(Map_.entries(map))).toEqual([
    [ 'five', 5 ],
    [ 'four', 4 ],
    [ 'one', 1 ],
    [ 'six', 6 ],
    [ 'three', 3 ],
    [ 'two', 2 ]
  ])
})
