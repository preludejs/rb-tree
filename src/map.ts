import { inspect } from 'util'
import * as RbTree from './rb-tree.js'
import Cmp = RbTree.Cmp

type E<K, V> = [ K, V ]

type Map_<K, V> = {
  tree: RbTree.t<E<K, V>, K>
}

export { Map_ as Map, Map_ as t, Cmp }

export const of =
  <K, V>(cmp: Cmp.t<K>): Map_<K, V> => ({
    tree: RbTree.of(cmp, (_: E<K, V>) => _[0])
  })

export const set =
  <K, V>(map: Map_<K, V>, key: K, value: V): void =>
    RbTree.insert(map.tree, [ key, value ], 0, _ => _)

export const maybeGet =
  <K, V>(map: Map_<K, V>, key: K): undefined | V =>
    RbTree.get(map.tree, key)[0]?.[1]

export const get =
  <K, V>(map: Map_<K, V>, key: K): V => {
    const _ = maybeGet(map, key)
    if (_ === undefined) {
      throw new Error(`Key ${inspect(key)} not found.`)
    }
    return _
  }

export const has =
  <K, V>(map: Map_<K, V>, key: K): boolean =>
    RbTree.has(map.tree, key)

/**
 * Deletes left most element.
 * @returns left most element.
 * @throws if map is empty.
 */
export const shift =
  <K, V>(map: Map_<K, V>): V =>
    RbTree.shift(map.tree)[1]

/**
 * Iterates over keys.
 * Modifications inside iteration are allowed.
 * Iteration will yield keys as they were during initial invocation.
 */
export const keys =
  function* <K, V>(map: Map_<K, V>): Generator<K> {
    for (const _ of RbTree.each(map.tree)) {
      yield _[0]
    }
  }

export const values =
  function* <K, V>(map: Map_<K, V>): Generator<V> {
    for (const _ of RbTree.each(map.tree)) {
      yield _[1]
    }
  }

export const entries =
  function* <K, V>(map: Map_<K, V>): Generator<[K, V]> {
    for (const _ of RbTree.each(map.tree)) {
      yield [ _[0], _[1] ]
    }
  }
