import { R, E, EE, N, mk } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import balance from './balance.js'

const insert =
  <T, K>(_: N<T>, key: (value: T) => K, cmp: Cmp.t<K>, x: T, merge: (a: T, b: T) => T): NonNullable<N<T>> => {

    // ins E = T R E x E
    if (_ === E) {
      return mk(R, E, x, E)
    }

    if (_ === EE) {
      throw new Error('Unexpected EE.')
    }

    // ins (T color a y b)
    const { c, l: a, v: y, r: b } = _
    const cmp_ = cmp(key(x), key(y))
    switch (cmp_) {

      // | x < y = balance color (ins a) y b
      case Cmp.asc:
        return balance(mk(c, insert(a, key, cmp, x, merge), y, b))

      // | x == y = T color a y b
      case Cmp.equal: {
        const v = merge(x, y)
        if (cmp(key(y), key(v)) !== Cmp.equal) {
          throw new Error(`Merge can't produce non equal value, ${y} != ${v}.`)
        }
        return mk(c, a, v, b)
      }

      // | x > y = balance color a y (ins b)
      case Cmp.dsc:
        return balance(mk(c, a, y, insert(b, key, cmp, x, merge)))

      default:
        throw new TypeError(`Expected cmp result, got ${cmp_}.`)
    }
  }

export default insert
