export default function () {
  const onMove = (e) => {
    const type = e.draggedContext.element.type
    const toClassName = e.to.className.split(' ')
    // console.log(type, toClassName)
    if (
      type == 'layoutGroup' &&
      ['layout-group__body', 'layout-table__body'].includes(toClassName[0])
    ) {
      //禁止 group 拖拽进 group\table
      return false
    }
    if (type == 'layoutTable' && ['layout-table__body'].includes(toClassName[0])) {
      //禁止 table 拖拽进 table
      return false
    }
    if (
      type == 'layoutTabs' &&
      ['layout-tabs__body', 'layout-table__body'].includes(toClassName[0])
    ) {
      //禁止 tabs 拖拽进 tabs/table
      return false
    }
    if (type == 'layoutTabs' && ['tabs-layout-group__body'].includes(toClassName[3])) {
      //禁止 tabs 拖拽进 tabs内的group
      return false
    }
    if (type == 'comboBox' && ['layout-table__body'].includes(toClassName[0])) {
      //禁止 comboBox 拖拽进 table
      return false
    }

    if (
      ['ueditor', 'buttonList', 'title'].includes(type) &&
      ['layout-table__body'].includes(toClassName[0])
    ) {
      //禁止 富文本、按钮组、文本 拖拽进 table
      return false
    }

    // 限制组合框可拖拽控件
    if (['combo-box__body'].includes(toClassName[0])) {
      if (['input', 'select', 'date', 'time'].includes(e.draggedContext.element.controlType)) {
        if (['textarea', 'radio', 'checkbox', 'switch'].includes(type)) return false
      } else {
        if (!['buttonList'].includes(type)) return false
      }
      if (type == 'comboBox') return false
    }

    return true
  }

  const handleDragPosition = (newIndex, columnData) => {
    let isGroup = false
    if (columnData[newIndex]) isGroup = columnData[newIndex].type == 'layoutGroup'
    let repIndex: number | undefined = undefined
    columnData.forEach((item, index) => {
      if (repIndex === undefined && item.type == 'layoutGroup') {
        if (isGroup && index > newIndex) repIndex = index != 0 ? index - 1 : index
        else if (!isGroup && index <= newIndex) repIndex = index
      }
    })
    if (isGroup && repIndex !== newIndex) {
      const column = columnData.splice(newIndex, 1)
      if (repIndex === undefined) repIndex = columnData.length
      if (column[0]) columnData.splice(repIndex, 0, column[0])
    } else if (!isGroup && repIndex !== undefined && repIndex < newIndex) {
      const column = columnData.splice(newIndex, 1)
      if (column[0]) columnData.splice(repIndex, 0, column[0])
    }
  }

  return {
    onMove,
    handleDragPosition
  }
}
