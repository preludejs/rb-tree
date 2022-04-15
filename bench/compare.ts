import { RBTree } from 'bintrees'
import * as Cmp from '@prelude/cmp'
import * as A from '@prelude/array'
// const n = parseInt(process.argv[2], 10)

const compare =
  (n: number) => {
    const tree = new RBTree(Cmp.numbers)
    let before = process.hrtime.bigint()
    for (let i = 0; i < n; i++) {
      tree.insert(Math.random())
    }
    const a = process.hrtime.bigint() - before

    const xs: number[] = []
    before = process.hrtime.bigint()
    for (let i = 0; i < n; i++) {
      const v = Math.random()
      const i = A.bsearch(xs, _ => Cmp.numbers(v, _))
      if (i < 0) {
        xs.splice(-i, 0, v)
      }
    }
    const b = process.hrtime.bigint() - before

    return parseFloat(b.toString()) / parseFloat(a.toString())
  }

for (let i = 0; i < 2048; i += 1) {
  let z = 0
  for (let j = 0; j < 100; j++) {
    z += compare(i)
  }
  z = z / 100
  console.log([i, z].join('\t'))
}
