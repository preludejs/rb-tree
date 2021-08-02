# Red-black tree module

Based on:
- [Chris Okasaki. Red-black trees in a functional setting. J. Funct. Program., 9(4):471–477, 1999.](https://www.cs.tufts.edu/comp/150FP/archive/chris-okasaki/redblack99.pdf)
- [Kimball Germane and Matthew Might (2014). "Deletion: The curse of the red-black tree." Journal of Functional Programming, 24(4), pp 423-433. July 2014.](https://matt.might.net/papers/germane2014deletion.pdf)

# Usage

```bash
npm i -E @prelude/rb-tree
```

```ts
import * as RbTree from '@prelude/rb-tree'
import * as Cmp from '@preluce/cmp'

const rb = RbTree.of(Cmp.strings)
RbTree.insert(rb, 'foo')
RbTree.insert(rb, 'bar')
console.log(RbTree.has(rb, 'foo')) // true
console.log(RbTree.has(rb, 'baz')) // false
for (const _ of RbTree.each(rb)) {
  console.log(_)
}
// bar
// foo
```

# License

```
MIT License

Copyright 2021 Mirek Rusin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
