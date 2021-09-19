/** Red. */
export const R = 1

/** Black. */
export const B = 2

/** Black-black. */
export const BB = 3

/** Color. */
export type P = typeof R | typeof B | typeof BB

/** Nil node. */
export const E = undefined

/** Black-black nil node. */
export const EE = null

/** Node. */
export type N<T> = typeof E | typeof EE | {
  c: P,
  l: N<T>,
  v: T,
  n: number,
  r: N<T>,
  s: number // n + l.s + r.s
}

/** Non nil node. */
export type M<T> = NonNullable<N<T>>

/** Node with explicit type for left and optionally right child. */
export type O<T, L, R = N<T>> = { c: P, l: L, v: T, n: number, r: R, s: number }

/** @returns node. */
export const mk =
  <T>(c: P, l: N<T>, v: T, n: number, r: N<T>): M<T> => {
    const s = n + (l?.s ?? 0) + (r?.s ?? 0)
    if (!Number.isSafeInteger(s)) {
      throw new Error(`s is not safe integer, ${JSON.stringify({
        c, l, v, n, r, s
      }, null, 2)}`)
    }
    return ({
      c, l, v, n, r, s
    })
  }
