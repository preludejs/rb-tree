import { R, B, E, EE, N, M, O, mk } from './prelude.js'
import * as Cmp from '@prelude/cmp'
import rotate from './rotate.js'
import shift from './shift.js'

const delete_ =
  <T, K>(_: N<T>, key: (value: T) => K, cmp1: Cmp.Cmp1<K>, i: number): [ undefined | T, number, N<T> ] => {
    switch (true) {

      // del E = E
      case _ === E:
        return [ undefined, 0, E ]

      case _ === EE:
        throw new Error('Unexpected EE.')

      // del (T R E y E) | x == y = E
      //                 | x /= y = T R E y E
      case _?.c === R && _.l === E && _.r === E: {
        const { v: y, n: j } = _ as M<T>
        return cmp1(key(y)) === Cmp.equal ?
          j <= i ?
            [ y, j - i, E ] :
            [ undefined, j - i, mk(R, E, y, j - i, E) ] :
          [ undefined, 0, _ ]
      }

      // del (T B E y E) | x == y = EE
      //                 | x /= y = T B E y E
      case _?.c === B && _.l === E && _.r === E: {
        const { v: y, n: j } = _ as M<T>
        return cmp1(key(y)) === Cmp.equal ?
          j <= i ?
            [ y, j - i, EE ] :
            [ undefined, j - i, mk(B, E, y, j - i, E) ] :
          [ undefined, 0, _ ]
      }

      // del (T B (T R E y E) z E)
      // | x < z = T B (del (T R E y E)) z E
      // | x == z = T B E y E
      // | x > z = T B (T R E y E) z E
      case _?.c === B && _.l?.c === R && _.l.l === E && _.l.r === E && _.r === E: {
        const { l: { v: y, n: j }, v: z, n: k } = _ as O<T, M<T>>
        const cmp_ = cmp1(key(z))
        switch (cmp_) {
          case Cmp.asc: {
            const [ v, n, r ] = delete_(mk(R, E, y, j, E), key, cmp1, i)
            return [ v, n, mk(B, r, _!.v, _!.n, E) ] // TODO: ?
          }
          case Cmp.equal:
            return i >= k ?
              [ z, k - i, mk(B, E, y, j, E) ] :
              [ z, k - i, mk(B, mk(R, E, y, j, E), z, k - i, E) ]
          case Cmp.dsc:
            return [ undefined, 0, _ ]
          default:
            throw new TypeError(`Expected cmp result, got ${cmp_}.`)
        }
      }

      // del (T c a y b)
      // | x < y = rotate c (del a) y b
      // | x == y = let (y’,b’) = min_del b in rotate c a y’ b’
      // | x > y = rotate c a y (del b)
      default: {
        const { c, l: a, v: y, n: j, r: b } = _ as M<T>
        const cmp_ = cmp1(key(y))
        switch (cmp_) {
          case Cmp.asc: {
            const [ v, n, r ] = delete_(a, key, cmp1, i)
            return [ v, n, rotate(mk(c, r, y, j, b)) ]
          }
          case Cmp.equal: {
            const [ y_, j_, b_ ] = shift<T>(b)
            return [ y, j_, rotate(mk(c, a, y_!, j_, b_)) ]
          }
          case Cmp.dsc: {
            const [ v, n, r ] = delete_(b, key, cmp1, i)
            return [ v, n, rotate(mk(c, a, y, j, r)) ]
          }
          default:
            throw new TypeError(`Expected cmp result, got ${cmp_}.`)
        }
      }

    }
  }

export default delete_
