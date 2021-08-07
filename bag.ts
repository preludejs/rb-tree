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
  <T>(bag: Bag<T>, value: T, count = 1): void =>
    RbTree.insert(bag.tree, [ value, count ], merge)

export const get =
  <T>(bag: Bag<T>, value: T): number =>
    RbTree.get(bag.tree, value)?.[1] ?? 0

/** @returns -0 if value was not found, 0 if it was removed or count otherwise. */
// export const remove =
//   <T>(bag: Bag<T>, value: T): -0 | number => {
//     const { tree } = bag
//     const _ = RbTree.delete(bag.tree, [ value, 1 ])
//     const _ = RbTree.maybeFind(bag.tree, value)
//     if (!_) {
//       return -0
//     }
//     const r = --_[1]
//     if (r <= 0) {
//       RbTree.delete(bag.tree, value)
//     }
//     return r
//   }

// const delete_ =
//   <T>(bag: Bag<T>, value: T): number => {
//   }
