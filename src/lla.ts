// import * as Cmp from '@prelude/cmp'
// import bsearch from './bsearch.js'

const bsearch =
  <T>(values: T[], cmp: (value: T) => number): number => {
    let low = 0
    let high = values.length - 1
    while (low <= high) {
      const mid = (low + high) >>> 1
      const r = cmp(values[mid])
      if (r > 0) {
        low = mid + 1
      } else if (r < 0) {
        high = mid - 1
      } else {
        return mid
      }
    }
    return -(low + 1)
  }

const N = 1024

export type Node<V> = {
  values: V[],
  left: null | Node<V>
  right: null | Node<V>,
  red: boolean
}

export type Tree<K, V> = {
  keyOfValue: (value: V) => K,
  cmp: (a: K, b: K) => number,
  root: null | Node<V>
}

export type t<K, V> = Tree<K, V>

const rotateRight =
  <V>(h: Node<V>) => {
    if (h === null || !h.left || !h.left.red) {
      throw new Error('Fail.')
    }
    const x = h.left
    h.left = x.right
    x.right = h
    x.red = h.red
    h.red = true
    return x
  }

const rotateLeft =
  <V>(h: Node<V>) => {
    if (h === null || !h.right || !h.right.red) {
      throw new Error('Fail.')
    }
    const x = h.right
    h.right = x.left
    x.left = h
    x.red = h.red
    h.red = true
    return x
  }

const flipColors =
  <V>(h: Node<V>) => {
    if (!h.left || !h.right) {
      throw new Error('Fail.')
    }
    h.red = !h.red
    h.left.red = !h.left.red
    h.right.red = !h.right.red
  }

// const moveRedLeft =
//   <K, V>(h: Node<K, V>) => {
//     if (!h.right) {
//       throw new Error('Fail.')
//     }
//     flipColors(h)
//     if (h.right.left?.red) {
//       h.right = rotateRight(h.right)
//       h = rotateLeft(h)
//       flipColors(h)
//     }
//     return h
//   }

// const moveRedRight =
//   <K, V>(h: Node<K, V>) => {
//     flipColors(h)
//     if (h.left?.left?.red) {
//       h = rotateRight(h)
//       flipColors(h)
//     }
//     return h
//   }

// const balance =
//   <K, V>(h: Node<K, V>) => {
//     if (h.right?.red && !h.left?.red) {
//       h = rotateLeft(h)
//     }
//     if (h.left?.red && h.left?.left?.red) {
//       h = rotateRight(h)
//     }
//     if (h.left?.red && h.right?.red) {
//       flipColors(h)
//     }
//     return h
//   }

let Z = 0

const put =
  <K, V>(keyOfValue: (value: V) => K, cmp: (a: K, b: K) => number, h: null | Node<V>, key: K, value: V): Node<V> => {
    if (h === null) {
      return { values: [ value ], red: true, left: null, right: null }
    }
    const r = cmp(key, keyOfValue(h.values[0]))
    if (r < 0) {
      h.left = put(keyOfValue, cmp, h.left, key, value)
    } else if (r > 0) {
      const e = cmp(key, keyOfValue(h.values[h.values.length - 1]))
      if (!h.right) {

        if (e > 0) {

          // Quick push at the end of array.
          h.values.push(value)

        } else {
          const i = bsearch(h.values, _ => cmp(key, keyOfValue(_)))
          if (i >= 0) {
            h.values[i] = value
          } else {
            h.values.splice(-i - 1, 0, value)
          }
        }

        // If maximum array length has been reached...
        if (h.values.length === N) {

          // ...
          const m = N >> 1
          const values = h.values.splice(m, m)
          h.right = { values, red: true, left: null, right: null }
        }
      } else {
        if (e <= 0) {

          const i = bsearch(h.values, _ => cmp(key, keyOfValue(_)))
          if (i >= 0) {
            h.values[i] = value
          } else {
            h.values.splice(-i - 1, 0, value)
            if (h.values.length === N) {
              h.right.values.unshift(h.values.pop()!)
              if (h.right.values.length > N) {
                console.log('violation', Z++)
                h.right.values.pop()
              }
            }
          }
        } else {
          h.right = put(keyOfValue, cmp, h.right, key, value)
        }
      }
    } else {
      h.values[0] = value
      return h
    }
    if (h.right?.red && !h.left?.red) {
      h = rotateLeft(h)
    }
    if (h.left?.red && h.left?.left?.red) {
      h = rotateRight(h)
    }
    if (h.left?.red && h.right?.red) {
      flipColors(h)
    }
    return h
  }

export const insert =
  <K, V>(tree: Tree<K, V>, key: K, value: V) => {
    tree.root = put(tree.keyOfValue, tree.cmp, tree.root, key, value)
    if (!tree.root) {
      throw new Error('Fail.')
    }
    tree.root.red = false
  }
