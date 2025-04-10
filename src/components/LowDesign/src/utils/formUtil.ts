import { cloneDeep } from 'lodash-es'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useLowStoreWithOut } from '@/store/modules/low'
import { handleStrObj } from '@/utils/lowDesign'
import { callApiFun, isValidJson, setDeepObject } from './util'
import { registerComp } from './registerComponent'
import { patternObj } from './verifyOption';
import { formatDate } from '@/utils/formatTime'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'
import { listToTree, filter } from '@/utils/tree';
import * as DicApi from '@/api/design/dic'
export interface JsEnhanceObj {
  initImport?: () => Promise<object>
  initOption?: () => void
  initData?: (formData: object) => Promise<any>
  beforeSubmit?: (submitData: object) => Promise<any>
  afterSubmit?: (submitData: object) => Promise<any>
  verifyError?: (msg) => Promise<any>
  afterReset?: () => void
}
export interface TabsEnhanceObj {
  initTabs?: () => void
  beforeLeave?: (tabName, oldTabName) => Promise<any>
  tabChange?: (tabName) => void
}
export interface TableEnhanceObj {
  initTable?: () => void
  setTableData?: (data: Array<object>, params) => Array<object>
}

interface InitFormOption {
  option: object
  control: object
  ruleObj: object
  componentData: object
  jsEnhance: string
  scssEnhance: string
}
interface OtherObj {
  formType: string
  parentProp: string
  isCell?: boolean
}

const dictStore = useDictStoreWithOut()
const lowStore = useLowStoreWithOut()
const regionDicKey = 'regionSelect'

const specialControlObj = {
  map: [{ key: 'mapOptionStr', label: '高德地图配置' }],
  monacoEditor: [{ key: 'editorOptionStr', label: 'MonacoEditor配置', dataKey: 'params.editorOption' }],
  markDown: [{ key: 'editorOptionStr', label: 'v-md-editor配置', dataKey: 'editorOption' }],
  ueditor: [{ key: 'wangEditorStr', label: 'wangEditor配置', dataKey: 'customConfig' }],
  customControl: [{ key: 'controlOptionStr', label: '控件配置', dataKey: 'params' }],
  table: [
    { key: 'tableConfigStr', label: '表格、字段配置', dataKey: 'children' },
    { key: 'tableOptionStr', label: '表格请求、回显、存储配置' }
  ],
  upload: [{ key: 'callBackStr', label: '上传回调配置' }],
  select: [{ key: 'remoteOptionStr', label: '远端数据配置' }]
}
const defaultBtnObj = {
  addBtn: {
    label: '新增',
    type: 'primary',
    icon: 'ri:add-large-line',
    btnKey: 'header',
    viewShow: false
  },
  delBtn: { label: '删除', type: 'danger', icon: '', btnKey: 'menu', viewShow: false },
  editBtn: { label: '编辑', type: 'primary', icon: '', btnKey: 'menu', viewShow: false }
}

const dicFormatterFun = (item, { dictTextFormatter, dictCode, dictText }) => {
  item.originalDicText = item[dictText]
  item[dictText] = dictTextFormatter.replace(/{dicCode}/g, item[dictCode]).replace(/{dicText}/g, item[dictText])
  return item
}

//控件初始化
const initColumn = (column: object, control, ruleObj, componentData: Object, otherObj: OtherObj) => {
  const { formType, parentProp, isCell } = otherObj
  for (const prop in column) {
    const columnItem = column[prop]
    columnItem.prop = prop
    const { type, label, controlType, dicType, dicCode, params, hideLabel } = columnItem
    columnItem.dataType = ['number', 'rate', 'slider'].includes(type) ? 'number' : 'string'
    if (type == 'layoutTable') columnItem.dataType = 'array'
    if (!ruleObj[parentProp]) ruleObj[parentProp] = {}
    if (!columnItem.className) columnItem.className = ''
    columnItem.className = `control-${type} control-${prop} ${columnItem.className}`
    const verifyControl = { isControl: true, isForm: false, isList: false }
    //标题处理
    if (hideLabel) {
      columnItem.label = ''
      columnItem.labelWidth = 0
    }
    if (type == 'layoutTable' && !hideLabel) {
      columnItem.labelPosition = 'top'
      columnItem.labelSuffix = ''
    }
    //组件处理
    if (type == 'number' && columnItem.textPosition) {
      columnItem.className = `${columnItem.className} avue-number-position-${columnItem.textPosition}`
      delete columnItem.textPosition
    }
    if (controlType == 'select') {
      const dictTextFormatter = columnItem.dictTextFormatter
      if (['static', 'code'].includes(dicType)) {
        let dicData = cloneDeep(dicType == 'static' ? (columnItem[`${dicType}DicData`] || []) : (dictStore.dictMap[dicCode] || []))
        if (dictTextFormatter) dicData = dicData.map(item => dicFormatterFun(item, { dictTextFormatter, dictText: 'label', dictCode: 'value' }))
        columnItem.dicData = dicData
      }
      if (dicType == 'table' && ['select', 'tree', 'cascader', 'radio', 'checkbox'].includes(type)) {
        const { dictCode, dictTable, dictText } = columnItem
        if (dictCode && dictTable) {
          const fieldCodeList = [dictCode]
          if (dictText) fieldCodeList.push(dictText)
          if (['tree', 'cascader'].includes(type)) fieldCodeList.push('pid')
          const text = encryptAES(JSON.stringify({ dbformId: dictTable, fieldCodeList: [...new Set(fieldCodeList)] }))
          Object.assign(columnItem, {
            dictCode, dictTable, dictText: dictText || dictCode,
            dictType: 'defaultTable',
            dicUrl: `/jeelowcode/dbform-data/list/${dictTable}`,
            dicMethod: 'post',
            props: { label: dictText || dictCode, value: dictCode },
            dicQuery: { jeeLowCode_dictTableField: text },
            dicFormatter: (res) => {
              if (dictTextFormatter) res.records = res.records.map(item => dicFormatterFun(item, { dictTextFormatter, dictText, dictCode }))
              if (['tree', 'cascader'].includes(type)) {
                return listToTree(res.records)
              }
              return res.records
            }
          })
        }
      }
      //处理字典排除值
      if (['static', 'code'].includes(dicType) && columnItem.delDicValue?.length) {
        if (['tree', 'cascader'].includes(type)) {
          const delDic = type == 'tree' ? columnItem.delDicValue : []
          if (type == 'cascader') {
            columnItem.delDicValue.forEach((item) => {
              if (item instanceof Array) delDic.push(item[item.length - 1])
            })
          }
          columnItem.dicData = filter(
            columnItem.dicData,
            (item) => !delDic.includes(item.value),
            { children: 'children', id: 'value' }
          )
        } else {
          columnItem.dicData = columnItem.dicData.filter(item => !columnItem.delDicValue.includes(item.value))
        }
      }
    }
    if (controlType == 'upload') {
      const uploadOption = {
        type: 'upload',
        propsHttp: { url: 'fileUrl' },
        data: { updateSupport: type == 'image' ? 0 : 1 },
        action: '/infra/file/jeelowcode/upload',
        controlType: type,
      }
      Object.assign(columnItem, uploadOption)
      verifyControl.isList = true
    }
    if (type == 'buttonList') {
      params.clickObj = {}
      params.buttonList = params.buttonList.map((btn) => {
        const config = handleStrObj(btn.configStr, `【${btn.label}】 其他配置格式异常，请检查`)
        if (config['handleClick']) {
          params.clickObj[btn.prop] = `${config['handleClick']}`
          delete config['handleClick']
        }
        delete btn.configStr
        Object.assign(btn, config)
        return btn
      })
      verifyControl.isForm = true
    }
    if (type == 'customControl') {
      const { isGlobal, controlUrl, controlName, isList } = columnItem
      if (!isGlobal) {
        if (controlUrl) {
          let random = componentData['pathOnly'][controlUrl]
          if (!random) {
            random = `key_${Math.ceil(Math.random() * 9999999)}`
            componentData['pathOnly'][controlUrl] = random
            componentData[random] = registerComp(controlUrl)
          }
          columnItem.componentKey = random
          verifyControl.isForm = true
          verifyControl.isList = isList
        }
      } else if (controlName) {
        columnItem.component = controlName
        verifyControl.isControl = false
      }
      delete columnItem.controlUrl
      delete columnItem.controlName
    }
    if (type == 'dicTableSelect') {
      const { dictCode, dictTable, dictText } = columnItem
      if (dictCode && dictTable) {
        columnItem.props = { lable: dictText || dictCode, value: dictCode }
        verifyControl.isForm = true
      } else {
        columnItem.type = 'input'
        verifyControl.isControl = false
      }
    }
    if (['userSelect', 'deptSelect', 'dicTableSelect'].includes(type) && parentProp.indexOf('layoutTable') === 0) {
      //表格布局详情模式
      if (type == 'dicTableSelect') {
        //表格选择回显
        columnItem.formatter = (row, value, valueText, column) => {
          if (!value) {
            row[`$${column.prop}`] = ''
            return ''
          }
          const key = `${column.dictTable}&${column.dictText}`
          const { dictTextFormatter, dictCode, dictText } = column
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
      } else {
        //用户、部门回显
        columnItem.formatter = (row, value, valueText, column) => {
          if (!value) {
            row[`$${column.prop}`] = ''
            return ''
          }
          if (typeof value == 'number') value = value + ''
          row[`$${column.prop}`] = value.split(',').map(id => {
            const text = lowStore.dicObj[type]?.[id] || ''
            if (column.textFormatter) {
              const dicItem = dicFormatterFun({ id: id, name: text }, { dictTextFormatter: column.textFormatter, dictText: 'name', dictCode: 'id' })
              return dicItem.name
            }
            return text || id
          }).join(column.separator || ' | ')
          return row[`$${column.prop}`]
        }
      }
    }
    if (['userSelect', 'deptSelect', 'markDown', 'comboBox'].includes(type)) {
      verifyControl.isForm = true
    }
    if (type == 'regionSelect') {
      Object.assign(columnItem, {
        type: 'cascader', lazy: true, dictType: 'region',
        props: { label: 'name', value: 'id' },
        lazyLoad: (node, resolve) => {
          const level = node.level;
          const data = node.data || {}
          let pid = data.id
          const regionType = columnItem.regionType
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
        dataType: columnItem.multiple ? 'json' : 'string',
        formatter: (row, value, valueText, column) => {
          if (!value) {
            row[`$${column.prop}`] = ''
            return ''
          }
          const separator = column.separator || (column.multiple ? ' | ' : '/')
          if (isValidJson(value)) value = JSON.parse(value)
          row[`$${column.prop}`] = (value instanceof Array ? value : value.split(',')).map(id => {
            if (id instanceof Array) return id.map(i => lowStore.dicObj[regionDicKey]?.[i] || i).join('/')
            return lowStore.dicObj[regionDicKey]?.[id] || id
          }).join(separator)
          return row[`$${column.prop}`]
        }
      })
    }
    if (type == 'monacoEditor') {
      const btnKey = ['footerBtn', 'headerBtn']
      params.clickObj = { footerBtn: {}, headerBtn: {} }
      btnKey.forEach(key => {
        if (params[key]) {
          params[key] = params[key].map(btn => {
            if (btn.configStr) {
              const config = handleStrObj(btn.configStr, `${label} 中【${btn.name}】 按钮配置格式异常，请检查`)
              if (config['clickFun']) {
                params.clickObj[key][btn.prop] = `${config['clickFun']}`
                delete config['clickFun']
              }
              delete btn.configStr
              Object.assign(btn, config)
            }
            return btn
          })
        }
      })
      verifyControl.isForm = true
    }
    if (type == 'ueditor') {
      columnItem.action = '/infra/file/jeelowcode/upload'
      columnItem.data = { updateSupport: 0 }
      columnItem.propsHttp = { url: 'fileUrl' }
    }
    //更多组件配置、特殊控件配置处理
    let controlOption = cloneDeep(specialControlObj[type]) || cloneDeep(specialControlObj[controlType]) || []
    if (!specialControlObj[type] && controlType == 'select' && dicType != 'remote') {
      controlOption = []
    }
    if (type == 'select' && dicType != 'remote') controlOption = []
    if (columnItem.moreOptionStr) {
      controlOption.push({ key: 'moreOptionStr', label: '更多组件配置' })
    }
    if (controlOption.length) {
      controlOption.forEach(({ key, label, dataKey }) => {
        if (columnItem[key]) {
          const controlObj = handleStrObj(
            columnItem[key],
            `【${columnItem.label}】 ${label}格式异常，请检查`,
            { requestApi: callApiFun }
          )
          if (dataKey) setDeepObject(columnItem, { [dataKey]: controlObj })
          else Object.assign(columnItem, controlObj)
          delete columnItem[key]
        }
      })
    }
    //占位内容处理
    if (['monacoEditor'].includes(type) && !columnItem.placeholder)
      columnItem.placeholder = `请输入 ${columnItem.label}`
    if (['timerange', 'datetimerange', 'monthrange', 'daterange'].includes(type)) {
      if (!columnItem.startPlaceholder)
        columnItem.startPlaceholder = `请选择 开始${columnItem.label}`
      if (!columnItem.endPlaceholder) columnItem.endPlaceholder = `请选择 结束${columnItem.label}`
    }
    //校验配置
    const trigger = ['select', 'date', 'time', 'upload', 'rate', 'slider'].includes(controlType) ? 'change' : 'blur'
    if (!columnItem.rules) columnItem.rules = []
    if (columnItem.required) {
      const message = trigger == 'change' ? `请${controlType == 'upload' ? '上传' : '选择'}` : '请输入'
      columnItem.rules.push({ required: true, message: `${message} ${label}`, trigger })
    }
    if (columnItem.verifyConfig) {
      let verifyIndex = columnItem.rules.length
      const verifyList = JSON.parse(columnItem.verifyConfig)
      verifyList.forEach(item => {
        if (!item.display || (item.type == 'only' && parentProp.indexOf('layoutTable_') == -1)) return //唯一校验只有表格布局有
        if (['only', 'customRule'].includes(item.type)) {
          if (!ruleObj[parentProp][prop]) ruleObj[parentProp][prop] = []
          ruleObj[parentProp][prop].push({ index: verifyIndex, rule: { trigger }, ruleStr: item.customStr, type: item.type })
        } else if (item.type == 'leng') {
          columnItem.rules.push({ ...patternObj.getLeng(item.leng_min, item.leng_max, item.leng_type), trigger })
        } else if (item.type == 'customRegExp' || patternObj[item.type]) {
          let regExp = patternObj[item.type]
          if (item.regExp) regExp = new RegExp(item.regExp)
          if (regExp) columnItem.rules.push({ pattern: regExp, trigger, message: item.msg || `${label} 格式不对` })
        }
        verifyIndex++
      })
    }
    //表格布局配置处理
    if (type == 'layoutTable' && columnItem.column) {
      const btnKey = ['addBtn', 'delBtn', 'editBtn']
      btnKey.forEach((key) => {
        const currBtn = defaultBtnObj[key]
        let display = columnItem.params[key]
        if (key == 'editBtn' && columnItem.tableType != 'formEdit') display = false
        columnItem.btnData[currBtn.btnKey].splice(0, 0, { ...currBtn, prop: key, display })
        delete columnItem.params[key]
      })
      columnItem.btnClickObj = {}
      columnItem.btnShowObj = {}
      for (const key in columnItem.btnData) {
        columnItem.btnData[key] = columnItem.btnData[key].map((item) => {
          const config = handleStrObj(item.configStr, `【${item.label}】 按钮配置格式异常，请检查`)
          if (config['handleClick']) {
            columnItem.btnClickObj[item.prop] = `${config['handleClick']}`
            delete config['handleClick']
          }
          if (config['handleShow']) {
            columnItem.btnShowObj[item.prop] = `${config['handleShow']}`
            delete config['handleShow']
          }
          delete item.configStr
          Object.assign(item, config)
          if (formType == 'view') {
            if (item.display && item.viewShow) item.display = true
            else item.display = false
            return item
          }
          return item
        })
      }
      control[`layoutTable_${prop}`] = {}
      initColumn(columnItem.column, control, ruleObj, componentData, {
        formType,
        parentProp: `layoutTable_${prop}`,
        isCell: columnItem.tableType == 'cellEdit',
      })
    }
    if (isCell && columnItem.cell === undefined) columnItem.cell = true
    //选项卡布局处理
    if (type == 'layoutTabs') {
      for (const tabKey in columnItem.column) {
        const tabsKey = `layoutTabs_${prop}_${tabKey}`
        control[tabsKey] = {}
        const tabItem = columnItem.column[tabKey]
        tabItem.prop = tabKey
        if (tabItem.column)
          initColumn(tabItem.column, control, ruleObj, componentData, { formType, parentProp: tabsKey })
        if (tabItem.group)
          tabItem.group.forEach((item) =>
            initColumn(item.column, control, ruleObj, componentData, { formType, parentProp: tabsKey })
          )
      }
    }
    if (type == 'comboBox') {
      initColumn(columnItem.column, control, ruleObj, componentData, {
        formType,
        parentProp: `comboBox_${prop}`,
      })
    }
    if (['edit', 'view'].includes(formType)) {
      if (!['title', 'layoutTable'].includes(columnItem.type)) delete columnItem.value //默认值只能对新增生效
      if (formType == 'view' && isCell) columnItem.cell = false
    }
    //表格布局列隐藏处理
    if (columnItem.display === false && parentProp && parentProp.indexOf('layoutTable') === 0) {
      columnItem.hide = true
    }

    const { isControl, isForm, isList } = verifyControl
    if (isControl) {
      if (!control[parentProp]) control[parentProp] = {}
      if (!control[parentProp][type]) control[parentProp][type] = []
      const controlData = { slotList: [] as string[], prop: prop }
      if (isForm) controlData.slotList.push('form')
      if (isList) controlData.slotList.push('list')
      control[parentProp][type].push(controlData)
    }
  }
}
//初始化表单配置
export const initFormOption: (formOption: any, formType: string) => InitFormOption = (
  formOption,
  formType
) => {
  const option = cloneDeep(formOption)
  const control = {}
  const ruleObj = {}
  const componentData = markRaw({ pathOnly: {} })
  if (option.column) {
    initColumn(option.column, control, ruleObj, componentData, { formType, parentProp: 'lowForm' })
  }
  if (option.group) {
    option.group.forEach((item) => {
      item.className = 'control-layoutGroup'
      initColumn(item.column, control, ruleObj, componentData, { formType, parentProp: 'lowForm' })
    })
  }

  const jsEnhance = formOption.jsEnhance
  const scssEnhance = formOption.scssEnhance
  delete option.jsEnhance
  delete option.scssEnhance
  if (formType == 'view') Object.assign(option, { detail: true, submitBtn: false, emptyBtn: false })
  return { option, control, ruleObj, componentData, jsEnhance, scssEnhance }
}
//表单数据格式化
export const formDataFormatting = (formOption, formData, formType) => {
  const echoObj = { userSelect: [], deptSelect: [] }
  const handleValue = (column, data, key, parentType) => {
    const type = column[key]?.type
    if (data[key] === '' || !type) return
    if (['userSelect', 'deptSelect', 'dicTableSelect'].includes(type)) {
      if (data[key] instanceof Array || typeof data[key] == 'number') data[key] = data[key].toString()
      if (type == 'dicTableSelect') {
        const { dictTable, dictCode, dictText } = column[key]
        if (dictTable && dictCode && dictText) {
          const dicKey = `${dictTable}&${dictCode}&${dictText}`
          if (!echoObj[dicKey]) echoObj[dicKey] = []
          echoObj[dicKey].push(...data[key].split(','))
        }
      } else echoObj[type].push(...data[key].split(','))
    } else if (column[key]?.controlType == 'date') {
      if (data[key]) {
        if (typeof data[key] == 'number' || typeof data[key] == 'string') {
          data[key] = data[key] + ''
          if (!(/[-|\/]/g.test(data[key]))) {
            //如果是时间戳强制转换
            data[key] = formatDate(new Date(data[key]), column[key].valueFormat || 'YYYY-MM-DD HH:mm:ss')
          }
        }
      }
    } 
  }

  const setForm = (column, data, parentType?) => {
    for (const key in data) handleValue(column, data, key, parentType)
    for (const prop in column) {
      const { type, value } = column[prop]
      if (formType == 'add' && value) handleValue(column, { [prop]: value }, prop, parentType)
      if (type == 'layoutTable') setTable(column[prop].column, data[prop] || [])
      if (type == 'layoutTabs') setTabs(column[prop].column, data)
      if (type == 'comboBox' && !data[prop]) data[prop] = {}
    }
  }
  const setTable = (column, data) => {
    if (data?.length) data.forEach(item => {
      if (['add', 'edit'].includes(formType) && item.$cellEdit === undefined) {
        item.$cellEdit = true
      }
      setForm(column, item, 'table')
    })
    else setForm(column, {}, 'table')
  }
  const setTabs = (column, data) => {
    for (const tabKey in column) initForm(column[tabKey], data[tabKey] || {})
  }
  const initForm = (option, data) => {
    setForm(option.column, data)
    if (option.group?.length) option.group.forEach((item) => setForm(item.column, data))
  }
  initForm(formOption, formData)

  const dicApiData: any[] = []
  for (const key in echoObj) {
    echoObj[key] = echoObj[key].filter((str) => {
      if (key.indexOf('&') !== -1 && key.split('&')[1] != 'id') return true
      return /^(\d+)$/.test(str + '');
    })
    if (['userSelect', 'deptSelect'].includes(key)) {
      if (echoObj[key].length) {
        dicApiData.push({ [key == 'userSelect' ? 'userIdList' : 'deptIdList']: [...new Set(echoObj[key])] })
      }
    } else if (echoObj[key]?.length) {
      const [dbformId, code, label] = key.split('&')
      dicApiData.push({ dbformId, code, label, dataList: [...new Set(echoObj[key])] })
    }
  }
  if (dicApiData.length) {
    DicApi.getDicTableText({
      jeeLowCode_dictLabel: encryptAES(JSON.stringify(dicApiData))
    }).then(dicData => {
      const dictData = {
        userList: { dicKey: 'userSelect', label: 'nickname' },
        deptList: { dicKey: 'deptSelect', label: 'name' }
      }
      for (const key in dicData) {
        const dicObj = {}
        let label = 'label'
        let dicKey = ''
        if (key.indexOf('&') != -1) {
          dicKey = key
          label = key.split('&')[1]
        } else if (dictData[key]) {
          dicKey = dictData[key].dicKey
          label = dictData[key].label
        }
        dicData[key].forEach(item => dicObj[item.id] = item[label])
        lowStore.setDicObj(dicKey, dicObj)
      }
    })
  }
}

//提交数据格式化
export const submitDataFormatting = (formOption, formData) => {
  const ergColumn = (column, data) => {
    for (const prop in column) {
      const { type } = column[prop]
      //处理清空后值为undefined、null问题
      if (data.hasOwnProperty(prop) && (data[prop] === undefined || data[prop] === null)) {
        data[prop] = ''
      }
      //处理空字符串数组问题
      if (data[prop] === '[]') data[prop] = ''

      //处理地区text
      if (column[prop].dictType == 'region' && type == 'cascader' && data[prop]) {
        const separator = column[prop].separator || (column[prop].multiple ? ' | ' : '/')
        if (isValidJson(data[prop])) data[prop] = JSON.parse(data[prop])
        data[`$${prop}`] = (data[prop] instanceof Array ? data[prop] : data[prop].split(',')).map(id => {
          if (id instanceof Array) return id.map(i => lowStore.dicObj[regionDicKey]?.[i] || i).join('/')
          return lowStore.dicObj[regionDicKey]?.[id] || id
        }).join(separator)
      }

      if (type == 'layoutTable') {
        if (data[prop]?.length) {
          data[prop] = data[prop].map(item => {
            //删除自定义id 防止提交表单报错
            if (item.id && item.id?.toString()?.indexOf('custom_') === 0) {
              delete item.id
            }
            return item
          })
        }
        ergTable(column[prop].column, data[prop] || [])
      }
      if (type == 'layoutTabs') ergTabs(column[prop].column, data)
    }
  }
  const ergTable = (column, data) => {
    if (data?.length) data.forEach(data => ergColumn(column, data))
    else ergColumn(column, {})
  }
  const ergTabs = (column, data) => {
    for (const tabKey in column) ergOption(column[tabKey], data[tabKey] || {})
  }
  const ergOption = (option, data) => {
    ergColumn(option.column, data)
    if (option.group?.length) option.group.forEach((item) => ergColumn(item.column, data))
  }
  ergOption(formOption, formData)
  return formData
}

//查找表单配置对应字段
export const findOptionField = (formOption: object, prop: string, parentProp?: string) => {
  let fieldData: any = null
  let findProp = parentProp || prop
  const eachOption = (obj) => {
    if (fieldData) return
    if (obj.column && Object.keys(obj.column).length) findObject(obj.column)
    if (!fieldData && obj.group) {
      for (const i in obj.group) {
        if (obj.group[i].prop == findProp) {
          fieldData = obj.group[i]
          break
        }
        findObject(obj.group[i].column)
        if (fieldData) break
      }
    }
  }
  const findObject = (obj) => {
    if (fieldData) return
    if (obj[findProp]) return (fieldData = obj[findProp])
    for (const key in obj) {
      const type = obj[key].type
      if (fieldData || !['layoutTable', 'layoutTabs', 'tab'].includes(type)) continue
      eachOption(obj[key])
    }
  }
  eachOption(formOption)
  if (parentProp && fieldData) {
    findProp = prop
    const parentData = fieldData
    fieldData = null
    eachOption(parentData)
  }
  return fieldData
}
//初始化后查找表单配置对应字段
export const findRefOptionField = (data: any, prop: string, parentProp?: string) => {
  const { formOption, formTableRef, formTabsRef } = data
  let fieldData: any = null
  let findProp = parentProp || prop
  const refData = {}
  const setRef = (refObj: object, type: string) => {
    const valueKey = type == 'table' ? 'tableOption' : 'tabsOption'
    if (refObj && Object.keys(refObj).length) {
      for (const key in refObj) {
        refData[key] = refObj[key][valueKey]
        if (type == 'tabs') setRef(refObj[key].formTableRef, 'table')
      }
    }
  }
  const eachOption = (obj) => {
    if (fieldData || !obj) return
    if (obj.column && Object.keys(obj.column).length) findObject(obj.column)
    if (!fieldData && obj.group) {
      for (const i in obj.group) {
        if (obj.group[i].prop == findProp) {
          if (parentProp) {
            const groupKey = obj.group[i].prop
            if (!refData[groupKey]) refData[groupKey] = []
            for (const key in obj.group[i].column) {
              if (['layoutTable', 'layoutTabs'].includes(obj.group[i].column[key].type)) refData[groupKey].push(key)
            }
          }
          fieldData = obj.group[i]
        }
        findObject(obj.group[i].column)
        if (fieldData) break
      }
    }
  }
  const findObject = (column) => {
    if (fieldData && findProp != parentProp) return
    if (column[findProp]) fieldData = column[findProp]
    if (!fieldData) {
      for (const key in column) {
        const type = column[key].type
        if (['layoutTable', 'layoutTabs'].includes(type)) eachOption(refData[column[key].prop])
        else if (type == 'tab') eachOption(column[key])
        if (fieldData) break
      }
    }
    if (fieldData && findProp == parentProp) {
      findProp = prop
      const curType = fieldData.type
      const curProp = fieldData.prop
      if (curType == 'tab') refData[curProp] = fieldData
      fieldData = null
      if (curType == 'layoutGroup') {
        for (const i in refData[curProp]) {
          const key = refData[curProp][i]
          eachOption(refData[key])
          if (fieldData) break
        }
      } else if (['layoutTable', 'layoutTabs', 'tab'].includes(curType)) eachOption(refData[curProp])
    }
  }
  setRef(formTableRef, 'table')
  setRef(formTabsRef, 'tabs')
  eachOption(formOption)
  return fieldData
}

