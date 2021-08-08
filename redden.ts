import { R, B, N, mk } from './prelude.js'

// redden (T B (T B a x b) y (T B c z d)) = T R (T B a x b) y (T B c z d)
// redden t = t
const redden =
  <T>(_: N<T>): N<T> =>
    _?.c === B && _.l?.c === B && _.r?.c === B ?
      mk(R, _.l, _.v, _.r) :
      _

export default redden
