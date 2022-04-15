import * as Cmp from '@prelude/cmp'

/** Red. */
export const R = 1

/** Black. */
export const B = 2

/** Black-black. */
export const BB = 3

/** Color. */
export type P = typeof R | typeof B | typeof BB

/** Nil node. */
export const E = undefined

/** Black-black nil node. */
export const EE = null

/** Node. */
export type N<T> = typeof E | typeof EE | [
  c: P,
  l: N<T>,
  v: T,
  r: N<T>
]

export const iC = 0
export const iL = 1
export const iV = 2
export const iR = 3

const mks = Array.from(Array(1_000_000), () => [0,0,0,0])
let mki = 0

function mk(a, b, c, d) {
  if (mki < 1_000_000) {
    const _ = mks[mki++]
    _[0] = a
    _[1] = b
    _[2] = c
    _[3] = d
    return _
  }
  return [a, b, c, d]
}

function balance(_: any) {
  let _c = _[0]
  let _l = _[1]
  switch (true) {

    // (balance B (T R (T R a x b) y c) z d) = T R (T B a x b) y (T B c z d)
    case _c === 2 && _l?.[0] === 1 && _l?.[1]?.[0] === 1:
      return mk(1, mk(2, _l[1][1], _l[1][2], _l[1][3]), _l[2], mk(2, _l[3], _[2], _[3]))

    // (balance B (T R a x (T R b y c)) z d) = T R (T B a x b) y (T B c z d)
    case _c === 2 && _l?.[0] === 1 && _l?.[3]?.[0] === 1:
      return mk(1, mk(2, _l[1], _l[2], _l[3][1]), _l[3][2], mk(2, _l[3][3], _[2], _[3]))

    // (balance B a x (T R (T R b y c) z d)) = T R (T B a x b) y (T B c z d)
    case _c === 2 && _?.[3]?.[0] === 1 && _?.[3]?.[1]?.[0] === 1:
      return mk(1, mk(2, _l, _[2], _[3][1][1]), _[3][1][2], mk(2, _[3][1][3], _[3][2], _[3][3]))

    // (balance B a x (T R b y (T R c z d))) = T R (T B a x b) y (T B c z d)
    case _c === 2 && _?.[3]?.[0] === 1 && _?.[3]?.[3]?.[0] === 1:
      return mk(1, mk(2, _l, _[2], _[3][1]), _[3][2], mk(2, _[3][3][1], _[3][3][2], _[3][3][3]))

    // (balance BB a x (T R (T R b y c) z d)) = T B (T B a x b) y (T B c z d)
    case _c === 3 && _?.[3]?.[0] === 1 && _?.[3]?.[1]?.[0] === 1:
      return mk(2, mk(2, _l, _[2], _[3][1][1]), _[3][1][2], mk(2, _[3][1][3], _[3][2], _[3][3]))

    // (balance BB (T R a x (T R b y c)) z d) = T B (T B a x b) y (T B c z d)
    case _c === 3 && _l?.[0] === 1 && _l?.[3]?.[0] === 1:
      return mk(2, mk(2, _l[1], _l[2], _l[3][1]), _l[3][2], mk(2, _l[3][3], _[2], _[3]))

    // balance color a x b = T color a x b
    default:
      return _
  }
}

export function rotate(_: any) {
  switch (true) {

    // (rotate R (T BB a x b) y (T B c z d)) = balance B (T R (T B a x b) y c) z d
    case _?.[0] === 1 && _?.[1]?.[0] === 3 && _?.[3]?.[0] === 2:
      return balance([2, [1, [2, _[1][1], _[1][2], _[1][3]], _[2], _[3][1]], _[3][2], _[3][3]])

    // (rotate R EE y (T B c z d)) = balance B (T R E y c) z d
    case _?.[0] === 1 && _?.[1] === undefined && _?.[3]?.[0] === 2:
      return balance([2, [1, null, _[2], _[3][1]], _[3][2], _[3][3]])

    // (rotate R (T B a x b) y (T BB c z d)) = balance B a x (T R b y (T B c z d))
    case _?.[0] === 1 && _?.[1]?.[0] === 2 && _?.[3]?.[0] === 3:
      return balance([2, _[1][1], _[1][2], [1, _[1][3], _[2], [2, _[3][1], _[3][2], _[3][3]]]])

    // (rotate R (T B a x b) y EE) = balance B a x (T R b y E)
    case _?.[0] === 1 && _?.[1]?.[0] === 2 && _?.[3] === undefined:
      return balance([2, _[1][1], _[1][2], [1, _[1][3], _[2], null]])

    // (rotate B (T BB a x b) y (T B c z d)) = balance BB (T R (T B a x b) y c) z d
    case _?.[0] === 2 && _?.[1]?.[0] === 3 && _?.[3]?.[0] === 2:
      return balance([3, [1, [2, _[1][1], _[1][2], _[1][3]], _[2], _[3][1]], _[3][2], _[3][3]])

    // (rotate B EE y (T B c z d)) = balance BB (T R E y c) z d
    case _?.[0] === 2 && _?.[1] === undefined && _?.[3]?.[0] === 2:
      return balance([3, [1, null, _[2], _[3][1]], _[3][2], _[3][3]])

    // (rotate B (T B a x b) y (T BB c z d)) = balance BB a x (T R b y (T B c z d))
    case _?.[0] === 2 && _?.[1]?.[0] === 2 && _?.[3]?.[0] === 3:
      return balance([3, _[1][1], _[1][2], [1, _[1][3], _[2], [2, _[3][1], _[3][2], _[3][3]]]])

    // (rotate B (T B a x b) y EE) = balance BB a x (T R b y E)
    case _?.[0] === 2 && _?.[1]?.[0] === 2 && _?.[3] === undefined:
      return balance([3, _[1][1], _[1][2], [1, _[1][3], _[2], null]])

    // (rotate B (T BB a w b) x (T R (T B c y d) z e)) = T B (balance B (T R (T B a w b) x c) y d) z e
    case _?.[0] === 2 && _?.[1]?.[0] === 3 && _?.[3]?.[0] === 1 && _?.[3]?.[1]?.[0] === 2:
      return [2, balance([2, [1, [2, _[1][1], _[1][2], _[1][3]], _[2], _[3][1][1]], _[3][1][2], _[3][1][3]]), _[3][2], _[3][3]]

    // (rotate B EE x (T R (T B c y d) z e)) = T B (balance B (T R E x c) y d) z e
    case _?.[0] === 2 && _?.[1] === undefined && _?.[3]?.[0] === 1 && _?.[3]?.[1]?.[0] === 2:
      return [2, balance([2, [1, null, _[2], _[3][1][1]], _[3][1][2], _[3][1][3]]), _[3][2], _[3][3]]

    // (rotate B (T R a w (T B b x c)) y (T BB d z e)) = T B a w (balance B b x (T R c y (T B d z e)))
    case _?.[0] === 2 && _?.[1]?.[0] === 1 && _?.[1]?.[3]?.[0] === 2 && _?.[3]?.[0] === 3:
      return [2, _[1][1], _[1][2], balance([2, _[1][3][1], _[1][3][2], [1, _[1][3][3], _[2], [2, _[3][1], _[3][2], _[3][3]]]])]

    // (rotate B (T R a w (T B b x c)) y EE) = T B a w (balance B b x (T R c y E))
    case _?.[0] === 2 && _?.[1]?.[0] === 1 && _?.[1]?.[3]?.[0] === 2 && _?.[3] === undefined:
      return [2, _[1][1], _[1][2], balance([2, _[1][3][1], _[1][3][2], [1, _[1][3][3], _[2], null]])]

    // rotate color a x b = T color a x b
    default:
      return _
  }
}

export function blacken(_: any) {
  switch (true) {
    // (blacken (T R (T R a x b) y c)) = T B (T R a x b) y c
    case _?.[0]?.[0] === 1 && _?.[0]?.[1]?.[0] === 1:
      return [2, [1, _[0][1][1], _[0][1][2], _[0][1][3]], _[0][2], _[0][3]]

    // (blacken (T R a x (T R b y c))) = T B a x (T R b y c)
    case _?.[0]?.[0] === 1 && _?.[0]?.[3]?.[0] === 1:
      return [2, _[0][1], _[0][2], [1, _[0][3][1], _[0][3][2], _[0][3][3]]]

    default:
      return _
  }
}

export function redden(_: any) {
  switch (true) {

    // (redden (T B (T B a x b) y (T B c z d))) = T R (T B a x b) y (T B c z d)
    case _?.[0]?.[0] === 2 && _?.[0]?.[1]?.[0] === 2 && _?.[0]?.[3]?.[0] === 2:
      return [1, [2, _[0][1][1], _[0][1][2], _[0][1][3]], _[0][2], [2, _[0][3][1], _[0][3][2], _[0][3][3]]]

    default:
      return _
  }
}

export function insert<T extends number>(_: N<T>, x: T): NonNullable<N<T>> {

  // ins E = T R E x E
  if (_ === E) {
    return [R, E, x, E]
  }

  if (_ === EE) {
    throw new Error('Unexpected EE.')
  }

  // ins (T color a y b)
  const cmp_ = Cmp.numbers(x, _[2])
  switch (cmp_) {

    // | x < y = balance color (ins a) y b
    case Cmp.asc:
      return balance([_[0], insert(_[1], x), _[2], _[3]])

    // | x == y = T color a y b
    case Cmp.equal:
      return _

    // | x > y = balance color a y (ins b)
    case Cmp.dsc:
      return balance([_[0], _[1], _[2], insert(_[3], x) ])

    default:
      throw new TypeError(`Expected cmp result, got ${cmp_}.`)
  }
}
