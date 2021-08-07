import { R, B, BB, E, EE, M, mk } from './prelude.js'
import balance from './balance-inlined.js'

const rotate =
  <T>(_: M<T>): M<T> => {
    switch (true) {

      // rotate R (T BB a x b) y (T B c z d) = balance B (T R (T B a x b) y c) z d
      case _.c === R && _.l?.c === BB && _.r?.c === B: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(B, mk(R, mk(B, a, x, b), y, c), z, d))
      }

      // rotate R EE y (T B c z d) = balance B (T R E y c) z d
      case _.c === R && _.l === EE && _.r?.c === B: {
        const { v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(B, mk(R, E, y, c), z, d))
      }

      // rotate R (T B a x b) y (T BB c z d) = balance B a x (T R b y (T B c z d))
      case _.c === R && _.l?.c === B && _.r?.c === BB: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(B, a, x, mk(R, b, y, mk(B, c, z, d))))
      }

      // rotate R (T B a x b) y EE = balance B a x (T R b y E)
      case _.c === R && _.l?.c === B && _.r === EE: {
        const { l: { l: a, v: x, r: b }, v: y } = _ as any
        return balance(mk(B, a, x, mk(R, b, y, E)))
      }

      // rotate B (T BB a x b) y (T B c z d) = balance BB (T R (T B a x b) y c) z d
      case _.c === B && _.l?.c === BB && _.r?.c === B: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(BB, mk(R, mk(B, a, x, b), y, c), z, d))
      }

      // rotate B EE y (T B c z d) = balance BB (T R E y c) z d
      case _.c === B && _.l === EE && _.r?.c === B: {
        const { v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(BB, mk(R, E, y, c), z, d))
      }

      // rotate B (T B a x b) y (T BB c z d) = balance BB a x (T R b y (T B c z d))
      case _.c === B && _.l?.c === B && _.r?.c === BB: {
        const { l: { l: a, v: x, r: b }, v: y, r: { l: c, v: z, r: d } } = _ as any
        return balance(mk(BB, a, x, mk(R, b, y, mk(B, c, z, d))))
      }

      // rotate B (T B a x b) y EE = balance BB a x (T R b y E)
      case _.c === B && _.l?.c === B && _.r === EE: {
        const { l: { l: a, v: x, r: b }, v: y } = _ as any
        return balance(mk(BB, a, x, mk(R, b, y, E)))
      }

      // rotate B (T BB a w b) x (T R (T B c y d) z e) = T B (balance B (T R (T B a w b) x c) y d) z e
      case _.c === B && _.l?.c === BB && _.r?.c === R && _.r.l?.c === B: {
        const { l: { l: a, v: w, r: b }, v: x, r: { l: { l: c, v: y, r: d }, v: z, r: e } } = _ as any
        return mk(B, balance(mk(B, mk(R, mk(B, a, w, b), x, c), y, d)), z, e)
      }

      // rotate B EE x (T R (T B c y d) z e) = T B (balance B (T R E x c) y d) z e
      case _.c === B && _.l === EE && _.r?.c === R && _.r.l?.c === B: {
        const { v: x, r: { l: { l: c, v: y, r: d }, v: z, r: e } } = _ as any
        return mk(B, balance(mk(B, mk(R, E, x, c), y, d)), z, e)
      }

      // rotate B (T R a w (T B b x c)) y (T BB d z e) = T B a w (balance B b x (T R c y (T B d z e)))
      case _.c === B && _.l?.c === R && _.l.r?.c === B && _.r?.c === BB: {
        const { l: { l: a, v: w, r: { l: b, v: x, r: c } }, v: y, r: { l: d, v: z, r: e } } = _ as any
        return mk(B, a, w, balance(mk(B, b, x, mk(R, c, y, mk(B, d, z, e)))))
      }

      // rotate B (T R a w (T B b x c)) y EE = T B a w (balance B b x (T R c y E))
      case _.c === B && _.l?.c === R && _.l.r?.c === B && _.r === EE: {
        const { l: { l: a, v: w, r: { l: b, v: x, r: c } }, v: y } = _ as any
        return mk(B, a, w, balance(mk(B, b, x, mk(R, c, y, E))))
      }

      // rotate color a x b = T color a x b
      default:
        return _
    }
  }

export default rotate
