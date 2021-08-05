import { R, B, BB, M, mk } from './prelude.js'

const balance =
  <T>(_: M<T>): M<T> => {
    switch (true) {

      // balance B (T R (T R a x b) y c) z d = T R (T B a x b) y (T B c z d)
      case _?.c === B && _.l?.c === R && _.l.l?.c === R: {
        const { l: { l: { l: a, v: x, r: b }, v: y, r: c }, v: z, r: d } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }

      // balance B (T R a x (T R b y c)) z d = T R (T B a x b) y (T B c z d)
      case _.c === B && _.l?.c === R && _.l.r?.c === R: {
        const { l: { l: a, v: x, r: { l: b, v: y, r: c } }, v: z, r: d } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }

      // balance B a x (T R (T R b y c) z d) = T R (T B a x b) y (T B c z d)
      case _.c === B && _.r?.c === R && _.r.l?.c === R: {
        const { l: a, v: x, r: { l: { l: b, v: y, r: c }, v: z, r: d } } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }

      // balance B a x (T R b y (T R c z d)) = T R (T B a x b) y (T B c z d)
      case _.c === B && _.r?.c === R && _.r.r?.c === R: {
        const { l: a, v: x, r: { l: b, v: y, r: { l: c, v: z, r: d } } } = _ as any
        return mk(R, mk(B, a, x, b), y, mk(B, c, z, d))
      }

      // balance BB a x (T R (T R b y c) z d) = T B (T B a x b) y (T B c z d)
      case _.c === BB && _.r?.c === R && _.r.l?.c === R: {
        const { l: a, v: x, r: { l: { l: b, v: y, r: c }, v: z, r: d } } = _ as any
        return mk(B, mk(B, a, x, b), y, mk(B, c, z, d))
      }

      // balance BB (T R a x (T R b y c)) z d = T B (T B a x b) y (T B c z d)
      case _.c === BB && _.l?.c === R && _.l.r?.c === R: {
        const { l: { l: a, v: x, r: { l: b, v: y, r: c } }, v: z, r: d } = _ as any
        return mk(B, mk(B, a, x, b), y, mk(B, c, z, d))
      }

      // balance color a x b = T color a x b
      default:
        return _
    }
  }

export default balance
