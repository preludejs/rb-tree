// /**
//  * Inlined version, small improvement, 1mln random integer inserts:
//  *
//  * 1.83s
//  * rss 248.05 MB
//  * heapTotal 219.61 MB
//  * heapUsed 117.88 MB
//  * external 0.25 MB
//  * arrayBuffers 0.01 MB
//  *
//  * vs original:
//  *
//  * 1.85s
//  * rss 248.34 MB
//  * heapTotal 219.36 MB
//  * heapUsed 126.33 MB
//  * external 0.25 MB
//  * arrayBuffers 0.01 MB
//  *
//  */

// import { R, B, BB, M } from './prelude.js'

// const balance =
//   <T>(_: M<T>): M<T> => {
//     switch (true) {
//       case _.c === B && _.l?.c === R && _.l.l?.c === R:
//         return { c: R, l: { c: B, l: _.l!.l!.l, v: _.l!.l!.v, r: _.l!.l!.r }, v: _.l!.v, r: { c: B, l: _.l!.r, v: _.v, r: _.r } }
//       case _.c === B && _.l?.c === R && _.l.r?.c === R:
//         return { c: R, l: { c: B, l: _.l!.l, v: _.l!.v, r: _.l!.r!.l }, v: _.l!.r!.v, r: { c: B, l: _.l!.r!.r, v: _.v, r: _.r } }
//       case _.c === B && _.r?.c === R && _.r.l?.c === R:
//         return { c: R, l: { c: B, l: _.l, v: _.v, r: _.r!.l!.l }, v: _.r!.l!.v, r: { c: B, l: _.r!.l!.r, v: _.r!.v, r: _.r!.r } }
//       case _.c === B && _.r?.c === R && _.r.r?.c === R:
//         return { c: R, l: { c: B, l: _.l, v: _.v, r: _.r!.l }, v: _.r!.v, r: { c: B, l: _.r!.r!.l, v: _.r!.r!.v, r: _.r!.r!.r } }
//       case _.c === BB && _.r?.c === R && _.r.l?.c === R:
//         return { c: B, l: { c: B, l: _.l, v: _.v, r: _.r!.l!.l }, v: _.r!.l!.v, r: { c: B, l: _.r!.l!.r, v: _.r!.v, r: _.r!.r } }
//       case _.c === BB && _.l?.c === R && _.l.r?.c === R:
//         return { c: B, l: { c: B, l: _.l!.l, v: _.l!.v, r: _.l!.r!.l }, v: _.l!.r!.v, r: { c: B, l: _.l!.r!.r, v: _.v, r: _.r } }
//       default:
//         return _
//     }
//   }

// export default balance
