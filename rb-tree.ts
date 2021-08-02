import * as Cmp from '@prelude/cmp'

export {
  Cmp
}

const R = 1
const B = 2

/** Node */
type N<T> = undefined | { c: typeof R | typeof B, l: N<T>, v: T, r: N<T> }

export type RbTree<T> = {
  cmp: Cmp.t<T>,
  root: N<T>
}

export type t<T> = RbTree<T>

export const of =
  <T>(cmp: Cmp.t<T>): RbTree<T> => ({
    cmp,
    root: undefined
  })

const mk =
  <T>(c: typeof R | typeof B, l: N<T>, v: T, r: N<T>): N<T> => ({
    c, l, v, r
  })

const balance =
  <T>(_: N<T>): N<T> => {
    switch (true) {
      case _?.c === B && _.l?.c === R && _.l?.l?.c === R: {
        const { l: { l: { l: a, v: x, r: b }, v: y, r: c }, v: z, r: d } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }
      case _?.c === B && _.l?.c === R && _.l?.r?.c === R: {
        const { l: { l: a, v: x, r: { l: b, v: y, r: c } }, v: z, r: d } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }
      case _?.c === B && _.r?.c === R && _.r?.l?.c === R: {
        const { l: a, v: x, r: { l: { l: b, v: y, r: c }, v: z, r: d } } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }
      case _?.c === B && _.r?.c === R && _.r?.r?.c === R: {
        const { l: a, v: x, r: { l: b, v: y, r: { l: c, v: z, r: d } } } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }
      default:
        return _
    }
  }

const has_ =
  <T>(n: N<T>, cmp: Cmp.t<T>, v: T): boolean => {
    if (n === undefined) {
      return false
    }
    const cmp_ = cmp(n.v, v)
    switch (cmp_) {
      case Cmp.asc:
        return has_(n.r, cmp, v)
      case Cmp.dsc:
        return has_(n.l, cmp, v)
      case Cmp.equal:
        return true
      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const has =
  <T>(tree: RbTree<T>, value: T): boolean =>
    has_(tree.root, tree.cmp, value)

const insert_ =
  <T>(n: N<T>, cmp: Cmp.t<T>, v: T): N<T> => {
    if (n === undefined) {
      return mk(R, undefined, v, undefined)
    }
    const cmp_ = cmp(n.v, v)
    switch (cmp_) {
      case Cmp.dsc:
        return balance({ ...n, l: insert_(n.l, cmp, v) })
      case Cmp.asc:
        return balance({ ...n, r: insert_(n.r, cmp, v) })
      case Cmp.equal:
        return n
      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const insert =
  <T>(tree: RbTree<T>, value: T): void => {
    tree.root = insert_(tree.root, tree.cmp, value)
    tree.root ? tree.root.c = B : undefined
  }

const each_ =
  function* <T>(n: N<T>): Generator<T> {
    if (!n) {
      return
    }
    yield *each_(n.l)
    yield n.v
    yield *each_(n.r)
  }

export const each =
  <T>(tree: RbTree<T>): Generator<T> =>
    each_(tree.root)
