
const bsearch =
  <T>(values: T[], cmp: (value: T) => number): number => {
    let low = 0
    let high = values.length - 1
    while (low <= high) {
      const mid = (low + high) >>> 1
      const r = cmp(values[mid])
      if (r > 0) {
        low = mid + 1
      } else if (r < 0) {
        high = mid - 1
      } else {
        return mid
      }
    }
    return -(low + 1)
  }

export default bsearch
