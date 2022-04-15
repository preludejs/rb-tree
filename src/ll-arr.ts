// import * as Cmp from '@prelude/cmp'

export type Node<K, V> = [
  key: K,
  value: V,
  red: boolean,
  left: null | Node<K, V>,
  right: null | Node<K, V>
]

const ikey = 0
const ivalue = 1
const ired = 2
const ileft = 3
const iright = 4

export type Tree<K, V> = {
  cmp: (a: K, b: K) => number,
  root: null | Node<K, V>
}

export type t<K, V> = Tree<K, V>

const rotateRight =
  <K, V>(h: Node<K, V>) => {
    if (h === null || !h[ileft] || !h[ileft]![ired]) {
      throw new Error('Fail.')
    }
    const x = h[ileft]!
    h[ileft] = x[iright]
    x[iright] = h
    x[ired] = h[ired]
    h[ired] = true
    return x
  }

const rotateLeft =
  <K, V>(h: Node<K, V>) => {
    if (h === null || !h[iright] || !h[iright]![ired]) {
      throw new Error('Fail.')
    }
    const x = h[iright]!
    h[iright] = x[ileft]
    x[ileft] = h
    x[ired] = h[ired]
    h[ired] = true
    return x
}

const flipColors =
  <K, V>(h: Node<K, V>) => {
    if (!h[ileft] || !h[iright]) {
      throw new Error('Fail.')
    }
    h[ired] = !h[ired]
    h[ileft]![ired] = !h[ileft]![ired]
    h[iright]![ired] = !h[iright]![ired]
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

const put =
  <K, V>(cmp: (a: K, b: K) => number, h: null | Node<K, V>, key: K, value: V): Node<K, V> => {
    if (h === null) {
      const f = new Array(5)
      f[ikey] = key
      f[ivalue] = value
      f[ired] = true
      f[ileft] = null
      f[iright] = null
      return f as Node<K, V>
      // return [key, value, true, null, null]
    }
    const r = cmp(key, h[ikey])
    if (r < 0) {
      h[ileft] = put(cmp, h[ileft], key, value)
    } else if (r > 0) {
      h[iright] = put(cmp, h[iright], key, value)
    } else {
      h[ivalue] = value
    }
    if (h[iright]?.[ired] && !h[ileft]?.[ired]) {
      h = rotateLeft(h)
    }
    if (h[ileft]?.[ired] && h[ileft]?.[ileft]?.[ired]) {
      h = rotateRight(h)
    }
    if (h[ileft]?.[ired] && h[iright]?.[ired]) {
      flipColors(h)
    }
    return h
  }

export const insert =
  <K, V>(tree: Tree<K, V>, key: K, value: V) => {
    tree.root = put(tree.cmp, tree.root, key, value)
    if (!tree.root) {
      throw new Error('Fail.')
    }
    tree.root[ired] = false
  }
