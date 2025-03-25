import { handleStrObj } from '@/utils/lowDesign';
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useLowStoreWithOut } from '@/store/modules/low'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'
import { cloneDeep } from 'lodash-es'
import { formatDate } from '@/utils/formatTime'
import { callApiFun, setDeepObject, isValidJson, stringToArr, ruleLeng } from './util';
import { registerComp } from './registerComponent';
import * as DicApi from '@/api/design/dic'
import * as TableApi from '@/api/design/table'
import { listToTree } from '@/utils/tree';
import { patternObj } from './verifyOption';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { graphic } from 'echarts';
import { TdHTMLAttributes } from 'vue';
export interface JsEnhanceObj {
  initImport?: () => Promise<object>
  initOption?: () => void
  beforeData?: (tableData: Array<any>) => Promise<any>
  beforeSearch?: (search: object) => Promise<any>
  beforeFormData?: (formData: object, type: string) => Promise<any>
  beforeRequest?: (type: 'add' | 'edit' | 'del', apiData: object) => Promise<any>
  afterRequest?: (type: 'add' | 'edit' | 'del', apiData: object | Array<object>) => Promise<boolean>
  customAddHandle?: (tableId: string, addData: object) => Promise<string | boolean>
  customEditHandle?: (tableId: string, editData: object) => Promise<string | boolean>
  customDelHandle?: (tableId: string, ids: string[]) => Promise<string | boolean>
  selectionChange?: (selectData: any[]) => void
  selectable?: (row: object, index: number) => boolean
  rowStyle?: (data: any) => object
  cellStyle?: (data) => object
  rowClick?: (row: object, column: object, event: Event) => void
  rowDblclick?: (row: object, column: object) => void
  cellClick?: (row: object, column: object, cell: TdHTMLAttributes, event: Event) => void
  cellDblclick?: (row: object, column: object, cell: TdHTMLAttributes, event: Event) => void
  summaryBottomFormatting?: (sums: Array<string | VNode>, columns, tableData, summaryData) => Array<string | VNode>
  summaryTopFormatting?: (data) => Array<any>
  beforeExpandInnerSub?: (data, searchData) => object
}

interface TableInfo {
  tableName: string
  tableType: string
  isOpen: boolean
  isPage: boolean
  isGetData: boolean
  rollBottom: boolean
  isHeight: boolean
  tableDescribe: string
  menuStyle: string
  formId: string
  summaryBottom: object
  isSummaryTop: boolean
  searchStyle: 'default' | 'inline'

  singleStyle?: 'default' | 'card' | 'expand'
  expandMode?: 'default' | 'accordion'

  expandShowNum?: number

  subTable?: Array<string>
  subTitle?: string
  subTemplate?: string
  subType?: string
  mainProp?: string

  singleCardSpan: number
}

const dictStore = useDictStoreWithOut()
const lowStore = useLowStoreWithOut()

//默认按钮
const defaultBtnObj = {
  addBtn: { buttonName: '新增', buttonType: 'primary', buttonIcon: 'ep:plus', buttonLocation: 'header', buttonSort: '7', permission: 'jeelowcode:dbform-data:create' },
  editBtn: { buttonName: '编辑', buttonType: 'primary', buttonIcon: 'ep:edit-pen', buttonLocation: 'menu', buttonSort: '7', permission: 'jeelowcode:dbform-data:update' },
  addChild: { buttonName: '新增子级', buttonType: 'primary', buttonIcon: 'ep:circle-plus', buttonLocation: 'menu', buttonSort: '8', permission: 'jeelowcode:dbform-data:create' },
  viewBtn: { buttonName: '查看', buttonType: 'primary', buttonIcon: 'ep:view', buttonLocation: 'menu', buttonSort: '9', permission: 'jeelowcode:dbform-data:query' },
  delBtn: { buttonName: '删除', buttonType: 'danger', buttonIcon: 'ep:delete', buttonLocation: 'menu', buttonSort: '10', permission: 'jeelowcode:dbform-data:delete' },
  importBtn: { buttonName: '导入', buttonType: 'primary', buttonIcon: 'clarity:import-line', buttonLocation: 'header', buttonSort: '8', permission: 'jeelowcode:dbform-data:import' },
  exportBtn: { buttonName: '导出', buttonType: 'primary', buttonIcon: 'clarity:export-line', buttonLocation: 'header', buttonSort: '9', permission: 'jeelowcode:dbform-data:export' },
  batchDelBtn: { buttonName: '批量删除', buttonType: '', buttonIcon: 'ep:delete', buttonLocation: 'header', buttonSort: '10', permission: 'jeelowcode:dbform-data:delete' },
}

//默认日期、时间格式化配置
const defaultDataConfig = {
  datetime: { format: "YYYY-MM-DD HH:mm:ss", valueFormat: "YYYY-MM-DD HH:mm:ss" },
  date: { format: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD" },
  month: { format: "YYYY-MM", valueFormat: "YYYY-MM-DD" },
  year: { format: "YYYY", valueFormat: "YYYY-MM-DD" },
  week: { format: "YYYY 第 ww 周", valueFormat: "YYYY-MM-DD" },
  time: { format: "HH:mm:ss", valueFormat: "HH:mm:ss" },
}


const dicFormatterFun = (item, { dictTextFormatter, dictCode, dictText }) => {
  item.originalDicText = item[dictText]
  item[dictText] = dictTextFormatter.replace(/{dicCode}/g, item[dictCode]).replace(/{dicText}/g, item[dictText])
  return item
}

//配置格式化
const initColumn = (data, componentData, columnParams) => {
  const { span, defaultTip, tableType, isOpen, tableId, treeLabel,
    isSub, subType, useFun, roleFieldObj, isCardTable, searchStyle,
    dicShowList,
  } = columnParams
  const column = {}
  const control = {}
  const ruleObj = {}
  const summaryBottom = {}
  const tableDic = {}
  data.forEach(item => {
    const { dictEntity, webEntity, queryEntity, exportEntity, summaryEntity, fieldCode, fieldName, fieldType, fieldLen, fieldPointLen, fieldDefaultVal } = item
    const { cellWidthType, cellWidth, controlsConfig, verifyConfig, isShowForm, isShowList, isDbSelect, isShowColumn, isShowSort, isRequired } = webEntity
    const controlType = webEntity.controlType || 'input'
    const { queryIsWeb, queryMode, queryConfig, queryDefaultVal } = queryEntity
    const { dictType, dictCode, dictTable, dictText, dictTextFormatter, dictTableColumn } = dictEntity
    const { isExport } = exportEntity
    const { summaryShow, summarySql } = summaryEntity || {}
    const verifyControl = { isControl: true, isForm: false, isList: false, isSearch: false, searchOption: {}, }
    //默认配置
    let hide = isShowList == 'N'
    if (dicShowList?.length && dicShowList.includes(fieldCode)) hide = false
    column[fieldCode] = {
      label: fieldName,
      prop: fieldCode,
      type: controlType,
      span,
      display: isShowForm == 'Y',
      hide,
      showColumn: isShowColumn == 'Y',
      [searchStyle == 'inline' ? 'inlineSearch' : 'search']: queryIsWeb == 'Y',
      sortable: isShowSort == 'Y' ? 'custom' : false,
      isExport: isExport == 'Y',
      dataType: ['Integer', 'BigInt', 'BigDecimal'].includes(fieldType) || controlType == 'number' ? 'number' : 'string',
      overHidden: isCardTable ? false : true,
      className: `low-field__${fieldCode} control-${controlType}`,
      labelClassName: `low-header__${fieldCode}`
    }

    //租户字段的列表、表单权限控制
    if (roleFieldObj[fieldCode]) {
      const { listIsView, formIsView, formIsEdit } = roleFieldObj[fieldCode]
      if (listIsView == 'N') column[fieldCode].hide = true
      if (formIsView) column[fieldCode].display = false
      if (formIsEdit) column[fieldCode].disabled = true
    }

    if (fieldCode == 'id') column[fieldCode].dataType = 'string'
    column[fieldCode][cellWidthType == 'min' ? 'minWidth' : 'width'] = cellWidth || 120
    //接口不返回字段时 默认值处理（因为value 新增编辑查看都会生效）
    if (fieldDefaultVal !== '' && fieldDefaultVal !== null && isDbSelect == 'Y') {
      if (isDbSelect == 'Y') column[fieldCode].value = fieldDefaultVal
      else column[fieldCode].addValue = fieldDefaultVal
    }
    if (queryDefaultVal !== '' && fieldDefaultVal !== null) column[fieldCode].searchValue = queryDefaultVal
    //字典处理
    if (dictTable) tableDic[fieldCode] = true
    else if (dictCode) {
      let dicData = cloneDeep(dictStore.dictMap[dictCode] || [])
      if (dictTextFormatter) dicData = dicData.map(item => dicFormatterFun(item, { dictTextFormatter, dictText: 'label', dictCode: 'value' }))
      column[fieldCode].dicData = dicData
    }
    //日期、时间字段类型 默认控件类型处理
    if (fieldType == 'Date') column[fieldCode].type = 'date'
    if (fieldType == 'Time') column[fieldCode].type = 'time'
    if (fieldType == 'DateTime') column[fieldCode].type = 'datetime'
    //小数处理
    if (fieldType == 'BigDecimal' && fieldPointLen) column[fieldCode].precision = fieldPointLen
    if (['Integer', 'BigInt', 'BigDecimal'].includes(fieldType) && controlType === 'input' && fieldCode != 'id') {
      column[fieldCode].type = 'number'
      column[fieldCode].controls = false
    }
    //控件特殊处理
    if (['file', 'image'].includes(controlType)) {
      const uploadOption = {
        type: 'upload',
        propsHttp: { url: 'fileUrl' },
        data: { updateSupport: controlType == 'image' ? 0 : 1 },
        action: '/infra/file/jeelowcode/upload',
        controlType,
        overHidden: false,
      }
      if (controlType == 'image') {
        uploadOption['accept'] = 'image/*'
        uploadOption['listType'] = 'picture-card'
      }
      column[fieldCode] = { ...column[fieldCode], ...uploadOption }
      verifyControl.isList = true
    }
    if (['select', 'radio', 'checkbox', 'tree', 'cascader'].includes(controlType) && dictType == 'table') {
      if (dictCode && dictTable) {
        const fieldCodeList = [dictCode]
        if (dictText) fieldCodeList.push(dictText)
        if (['tree', 'cascader'].includes(controlType)) fieldCodeList.push('pid')
        const text = encryptAES(JSON.stringify({ dbformId: dictTable, fieldCodeList: [...new Set(fieldCodeList)] }))
        column[fieldCode] = {
          ...column[fieldCode],
          dictCode, dictTable, dictText: dictText || dictCode,
          dictType: 'defaultTable',
          dicUrl: `/jeelowcode/dbform-data/list/${dictTable}`,
          dicMethod: 'post',
          props: { label: dictText || dictCode, value: dictCode },
          dicQuery: { jeeLowCode_dictTableField: text },
          dicFormatter: (res) => {
            if (dictTextFormatter) res.records = res.records.map(item => dicFormatterFun(item, { dictTextFormatter, dictText, dictCode }))
            if (['tree', 'cascader'].includes(controlType)) {
              return listToTree(res.records)
            }
            return res.records
          }
        }
      }
    }
    if (controlType == 'switch') {
      const isNumber = fieldType == 'Integer'
      column[fieldCode] = {
        ...column[fieldCode],
        activeIcon: "el-icon-check",
        inactiveIcon: "el-icon-close",
        inlinePrompt: true,
        dicData: [{ label: '关闭', value: isNumber ? 0 : '0' }, { label: '开启', value: isNumber ? 1 : '1' }],
      }
    }
    if (controlType == 'dicTableSelect') {
      if (dictCode && dictTable) {
        column[fieldCode] = {
          ...column[fieldCode],
          dictCode, dictTable, dictText: dictText || dictCode,
          dictTableColumn: dictTableColumn ? dictTableColumn.split(',') : [],
          dictTextFormatter,
          props: { lable: dictText || dictCode, value: dictCode },
          formatter: (row, value, valueText, column) => {
            if (!value) {
              row[`$${column.prop}`] = ''
              return ''
            }
            const key = `${column.dictTable}&${column.dictText}`
            row[`$${column.prop}`] = value.split(',').map(id => {
              const text = lowStore.dicObj[key]?.[id] || ''
              if (dictTextFormatter) {
                const dicItem = dicFormatterFun({ [dictCode]: id, [dictText]: text }, { dictTextFormatter, dictText, dictCode })
                return dicItem[dictText]
              }
              return text || id
            }).join(column.separator || ' | ')
            return row[`$${column.prop}`]
          }
        }
        verifyControl.isForm = true
        verifyControl.isSearch = true
        verifyControl.searchOption = { column: { multiple: false } }
      } else {
        verifyControl.isControl = false
        column[fieldCode].type = 'input'
      }
    }
    if (['userSelect', 'deptSelect'].includes(controlType)) {
      let configData: any = {
        findType: 'all',
        formatter: (row, value, valueText, column) => {
          if (!value) {
            row[`$${column.prop}`] = ''
            return ''
          }
          if (typeof value == 'number') value = value + ''
          row[`$${column.prop}`] = value.split(',').map(id => {
            const text = lowStore.dicObj[controlType]?.[id] || ''
            if (column.textFormatter) {
              const dicItem = dicFormatterFun({ id: id, name: text }, { dictTextFormatter: column.textFormatter, dictText: 'name', dictCode: 'id' })
              return dicItem.name
            }
            return text || id
          }).join(column.separator || ' | ')
          return row[`$${column.prop}`]
        }
      }
      if (controlType == 'userSelect') {
        configData = {
          ...configData,
          columnKey: ['mobile', 'sex', 'deptName'],
          avatar: false,
        }
      }
      column[fieldCode] = { ...column[fieldCode], ...configData }
      verifyControl.isForm = true
      verifyControl.isSearch = true
      verifyControl.searchOption = { column: { multiple: false } }
    }
    if (controlType == 'monacoEditor') {
      verifyControl.isForm = true
    }
    if (controlType == 'ueditor') {
      column[fieldCode].action = '/infra/file/jeelowcode/upload'
      column[fieldCode].data = { updateSupport: 0 }
      column[fieldCode].propsHttp = { url: 'fileUrl' }
    }
    if (controlType == 'markDown') {
      verifyControl.isForm = true
    }
    if (controlType == 'regionSelect') {
      column[fieldCode] = {
        ...column[fieldCode],
        type: 'cascader', lazy: true, dictType: 'region',
        props: { label: 'name', value: 'id' },
        regionType: 'ssq',
        lazyLoad: (node, resolve) => {
          const level = node.level;
          const data = node.data || {}
          let pid = data.id
          const regionType = useFun.getPropConfig(fieldCode, 'regionType') || column[fieldCode].regionType
          if (level == 0) pid = regionType == 'gj' ? 0 : 1
          callApiFun('get', '/system/area/tree-by-id', { params: { pid } }).then(res => {
            res = res.map(item => {
              item.id = item.id + ''
              if (['gj', 's'].includes(regionType) || (regionType == 'ss' && node.level == 1)) item.leaf = true
              return item
            })
            resolve(res)
          })
        },
        formatter: (row, value, valueText, column) => {
          if (!value) {
            row[`$${column.prop}`] = ''
            return ''
          }
          const separator = column.separator || (column.multiple ? ' | ' : '/')
          if (isValidJson(value)) value = JSON.parse(value)
          row[`$${column.prop}`] = (value instanceof Array ? value : value.split(',')).map(id => {
            if (id instanceof Array) return id.map(i => lowStore.dicObj[controlType]?.[i] || i).join('/')
            return lowStore.dicObj[controlType]?.[id] || id
          }).join(separator)
          return row[`$${column.prop}`]
        }
      }
    }
    //树表pid特殊处理
    if (['treeTable', 'treeAround'].includes(tableType) && fieldCode == 'pid') {
      column[fieldCode] = {
        ...column[fieldCode],
        value: '',
        dataType: 'string',
        type: 'tree',
        dicUrl: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/list/${tableId}`,
        dicMethod: 'post',
        props: { label: treeLabel, value: 'id' },
      }
    }
    //控件配置格式化
    const controlsData = {}
    const customData = {}
    const optionData = {}
    const { custom_str, option_str } = handleStrObj(controlsConfig, `${defaultTip} ${fieldName}（${fieldCode}）字段的控件配置解析异常，请检查`) as any
    if (option_str) Object.assign(optionData, handleStrObj(option_str, `${defaultTip} ${fieldName}（${fieldCode}）字段的控件配置解析异常，请检查`))
    if (custom_str) Object.assign(customData, handleStrObj(custom_str, `${defaultTip} ${fieldName}（${fieldCode}）字段的控件配置-更多配置解析异常，请检查`))
    setDeepObject(controlsData, optionData)
    Object.keys(customData).forEach(key => {
      if (customData[key] && controlsData[key] && customData[key] instanceof Object) {
        if (!(controlsData[key] instanceof Array)) {
          controlsData[key] = { ...controlsData[key], ...customData[key] }
          delete customData[key]
          if (column[fieldCode] && column[fieldCode][key]) {
            column[fieldCode][key] = { ...column[fieldCode][key], ...controlsData[key] }
            delete controlsData[key]
          }
        }
      }
    })
    Object.assign(controlsData, customData)
    column[fieldCode] = { ...column[fieldCode], ...controlsData }
    //自定义控件
    if (controlType == 'customControl') {
      const { isGlobal, controlUrl, controlName, isList, isSearch, searchOption } = column[fieldCode]
      column[fieldCode].type = 'input'
      if (!isGlobal) {
        if (controlUrl) {
          let random = componentData['pathOnly'][controlUrl]
          if (!random) {
            random = `key_${Math.ceil(Math.random() * 9999999)}`
            componentData['pathOnly'][controlUrl] = random
            componentData[random] = registerComp(controlUrl)
          }
          column[fieldCode].componentKey = random
          verifyControl.isForm = true
          verifyControl.isList = isList
          verifyControl.isSearch = isSearch
          verifyControl.searchOption = searchOption || {}
        }
      } else if (controlName) {
        column[fieldCode].component = controlName
        verifyControl.isControl = false
      }
    }
    //部分控件栅格处理
    if (!controlsData['span'] && ['upload', 'textarea', 'ueditor', 'markDown'].includes(column[fieldCode].type)) column[fieldCode].span = 24
    //查询配置格式化
    const queryStrData = handleStrObj(queryConfig, `${defaultTip} ${fieldName}（${fieldCode}）字段的查询配置解析异常，请检查`) as any
    const queryData = {}
    if (queryStrData.option_str) Object.assign(queryData, handleStrObj(queryStrData.option_str, `${defaultTip} ${fieldName}（${fieldCode}）字段的查询配置解析异常，请检查`))
    if (queryStrData.custom_str) Object.assign(queryData, handleStrObj(queryStrData.custom_str, `${defaultTip} ${fieldName}（${fieldCode}）字段的查询配置-更多配置解析异常，请检查`))
    column[fieldCode] = { ...column[fieldCode], ...queryData }
    //范围查询处理
    if (queryMode == 'RANGE' && !queryData['searchRange']) column[fieldCode].searchRange = true
    //默认查询处理
    if (['file', 'image', 'monacoEditor', 'ueditor', 'markDown', 'customControl'].includes(controlType)) {
      column[fieldCode].searchType = 'input'
    }
    //日期、时间默认控件配置处理
    let currType = column[fieldCode].type.replace('range', '')
    if (currType[currType.length - 1] === 's') currType = currType.substring(0, currType.length - 1)
    if (defaultDataConfig[currType]) {
      if (!column[fieldCode].format) column[fieldCode].format = defaultDataConfig[currType].format
      if (!column[fieldCode].valueFormat) {
        column[fieldCode].valueFormat = defaultDataConfig[currType].valueFormat
        if (fieldType == 'DateTime' && currType != 'datetime') column[fieldCode].valueFormat = `${column[fieldCode].valueFormat} HH:mm:ss`
      }
    }
    //数字输入框范围查询配置
    if (column[fieldCode].type == 'number' && column[fieldCode].searchRange) verifyControl.isSearch = true
    //验证配置
    const trigger = ['select', 'date', 'time', 'upload', 'rate', 'slider'].includes(controlType) ? 'change' : 'blur'
    if (!column[fieldCode].rules) column[fieldCode].rules = []
    if (isRequired == 'Y') {
      const message = trigger == 'change' ? `请${controlType == 'upload' ? '上传' : '选择'}` : '请输入'
      column[fieldCode].rules.push({ required: true, message: `${message} ${fieldName}`, trigger })
    }
    if (fieldType == 'String' && ['input'].includes(column[fieldCode].type)) column[fieldCode].rules.push(ruleLeng(fieldLen))
    if (verifyConfig) {
      let verifyIndex = column[fieldCode].rules.length
      const verifyList = JSON.parse(verifyConfig)
      verifyList.forEach(item => {
        if (!item.display || (item.type == 'only' && isSub && subType == 'one')) return //附表表单没有唯一校验
        if (['only', 'customRule'].includes(item.type)) {
          if (!ruleObj[fieldCode]) ruleObj[fieldCode] = []
          ruleObj[fieldCode].push({ index: verifyIndex, rule: { trigger }, type: item.type, ruleStr: item.customStr || '' })
        } else if (item.type == 'leng') {
          column[fieldCode].rules.push({ ...patternObj.getLeng(item.leng_min, item.leng_max, item.leng_type), trigger })
        } else if (item.type == 'customRegExp' || patternObj[item.type]) {
          let regExp = patternObj[item.type]
          if (item.regExp) regExp = new RegExp(item.regExp)
          if (regExp) column[fieldCode].rules.push({ pattern: regExp, trigger, message: item.msg || `${fieldName} 格式不对` })
        }
        verifyIndex++
      })
    }
    // tree、cascader绑定字典 默认懒加载处理
    if (['tree', 'cascader'].includes(controlType) && column[fieldCode].lazy && column[fieldCode].dictType == 'defaultTable') {
      column[fieldCode] = {
        ...column[fieldCode],
        [`${controlType == 'tree' ? 'treeLoad' : 'lazyLoad'}`]: (node, resolve) => {
          const level = node.level;
          const data = node.data || {}
          if (controlType == 'tree' && data.hasChildren === false) return resolve([]) //处理：多选时 没有子集还是调用问题
          callApiFun('post', column[fieldCode].dicUrl, { data: { ...column[fieldCode].dicQuery, pid: level == 0 ? 0 : data.id } }).then(res => {
            resolve(res.records)
          })
        },
        formatter: (row, value, valueText, column) => {
          if (!value) {
            row[`$${column.prop}`] = ''
            return ''
          }
          const key = `${column.dictTable}&${column.dictText}`
          const separator = column.separator || ' | '
          if (controlType == 'cascader' && isValidJson(value)) value = JSON.parse(value)
          row[`$${column.prop}`] = (value instanceof Array ? value : value.split(',')).map(id => {
            if (id instanceof Array) return id.map(i => lowStore.dicObj[key]?.[i] || i).join('/')
            return lowStore.dicObj[key]?.[id] || id
          }).join(separator)
          return row[`$${column.prop}`]
        }
      }
    }
    //如果cascader存储的是全路径并且是多选 要以json存储
    if (currType == 'cascader' && column[fieldCode].multiple) column[fieldCode].dataType = 'json'
    //插槽处理
    const { isControl, isForm, isList, isSearch, searchOption } = verifyControl
    if (isControl) {
      if (!control[controlType]) control[controlType] = []
      let controlData = { slotList: [] as string[], prop: fieldCode }
      if (isForm) controlData.slotList.push('form')
      if (isList) controlData.slotList.push('list')
      if (isSearch) {
        controlData.slotList.push('search')
        if (searchOption) controlData = { ...controlData, ...searchOption }
      }
      control[controlType].push(controlData)
    }
    //统计处理
    if (summaryShow == 'Y' && summarySql) {
      summaryBottom[fieldCode] = true
    }
  })
  return { column, control, ruleObj, summaryBottom }
}

//按钮初始化
const initButton = (data, context) => {
  const { wsCache } = useCache()
  const permissions = wsCache.get(CACHE_KEY.USER).permissions
  const { model, defaultTip, tableType, getPermiKey, webConfigRoleButtonVoList } = context
  const defPermiObj = {
    addBtn: 'create', addChild: 'create',
    editBtn: 'update',
    delBtn: 'delete', batchDelBtn: 'delete',
    viewBtn: 'query',
    importBtn: 'import',
    exportBtn: 'export'
  }
  data = data.filter(item => {
    if (item.buttonShow == 'N') return false
    //附表 过滤：编辑、查看、导入、导出
    if (tableType == '4' && ['editBtn', 'viewBtn', 'importBtn', 'exportBtn'].includes(item.buttonCode) && model !== 'erpTable') return false

    //租户权限过滤
    if (webConfigRoleButtonVoList?.includes(item.buttonCode)) return false

    //菜单权限过滤
    if (getPermiKey) {
      let permiKey = ''
      if (defPermiObj[item.buttonCode]) permiKey = getPermiKey(defPermiObj[item.buttonCode])
      else if (item.buttonAuth == 'Y') permiKey = getPermiKey(item.buttonCode)
      if (permiKey && permissions[permiKey] === false) return false
    }
    return true
  })
  data.sort((a, b) => a.buttonSort - b.buttonSort)

  const menu = {}
  const header = {}
  const handleShowObj = { header: {}, menu: {} }
  data.forEach(item => {
    const btnItem = { label: item.buttonName, prop: item.buttonCode, display: item.buttonShow == 'Y', type: item.buttonType, icon: item.buttonIcon, params: {} }
    if (item.buttonExp) {
      const config = handleStrObj(item.buttonExp, `${defaultTip} 自定义按钮【${item.buttonName}】 其他配置格式异常，请检查`)
      if (config['handleShow']) {
        handleShowObj[item.buttonLocation][item.buttonCode] = { funStr: `${config['handleShow']}`, label: item.buttonName }
        delete config['handleShow']
      }
      delete item.buttonExp
      btnItem.params = config
    }
    if (item.buttonLocation == 'header') header[item.buttonCode] = btnItem
    else menu[item.buttonCode] = btnItem
  })
  return { menu, header, handleShowObj }
}

//表格配置格式化
export const initTableOption = (data, context) => {
  if (!data.buttonList) data.buttonList = []
  const { buttonList, dbForm, jsList, subDbFormIdList, summaryTopOpenFlag, webConfigRoleFieldVoList, webConfigRoleButtonVoList } = data
  const { tableId, calcHeight, model, dicSelectType, dicShowList, isPermi, isSub, useFun } = context
  const roleFieldObj = {}
  const deleteField: string[] = []

  //租户字段权限过滤
  if (webConfigRoleFieldVoList) {
    webConfigRoleFieldVoList.forEach(item => {
      if (item.enableState == 'N') deleteField.push(item.fieldCode)
      else roleFieldObj[item.fieldCode] = item
    })
  }
  const fieldList = deleteField.length ? data.fieldList.filter(item => !deleteField.includes(item.fieldCode)) : data.fieldList

  let jsEnhanceStr = ''
  let scssEnhanceStr = ''
  jsList.forEach(item => {
    if (!jsEnhanceStr && item.jsType == 'js') jsEnhanceStr = item.jsJson
    if (!scssEnhanceStr && item.jsType == 'scss') scssEnhanceStr = item.jsJson
  })
  const defaultTip = `${dbForm.tableDescribe}（${tableId}）`
  const splitKey = ['basicFunction', 'dataConfig', 'tableConfig']
  splitKey.forEach(key => dbForm[key] = dbForm[key]?.split(',') || '')
  const isHeight = dbForm.tableConfig.includes('height')
  const isOpen = dbForm.dataConfig.includes('authOpen')
  const tableOption: any = {
    rowKey: 'id',
    height: isHeight ? 'auto' : undefined,
    calcHeight: isHeight ? 160 : '',
    selection: (dicSelectType || dbForm.tableSelect) == 'multiple',
    reserveSelection: true,
    index: dbForm.tableConfig.includes('index'),
    border: dbForm.tableConfig.includes('border'),
    stripe: dbForm.tableConfig.includes('stripe'),
    header: dbForm.tableConfig.includes('header'),
    menu: dbForm.tableConfig.includes('menu'),
    dialogCustomClass: `low-table__dialog low-table__dialog__${tableId}`,
    column: {},
  }
  const treeAroundOption: any = {}
  const componentData = markRaw(
    { pathOnly: {} }
  )
  let tableType = 'default'
  // 树表
  if (dbForm.tableType == 2) {
    tableType = 'treeTable'
    tableOption.rowParentKey = 'pid'
    if (dbForm.treeStyle == 'around') {
      tableType = 'treeAround'
      treeAroundOption.addBtn = false
      treeAroundOption.menu = false
      treeAroundOption.props = { label: dbForm.treeLabelField, value: 'id', children: 'children' }
    }
    if (dbForm.treeMode == 'treeLazy') {
      if (tableType == 'treeTable') tableOption.lazy = true
      if (tableType == 'treeAround') treeAroundOption.lazy = true
    }
  }
  const { singleStyle, singleCardSpan, expandShowNum, expandMode, searchStyle } = JSON.parse(dbForm.tableStyle || '{}')
  //单表卡片布局处理
  if (dbForm.tableType == 1 && singleStyle == 'card') {
    if (singleStyle == 'card') {
      tableOption.grid = true
      tableOption.gridSpan = 24 / singleCardSpan
    }
  }

  if (calcHeight) {
    tableOption.height = 'auto'
    tableOption.calcHeight = calcHeight
  }
  const { custom_str, option_str } = handleStrObj(dbForm.basicConfig, `${defaultTip} 表格扩展配置解析异常，请检查`) as any
  if (custom_str) Object.assign(tableOption, handleStrObj(custom_str, `${defaultTip} 表格扩展配置-更多配置解析异常，请检查`))
  if (option_str) Object.assign(tableOption, handleStrObj(option_str, `${defaultTip} 表格扩展配置解析异常，请检查`))

  Object.assign(tableOption, { addBtn: false, editBtn: false, viewBtn: false, delBtn: false, excelBtn: false })
  const columnParams = {
    span: dbForm.formStyle ? 24 / dbForm.formStyle : 12, defaultTip, tableType, isOpen, tableId,
    treeLabel: dbForm.treeLabelField, isSub, subType: dbForm.subTableMapping, useFun, roleFieldObj,
    isCardTable: tableOption.grid, searchStyle: singleStyle == 'card' ? 'defalut' : searchStyle,
    dicShowList,
  }
  const { column, control, ruleObj, summaryBottom } = initColumn(fieldList, componentData, columnParams)
  tableOption.column = column

  if (subDbFormIdList && subDbFormIdList.length) {
    if (['normal', 'innerTable'].includes(dbForm.themeTemplate) || !dbForm.themeTemplate) {
      // 追加附表字段
      tableOption.column.lowCustomSubTable = { prop: 'lowCustomSubTable', label: '', labelWidth: 0, span: 24, hide: true, className: 'low-sub-tabs__row', tabsOption: { column: [] } }
    } else if (dbForm.themeTemplate == 'erp') {
      //erp主题 强制单选、高度自适应
      dbForm.tableSelect = 'radio'
      tableOption.selection = false
      tableOption.height = 'auto'
    }
    if (dbForm.themeTemplate == 'innerTable' || (dbForm.tableType == 1 && singleStyle == 'expand')) {
      //主附表内嵌
      tableOption.expand = true
      tableOption.expandRowKeys = []
    }
  }
  if (dbForm.tableType == 1 && singleStyle == 'expand') {
    //可展开表格
    tableOption.expand = true
    tableOption.expandRowKeys = []
  }
  if ((dicSelectType || dbForm.tableSelect) == 'radio') {
    //添加单选字段
    tableOption.column = {
      lowSelectRadio: { label: '', display: false, width: 50, overHidden: false, fixed: true, showColumn: false },
      ...tableOption.column,
    }
    tableOption.index = false
  }
  for (const key in defaultBtnObj) {
    const btnItem = { ...defaultBtnObj[key], buttonShow: dbForm.basicFunction.includes(key) ? 'Y' : 'N', buttonCode: key }
    if (key == 'addChild' && dbForm.tableType != 2) {
      btnItem.buttonShow = 'N'
    }
    buttonList.push(btnItem)
  }
  const getPermiKey = (code) => `jeelowcode:dbform-data:${code}:${tableId}`

  const buttonObj = initButton(buttonList, { model, defaultTip, tableType: dbForm.tableType, getPermiKey: isPermi ? getPermiKey : false, webConfigRoleButtonVoList })

  if (Object.keys(summaryBottom).length && !['treeTable', 'treeLazy'].includes(tableType)) tableOption.showSummary = true
  if (model == 'dicTable') Object.assign(tableOption, { header: false, menu: false, tip: false, showSummary: false, emptyBtn: false })

  const tableInfo: TableInfo = {
    tableName: dbForm.tableName,
    tableType,
    isOpen,
    isPage: dbForm.dataConfig.includes('page'),
    isGetData: dbForm.dataConfig.includes('initDataReq'),
    rollBottom: dbForm.tableConfig.includes('rollBottom'),
    isHeight,
    tableDescribe: dbForm.tableDescribe,
    menuStyle: dbForm.operateMenuStyle,
    formId: dbForm.isDesForm == 'Y' ? dbForm.desformWebId : '',
    summaryBottom,
    isSummaryTop: summaryTopOpenFlag,
    searchStyle,
    singleStyle,
    singleCardSpan,
  }
  if (dbForm.tableType == 3) {
    tableInfo.subTable = subDbFormIdList || []
    tableInfo.subTemplate = dbForm.themeTemplate
  } else if (dbForm.tableType == 4) {
    tableInfo.subTitle = dbForm.subTableTitle || dbForm.tableDescribe
    tableInfo.subType = dbForm.subTableMapping
    tableInfo.mainProp = data.mainProp
  }
  // 主附表内嵌处理
  if (model == 'innerTable') {
    tableOption.header = false
    tableOption.menu = false
    tableOption.selection = false
    tableOption.height = undefined
    tableOption.calcHeight = ''
    tableOption.maxHeight = 300
    delete tableOption.column.lowSelectRadio

    tableInfo.isPage = false
    tableInfo.isHeight = false
  }
  //展开表格处理
  if (dbForm.tableType == 1 && singleStyle == 'expand') {
    tableInfo.expandShowNum = expandShowNum
    tableInfo.expandMode = expandMode
  }

  return {
    tableOption,
    treeAroundOption,
    control,
    ruleObj,
    componentData,
    buttonObj,
    tableInfo,
    jsEnhanceStr,
    scssEnhanceStr,
  }
}


//表格数据、详情数据格式化
export const tableFormatting = (data, column, otherData: any = {}) => {
  const { isCell, menuShowObj, executeStrFunction } = otherData
  const isArray = data instanceof Array
  let currData = isArray ? cloneDeep(data) : cloneDeep([data])
  const dateControl = {}
  const userAndDeptControl: any = { props: [], userIds: [], deptIds: [], typeKey: { userSelect: 'user', deptSelect: 'dept' } }
  const dicTableData = { propObj: {}, keyList: [] as Array<string>, dicStoreKey: {} }
  for (const prop in column) {
    const { type, hide, lazy, dictType, valueFormat } = column[prop]
    // 日期 时间处理
    if (['datetime', 'date', 'year', 'month', 'week'].includes(type)) dateControl[prop] = valueFormat
    //字典回显处理
    if ((isArray && !hide) || !isArray) {
      if (type == 'dicTableSelect' || (['tree', 'cascader'].includes(type) && lazy && dictType == 'defaultTable')) {
        const { dictCode, dictText, dictTable } = column[prop]
        const key = `${dictTable}&${dictText}`
        dicTableData.propObj[prop] = key
        if (!dicTableData[key]) dicTableData.keyList.push(key)
        dicTableData[key] = { dbformId: dictTable, code: dictCode, label: dictText, dataList: [] }
      }
      if (Object.keys(userAndDeptControl.typeKey).includes(type)) userAndDeptControl.props.push({ type: userAndDeptControl.typeKey[type], prop })
    }
  }
  currData = currData.map((item) => {
    // 数据格式化
    for (const prop in dateControl) {
      if (item[prop]) item[prop] = formatDate(item[prop], dateControl[prop])
    }
    //表格字典回显处理
    for (const prop in dicTableData.propObj) {
      const key = dicTableData.propObj[prop]
      if (item[prop]) dicTableData[key].dataList = [...dicTableData[key].dataList, ...stringToArr(item[prop])]
    }
    userAndDeptControl.props.forEach(({ type, prop }) => {
      if (item[prop]) {
        item[prop] = item[prop].toString()
        userAndDeptControl[`${type}Ids`].push(...item[prop].split(','))
      }
    })
    if (isCell) item.$cellEdit = true
    //按钮显隐增强执行
    if (menuShowObj) {
      for (const key in menuShowObj) item[`$btn__${key}`] = executeStrFunction(menuShowObj[key].funStr, [cloneDeep(item)], `自定义按钮（操作列） ${menuShowObj[key].label} 显隐增强执行异常`)
    }
    return item
  })

  //查询回显文本
  const dicApiData: any = { jeeLowCode_dictLabel: [] }
  if (dicTableData.keyList.length) {
    const dicTableApiData: Array<string> = []
    dicTableData.keyList.forEach(key => {
      dicTableData[key].dataList = [...new Set(dicTableData[key].dataList)].filter((id: string) => {
        if ((dicTableData[key].code == 'id' && /^(\d+)$/.test(id + '')) || dicTableData[key].code != 'id') {
          if (!lowStore.dicObj[key]?.[id]) return true
        }
        return false
      })
      dicTableData[key].dataList = [...new Set(dicTableData[key].dataList)].filter((id: string) => !lowStore.dicObj[key] ? true : !lowStore.dicObj[key][id])
      if (dicTableData[key].dataList.length) dicTableApiData.push(dicTableData[key])
    })
    dicApiData.jeeLowCode_dictLabel.push(...dicTableApiData)
  }
  for (const key in userAndDeptControl.typeKey) {
    const abbr = userAndDeptControl.typeKey[key]
    userAndDeptControl[`${abbr}Ids`] = userAndDeptControl[`${abbr}Ids`].filter(id => {
      return /^(\d+)$/.test(id + '')
    })
    if (userAndDeptControl[`${abbr}Ids`].length) dicApiData.jeeLowCode_dictLabel.push({ [`${abbr}IdList`]: [...new Set(userAndDeptControl[`${abbr}Ids`])] })
  }
  if (dicApiData.jeeLowCode_dictLabel.length) {
    dicApiData.jeeLowCode_dictLabel = encryptAES(JSON.stringify(dicApiData.jeeLowCode_dictLabel))
    const dictData = {
      userList: { dicKey: 'userSelect', label: 'nickname', value: 'id' },
      deptList: { dicKey: 'deptSelect', label: 'name', value: 'id' }
    }
    DicApi.getDicTableText(dicApiData).then(dicData => {
      for (const key in dicData) {
        const dicObj = {}
        let labelKey = 'label'
        let valueKey = 'id'
        let dicKey = ''
        if (key.indexOf('&') != -1) {
          dicKey = key
          labelKey = dicTableData[key].label || key.split('&')[1]
          valueKey = dicTableData[key].code || 'id'
        } else if (dictData[key]) {
          dicKey = dictData[key].dicKey
          labelKey = dictData[key].label
          valueKey = dictData[key].value
        }
        dicData[key].forEach(item => dicObj[item[valueKey]] = item[labelKey])
        lowStore.setDicObj(dicKey, dicObj)
      }
    })
  }
  return isArray ? currData : currData[0]
}

//表单存储数据格式化
export const saveFormFormatting = (data, column) => {
  const formatting = (currData) => {
    for (const key in currData) {
      //处理清空后值为undefined、null问题
      if (currData[key] === undefined || currData[key] === null) currData[key] = ''
      //处理空字符串数组问题
      if (currData[key] === '[]') currData[key] = ''
    }
    return currData
  }
  if (data instanceof Array) data = data.map(item => formatting(item))
  else formatting(data)
  return data
}

//获取懒加载已勾选的数据
export const setFormLazyCacheData = (column, control, data) => {
  return new Promise(async (resolve) => {
    const isArray = data instanceof Array
    const currData = isArray ? cloneDeep(data) : cloneDeep([data])
    const lazyObj = {}
    const lazyType = ['tree']
    lazyType.forEach(type => {
      if (control[type]) {
        control[type].forEach(({ prop }) => {
          const { lazy, dictType, dictCode, dictTable, dictText } = column[prop]
          if (lazy && dictType == 'defaultTable') {
            if (!lazyObj[dictTable]) lazyObj[dictTable] = { dbformId: dictTable, code: dictCode, valList: [], fieldList: [dictCode, 'pid'], propKey: [] }
            lazyObj[dictTable].fieldList.push(dictText)
            lazyObj[dictTable].propKey.push(prop)
          }
        })
      }
    })
    if (!Object.keys(lazyObj).length) {
      resolve({})
      return
    }
    currData.forEach(item => {
      for (const key in lazyObj) {
        const { propKey } = lazyObj[key]
        propKey.forEach(prop => {
          if (item[prop]) {
            if (typeof item[prop] == 'string') item[prop] = item[prop].split(',')
            lazyObj[key].valList = [...lazyObj[key].valList, ...item[prop]]
          }
        })
      }
    })
    const apiList: object[] = []
    const cacheOption = {}
    for (const key in lazyObj) {
      if (lazyObj[key].valList.length) {
        lazyObj[key].fieldList = [...new Set(lazyObj[key].fieldList)]
        lazyObj[key].valList = [...new Set(lazyObj[key].valList)]
        cacheOption[key] = { props: lazyObj[key].propKey, data: [] }
        delete lazyObj[key].propKey
        apiList.push(lazyObj[key])
      }
    }
    if (!apiList.length) {
      resolve({})
      return
    }
    const resData = await TableApi.getLazyStructureData(apiList)
    for (const key in resData) {
      const cacheData = listToTree(resData[key])
      cacheOption[key].data = cacheData
    }
    resolve(cacheOption)
  }) as Promise<any>
}

//获取搜索需要的多选数据prop
export const getMultipleProp = (column) => {
  const props: Array<string> = []
  for (const prop in column) {
    const { type, multiple } = column[prop]
    if (['select', 'dicTableSelect', 'userSelect', 'deptSelect'].includes(type) && multiple) props.push(prop)
  }
  return { more_select_field: props.join(',') }
}

//查找表单配置对应字段
export const findOptionField = (tableOption: object, prop: string) => {
  let fieldData: any = null
  const eachOption = (obj) => {
    if (fieldData) return
    if (obj.column && Object.keys(obj.column).length) findObject(obj.column)
    if (!fieldData && obj.group) {
      for (const groupItem of obj.group) {
        if (groupItem.prop == prop) {
          fieldData = groupItem
          break
        }
        findObject(groupItem.column)
        if (fieldData) break
      }
    }
  }
  const findObject = (obj) => {
    if (fieldData) return
    if (obj[prop]) return (fieldData = obj[prop])
    for (const key in obj) childrenFindObject(obj[key])
  }
  const childrenFindObject = (obj) => {
    //多级表头处理
    if (obj.children?.length) {
      for (const column of obj.children) {
        if (column.prop == prop) {
          fieldData = column
          break
        }
        childrenFindObject(column)
      }
    }
  }
  eachOption(tableOption)
  return fieldData
}



const summaryTopChartDefault = {
  line: {
    title: { text: '', left: 'center' },
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ data: [], type: 'line', areaStyle: { color: new graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(64, 158, 255, 0.3)' }, { offset: 1, color: 'rgba(64, 158, 255, 0.0)' }]) } }]
  },
  bar: {
    title: { text: '', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ data: [], type: 'bar', areaStyle: { color: new graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(64, 158, 255, 0.3)' }, { offset: 1, color: 'rgba(64, 158, 255, 0.0)' }]) } }]
  },
  pie: {
    title: { text: '', left: 'center', },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    series: [
      {
        name: '', type: 'pie', radius: '75%', center: ['50%', '50%'], roseType: 'area', data: [],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200,
        itemStyle: { emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
        label: { show: true, position: 'outside', formatter: '{b}: {c} ({d}%)', color: '#333', fontSize: 12 },
        labelLine: { show: true, length: 8, length2: 15, lineStyle: { color: '#aaa' } }
      }
    ]
  }
}
const defaultColor = [
  '#FFC107', '#9C27B0', '#4CAF50', '#2196F3', '#F44336', '#00BCD4', //柔和
  '#FF5722', '#FF9800', '#E91E63', '#3F51B5', '#009688', '#03A9F4', //明亮
  '#795548', '#607D8B', '#455A64', '#5D4037', '#3E2723', '#1B5E20', //深色
  '#F57C00', '#8BC34A', '#009688', '#FFEB3B', '#FFCDD2', '#E0E0E0' //自然色
]

//顶部统计格式化处理
export const summaryTopFormatting = (topList) => {
  const formattingData = (item, formatting) => {
    let text = formatting
    for (const key in item) {
      const replaceText = `#{${key}}`
      text = text.replace(replaceText, item[key])
      //oracle数据库兼容
      const lowerText = `#{${key.toLowerCase()}}`
      text = text.replace(lowerText, item[key])
    }
    return text
  }

  topList = topList.map(topItem => {
    if (topItem.summaryJson) {
      const summaryData = JSON.parse(topItem.summaryJson)
      topItem.summaryData = {
        summarySpan: summaryData.summarySpan,
        summaryControl: summaryData.summaryControl,
        formattingObj: summaryData.summarySql.formattingObj
      }
      delete topItem.summaryJson
    }
    const { dataMapList, summaryData } = topItem
    const { summarySpan, summaryControl, formattingObj } = summaryData
    const data: any = {
      label: topItem.summaryLabel,
      span: summarySpan || 8,
      control: summaryControl || 'text',
      rawData: cloneDeep(dataMapList)
    }
    data.prop = `${data.control}_${Math.ceil(Math.random() * 9999999)}`
    if (data.control == 'text') data.children = []
    else if (data.control == 'card') {
      let span = Math.floor(24 / dataMapList.length)
      if (span < 4) span = 4
      data.cardOption = { span, data: [] }
    }
    else if (['line', 'bar', 'pie'].includes(data.control)) {
      data.chartOption = cloneDeep(summaryTopChartDefault[data.control])
      data.chartOption.title.text = data.label
      data.chartStyle = { width: '100%', hieght: '200px' }
      if (data.control == 'pie') data.chartOption.series[0].name = data.label
    }

    dataMapList.forEach((item, index) => {
      //文本处理
      if (data.control == 'text') {
        if (formattingObj.text) data.children.push(formattingData(item, formattingObj.text))
        else {
          let text = ''
          for (const k in item) text = text + `${k}：${item[k]}`
          data.children.push(text)
        }
      }
      //卡片处理
      if (data.control == 'card') {
        const cardItem = { click: (item) => { }, title: '', count: 0, icon: 'iconamoon:information-circle-light', color: defaultColor[index % 24], href: 'javascript:void(null)', target: '' }
        if (formattingObj.card_name) cardItem.title = formattingData(item, formattingObj.card_name)
        if (formattingObj.card_value) cardItem.count = formattingData(item, formattingObj.card_value)
        data.cardOption.data.push(cardItem)
      }
      //echarts图表处理
      if (['line', 'bar'].includes(data.control)) {
        if (formattingObj[`${data.control}_x`]) {
          const text = formattingData(item, formattingObj[`${data.control}_x`])
          data.chartOption.xAxis.data.push(text)
        }
        if (formattingObj[`${data.control}_y`]) {
          const text = formattingData(item, formattingObj[`${data.control}_y`])
          data.chartOption.series[0].data.push(text)
        }
        if (formattingObj[`${data.control}_y_unit`]) data.chartOption.tooltip.valueFormatter = (value) => `${value}${formattingObj[`${data.control}_y_unit`]}`
      } else if (data.control == 'pie') {
        const pieItem: any = { ...item }
        if (formattingObj.pie_name) pieItem.name = formattingData(item, formattingObj.pie_name)
        if (formattingObj.pie_value) pieItem.value = formattingData(item, formattingObj.pie_value)
        if (formattingObj.pie_unit) {
          data.chartOption.tooltip.formatter = `{a} <br/>{b}: {c}${formattingObj.pie_unit} ({d}%)`
          data.chartOption.series[0].label.formatter = `{b}: {c}${formattingObj.pie_unit} ({d}%)`
        }
        data.chartOption.series[0].data.push(pieItem)
      }
    })
    return data
  })
  return topList
}
