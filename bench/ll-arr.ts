// import * as Cmp from '@prelude/cmp'
import * as Tree from '../mjs/ll-arr.js'
const t: Tree.t<number, boolean> = {
  cmp: (a: number, b: number) => a - b,
  root: null
}
const before = process.hrtime.bigint()
const n = parseInt(process.argv[2], 10)
for (let i = 0; i < n; i++) {
  Tree.insert(t, Math.random(), true)
}
console.log({ n })
const duration = process.hrtime.bigint() - before
console.log(parseFloat(duration.toString()) / 1_000_000_000)
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
