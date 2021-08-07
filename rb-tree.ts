import { B, E, N } from './prelude.js'
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

export const of =
  <T, K>(cmp: Cmp.t<K>, key: ((value: T) => K)): RbTree<T, K> => ({
    cmp,
    key,
    root: E
  })

const get_ =
  <T, K>(_: N<T>, key: (value: T) => K, cmp: CmpWithRight<K>): undefined | T => {
    if (_ == null) {
      return undefined
    }
    const cmp_ = cmp(key(_.v))
    switch (cmp_) {
      case Cmp.asc:
        return get_(_.l, key, cmp)
      case Cmp.equal:
        return _.v
      case Cmp.dsc:
        return get_(_.r, key, cmp)
      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export const get =
  <T, K>(tree: RbTree<T, K>, key: K): undefined | T =>
    get_(tree.root, tree.key, b => tree.cmp(key, b))

export const has =
  <T, K>(tree: RbTree<T, K>, key: K): boolean =>
    get(tree, key) !== undefined

/**
 * Inserts provided `value`.
 * If element already exists, `merge` is used to produce final element (defaults to identity function).
 */
export const insert =
  <T, K>(tree: RbTree<T, K>, element: NonNullable<T>, merge: (a: T, b: T) => T = _ => _): void => {
    tree.root = blacken(insert_(tree.root, tree.key, tree.cmp, element, merge))
  }

/**
 * Shifts left-most element (ie. minimum element).
 * @returns `undefined` or shifted element.
 */
export const maybeShift =
  <T, K>(tree: RbTree<T, K>): undefined | T => {
    if (tree.root == null) {
      return undefined
    }
    const [ x, a ] = shift_(tree.root)
    tree.root = a
    // ??
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
  <T, K>(tree: RbTree<T, K>): T => {
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
  <T, K>(tree: RbTree<T, K>): Generator<T> =>
    each_(tree.root)

const count_ =
  <T>(_: N<T>): number =>
    _ ? 1 + count_(_.l) + count_(_.r) : 0

export const count =
  <T, K>(tree: RbTree<T, K>): number =>
    count_(tree.root)

const delete_ =
  <T, K>(tree: RbTree<T, K>, key: K): void =>
    void (tree.root = delete__(redden(tree.root), tree.key, b => tree.cmp(key, b)))

export { delete_ as delete }
