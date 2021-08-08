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
  r: N<T>,
  n: number
}

export type M<T> = NonNullable<N<T>>

export const mk =
  <T>(c: P, l: N<T>, v: T, r: N<T>): M<T> => ({
    c, l, v, r, n: 1 + (l?.n ?? 0) + (r?.n ?? 0)
  })
