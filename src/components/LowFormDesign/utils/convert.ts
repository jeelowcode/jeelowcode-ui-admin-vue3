import { cloneDeep } from 'lodash-es'

//将设计器数组配置转换为avue对象配置
const ArrayToObject = (columnList) => {
  const column = {}
  const group: any[] = []
  columnList.forEach(child => {
    if (child.column) {
      if (child.column.length) {
        const { columnData, groupData } = ArrayToObject(child.column)
        child.column = columnData
        if (groupData.length) child.group = groupData
      } else child.column = {}
    }
    if (child.dic) delete child.dic
    if (child.type == 'layoutGroup') group.push(child)
    else {
      const prop = child.prop
      delete child.prop
      column[prop] = child
    }
  })
  return { columnData: column, groupData: group }
}
//将avue对象配置转换为设计器数组配置
const ObjectToArray = (columnObj, groupList?) => {
  const column: any[] = []
  if (!columnObj) columnObj = {}
  if (!groupList) groupList = []
  for (const key in columnObj) {
    if (columnObj[key].column || columnObj[key].group) {
      columnObj[key].column = ObjectToArray(columnObj[key].column, columnObj[key].group)
      delete columnObj[key].group
    }
    column.push({ ...columnObj[key], prop: key })
  }
  groupList.forEach(group => {
    group.column = ObjectToArray(group.column)
    column.push(group)
  })
  return column
}

//配置转换
export const convertFormViewOption = (option, type = 'save') => {
  const data = cloneDeep(option)
  if (type == 'save') {
    const { columnData, groupData } = ArrayToObject(data.column)
    data.column = columnData
    data.group = groupData
  } else if (type == 'formDesign') {
    data.column = ObjectToArray(data.column, data.group)
    delete data.group
  }
  return data
}