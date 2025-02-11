import { verifyReportCode } from '@/api/design/report';
import { cloneDeep } from 'lodash-es';
// 数据字典
export const dicObj = {
  dic_whether: [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ],
  tableSelect: [
    { label: '多选', value: 'multiple' },
    { label: '单选', value: 'radio' },
    { label: '禁用', value: 'disabled' },
  ],
  dataConfig: [
    { label: '分页', value: 'page' },
  ],
  dataConfigSelect: [
    { label: '需登录', value: 'authFalse', desc: '访问该表接口：需登录' },
    { label: '需登录、鉴权', value: 'authTrue', desc: '访问该表接口：需登录并且需要配置菜单权限' },
    { label: '不登录可查询数据', value: 'authOpen', desc: '访问该表查询接口：不需要登录' },
  ],
  tableConfig: [
    { label: '固定表格高度', value: 'height' },
    { label: '序号列', value: 'index' },
    { label: '纵向边框', value: 'border' },
    { label: '斑马纹样式', value: 'stripe' },
  ],
  fieldType: [
    { label: '字符串 String', value: 'String' },
    { label: '整数 Integer', value: 'Integer' },
    { label: '大整数 BigInt', value: 'BigInt' },
    { label: '小数 BigDecimal', value: 'BigDecimal' },
    { label: '日期 Date', value: 'Date' },
    { label: '时间 Time', value: 'Time' },
    { label: '日期时间 DateTime', value: 'DateTime' },
    { label: '文本 Text', value: 'Text' },
    { label: '大文本 LongText', value: 'LongText' },
    { label: '二进制 Blob', value: 'Blob' },
  ],
  cellWidthType: [
    { label: '固定', value: 'fixed' },
    { label: '最小', value: 'min' },
  ],
  queryMode: [
    { label: '精确查询', value: 'EQ' },
    { label: '模糊查询', value: 'LIKE' },
    { label: '范围查询（仅适用于日期、时间、数字）', value: 'RANGE' },
  ],
}
export const getDicObj = (key) => {
  const obj = {}
  if (dicObj[key]) dicObj[key].forEach(item => obj[item.value] = item.label)
  return obj
}

const rules_required = (label, type = '') => [{ required: true, message: `${['select'].includes(type) ? '请选择' : '请输入'} ${label}`, trigger: "blur" }]
const reportCode_required = async (rule, value, callback) => {
  if (value === '') callback(new Error('请输入 报表编码'));
  else {
    const bool = await verifyReportCode(value)
    if (bool) callback(new Error('报表编码已存在，请修改'));
    else callback()
  }
};

const dataOriginObj = {}
const dataOrigin_dicFormatter = (data) => {
  const sysList: any[] = []
  const dbList: any[] = []
  data.forEach(item => {
    const row = {
      label: `${item.tableName}（${item.tableDescribe}）`,
      tableText: item.tableDescribe,
      tableName: item.tableName,
      value: item.tableId,
      type: 'table',
      fieldList: item.fieldModelList.map(child => {
        let label = child.fieldCode
        if (child.fieldName) label = `${label}（${child.fieldName}）`
        return { label, value: child.fieldCode, tableName: item.tableName, type: 'field', fieldType: child.fieldType }
      })
    }
    if (item.tableId == item.tableName) sysList.push(row)
    else if (item.tableName.indexOf('view_') !== 0) dbList.push(row)
    dataOriginObj[item.tableId] = row
  })
  return [
    { label: '系统表', value: 'sys', disabled: true, children: sysList },
    { label: '表单开发', value: 'dbForm', disabled: true, children: dbList },
  ]
}

//表格配置
const tableOptionColumn = {
  reportName: { label: '报表名称', display: false, search: true, minWidth: 140 },
  reportCode: { label: '报表编码', display: false, search: true, minWidth: 140, overHidden: true },
  javaConfig: { label: 'JAVA类路径', display: false, search: true, minWidth: 140, overHidden: true, searchLabelWidth: 100, },
  createTime: { label: '创建时间', type: 'datetime', format: 'YYYY-MM-DD HH:mm:ss', valueFormat: 'x', display: false, width: 160 },
  custom_form: { label: '', labelWidth: 0, span: 24, hide: true, showColumn: false },
  custom_info: { label: '', labelWidth: 0, span: 24, hide: true, showColumn: false }
}
// 表单配置
const customFormColumn = {
  reportName: { label: '报表名称', rules: rules_required('报表名称') },
  reportCode: { label: '报表编码', rules: [...rules_required('报表编码'), { validator: reportCode_required, trigger: 'blur', required: true }] },
  groupReportId: { label: '分组类型', type: 'tree', value: '', dicData: [], filterable: true, defaultExpandAll: true, props: { label: 'name', value: 'id' } },
  dataOrigin: { label: '数据来源', type: 'tree', value: '', span: 12, dataType: 'string', multiple: true, filterable: true, parent: false, defaultExpandAll: true, dicUrl: '/jeelowcode/dbform/get/all-table', dicQuery: { systemFlag: 'Y' }, dicFormatter: dataOrigin_dicFormatter },
  originButton: { label: '', labelWidth: 0, },
  javaConfig: { label: 'JAVA类路径', span: 12 },
  dataConfig: { label: '数据配置', type: 'checkbox', span: 24, dicData: dicObj.dataConfig, dataType: 'string', value: ['page', 'authFalse'] },
  tableConfig: { label: '表格配置', type: 'checkbox', span: 24, dicData: dicObj.tableConfig, dataType: 'string', value: ['height', 'header', 'menu', 'index', 'border'] },
}

const infoColumn = {
  fieldColumn: {
    fieldCode: { title: '字段编码', minWidth: 120, editRender: { name: 'LowInput', verifyEdit: true } },
    fieldName: { title: '字段名称', minWidth: 120, editRender: { name: 'LowInput' } },
    fieldType: { title: '字段类型', minWidth: 100, editRender: { name: 'LowSelect', verifyEdit: true, dicData: dicObj.fieldType, dicObj: getDicObj('fieldType') } },
    queryIsDb: { title: '接口查询', width: 75, align: "center", editRender: { name: 'LowCheckbox' } },
    queryIsWeb: { title: '查询控件', width: 75, align: "center", editRender: { name: 'LowCheckbox' } },
    queryMode: { title: '查询模式', width: 130, editRender: { name: 'LowSelect', verifyEdit: true, dicData: dicObj.queryMode, dicObj: getDicObj('queryMode') } },
    dictCode: { title: '字典Code', width: 180, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, noStop: true, dicData: [] } },
    isExport: { title: '是否可导出', width: 90, align: "center", editRender: { name: 'LowCheckbox' } },
    isShowSort: { title: '是否排序', width: 75, align: "center", editRender: { name: 'LowCheckbox' } },
  },
}

const infoApiKey = {}
const apiKey = { fieldColumn: 'fieldList' }
for (const key in infoColumn) {
  if (apiKey[key]) {
    const keys = Object.keys(infoColumn[key])
    if (key == 'fieldColumn') keys.push('sortNum')
    infoApiKey[apiKey[key]] = keys
  }
}

//默认值
const infoDefaultData = {
  basics: {
    fieldCode: '', fieldName: '', fieldType: 'String', queryIsDb: 'N', queryIsWeb: 'N', queryMode: 'LIKE', dictCode: '', isExport: 'Y', isShowSort: 'N',
  },
}


//格式化接口初始数据
const formattingInitData = (editInfoData) => {
  const optionObj = {}

  for (const apiKey in infoApiKey) {
    const key = apiKey
    optionObj[key] = {}
    editInfoData[key]?.forEach(item => optionObj[key][item.fieldCode] = item)
  }

  const infoData = [] as any
  editInfoData.fieldList.forEach(fieldItem => {
    const fieldCode = fieldItem.fieldCode
    const infoItem: any = {}

    for (const apiKey in infoApiKey) {
      const dataKey = apiKey
      if (!optionObj[dataKey]) continue
      const editItem = optionObj[dataKey][fieldCode] || cloneDeep(infoDefaultData)

      infoItem[`${apiKey}_id`] = editItem.id
      for (const i in infoApiKey[apiKey]) {
        const key = infoApiKey[apiKey][i]
        if (apiKey != 'fieldList' && ['fieldCode', 'fieldName'].includes(key)) continue
        infoItem[key] = editItem[key]
      }
    }
    infoData.push(infoItem)
  })
  return { infoData }
}

export const pageOption = {
  tableOptionColumn, customFormColumn, dataOriginObj,
  infoApiKey,
  reportCode_required
}
export const tableInfoOption = {
  infoColumn,
  infoDefaultData,
  formattingInitData,
}
