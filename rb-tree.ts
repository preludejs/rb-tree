import { R, B, BB, E, EE, N, M, mk } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import balance from './balance.js'

export {
  Cmp
}

export type RbTree<T> = {
  cmp: Cmp.t<T>,
  root: N<T>
}

export type t<T> = RbTree<T>

export const of =
  <T>(cmp: Cmp.t<T>): RbTree<T> => ({
    cmp,
    root: E
  })

const has_ =
  <T>(n: N<T>, cmp: Cmp.t<T>, v: T): boolean => {
    if (n == null) {
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

const blacken =
  <T>(_: N<T>): N<T> => {
    switch (true) {

      // blacken (T R (T R a x b) y c) = T B (T R a x b) y c
      case _?.c === R && _.l?.c === R: {
        const { l: { l: a, v: x, r: b }, v: y, r: c } = _ as any
        return mk(B, mk(R, a, x, b), y, c)
      }

      // blacken (T R a x (T R b y c)) = T B a x (T R b y c)
      case _?.c === R && _.r?.c === R: {
        const { l: a, v: x, r: { l: b, v: y, r: c} } = _ as any
        return mk(B, a, x, mk(R, b, y, c))
      }

      // blacken t = t
      default:
        return _
    }
  }

const insert_ =
  <T>(_: N<T>, cmp: Cmp.t<T>, x: T): NonNullable<N<T>> => {

    // ins E = T R E x E
    if (_ === E) {
      return mk(R, E, x, E)
    }

    if (_ === EE) {
      throw new Error('Unexpected EE.')
    }

    // ins (T color a y b)
    const { c, l: a, v: y, r: b } = _
    const cmp_ = cmp(x, y)
    switch (cmp_) {

      // | x < y = balance color (ins a) y b
      case Cmp.asc:
        return balance(mk(c, insert_(a, cmp, x), y, b))

      // | x == y = T color a y b
      case Cmp.equal:
        return mk(c, a, y, b)

      // | x > y = balance color a y (ins b)
      case Cmp.dsc:
        return balance(mk(c, a, y, insert_(b, cmp, x)))

      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const insert =
  <T>(tree: RbTree<T>, value: NonNullable<T>): void => {
    tree.root = blacken(insert_(tree.root, tree.cmp, value))
  }

const rotate =
  <T>(_: M<T>): M<T> => {
    switch (true) {

      // rotate R (T BB a x b) y (T B c z d) = balance B (T R (T B a x b) y c) z d
      case _.c === R && _.l?.c === BB && _.r?.c === B: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(B, mk(R, mk(B, a, x, b), y, c), z, d))
      }

      // rotate R EE y (T B c z d) = balance B (T R E y c) z d
      case _.c === R && _.l === EE && _.r?.c === B: {
        const { v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(B, mk(R, E, y, c), z, d))
      }

      // rotate R (T B a x b) y (T BB c z d) = balance B a x (T R b y (T B c z d))
      case _.c === R && _.l?.c === B && _.r?.c === BB: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(B, a, x, mk(R, b, y, mk(B, c, z, d))))
      }

      // rotate R (T B a x b) y EE = balance B a x (T R b y E)
      case _.c === R && _.l?.c === B && _.r === EE: {
        const { l: { l: a, v: x, r: b }, v: y } = _ as any
        return balance(mk(B, a, x, mk(R, b, y, E)))
      }

      // rotate B (T BB a x b) y (T B c z d) = balance BB (T R (T B a x b) y c) z d
      case _.c === B && _.l?.c === BB && _.r?.c === B: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(BB, mk(R, mk(B, a, x, b), y, c), z, d))
      }

      // rotate B EE y (T B c z d) = balance BB (T R E y c) z d
      case _.c === B && _.l === EE && _.r?.c === B: {
        const { v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(BB, mk(R, E, y, c), z, d))
      }

      // rotate B (T B a x b) y (T BB c z d) = balance BB a x (T R b y (T B c z d))
      case _.c === B && _.l?.c === B && _.r?.c === BB: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(BB, a, x, mk(R, b, y, mk(B, c, z, d))))
      }

      // rotate B (T B a x b) y EE = balance BB a x (T R b y E)
      case _.c === B && _.l?.c === B && _.r === EE: {
        const { l: { l: a, v: x, r: b }, v: y } = _ as any
        return balance(mk(BB, a, x, mk(R, b, y, E)))
      }

      // rotate B (T BB a w b) x (T R (T B c y d) z e) = T B (balance B (T R (T B a w b) x c) y d) z e
      case _.c === B && _.l?.c === BB && _.r?.c === R && _.r.l?.c === B: {
        const { l: { l: a, v: w, r: b }, v: x, r: { l: { l: c, v: y, r: d }, v: z, r: e } } = _ as any
        return mk(B, balance(mk(B, mk(R, mk(B, a, w, b), x, c), y, d)), z, e)
      }

      // rotate B EE x (T R (T B c y d) z e) = T B (balance B (T R E x c) y d) z e
      case _.c === B && _.l === EE && _.r?.c === R && _.r.l?.c === B: {
        const { v: x, r: { l: { l: c, v: y, r: d }, v: z, r: e } } = _ as any
        return mk(B, balance(mk(B, mk(R, E, x, c), y, d)), z, e)
      }

      // rotate B (T R a w (T B b x c)) y (T BB d z e) = T B a w (balance B b x (T R c y (T B d z e)))
      case _.c === B && _.l?.c === R && _.l.r?.c === B && _.r?.c === BB: {
        const { l: { l: a, v: w, r: { l: b, v: x, r: c } }, v: y, r: { l: d, v: z, r: e } } = _ as any
        return mk(B, a, w, balance(mk(B, b, x, mk(R, c, y, mk(B, d, z, e)))))
      }

      // rotate B (T R a w (T B b x c)) y EE = T B a w (balance B b x (T R c y E))
      case _.c === B && _.l?.c === R && _.l.r?.c === B && _.r === EE: {
        const { l: { l: a, v: w, r: { l: b, v: x, r: c } }, v: y } = _ as any
        return mk(B, a, w, balance(mk(B, b, x, mk(R, c, y, E))))
      }

      // rotate color a x b = T color a x b
      default:
        return _
    }
  }

const pop_ =
  <T>(_: N<T>): [ undefined | T, N<T> ] => {
    if (_ == null) {
      return [ undefined, E ]
    }
    switch (true) {

      // min_del (T R E x E) = (x,E)
      case _.c === R && _.l === E && _.r === E: {
        const { v: x } = _
        return [ x, E ]
      }

      // min_del (T B E x E) = (x,EE)
      case _.c === B && _.l === E && _.r === E: {
        const { v: x } = _
        return [ x, EE ]
      }

      // min_del (T B E x (T R E y E)) = (x,T B E y E)
      case _.c === B && _.l === E && _.r?.c === R && _.r.l === E && _.r.r === E: {
        const { v: x, r: { v: y } } = _ as any
        return [ x, mk(B, E, y, E) ]
      }

      // min_del (T c a x b) = let (x’,a’) = min_del a
      // in (x’,rotate c a’ x b)
      default: {
        const { c, l: a, v: x, r: b } = _
        const [ x_, a_ ] = pop_(a)
        return [ x_, rotate(mk(c, a_, x, b)) ]
      }
    }
  }

export const maybePop =
  <T>(tree: RbTree<T>): undefined | T => {
    const [ x, a ] = pop_(tree.root)
    tree.root = a
    if (tree.root) {
      tree.root.c = B
    }
    return x
  }

export const pop =
  <T>(tree: RbTree<T>): T => {
    const _ = maybePop(tree)
    if (_ === undefined) {
      throw new Error('Error while trying to pop from empty rb-tree.')
    }
    return _
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

const count_ =
  <T>(_: N<T>): number =>
    _ ? 1 + count_(_.l) + count_(_.r) : 0

export const count =
  <T>(tree: RbTree<T>): number =>
    count_(tree.root)
