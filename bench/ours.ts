import * as RbTree from '../rb-tree.js'
const t = RbTree.of(RbTree.Cmp.numbers)
const before = Date.now()
for (let i = 0; i < 1_000_000; i++) {
  RbTree.insert(t, Math.random())
}
const duration = Date.now() - before
console.log((duration / 1000).toFixed(2))
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
