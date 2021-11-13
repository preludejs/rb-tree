import * as RbTree from '../cjs/rb-tree.js'
const t = RbTree.of(RbTree.Cmp.numbers, (_: number) => _)
const before = Date.now()
for (let i = 0; i < 1_000; i++) {
  RbTree.insert(t, Math.random())
}
const duration = Date.now() - before
console.log((duration / 1000).toFixed(7))
const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
