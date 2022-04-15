// import * as Cmp from '@prelude/cmp'

export type Node<K, V> = {
  key: K,
  value: V,
  left: null | Node<K, V>
  right: null | Node<K, V>,
  red: boolean
}

export type Tree<K, V> = {
  cmp: (a: K, b: K) => number,
  root: null | Node<K, V>
}

export type t<K, V> = Tree<K, V>

const rotateRight =
  <K, V>(h: Node<K, V>) => {
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
  <K, V>(h: Node<K, V>) => {
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
  <K, V>(h: Node<K, V>) => {
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

const put =
  <K, V>(cmp: (a: K, b: K) => number, h: null | Node<K, V>, key: K, value: V): Node<K, V> => {
    if (h === null) {
      return { key, value, red: true, left: null, right: null }
    }
    const r = cmp(key, h.key)
    if (r < 0) {
      h.left = put(cmp, h.left, key, value)
    } else if (r > 0) {
      h.right = put(cmp, h.right, key, value)
    } else {
      h.value = value
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
    tree.root = put(tree.cmp, tree.root, key, value)
    if (!tree.root) {
      throw new Error('Fail.')
    }
    tree.root.red = false
  }
