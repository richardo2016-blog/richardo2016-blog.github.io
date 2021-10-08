function leftDisplacement (list, n = 0) {
  return (n = n % list.length, !n ? list : list.slice(-n).concat(list.slice(0, -n)))
}
