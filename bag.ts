import * as RbTree from './rb-tree'
import Cmp = RbTree.Cmp

export { Cmp }

export type Bag<T> = {
  tree: RbTree.t<[T, number]>
}

export type t<T> = Bag<T>

export const of =
  <T>(cmp: Cmp.t<T>):Bag<T> => ({
    tree: RbTree.of((a, b) => cmp(a[0], b[0]))
  })

export const add =
  <T>(bag: Bag<T>, value: T): number =>
    ++RbTree.insert(bag.tree, value)[1]

/** @returns -0 if value was not found, 0 if it was removed or count otherwise. */
export const remove =
  <T>(bag: Bag<T>, value: T): -0 | number => {
    const _ = RbTree.maybeFind(bag.tree, value)
    if (!_) {
      return -0
    }
    const r = --_[1]
    if (r <= 0) {
      RbTree.delete(bag.tree, value)
    }
    return r
  }

const delete_ =
  <T>(bag: Bag<T>, value: T): number => {

  }
