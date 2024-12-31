
export const calcCount = (column) => {
  const propCount = {}
  let count = 0
  const spanDefault = 12
  const spanAll = 24
  column.forEach((item, index) => {
    count = count + (item.span || spanDefault) + (item.offset || 0)
    if (count === spanAll) {
      count = 0
    } else if (count > spanAll) {
      count = 0 + (item.span || spanDefault) + (item.offset || 0)
    } else if (count < spanAll && column[index + 1] && column[index + 1].span > spanAll - count) {
      count = 0
    } else if (item.row && count !== spanAll) {
      propCount[item.prop] = spanAll - count
      count = 0
    }
  })
  return propCount
}