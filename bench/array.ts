import * as A from '@prelude/array'
import * as Cmp from '@prelude/cmp'

const xs: number[] = []
const before = Date.now()

for (let i = 0; i < 1_000; i++) {
  const v = Math.random()
  const i = A.bsearch(xs, _ => Cmp.numbers(v, _))
  if (i < 0) {
    xs.splice(-i, 0, v)
  }
}
const duration = Date.now() - before
console.log((duration / 1000).toFixed(7))
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
