import { R, B, BB, E, EE, N, M, mk } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import balance from './balance-inlined.js'

export {
  Cmp
}

export type CmpWithRight<T> = (b: T) => Cmp.R

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

const get_ =
  <T>(_: N<T>, cmp: CmpWithRight<T>): undefined | T => {
    if (_ == null) {
      return undefined
    }
    const cmp_ = cmp(_.v)
    switch (cmp_) {
      case Cmp.asc:
        return get_(_.l, cmp)
      case Cmp.equal:
        return _.v
      case Cmp.dsc:
        return get_(_.r, cmp)
      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const get =
  <T>(tree: RbTree<T>, cmp: CmpWithRight<T>): undefined | T =>
    get_(tree.root, cmp)

export const getValue =
  <T>(tree: RbTree<T>, value: T): undefined | T =>
    get_(tree.root, b => tree.cmp(value, b))

export const hasValue =
  <T>(tree: RbTree<T>, value: T): boolean =>
    getValue(tree, value) !== undefined

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
  <T>(_: N<T>, cmp: Cmp.t<T>, x: T, merge: (a: T, b: T) => T): NonNullable<N<T>> => {

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
        return balance(mk(c, insert_(a, cmp, x, merge), y, b))

      // | x == y = T color a y b
      case Cmp.equal: {
        const v = merge(x, y)
        if (cmp(y, v) !== Cmp.equal) {
          throw new Error(`Merge can't produce non equal value, ${y} != ${v}.`)
        }
        return mk(c, a, v, b)
      }

      // | x > y = balance color a y (ins b)
      case Cmp.dsc:
        return balance(mk(c, a, y, insert_(b, cmp, x, merge)))

      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const insert =
  <T>(tree: RbTree<T>, value: NonNullable<T>, merge: (a: T, b: T) => T = _ => _): void => {
    tree.root = blacken(insert_(tree.root, tree.cmp, value, merge))
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

const shift_ =
  <T>(_: N<T>): [ undefined | T, N<T> ] => {
    switch (true) {

      // min_del (T R E x E) = (x,E)
      case _?.c === R && _.l === E && _.r === E: {
        const { v: x } = _!
        return [ x, E ]
      }

      // min_del (T B E x E) = (x,EE)
      case _?.c === B && _.l === E && _.r === E: {
        const { v: x } = _!
        return [ x, EE ]
      }

      // min_del (T B E x (T R E y E)) = (x,T B E y E)
      case _?.c === B && _.l === E && _.r?.c === R && _.r.l === E && _.r.r === E: {
        const { v: x, r: { v: y } } = _ as any
        return [ x, mk(B, E, y, E) ]
      }

      // min_del (T c a x b) = let (x’,a’) = min_del a
      // in (x’,rotate c a’ x b)
      default: {
        const { c, l: a, v: x, r: b } = _!
        const [ x_, a_ ] = shift_(a)
        return [ x_, rotate(mk(c, a_, x, b)) ]
      }
    }
  }

/**
 * Shifts left-most element (ie. minimum element).
 * @returns `undefined` or shifted element.
 */
export const maybeShift =
  <T>(tree: RbTree<T>): undefined | T => {
    if (tree.root == null) {
      return undefined
    }
    const [ x, a ] = shift_(tree.root)
    tree.root = a
    if (tree.root) {
      tree.root.c = B
    }
    return x
  }

/**
 * @returns removed left-most element.
 * @throws if tree is empty.
 */
export const shift =
  <T>(tree: RbTree<T>): T => {
    const _ = maybeShift(tree)
    if (_ === undefined) {
      throw new Error('Error while trying to shift an empty rb-tree.')
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

// redden (T B (T B a x b) y (T B c z d)) = T R (T B a x b) y (T B c z d)
// redden t = t
const redden =
  <T>(_: N<T>): N<T> =>
    _?.c === B && _.l?.c === B && _.r?.c === B ?
      mk(R, _.l, _.v, _.r) :
      _

const delete__ =
  <T>(_: N<T>, cmp: Cmp.t<T>, x: T): N<T> => {
    switch (true) {

      // del E = E
      case _ === E:
        return E

      case _ === EE:
        throw new Error('Unexpected EE.')

      // del (T R E y E) | x == y = E
      //                 | x /= y = T R E y E
      case _?.c === R && _.l === E && _.r === E:
        return cmp(x, _!.v) === Cmp.equal ?
          E :
          _

      // del (T B E y E) | x == y = EE
      //                 | x /= y = T B E y E
      case _?.c === B && _.l === E && _.r === E:
        return cmp(x, _!.v) === Cmp.equal ?
          EE :
          _

      // del (T B (T R E y E) z E)
      // | x < z = T B (del (T R E y E)) z E
      // | x == z = T B E y E
      // | x > z = T B (T R E y E) z E
      case _?.c === B && _.l?.c === R && _.l.l === E && _.l.r === E && _.r === E: {
        const cmp_ = cmp(x, _!.v)
        switch (cmp_) {
          case Cmp.asc:
            return mk(B, delete__(mk(R, E, _!.l!.v, E), cmp, x), _!.v, E)
          case Cmp.equal:
            return mk(B, E, _!.l!.v, E)
          case Cmp.dsc:
            return mk(B, mk(B, E, _!.l!.v, E), _!.v, E)
          default:
            throw new TypeError(`Expected cmp result, got ${cmp_}.`)
        }
      }

      // del (T c a y b)
      // | x < y = rotate c (del a) y b
      // | x == y = let (y’,b’) = min_del b in rotate c a y’ b’
      // | x > y = rotate c a y (del b)
      default: {
        const { c, l: a, v: y, r: b } = _ as any
        const cmp_ = cmp(x, y)
        switch (cmp_) {
          case Cmp.asc:
            return rotate(mk(c, delete__(a, cmp, x), y, b))
          case Cmp.equal: {
            const [ y_, b_ ] = shift_<T>(b)
            return rotate(mk(c, a, y_!, b_))
          }
          case Cmp.dsc:
            return rotate(mk(c, a, y, delete__(b, cmp, x)))
          default:
            throw new TypeError(`Expected cmp result, got ${cmp_}.`)
        }
      }

    }
  }

const delete_ =
  <T>(tree: RbTree<T>, value: T): void =>
    void (tree.root = delete__(redden(tree.root), tree.cmp, value))

export { delete_ as delete }
