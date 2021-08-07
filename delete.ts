import { R, B, E, EE, N, mk } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import rotate from './rotate.js'
import shift from './shift.js'

const delete_ =
  <T, K>(_: N<T>, key: (value: T) => K, cmp1: Cmp.Cmp1<K>): [ undefined | T, N<T> ] => {
    switch (true) {

      // del E = E
      case _ === E:
        return [ undefined, E ]

      case _ === EE:
        throw new Error('Unexpected EE.')

      // del (T R E y E) | x == y = E
      //                 | x /= y = T R E y E
      case _?.c === R && _.l === E && _.r === E:
        return cmp1(key(_!.v)) === Cmp.equal ?
          [ _!.v, E ] :
          [ undefined, _ ]

      // del (T B E y E) | x == y = EE
      //                 | x /= y = T B E y E
      case _?.c === B && _.l === E && _.r === E:
        return cmp1(key(_!.v)) === Cmp.equal ?
          [ _!.v, EE ] :
          [ undefined, _ ]

      // del (T B (T R E y E) z E)
      // | x < z = T B (del (T R E y E)) z E
      // | x == z = T B E y E
      // | x > z = T B (T R E y E) z E
      case _?.c === B && _.l?.c === R && _.l.l === E && _.l.r === E && _.r === E: {
        const cmp_ = cmp1(key(_!.v))
        switch (cmp_) {
          case Cmp.asc: {
            const [ v, r ] = delete_(mk(R, E, _!.l!.v, E), key, cmp1)
            return [ v, mk(B, r, _!.v, E) ]
          }
          case Cmp.equal:
            return [ _!.v, mk(B, E, _!.l!.v, E) ]
          case Cmp.dsc:
            // _ ??
            return [ undefined, mk(B, mk(B, E, _!.l!.v, E), _!.v, E) ]
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
          case Cmp.asc: {
            const [ v, r ] = delete_(a, key, cmp1)
            return [ v, rotate(mk(c, r, y, b)) ]
          }
          case Cmp.equal: {
            const [ y_, b_ ] = shift<T>(b)
            return [ y, rotate(mk(c, a, y_!, b_)) ]
          }
          case Cmp.dsc: {
            const [ v, r ] = delete_(b, key, cmp1)
            return [ v, rotate(mk(c, a, y, r)) ]
          }
          default:
            throw new TypeError(`Expected cmp result, got ${cmp_}.`)
        }
      }

    }
  }

export default delete_
