import insert from '../fast.cjs'
let t: any = undefined
const before = Date.now()
// const n = 100
const n = 1_000_000
for (let i = 0; i < n; i++) {
  t = insert(t, Math.random())
}
// console.log(JSON.stringify(t, null, 2))
const duration = Date.now() - before
console.log((duration / 1000).toFixed(7))
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
