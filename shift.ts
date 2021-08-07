import { R, B, E, EE, N, mk } from './prelude.js'
import rotate from './rotate.js'

const shift =
  <T>(_: N<T>): [ undefined | T, N<T> ] => {
    switch (true) {

      // min_del (T R E x E) = (x,E)
      case _?.c === R && _.l === E && _.r === E: {
        const { v: x } = _!
        return [ x, E ]
      }

      // min_del (T B E x E) = (x,EE)
      case _?.c === B && _.l === E && _.r === E: {
        const { v: x } = _!
        return [ x, EE ]
      }

      // min_del (T B E x (T R E y E)) = (x,T B E y E)
      case _?.c === B && _.l === E && _.r?.c === R && _.r.l === E && _.r.r === E: {
        const { v: x, r: { v: y } } = _ as any
        return [ x, mk(B, E, y, E) ]
      }

      // min_del (T c a x b) = let (x’,a’) = min_del a
      // in (x’,rotate c a’ x b)
      default: {
        const { c, l: a, v: x, r: b } = _!
        const [ x_, a_ ] = shift(a)
        return [ x_, rotate(mk(c, a_, x, b)) ]
      }
    }
  }

export default shift
