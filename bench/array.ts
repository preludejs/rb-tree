import * as A from '@prelude/array'
import * as Cmp from '@prelude/cmp'

const n = parseInt(process.argv[2], 10)

const xs: number[] = []
const before = process.hrtime.bigint()

for (let i = 0; i < n; i++) {
  const v = Math.random()
  const i = A.bsearch(xs, _ => Cmp.numbers(v, _))
  if (i < 0) {
    xs.splice(-i, 0, v)
  }
}
console.log({ n })
const duration = process.hrtime.bigint() - before
console.log(duration)
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
