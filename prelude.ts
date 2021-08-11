export const R = 1
export const B = 2
export const BB = 3

export type P = typeof R | typeof B | typeof BB

export const E = undefined
export const EE = null
export type N<T> = typeof E | typeof EE | {
  c: 1 | 2 | 3,
  l: N<T>,
  v: T,
  n: number,
  r: N<T>,
  s: number // n + l.s + r.s
}

export type M<T> = NonNullable<N<T>>

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
