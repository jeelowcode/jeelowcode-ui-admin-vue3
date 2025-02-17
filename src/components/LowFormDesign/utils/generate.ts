import { getWebConfig } from '@/api/design/table'
import controlConfig from '../components/DesignControl/controlConfig';
import { convertFormViewOption } from './convert';
import { handleStrObj } from '@/utils/lowDesign';
import { useDictStoreWithOut } from '@/store/modules/dict'
import { cloneDeep } from 'lodash-es';

const excKey = ['id', 'tenant_id', 'create_user', 'create_time', 'create_dept', 'update_user', 'update_time', 'pid', 'is_deleted']
const defaultDataConfig = {
  datetime: { format: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss" },
  date: { format: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD" },
  month: { format: "YYYY-MM", valueFormat: "YYYY-MM-DD" },
  year: { format: "YYYY", valueFormat: "YYYY-MM-DD" },
  week: { format: "YYYY 第 ww 周", valueFormat: "YYYY-MM-DD" },
  time: { format: "HH:mm:ss", valueFormat: "HH:mm:ss" },
}
const controlObj: any = {}
controlConfig.forEach(typeList => {
  typeList.control.forEach(control => {
    controlObj[control.type] = control
  })
})

const dictStore = useDictStoreWithOut()

const getColumn = (fieldList, span, subType?) => {
  const column: any = {}
  fieldList.forEach(field => {
    if (excKey.includes(field.fieldCode) || (subType && field.foreignkeyEntity?.mainTable)) return
    //控件类型处理
    let controlType = field.webEntity.controlType
    let controlsConfig: any = {}
    try {
      if (field.webEntity.controlsConfig) {
        const { custom_str, option_str } = handleStrObj(field.webEntity.controlsConfig) as any
        if (custom_str) controlsConfig = { ...controlsConfig, ...handleStrObj(custom_str) }
        if (option_str) controlsConfig = { ...controlsConfig, ...handleStrObj(option_str) }
      }
    } catch (error) { }
    if (!controlObj[controlType]) controlType = 'input'
    if (['Integer', 'BigDecimal'].includes(field.fieldType)) controlType = 'number'
    if (controlsConfig.type && !['date', 'time'].includes(controlType)) controlType = controlsConfig.type

    column[field.fieldCode] = {
      ...cloneDeep(controlObj[controlType]),
      label: field.fieldName,
      span: ['file', 'image', 'textarea', 'ueditor', 'markDown'].includes(controlType) ? 24 : span
    }
    //基本属性
    if (field.fieldDefaultVal !== '' && field.fieldDefaultVal !== null) column[field.fieldCode].value = field.fieldDefaultVal
    if (field.isRequired == 'Y') column[field.fieldCode].required = true
    if (field.isShowForm == 'N') column[field.fieldCode].display = false
    if (controlsConfig.multiple) column[field.fieldCode].multiple = controlsConfig.multiple
    //时间处理
    if (['date', 'time'].includes(controlType)) {
      if (controlsConfig.type) column[field.fieldCode].type = controlsConfig.type
      else if (field.fieldType == 'DateTime') column[field.fieldCode].type = 'datetime'
      const type = column[field.fieldCode].type.replace('range', '')
      if (defaultDataConfig[type]) column[field.fieldCode] = { ...column[field.fieldCode], ...defaultDataConfig[type] }
    }
    //字典处理
    if (column[field.fieldCode].controlType == 'select') {
      const dicOption: any = {}
      const { dictCode, dictTable, dictType, dictText, dictTableColumn, dictTextFormatter } = field.dictEntity
      if (dictType == 'dict' && dictCode) {
        dicOption.dicType = 'code'
        dicOption.dicCode = dictCode
        dicOption.codeDicData = []
        if (dictStore.dictMap[dictCode]) dicOption.codeDicData = dictStore.dictMap[dictCode]
      }
      if (dictType == 'table' && dictTable && dictCode && dictText) {
        dicOption.dicType = 'table'
        dicOption.dictTable = dictTable
        dicOption.dictCode = dictCode
        dicOption.dictText = dictText
        if (dictTableColumn) dicOption.dictTableColumn = dictTableColumn
      }
      if (dictTextFormatter) dicOption.dictTextFormatter = dictTextFormatter
      column[field.fieldCode] = { ...column[field.fieldCode], ...dicOption }
    }
    //自定义控件
    if (controlType == 'customControl') {
      column[field.fieldCode].isGlobal = controlsConfig.isGlobal || 'N'
      column[field.fieldCode].controlUrl = controlsConfig.controlUrl
      column[field.fieldCode].controlName = controlsConfig.controlName
    }
    //表格布局字段
    if (subType == 'many') column[field.fieldCode].cell = true
  })
  return column
}

export const generateOption = async (tableId) => {
  const { dbForm, fieldList, subDbFormIdList } = await getWebConfig(tableId)
  const column = getColumn(fieldList, 24 / dbForm.formStyle)
  if (subDbFormIdList?.length) {
    const tabsOption = cloneDeep(controlObj['layoutTabs'])
    const tabsColumn: any = []
    const promiseArr: any = []
    subDbFormIdList.forEach((subTableId, index) => {
      promiseArr.push(new Promise(async resolve => {
        const subConfig = await getWebConfig(subTableId)
        const { tableName, tableDescribe, subTableTitle, subTableMapping } = subConfig.dbForm
        const code = Math.ceil(Math.random() * 9999)
        tabsColumn[index] = {
          type: 'tab',
          id: subTableId,
          label: subTableTitle || tableDescribe,
          prop: subTableMapping == 'one' ? tableName : 'sub_tab_' + code,
          display: true,
          column: []
        }
        const span = 24 / subConfig.dbForm.formStyle
        if (subTableMapping == 'one') tabsColumn[index].column = getColumn(subConfig.fieldList, span, subTableMapping)
        else {
          tabsColumn[index].column = {
            [tableName]: {
              ...cloneDeep(controlObj['layoutTable']),
              column: getColumn(subConfig.fieldList, span, subTableMapping)
            }
          }
        }
        resolve(true)
      }))
    })
    await Promise.all(promiseArr)
    tabsOption.column = {}
    tabsColumn.forEach(column => tabsOption.column[column.prop] = column)
    column['sub_tabs'] = tabsOption
  }
  return convertFormViewOption({ column }, 'formDesign')
}