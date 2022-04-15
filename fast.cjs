function d(a) {
  var b, c, f, g, h, k, l, m, n, p, q, r, t, u, v, w, x, y;
  switch(!0) {
    case 2 === (null == a ? void 0 : a[0]) && 1 === (null == a ? void 0 : null == (b = a[1]) ? void 0 : b[0]) && 1 === (null == a ? void 0 : null == (c = a[1]) ? void 0 : null == (f = c[1]) ? void 0 : f[0]):
      return [1, [2, a[1][1][1], a[1][1][2], a[1][1][3]], a[1][2], [2, a[1][3], a[2], a[3]]];
    case 2 === (null == a ? void 0 : a[0]) && 1 === (null == a ? void 0 : null == (g = a[1]) ? void 0 : g[0]) && 1 === (null == a ? void 0 : null == (h = a[1]) ? void 0 : null == (k = h[3]) ? void 0 : k[0]):
      return [1, [2, a[1][1], a[1][2], a[1][3][1]], a[1][3][2], [2, a[1][3][3], a[2], a[3]]];
    case 2 === (null == a ? void 0 : a[0]) && 1 === (null == a ? void 0 : null == (l = a[3]) ? void 0 : l[0]) && 1 === (null == a ? void 0 : null == (m = a[3]) ? void 0 : null == (n = m[1]) ? void 0 : n[0]):
      return [1, [2, a[1], a[2], a[3][1][1]], a[3][1][2], [2, a[3][1][3], a[3][2], a[3][3]]];
    case 2 === (null == a ? void 0 : a[0]) && 1 === (null == a ? void 0 : null == (p = a[3]) ? void 0 : p[0]) && 1 === (null == a ? void 0 : null == (q = a[3]) ? void 0 : null == (r = q[3]) ? void 0 : r[0]):
      return [1, [2, a[1], a[2], a[3][1]], a[3][2], [2, a[3][3][1], a[3][3][2], a[3][3][3]]];
    case 3 === (null == a ? void 0 : a[0]) && 1 === (null == a ? void 0 : null == (t = a[3]) ? void 0 : t[0]) && 1 === (null == a ? void 0 : null == (u = a[3]) ? void 0 : null == (v = u[1]) ? void 0 : v[0]):
      return [2, [2, a[1], a[2], a[3][1][1]], a[3][1][2], [2, a[3][1][3], a[3][2], a[3][3]]];
    case 3 === (null == a ? void 0 : a[0]) && 1 === (null == a ? void 0 : null == (w = a[1]) ? void 0 : w[0]) && 1 === (null == a ? void 0 : null == (x = a[1]) ? void 0 : null == (y = x[3]) ? void 0 : y[0]):
      return [2, [2, a[1][1], a[1][2], a[1][3][1]], a[1][3][2], [2, a[1][3][3], a[2], a[3]]];
    default:
      return a;
  }
}
function e(a, b) {
  if (void 0 === a) {
    return [1, void 0, b, void 0];
  }
  if (null === a) {
    throw Error("Unexpected EE.");
  }
  var c = b - a[2];
  if (c > 0) {
    return d([a[0], e(a[1], b), a[2], a[3]]);
  }
  if (c < 0) {
    return d([a[0], a[1], a[2], e(a[3], b)]);
  }
  return a
}
module.exports = e;
