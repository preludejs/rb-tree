import * as RbTree from './rb-tree'
import Cmp = RbTree.Cmp

export { Cmp }

export type Bag<T> = {
  tree: RbTree.t<T, T>
}

export type t<T> = Bag<T>

export const of =
  <T>(cmp: Cmp.t<T>):Bag<T> => ({
    tree: RbTree.of(cmp, _ => _)
  })

export const add =
  <T>(bag: Bag<T>, key: NonNullable<T>, n = 1): void =>
    RbTree.insert(bag.tree, key, n)

export const get =
  <T>(bag: Bag<T>, key: T): number =>
    RbTree.get(bag.tree, key)?.[1] ?? -0

/**
 * Removes `n` elements from multiset.
 * @returns Negative number if element has been deleted, positive if it hasn't been deleted, -0 if didn't exist.
 */
export const remove =
  <T>(bag: Bag<T>, key: T, n = 1): -0 | number =>
    RbTree.delete(bag.tree, key, n)[1]

// const delete_ =
//   <T>(bag: Bag<T>, key: T): -0 | number =>
//     RbTree.delete(bag.tree, key)?.[1] ?? -0

// export { delete_ as delete }
