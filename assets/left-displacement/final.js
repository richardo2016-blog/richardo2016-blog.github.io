function rightDisplacement (list, n = 0) {
  return list.map((val, index, arr) => {
    return arr[(index - n < 0 ? arr.length : index - n > arr.length - 1 ? -arr.length : 0) + (index - n)]
  })
}
