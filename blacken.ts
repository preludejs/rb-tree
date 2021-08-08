import { R, B, N, mk } from './prelude.js'

const blacken =
  <T>(_: N<T>): N<T> => {
    switch (true) {

      // blacken (T R (T R a x b) y c) = T B (T R a x b) y c
      case _?.c === R && _.l?.c === R: {
        const { l: { l: a, v: x, r: b }, v: y, r: c } = _ as any
        return mk(B, mk(R, a, x, b), y, c)
      }

      // blacken (T R a x (T R b y c)) = T B a x (T R b y c)
      case _?.c === R && _.r?.c === R: {
        const { l: a, v: x, r: { l: b, v: y, r: c} } = _ as any
        return mk(B, a, x, mk(R, b, y, c))
      }

      // blacken t = t
      default:
        return _
    }
  }

export default blacken
