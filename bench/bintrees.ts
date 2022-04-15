import { RBTree } from 'bintrees'
import * as Cmp from '@prelude/cmp'

const n = parseInt(process.argv[2], 10)

const tree = new RBTree(Cmp.numbers)

const before = process.hrtime.bigint()
for (let i = 0; i < n; i++) {
  tree.insert(Math.random())
}
// let z = 0;
// (tree['each'] as any)(function (_) {
//   z++
//   // console.log(_)
// })
// console.log(z)
// var it=tree.iterator(), item;
// while((item = it.next()) !== null) {
//     // do stuff with item
// }
// for (const e of tree.) {
//   console.log(e)
// }
console.log({ n })
const duration = process.hrtime.bigint() - before
console.log(parseFloat(duration.toString()) / 1_000_000_000)
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
