export function from_pos (from_index, max_index) {
  return from_index > max_index ?
    (from_index - 1 - max_index) :
    (from_index < 0 ? 1 : 0) * max_index + from_index
}

export function leftDisplacement (list, n = 0) {
  n = n % list.length
  n = n < 0 ? list.length + n : n

  return list.map((val, index, arr) => {
    return arr[from_pos(index + n, arr.length - 1)]
  })
}
