import { R, B, E, EE, N, mk } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import rotate from './rotate.js'
import shift from './shift.js'

const delete_ =
  <T, K>(_: N<T>, key: (value: T) => K, cmp1: Cmp.Cmp1<K>): N<T> => {
    switch (true) {

      // del E = E
      case _ === E:
        return E

      case _ === EE:
        throw new Error('Unexpected EE.')

      // del (T R E y E) | x == y = E
      //                 | x /= y = T R E y E
      case _?.c === R && _.l === E && _.r === E:
        return cmp1(key(_!.v)) === Cmp.equal ?
          E :
          _

      // del (T B E y E) | x == y = EE
      //                 | x /= y = T B E y E
      case _?.c === B && _.l === E && _.r === E:
        return cmp1(key(_!.v)) === Cmp.equal ?
          EE :
          _

      // del (T B (T R E y E) z E)
      // | x < z = T B (del (T R E y E)) z E
      // | x == z = T B E y E
      // | x > z = T B (T R E y E) z E
      case _?.c === B && _.l?.c === R && _.l.l === E && _.l.r === E && _.r === E: {
        const cmp_ = cmp1(key(_!.v))
        switch (cmp_) {
          case Cmp.asc:
            return mk(B, delete_(mk(R, E, _!.l!.v, E), key, cmp1), _!.v, E)
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
        const cmp_ = cmp1(y)
        switch (cmp_) {
          case Cmp.asc:
            return rotate(mk(c, delete_(a, key, cmp1), y, b))
          case Cmp.equal: {
            const [ y_, b_ ] = shift<T>(b)
            return rotate(mk(c, a, y_!, b_))
          }
          case Cmp.dsc:
            return rotate(mk(c, a, y, delete_(b, key, cmp1)))
          default:
            throw new TypeError(`Expected cmp result, got ${cmp_}.`)
        }
      }

    }
  }

export default delete_
