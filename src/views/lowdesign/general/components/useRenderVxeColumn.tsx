import { VxeUI } from 'vxe-table'
import { tableInfoOption } from '../../tableDesign/designData';
import { MonacoEditor } from '@/components/MonacoEditor/index'
import { useAppStoreWithOut } from '@/store/modules/app'

const appStore = useAppStoreWithOut()

//表单开发校验
const infoTableIsEdit = ({ row, column }, { verifyEdit, noStop }) => {
  let bool = true
  //判断如果是 需要编辑校验并且是系统字段 不可编辑
  if (verifyEdit && tableInfoOption.disabledArr.includes(row.fieldCode) && row.only) bool = false
  //判断是否可以绑定字典
  if (!['select', 'radio', 'checkbox', 'tree', 'cascader', 'dicTableSelect'].includes(row.controlType) && ['dictType', 'dictCode', 'dictTable', 'dictText', 'dictTableColumn'].includes(column.field)) {
    if (!noStop) bool = false
  }
  if (row.controlType != 'dicTableSelect' && column.field == 'dictTableColumn') bool = false
  //判断如果是 系统字典 不可编辑
  if (row.dictType == 'dict' && ['dictTable', 'dictText', 'dictTableColumn'].includes(column.field)) bool = false
  //判断如果没有同步数据库 接口查询、外键 不可编辑
  if (row.isDb == 'N' && ['queryIsDb', 'mainTable', 'mainField'].includes(column.field)) bool = false
  //如果是树表pid的接口查询 不可编辑
  if (row.fieldCode == 'pid' && row.only && column.field == 'queryIsDb') bool = false
  //如果是id 接口查询 不可编辑
  if (row.fieldCode == 'id' && row.only && column.field == 'queryIsDb') bool = false
  //如果配置了外键 接口查询 不可编辑
  if (row.mainField && row.mainField && column.field == 'queryIsDb') bool = false
  //如果虚拟字段 处理方式为空 处理配置不能编辑
  if (!row.virtualType && ['virtual_java_str', 'virtual_sql_str', 'virtual_fun_str'].includes(column.field)) bool = false
  return bool
}

const handleLowClickInput = (row, column) => {
  const prop = column.fieldProp || column.field
  let text = row[prop]
  if (text) {
    if (['summarySql', 'virtual_sql_str', 'virtual_java_str'].includes(prop)) {
      const obj = JSON.parse(text)
      text = obj[obj.valueType]
      if (prop == 'summarySql' && obj.valueType == 'group') {
        text = text.replace('#{jeelowcode_summary_table}', '当前表的数据源')
      }
      if (prop == 'virtual_java_str') {
        if (obj.valueType == 'group') {
          text = text.map(item => `${item.type == 'CALCULATE' ? '计算' : '拼接'}：${item.value} `).join(' ')
        } else if (obj.valueType == 'custom') {
          text = `JAVA类名/Sping Key：${text.javaPath}`
        }
      }
    }
  }

  return text
}

watch(() => appStore.isDark, (val) => {
  if (val) VxeUI.setTheme('dark')
  else VxeUI.setTheme('light')
}, { immediate: true })

export const useRenderVxeColumn = (useType = 'table') => {
  if (VxeUI.renderer.get('LowInput') !== null) return
  const stopIcon = <icon style="position: absolute; right: 4px; top: 2px; color: #f56c6c;" size={14} icon="uiw:stop-o" />
  const lowControl = {
    LowInput: {
      default: (renderOpts, { row, column, fieldProp }, isStop) => {
        const prop = fieldProp || column.field
        if (isStop) return (<div> <span>{row[prop]}</span> {stopIcon}  </div>)
        return <span>{row[prop]}</span>
      },
      edit: (renderOpts, { row, column, fieldProp }) => {
        const { placeholder } = renderOpts
        const prop = fieldProp || column.field
        return <el-input class="my-cell" text="text" v-model={row[prop]} placeholder={placeholder ? placeholder : '请输入 ' + column.title} />
      }
    },
    LowNumber: {
      default: (renderOpts, { row, column }, isStop) => {
        if (isStop) return (<div> <span>{row[column.field]}</span> {stopIcon}  </div>)
        return <span>{row[column.field]}</span>
      },
      edit: (renderOpts, { row, column }) => {
        return <div class="w-100% flex"><el-input-number v-model={row[column.field]} controls={false} placeholder={'请输入 ' + column.title} {...(renderOpts.params || {})} /></div>
      }
    },
    LowCheckbox: {
      default: (renderOpts, { row, column }, isStop) => {
        if (isStop) return (<div> <span>{row[column.field] == 'Y' ? '√' : ''}</span> {stopIcon}  </div>)
        return <span>{row[column.field] == 'Y' ? '√' : ''}</span>
      },
      edit: (renderOpts, { row, column }) => {
        return <el-checkbox v-model={row[column.field]} true-value="Y" false-value="N" />
      }
    },
    LowSelect: {
      default: (renderOpts, { row, column }, isStop = false) => {
        if (column.field == 'dictType' && !row[column.field] && infoTableIsEdit({ row, column }, renderOpts)) {
          return <div class="c-#ccc text-12px">可配置</div>
        }
        const { typeKey } = renderOpts
        let dicObj = {}
        if (typeKey && row[typeKey]) {
          dicObj = renderOpts[`${row[typeKey]}DicObj`] || {}
          if (row[typeKey] == 'table' && column.field != 'dictTable' && row.dictTable) dicObj = dicObj[row.dictTable] || {}
        } else if (column.field == 'mainField') {
          dicObj = renderOpts.dicObj || {}
          if (row.mainTable) dicObj = dicObj[row.mainTable] || {}
        } else if (!typeKey) dicObj = renderOpts['dicObj'] || {}
        let value = row[column.field]
        if (value === '' || value === undefined || value === null) value = []
        if (typeof value == 'string') value = [value]
        if (value.length && Object.keys(dicObj).length) {
          const text: Array<string> = []
          value.forEach(key => text.push(dicObj[key] || key))
          value = text.join(' | ')
        }
        if (isStop) return (<div> <span>{value}</span> {stopIcon}  </div>)
        return <span>{value}</span>
      },
      edit: (renderOpts, { row, rowIndex, column }) => {
        const { multiple, filterable, typeKey } = renderOpts
        let dicData = [] as any
        if (typeKey && row[typeKey]) {
          dicData = renderOpts[`${row[typeKey]}DicData`]
          if (row[typeKey] == 'table' && column.field != 'dictTable') {
            if (row.dictTable) dicData = dicData[row.dictTable]
            else dicData = [{ label: '请先选择 字典Table', value: '-1', disabled: true }]
          }
        } else if (column.field == 'mainField') {
          dicData = renderOpts.dicData
          if (row.mainTable) dicData = dicData[row.mainTable]
          else dicData = [{ label: '请先选择 外键-主表名', value: '-1', disabled: true }]
        } else if (!typeKey) dicData = renderOpts['dicData']

        //树表
        if (column.field == 'dictTable' && ['tree', 'cascader'].includes(row.controlType) && row.dictType) {
          dicData = renderOpts['treeDicData']
        }

        //设置禁用选择
        if (column.field == 'dictType') {
          dicData = dicData.map(item => {
            if (['tree', 'cascader', 'dicTableSelect'].includes(row.controlType) && item.value == 'dict') item.disabled = true
            else item.disabled = false
            return item
          })
        }
        return (
          <avue-select
            popper-class="vxe-table--ignore-clear"
            v-model={row[column.field]}
            placeholder={'请选择 ' + column.title}
            dic={dicData}
            multiple={multiple}
            filterable={filterable}
            onChange={() => renderOpts.events ? renderOpts.events.change(row, column.field, rowIndex) : ''}
          />
        )
      }
    },
    LowSummaryBottomSql: {
      default: (renderOpts, { row, column }, isStop = false) => {
        const { dicObj } = renderOpts
        let value = row.summaryJson.sqlType
        if (value === '' || value === undefined || value === null) return ''
        if (value == 'custom') return <span>自定义SQL：<span style="color:#409EFF">{row.summaryJson.sqlValue}</span></span>
        if (Object.keys(dicObj).length) value = dicObj[value]
        if (isStop) return (<div> <span>{value}</span> {stopIcon}  </div>)
        return <span>{value}</span>
      },
      edit: (renderOpts, { row, column }) => {
        const { dicData } = renderOpts
        const visible = row.summaryJson.sqlType == 'custom'
        return (
          <el-popover popper-class="low-summary-buttom-sql__popover" popper-style={{ width: 'auto', height: 'auto' }} visible={visible} placement='bottom-start' v-slots={{
            reference: () => (
              <avue-select
                popper-class="vxe-table--ignore-clear"
                v-model={row.summaryJson.sqlType}
                placeholder={'请选择 ' + column.title}
                dic={dicData}
              />
            ),
            default: () => (
              <div style={{ width: '400px', height: '200px' }} class="vxe-table--ignore-clear">
                <MonacoEditor v-model={row.summaryJson.sqlValue} language='mysql' editorOption={{ minimap: false }}></MonacoEditor>
              </div>
            ),
          }}>
          </el-popover>
        )
      }
    },
    LowClickInput: {
      default: (renderOpts, { row, column, fieldProp }, isStop) => {
        const text = handleLowClickInput(row, { ...column, fieldProp })
        if (isStop) return (<div> <span>{text}</span> {stopIcon}  </div>)
        return <span>{text}</span>
      },
      edit: (renderOpts, { row, rowIndex, column, fieldProp }) => {
        const prop = fieldProp || column.field
        const text = handleLowClickInput(row, { ...column, fieldProp })
        return <el-input class="my-cell" readonly onClick={() => renderOpts.events.click(row, prop, rowIndex)} text="text" value={text} placeholder={'请输入 ' + column.title} />
      }
    },
    virtualInput: {
      default: (renderOpts, { row, column }, isStop) => {
        if (!row.virtualType) isStop = true
        const option = { row, column, fieldProp: `virtual_${row.virtualType}_str` }
        if (row.virtualType == 'fun') return lowControl.LowInput.default(renderOpts, option, isStop)
        else return lowControl.LowClickInput.default(renderOpts, option, isStop)
      },
      edit: (renderOpts, { row, rowIndex, column }) => {
        const option = { row, column, rowIndex, fieldProp: `virtual_${row.virtualType}_str` }
        if (row.virtualType == 'fun') return lowControl.LowInput.edit(renderOpts, option)
        else return lowControl.LowClickInput.edit(renderOpts, option)
      }
    }
  }
  for (const key in lowControl) {
    const addObj = { renderDefault: lowControl[key].default, renderCell: lowControl[key].default }
    if (lowControl[key].edit) {
      addObj['renderEdit'] = (renderOpts: any, params) => {
        if (useType == 'table') {
          if (!infoTableIsEdit(params, renderOpts)) return lowControl[key].default(renderOpts, params, true)
        }
        return lowControl[key].edit(renderOpts, params)
      }
    }
    VxeUI.renderer.add(key, addObj)
  }
}
