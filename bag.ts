import * as RbTree from './rb-tree'
import Cmp = RbTree.Cmp

export { Cmp }

type E<T> = [ T, number ]

const merge =
  <T>(a: E<T>, b: E<T>): E<T> =>
    [ a[0], a[1] + b[1] ]

export type Bag<T> = {
  tree: RbTree.t<E<T>, T>
}

export type t<T> = Bag<T>

export const of =
  <T>(cmp: Cmp.t<T>):Bag<T> => ({
    tree: RbTree.of(cmp, (_: E<T>) => _[0])
  })

export const add =
  <T>(bag: Bag<T>, key: T, count = 1): void =>
    RbTree.insert(bag.tree, [ key, count ], merge)

export const get =
  <T>(bag: Bag<T>, key: T): number =>
    RbTree.get(bag.tree, key)?.[1] ?? -0

/**
 * Removes `n` elements from multiset.
 * @returns Negative number if element has been deleted, positive if it hasn't been deleted, -0 if didn't exist.
 */
export const remove =
  <T>(bag: Bag<T>, key: T, n = 1): -0 | number => {
    const _ = RbTree.get(bag.tree, key)
    if (_) {
      const r = _[1]
      _[1] -= n
      if (_[1] <= 0) {
        RbTree.delete(bag.tree, key)
        return -r
      } else {
        return n
      }
    } else {
      return -0
    }
  }

const delete_ =
  <T>(bag: Bag<T>, key: T): -0 | number =>
    RbTree.delete(bag.tree, key)?.[1] ?? -0

export { delete_ as delete }
