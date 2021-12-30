import { R, B, E, N, M } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import blacken from './blacken.js'
import delete__ from './delete.js'
import insert_ from './insert.js'
import redden from './redden.js'
import shift_ from './shift.js'

export {
  Cmp
}

export type CmpWithRight<K> =
  (b: K) => Cmp.R

export type RbTree<T, K> = {
  cmp: Cmp.t<K>,
  key: (value: T) => K,
  root: N<T>
}

export type t<T, K> = RbTree<T, K>

/** Range query. */
export type Query<K> =
  | undefined
  | ({} | { $l: K } | { $le: K } & ({} | { $r: K } | { $re: K }))

/** @returns Red-black tree based on element-to-key mapping function and comparision over keys function. */
export const of =
  <T, K>(cmp: Cmp.t<K>, key: ((value: T) => K)): RbTree<T, K> => ({
    cmp,
    key,
    root: E
  })

const get_ =
  <T, K>(_: N<T>, key: (value: T) => K, cmp: CmpWithRight<K>): [ undefined | T, number ] => {
    if (_ == null) {
      return [ undefined, -0 ]
    }
    const cmp_ = cmp(key(_.v))
    switch (cmp_) {
      case Cmp.asc:
        return get_(_.l, key, cmp)
      case Cmp.equal:
        return [ _.v, _.n ]
      case Cmp.dsc:
        return get_(_.r, key, cmp)
      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const get =
  <T, K>(tree: RbTree<T, K>, key: K): [ undefined | T, number ] =>
    get_(tree.root, tree.key, b => tree.cmp(key, b))

export const getv =
  <T, K>(tree: RbTree<T, K>, key: K): undefined | T =>
    get(tree, key)[0]

export const getc =
  <T, K>(tree: RbTree<T, K>, key: K): number =>
    get(tree, key)[1]

export const has =
  <T, K>(tree: RbTree<T, K>, key: K): boolean =>
    getc(tree, key) > 0

/**
 * Inserts provided `value`.
 * If element already exists, `merge` is used to produce final element (defaults to identity function).
 */
export const insert =
  <T, K>(tree: RbTree<T, K>, element: NonNullable<T>, n = 1, merge: (a: T, b: T) => T = _ => _): void => {
    tree.root = blacken(insert_(tree.root, tree.key, tree.cmp, element, n, merge))
  }

/**
 * Shifts left-most element (ie. minimum element).
 * @returns `undefined` or shifted element.
 */
// TODO: shiftSame
export const maybeShiftCount =
  <T, K>(tree: RbTree<T, K>): [ undefined | T, number ] => {
    if (tree.root == null) {
      return [ undefined, 0]
    }
    const [ x, i, a ] = shift_(tree.root)
    tree.root = a
    // ??
    if (tree.root) {
      tree.root.c = B
    }
    return [ x, i ]
  }

/**
 * @returns removed left-most element.
 * @throws if tree is empty.
 */
export const shiftCount =
  <T, K>(tree: RbTree<T, K>): [ value: T, count: number ] => {
    const [ x, i ] = maybeShiftCount(tree)
    if (x === undefined) {
      throw new Error('Error while trying to shift an empty rb-tree.')
    }
    return [ x, i ]
  }

export const shift =
  <T, K>(tree: RbTree<T, K>): T =>
    shiftCount(tree)[0]

const eachNode =
  function* <T>(n: N<T>): Generator<M<T>> {
    if (!n) {
      return
    }
    yield *eachNode(n.l)
    yield n
    yield *eachNode(n.r)
  }

// TODO: eachCount
export const each =
  function* <T, K>(tree: RbTree<T, K>): Generator<T> {
    for (const _ of eachNode(tree.root)) {
      yield _.v
    }
  }

export const countLeft_ =
  <T, K>(_: N<T>, key: (value: T) => K, cmp: CmpWithRight<K>, inclusive: boolean): number => {
    if (!_) {
      return 0
    }
    const cmp_ = cmp(key(_.v))
    switch (cmp_) {
      case Cmp.asc:
        return countLeft_(_.l, key, cmp, inclusive)
      case Cmp.equal:
        return (_.l?.s ?? 0) + (inclusive ? _.n : 0)
      case Cmp.dsc:
        return _.s - (_.r?.s ?? 0) + countLeft_(_.r, key, cmp, inclusive)
      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
      }
  }

export const count =
  <T, K>(tree: RbTree<T, K>, query?: Query<K>): number => {
    const n = tree.root?.s ?? 0
    if (query === undefined) {
      return n
    }
    const cl =
      (k: K, e: boolean): number =>
        countLeft_(tree.root, tree.key, b => tree.cmp(k, b), e)

    // How many to remove?
    const a = '$l' in query ? n - cl(query.$l, false) : 0
    const b = '$le' in query ? n - cl(query.$le, true) : 0
    const c = '$r' in query ? cl(query.$r, true) : 0
    const d = '$re' in query ? cl(query.$re, false) : 0
    const x = Math.max(a, b)
    const y = Math.max(c, d)
    return n - x - y
  }

const delete_ =
  <T, K>(tree: RbTree<T, K>, key: K, i = 1): [ undefined | T, number ] => {
    const [ v, n, r ] = delete__(redden(tree.root), tree.key, b => tree.cmp(key, b), i)
    tree.root = r
    return [ v, n ]
  }

export { delete_ as delete }

/** Assert local invariant - red nodes don't have red children. */
export const assertLocal =
  <T, K>(tree: RbTree<T, K>): void => {
    for (const _ of eachNode(tree.root)) {
      if (_.c === R) {
        if ((_.l?.c ?? B) !== B || (_.r?.c ?? B) !== B) {
          throw new Error('Local invariant violated.')
        }
      }
    }
  }

/** Assert global invariant - paths from nil leafs up to the root go through same number of black nodes. */
export const assertGlobal =
  <T, K>(tree: RbTree<T, K>): void => {

    const visit =
      function* <T>(n: N<T>, b: number): Generator<number> {
        if (!n) {
          yield b
          return
        }
        const b_ = b + (n.c === B ? 1 : 0)
        yield *visit(n.l, b_)
        yield *visit(n.r, b_)
      }

    let b_: undefined | number = undefined
    for (const b of visit(tree.root, 0)) {
      if (b_ === undefined) {
        b_ = b
      }
      if (b_ !== b) {
        throw new Error('Global invariant violated.')
      }
    }
  }

export const assertMonotonic =
  <T, K>(tree: RbTree<T, K>): void => {
    let k: undefined | K = undefined
    for (const _ of each(tree)) {
      const k_ = tree.key(_)
      if (k === undefined) {
        k = k_
      }
      if (tree.cmp(k, k_) === Cmp.dsc) {
        throw new Error('Monotonic invariant violated.')
      }
    }
  }

export const assert =
  <T, K>(tree: RbTree<T, K>): void => {
    assertLocal(tree)
    assertGlobal(tree)
    assertMonotonic(tree)
  }
