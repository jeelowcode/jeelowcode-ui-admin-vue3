
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

export const dictTextFormatter = [
  { label: '字典Code-字典Text', value: '{dicCode}-{dicText}' },
  { label: '字典Text-字典Code', value: '{dicText}-{dicCode}' },
  { label: '字典Text(字典Code)', value: '{dicText}({dicCode})' },
  { label: '字典Text[字典Code]', value: '{dicText}[{dicCode}]' },
  { label: '其他格式请自行输入', value: 'custom-tip-1', disabled: true },
  { label: '例如：code：{dicCode}，text：{dicText}', value: 'custom-tip-2', disabled: true },
  { label: '效果：code：1001，text：小明', value: 'custom-tip-3', disabled: true }
]