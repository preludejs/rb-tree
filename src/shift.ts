import { R, B, E, EE, N, mk } from './prelude.js'
import rotate from './rotate.js'

const shift =
  <T>(_: N<T>): [ T, number, N<T> ] => {
    switch (true) {

      // min_del (T R E x E) = (x,E)
      case _?.c === R && _.l === E && _.r === E: {
        const { v: x, n: i } = _!
        return [ x, i, E ]
      }

      // min_del (T B E x E) = (x,EE)
      case _?.c === B && _.l === E && _.r === E: {
        const { v: x, n: i } = _!
        return [ x, i, EE ]
      }

      // min_del (T B E x (T R E y E)) = (x,T B E y E)
      case _?.c === B && _.l === E && _.r?.c === R && _.r.l === E && _.r.r === E: {
        const { v: x, n: i, r: { v: y, n: j } } = _ as any
        return [ x, i, mk(B, E, y, j, E) ]
      }

      // min_del (T c a x b) = let (x’,a’) = min_del a
      // in (x’,rotate c a’ x b)
      default: {
        const { c, l: a, v: x, n: i, r: b } = _!
        const [ x_, n_, a_ ] = shift(a)
        return [ x_, n_, rotate(mk(c, a_, x, i, b)) ]
      }
    }
  }

export default shift
