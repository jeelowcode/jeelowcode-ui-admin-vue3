import { verifyDbName } from '@/api/design/table';
import { cloneDeep } from 'lodash-es';
// 数据字典
export const dicObj = {
  dic_whether: [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ],
  tableType: [
    { label: '单表', value: 1 },
    { label: '树表', value: 2 },
    { label: '主表', value: 3 },
    { label: '附表', value: 4 },
  ],
  tableClassify: [
    { label: '业务表', value: 1 },
    { label: '表视图', value: 2 },
  ],
  is_db_sync: [
    { label: '已同步', value: 'Y' },
    { label: '未同步', value: 'N' },
  ],
  tableIdType: [
    { label: 'ID_WORKER(分布式自增)', value: 'NATIVE' },
  ],
  themeTemplate: [
    { label: '默认主题', value: 'normal' },
    { label: 'ERP主题', value: 'erp' },
    { label: '内嵌子表主题', value: 'innerTable' },
  ],
  searchStyle: [
    { label: '表格顶部', value: 'default' },
    { label: '表格内嵌', value: 'inline' },
  ],
  treeStyle: [
    { label: '默认样式', value: 'default' },
    { label: '左树右表', value: 'around' },
  ],
  treeMode: [
    { label: '默认', value: 'default' },
    { label: '懒加载', value: 'treeLazy' },
  ],
  tableSelect: [
    { label: '多选', value: 'multiple' },
    { label: '单选', value: 'radio' },
    { label: '禁用', value: 'disabled' },
  ],
  subTableMapping: [
    { label: '一对多', value: 'many' },
    { label: '一对一', value: 'one' },
  ],
  operateMenuStyle: [
    { label: '横向排列', value: 'normal' },
    { label: '更多下拉', value: 'more' },
  ],
  singleStyle: [
    { label: '默认表格', value: 'default' },
    { label: '可展开表格', value: 'expand' },
    { label: '卡片表格', value: 'card' },
  ],
  singleCardSpan: [
    { label: '一列', value: 1 },
    { label: '二列', value: 2 },
    { label: '三列', value: 3 },
    { label: '四列', value: 4 },
    { label: '六列', value: 6 },
    { label: '八列', value: 8 },
    { label: '十二列', value: 12 },
  ],
  expandMode: [
    { label: '默认', value: 'default' },
    { label: '手风琴', value: 'accordion' }
  ],
  formStyle: [
    { label: '一列', value: 1 },
    { label: '二列', value: 2 },
    { label: '三列', value: 3 },
    { label: '四列', value: 4 },
  ],
  dataConfig: [
    { label: '分页', value: 'page' },
    { label: '初始数据请求', value: 'initDataReq' },
  ],
  dataConfigSelect: [
    { label: '需登录', value: 'authFalse', desc: '访问该表接口：需登录' },
    { label: '需登录、鉴权', value: 'authTrue', desc: '访问该表接口：需登录并且需要配置菜单权限' },
    { label: '不登录可查询、新增数据', value: 'authOpen', desc: '访问该表查询、新增接口：不需要登录' },
  ],
  tableConfig: [
    { label: '固定表格高度', value: 'height' },
    { label: '表格头部操作', value: 'header' },
    { label: '操作列', value: 'menu' },
    { label: '序号列', value: 'index' },
    { label: '纵向边框', value: 'border' },
    { label: '斑马纹样式', value: 'stripe' },
    { label: '表格滚动条固定在底部', value: 'rollBottom' },
  ],
  basicFunction: [
    { label: '新增', value: 'addBtn' },
    { label: '编辑', value: 'editBtn' },
    { label: '查看', value: 'viewBtn' },
    { label: '删除', value: 'delBtn' },
    { label: '批量删除', value: 'batchDelBtn' },
    { label: '导入', value: 'importBtn' },
    { label: '导出', value: 'exportBtn' },
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
  controlType: [
    { label: '文本输入框', value: 'input' },
    { label: '数字输入框', value: 'number' },
    { label: '下拉选择框', value: 'select' },
    { label: '单选框', value: 'radio' },
    { label: '多选框', value: 'checkbox' },
    { label: '日期', value: 'date' },
    { label: '时间', value: 'time' },
    { label: '开关', value: 'switch' },
    { label: '文件', value: 'file' },
    { label: '图片', value: 'image' },
    { label: '树型选择框', value: 'tree' },
    { label: 'Cascader级联选择框', value: 'cascader' },
    { label: '表格选择框', value: 'dicTableSelect' },
    { label: '用户选择框', value: 'userSelect' },
    { label: '部门选择框', value: 'deptSelect' },
    { label: '地区选择框', value: 'regionSelect' },
    { label: '代码编辑器', value: 'monacoEditor' },
    { label: '富文本', value: 'ueditor' },
    { label: 'MarkDown编辑器', value: 'markDown' },
    { label: '自定义控件', value: 'customControl' },
  ],
  dictType: [
    { label: '系统字典', value: 'dict' },
    { label: '表格数据', value: 'table' },
  ],
  dictTextFormatter: [
    { label: '字典Code-字典Text', value: '{dicCode}-{dicText}' },
    { label: '字典Text-字典Code', value: '{dicText}-{dicCode}' },
    { label: '字典Text(字典Code)', value: '{dicText}({dicCode})' },
    { label: '字典Text[字典Code]', value: '{dicText}[{dicCode}]' },
    { label: '其他格式请自行输入', value: 'custom-tip-1', disabled: true },
    { label: '例如：code：{dicCode}，text：{dicText}', value: 'custom-tip-2', disabled: true },
    { label: '效果：code：1001，text：小明', value: 'custom-tip-3', disabled: true },

  ],
  queryMode: [
    { label: '精确查询', value: 'EQ' },
    { label: '模糊查询', value: 'LIKE' },
    { label: '范围查询（仅适用于控件类型为：日期、时间、数字）', value: 'RANGE' },
  ],
  indexType: [
    { label: 'normal', value: 'normal' },
    { label: 'unique', value: 'unique' },
  ],
  summaryType: [
    { label: '合计', value: 'sum' },
    { label: '平均', value: 'avg' },
    { label: '最大值', value: 'max' },
    { label: '最小值', value: 'min' },
    { label: '自定义SQL', value: 'custom' },
  ],
  orderByType: [
    { label: '升序', value: 'asc' },
    { label: '降序', value: 'desc' },
  ],
  summaryControl: [
    { label: '文本', value: 'text' },
    { label: '卡片', value: 'card' },
    { label: '折线图', value: 'line' },
    { label: '柱状图', value: 'bar' },
    { label: '饼图', value: 'pie' },
  ],
  virtualType: [
    { label: 'SQL函数处理', value: 'fun' },
    { label: 'SQL处理', value: 'sql' },
    { label: 'JAVA处理', value: 'java' },
  ],
  indexFieldDefault: [] as any[]
}
export const getDicObj = (key) => {
  const obj = {}
  if (dicObj[key]) dicObj[key].forEach(item => obj[item.value] = item.label)
  return obj
}

const control_tableType = (val) => {
  dicObj.dataConfig = dicObj.dataConfig.map(item => {
    if (item.value == 'page') {
      item['disabled'] = val == 2
    }
    return item
  })
  dicObj.tableSelect = dicObj.tableSelect.map(item => {
    if (item.value == 'radio') {
      item['disabled'] = val == 2
    }
    return item
  })
  dicObj.basicFunction = dicObj.basicFunction.filter(item => {
    if (item.value == 'addChild') return false
    return true
  })
  if (val == 2) {
    dicObj.basicFunction.splice(1, 0, { label: '新增子级', value: 'addChild' })
    dicObj.basicFunction = [...dicObj.basicFunction]
  }
  return {
    themeTemplate: { disabled: val != 3 },
    treeLabelField: { display: val == 2 },
    subTableTitle: { display: val == 4 },
    isDesForm: { display: val != 4 },
    dataConfig: { dicData: dicObj.dataConfig },
    tableSelect: { dicData: dicObj.tableSelect },
    basicFunction: { dicData: dicObj.basicFunction },
  }
}

const control_tableClassify = (val) => {
  return {
    dataOrigin: { display: val == 2 },
    originButton: { display: val == 2 },
  }
}

const control_isDesForm = (val) => {
  return {
    desformWebId: { display: val == 'Y' }
  }
}
const rules_required = (label, type = '') => [{ required: true, message: `${['select'].includes(type) ? '请选择' : '请输入'} ${label}`, trigger: "blur" }]
const tableName_required = async (rule, value, callback) => {
  const regExp = /^[a-z][a-z0-9_]*$/
  if (value === '') callback(new Error('请输入 表名'));
  else if (!regExp.test(value)) callback(new Error('表名只能使用小写字母、数字、下划线，并以字母开头'));
  else {
    const bool = await verifyDbName(value)
    if (bool) callback(new Error('表名已存在，请修改'));
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
    { label: '系统表', value: 'sys', children: sysList },
    { label: '表单开发', value: 'dbForm', children: dbList },
  ]
}

//表格配置
const tableOptionColumn = {
  lowSelectRadio: { label: '', display: false, width: 50, overHidden: false, fixed: true, showColumn: false },
  id: { label: '表ID', display: false, search: true, width: 100, overHidden: true },
  tableName: { label: '表名', display: false, search: true, minWidth: 140 },
  tableDescribe: { label: '表描述', display: false, search: true, minWidth: 180, overHidden: true },
  tableType: { label: '表类型', display: false, value: 1, search: true, type: 'select', dicData: dicObj.tableType, width: 70 },
  tableClassify: { label: '表分类', display: false, value: 1, search: true, type: 'select', dicData: dicObj.tableClassify, width: 70 },
  isDbSync: { label: '同步状态', display: false, type: 'select', search: true, dicData: dicObj.is_db_sync, width: 85 },
  optionCondition: { label: '配置情况', display: false, width: 180, className: 'option-condition-td' },
  custom_form: { label: '', labelWidth: 0, span: 24, hide: true, showColumn: false },
  custom_info: { label: '', labelWidth: 0, span: 24, hide: true, showColumn: false }
}
// 表单配置
const customFormColumn = {
  tableName: { label: '表名', rules: [{ validator: tableName_required, trigger: 'blur', required: true }] },
  tableDescribe: { label: '表描述', rules: rules_required('表描述') },
  // tableIdType: { label: '主键类型', type: 'select', value: 'NATIVE', dicData: dicObj.tableIdType, clearable: false },
  groupDbformId: { label: '分组类型', type: 'tree', value: '', dicData: [], filterable: true, defaultExpandAll: true, props: { label: 'name', value: 'id' } },
  tableType: { label: '表类型', type: 'select', value: 1, dicData: dicObj.tableType, control: control_tableType, clearable: false },
  subTableTitle: { label: '附表-Tab标题', display: false },
  tableClassify: { label: '表分类', type: 'select', value: 1, dicData: dicObj.tableClassify, control: control_tableClassify, clearable: false },
  dataOrigin: { label: '数据来源', type: 'tree', value: '', display: false, span: 12, dataType: 'string', multiple: true, filterable: true, parent: false, defaultExpandAll: true, dicUrl: '/jeelowcode/dbform/get/all-table', dicQuery: { systemFlag: 'Y' }, dicFormatter: dataOrigin_dicFormatter },
  originButton: { label: '', labelWidth: 0, display: false },
  themeTemplate: { label: '主题模板', type: 'select', disabled: true, value: 'normal', dicData: dicObj.themeTemplate, clearable: false },
  treeLabelField: { label: '树表回显字段', display: false, value: '', type: 'select', dicData: [], clearable: false, rules: rules_required('树表回显字段', 'select'), },
  treeStyle: { label: '树表样式', display: false, value: 'default', type: 'select', dicData: dicObj.treeStyle, clearable: false },
  treeMode: { label: '树表模式', display: false, value: 'default', type: 'select', dicData: dicObj.treeMode, clearable: false },
  tableSelect: { label: '表格选择', type: 'select', value: 'multiple', display: false, dicData: dicObj.tableSelect },
  operateMenuStyle: { label: '操作栏样式', type: 'select', value: 'more', display: false, dicData: dicObj.operateMenuStyle, clearable: false },
  tableStyle: { label: '单表样式', display: false },
  formStyle: { label: '表单风格', type: 'select', value: 2, dicData: dicObj.formStyle, clearable: false },
  isDesForm: { label: '默认表单', type: 'select', value: 'N', control: control_isDesForm, clearable: false, dicData: [{ label: '是', value: 'N' }, { label: '否', value: 'Y' }] },
  desformWebId: { label: '自定义表单', display: false, type: 'select', filterable: true, rules: rules_required('自定义表单', 'select'), dicUrl: '/jeelowcode/desform/page', dicMethod: 'post', props: { label: 'desformName', value: 'id' }, dicFormatter: (data) => data.records },
  subTableListStr: { label: '关联的附表', display: false, span: 24, disabled: true },
  dataConfig: { label: '数据配置', type: 'checkbox', span: 24, dicData: dicObj.dataConfig, dataType: 'string', value: ['page', 'initDataReq', 'authFalse'] },
  tableConfig: { label: '表格配置', type: 'checkbox', span: 24, dicData: dicObj.tableConfig, dataType: 'string', value: ['height', 'header', 'menu', 'index', 'border', 'rollBottom'] },
  basicFunction: { label: '基础功能', type: 'checkbox', span: 18, dicData: dicObj.basicFunction, dataType: 'string', value: 'addBtn,editBtn,viewBtn,delBtn,batchDelBtn,importBtn,exportBtn' },
  basicConfig: { label: '', labelWidth: 0, span: 6, params: { otherParams: { type: 'default', width: '620px', tipKeyList: ['tableOption'] }, dialogParams: { closeOnClickModal: true, closeOnPressEscape: true } } },
}

const infoColumn = {
  mysqlColumn: {
    fieldCode: { title: '字段编码', minWidth: 120, editRender: { name: 'LowInput', verifyEdit: true } },
    fieldName: { title: '字段名称', minWidth: 120, editRender: { name: 'LowInput' } },
    fieldType: { title: '字段类型', minWidth: 100, editRender: { name: 'LowSelect', verifyEdit: true, dicData: dicObj.fieldType, dicObj: getDicObj('fieldType') } },
    fieldDefaultVal: { title: '默认值', minWidth: 120, editRender: { name: 'LowInput', verifyEdit: true } },
    fieldLen: { title: '字段长度', minWidth: 80, editRender: { name: 'LowNumber', verifyEdit: true } },
    fieldPointLen: { title: '小数位数', minWidth: 80, editRender: { name: 'LowNumber', verifyEdit: true } },
    fieldRemark: { title: '备注', minWidth: 120, editRender: { name: 'LowInput' } },
    isPrimaryKey: { title: '是否主键', width: 54, align: "center", editRender: { name: 'LowCheckbox', verifyEdit: true } },
    isNull: { title: '是否为空', width: 54, align: "center", editRender: { name: 'LowCheckbox', verifyEdit: true } },
    isDb: { title: '同步数据库', width: 64, align: "center", editRender: { name: 'LowCheckbox', verifyEdit: true } },
  },
  viewColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    isShowList: { title: '列表显示', width: 54, align: "center", editRender: { name: 'LowCheckbox' }, titleSuffix: { content: '控制表格列是否显示' } },
    isDbSelect: { title: '字段显示', width: 54, align: "center", editRender: { name: 'LowCheckbox', verifyEdit: true, }, titleSuffix: { content: '控制接口是否返回该字段' } },
    isShowForm: { title: '表单显示', width: 54, align: "center", editRender: { name: 'LowCheckbox', verifyEdit: true, } },
    isRequired: { title: '是否必填', width: 54, align: "center", editRender: { name: 'LowCheckbox', verifyEdit: true, } },
    cellWidthType: { title: '列宽类型', width: 100, align: "center", editRender: { name: 'LowSelect', dicData: dicObj.cellWidthType, dicObj: getDicObj('cellWidthType') } },
    cellWidth: { title: '列宽', width: 80, align: "center", editRender: { name: 'LowInput', placeholder: '120' } },
    controlType: { title: '控件类型', width: 140, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, dicData: dicObj.controlType, dicObj: getDicObj('controlType'), events: {} } },
    controlsConfig: { title: '控件配置', minWidth: 100, editRender: { name: 'LowClickInput', events: {} } },
    verifyConfig: { title: '校验配置', minWidth: 100, editRender: { name: 'LowClickInput', events: {} } },
    isShowSort: { title: '是否排序', width: 54, align: "center", editRender: { name: 'LowCheckbox' } },
    isShowColumn: { title: '是否可控', width: 54, align: "center", editRender: { name: 'LowCheckbox' } },
  },
  queryColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    isShowList: { title: '列表显示', width: 54, align: "center", cellRender: { name: 'LowCheckbox' } },
    queryIsDb: { title: '接口查询', width: 54, align: "center", editRender: { name: 'LowCheckbox' } },
    queryIsWeb: { title: '查询控件', width: 54, align: "center", editRender: { name: 'LowCheckbox' } },
    queryDefaultVal: { title: '查询控件默认值', width: 160, editRender: { name: 'LowInput' } },
    queryMode: { title: '查询模式', width: 130, editRender: { name: 'LowSelect', dicData: dicObj.queryMode, dicObj: getDicObj('queryMode') } },
    queryConfig: { title: '查询配置', minWidth: 100, editRender: { name: 'LowClickInput', events: {} } },
  },
  dicColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    dictType: { title: '字典类型', width: 140, editRender: { name: 'LowSelect', verifyEdit: true, events: {}, dicData: dicObj.dictType, dicObj: getDicObj('dictType') } },
    dictCode: { title: '字典Code', width: 180, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, typeKey: 'dictType', dicData: [] } },
    dictTable: { title: '字典Table', width: 230, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, typeKey: 'dictType', dicData: [] } },
    dictText: { title: '字典Text', width: 180, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, typeKey: 'dictType', dicData: [] } },
    dictTextFormatter: { title: '字典Text格式化', width: 180, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, allowCreate: true, dicData: dicObj.dictTextFormatter, dicObj: getDicObj('dictTextFormatter') } },
    dictTableColumn: { title: '字典显示列', editRender: { name: 'LowSelect', verifyEdit: true, multiple: true, filterable: true, typeKey: 'dictType', dicData: [] } },
  },
  expColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    isShowList: { title: '列表显示', width: 74, align: "center", cellRender: { name: 'LowCheckbox' } },
    isExport: { title: '是否可导入/导出', width: 140, align: "center", editRender: { name: 'LowCheckbox' } },
    importExampleTxt: { title: '导入模板示例文本', minWidth: 120, editRender: { name: 'LowInput' } },
  },
  keyColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    mainTable: { title: '外键-主表名', width: 230, editRender: { name: 'LowSelect', verifyEdit: true, filterable: true, dicData: [], events: {} } },
    mainField: { title: '外键-主键字段', editRender: { name: 'LowSelect', verifyEdit: true, dicData: [], events: {} } },
  },
  summaryBottomColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    summaryShow: { title: '显示统计', width: 80, align: "center", editRender: { name: 'LowCheckbox' } },
    summaryLabel: { title: '统计名称', width: 160, editRender: { name: 'LowInput' } },
    summarySql: { title: '统计执行sql', minWidth: 120, editRender: { name: 'LowSummaryBottomSql', dicData: dicObj.summaryType, dicObj: getDicObj('summaryType') } },
  },
  summaryTopColumn: {
    summaryShow: { title: '显示统计', width: 80, align: "center", editRender: { name: 'LowCheckbox' } },
    summarySpan: { title: '统计栅格', width: 80, align: 'center', editRender: { name: 'LowNumber', params: { min: 1, max: 24 } } },
    summaryLabel: { title: '统计名称', width: 160, editRender: { name: 'LowInput' } },
    summaryControl: { title: '统计控件类型', width: 120, align: 'center', cellRender: { name: 'LowSelect', dicData: dicObj.summaryControl, dicObj: getDicObj('summaryControl') } },
    summarySql: { title: '统计SQL配置', minWidth: 100, editRender: { name: 'LowClickInput', events: {} } },
  },
  virtualColumn: {
    fieldCode: { title: '字段编码', width: 140 },
    fieldName: { title: '字段名称', width: 140 },
    virtualType: { title: '处理方式', width: 140, align: 'center', editRender: { name: 'LowSelect', dicData: dicObj.virtualType, dicObj: getDicObj('virtualType') } },
    virtualValue: { title: '处理配置', minWidth: 140, editRender: { name: 'virtualInput', events: {} } },
  },
  indexColumn: {
    indexName: { title: '索引名称', width: 180, editRender: { name: 'LowInput' } },
    indexType: { title: '索引类型', width: 180, editRender: { name: 'LowSelect', dicData: dicObj.indexType } },
    indexFieldCodeList: { title: '索引字段列表', editRender: { name: 'LowSelect', multiple: true, filterable: true, dicData: [] } }
  },
}

const infoApiKey = {}
const indexApiKey = Object.keys(infoColumn.indexColumn)
const apiKey = { mysqlColumn: 'fieldList', viewColumn: 'webList', queryColumn: 'queryList', dicColumn: 'dictList', expColumn: 'exportList', keyColumn: 'foreignkeyList', summaryBottomColumn: 'summaryList' }
for (const key in infoColumn) {
  if (apiKey[key]) {
    const keys = Object.keys(infoColumn[key])
    if (key == 'mysqlColumn') keys.push('sortNum')
    infoApiKey[apiKey[key]] = keys
  }
}

const disabledArr = ['id', 'tenant_id', 'create_user', 'create_time', 'create_dept', 'update_user', 'update_time', 'pid', 'is_deleted']

//默认值
const infoDefaultData = {
  basics: {
    fieldCode: '', fieldName: '', fieldLen: 128, fieldPointLen: 0, fieldDefaultVal: '', fieldType: 'String', fieldRemark: '', isPrimaryKey: 'N', isNull: 'Y', isDb: 'Y',
    isShowList: 'Y', isDbSelect: 'Y', isShowForm: 'Y', isRequired: 'N', cellWidthType: 'min', controlType: 'input', isShowSort: 'N', isShowColumn: 'Y',
    queryIsDb: 'N', queryIsWeb: 'N', queryMode: 'EQ', queryConfig: '',
    dictType: '', dictCode: '', dictTable: '', dictText: '', dictTextFormatter: '', dictTableColumn: [],
    isExport: 'Y', importExampleTxt: '',
    mainTable: '', mainField: '',
    summaryShow: 'N', summaryLabel: '', summarySql: '', summaryJson: { sqlType: '', sqlValue: '' },
    virtualType: '', virtual_java_str: '', virtual_sql_str: '', virtual_fun_str: '', virtualValue: ''
  },
  index: { indexName: '', indexFieldCodeList: [], indexType: 'normal' },
  summaryTop: { summaryShow: 'Y', summarySpan: 8, summaryControl: 'text', summaryLabel: '', summarySql: '', }
}


//获取默认字段配置
const getDefaultMysqlField = (type?: string) => {
  let fieldObj = {}
  if (type == 'tree') {
    fieldObj = {
      pid: { fieldName: '父级节点', fieldType: 'BigInt', fieldDefaultVal: 0, isShowList: 'N', isShowForm: 'Y', only: true, is_tree_field: true, queryIsDb: 'Y' },
    }
  } else {
    fieldObj = {
      id: { fieldName: '主键', fieldType: 'BigInt', isPrimaryKey: 'Y', isNull: 'N', isShowList: 'N', isShowForm: 'N', isExport: 'N', queryIsDb: 'Y', isShowColumn: 'N', dictType: '', only: true },
      tenant_id: { fieldName: '租户编号', fieldType: 'BigInt', isShowList: 'N', isShowForm: 'N', isExport: 'N', isShowColumn: 'N', dictType: '', only: true },
      create_user: { fieldName: '创建人', fieldType: 'BigInt', isShowList: 'N', isShowForm: 'N', controlType: 'userSelect', isExport: 'N', queryIsDb: 'Y', isShowColumn: 'N', dictType: '', only: true },
      create_time: { fieldName: '创建时间', fieldType: 'DateTime', isShowList: 'N', isShowForm: 'N', controlType: 'date', isExport: 'N', queryIsDb: 'Y', isShowColumn: 'N', dictType: '', only: true },
      create_dept: { fieldName: '创建部门id', fieldType: 'BigInt', isShowList: 'N', isShowForm: 'N', controlType: 'deptSelect', isExport: 'N', queryIsDb: 'Y', isShowColumn: 'N', dictType: '', only: true },
      update_user: { fieldName: '更新人', fieldType: 'BigInt', isShowList: 'N', isShowForm: 'N', controlType: 'userSelect', isExport: 'N', queryIsDb: 'Y', isShowColumn: 'N', dictType: '', only: true },
      update_time: { fieldName: '更新时间', fieldType: 'DateTime', isShowList: 'N', isShowForm: 'N', controlType: 'date', isExport: 'N', queryIsDb: 'Y', isShowColumn: 'N', dictType: '', only: true },
      is_deleted: { fieldName: '是否删除', fieldType: 'Integer', fieldLen: 2, fieldDefaultVal: 0, isShowList: 'N', isShowForm: 'N', isShowColumn: 'N', isExport: 'N', queryIsDb: 'Y', dictType: '', only: true },
    }
  }
  const defaultFieldData: any[] = []
  for (const key in fieldObj) defaultFieldData.push({ ...cloneDeep(infoDefaultData.basics), ...fieldObj[key], fieldCode: key, })
  return defaultFieldData
}

getDefaultMysqlField().forEach(item => {
  if (item.fieldCode == 'id') return
  dicObj.indexFieldDefault.push({ label: `${item.fieldCode}（${item.fieldName}）`, value: item.fieldCode, type: item.fieldType })
})

//格式化接口初始数据
const formattingInitData = (editInfoData) => {
  const optionObj = {}
  const infoData = [] as any
  const indexData = [] as any
  const summaryTopData = [] as any
  for (const apiKey in infoApiKey) {
    let key = apiKey
    if (apiKey == 'summaryList') key = 'summaryBottomList'
    optionObj[key] = {}
    editInfoData[key]?.forEach(item => optionObj[key][item.fieldCode] = item)
  }

  editInfoData.fieldList.forEach(fieldItem => {
    const fieldCode = fieldItem.fieldCode
    const infoItem: any = {}
    for (const apiKey in infoApiKey) {
      let dataKey = apiKey
      if (apiKey == 'summaryList') dataKey = 'summaryBottomList'
      if (!optionObj[dataKey]) continue

      const editItem = optionObj[dataKey][fieldCode] || cloneDeep(infoDefaultData)
      infoItem[`${apiKey}_id`] = editItem.id

      if (apiKey == 'summaryList') infoItem.summaryJson = editItem.summaryJson ? JSON.parse(editItem.summaryJson) : cloneDeep(infoDefaultData.basics.summaryJson)
      if (apiKey == 'webList') {
        if (editItem.formatConfig) {
          const formatConfig = JSON.parse(editItem.formatConfig)
          infoItem.virtualType = formatConfig.formatType
          infoItem.virtual_sql_str = JSON.stringify(formatConfig.formatJson.sql || {})
          infoItem.virtual_java_str = JSON.stringify(formatConfig.formatJson.java || {})
          infoItem.virtual_fun_str = formatConfig.formatJson.fun || ''
          infoItem.virtualValue = ''
        } else {
          infoItem.virtualType = ''
          infoItem.virtual_sql_str = ''
          infoItem.virtual_java_str = ''
          infoItem.virtual_fun_str = ''
          infoItem.virtualValue = ''
        }
      }
      for (const i in infoApiKey[apiKey]) {
        const key = infoApiKey[apiKey][i]
        if (apiKey != 'fieldList' && ['fieldCode', 'fieldName'].includes(key)) continue
        if (['queryList', 'exportList'].includes(apiKey) && key == 'isShowList') continue
        infoItem[key] = editItem[key]

        if (key == 'dictTableColumn' && !(infoItem[key] instanceof Array)) {
          infoItem[key] = infoItem[key] ? infoItem[key].split(',') : []
        }
        if (key == 'fieldCode' && disabledArr.includes(infoItem[key])) infoItem.only = true
      }
    }
    infoData.push(infoItem)
  })

  if (editInfoData.indexList) {
    const indexKeyList = Object.keys(infoColumn.indexColumn)
    editInfoData.indexList.forEach(item => {
      const indexItem = {}
      indexKeyList.forEach(prop => {
        if (prop == 'indexFieldCodeList') indexItem[prop] = item[prop] ? item[prop].split(',') : []
        else indexItem[prop] = item[prop]
      })
      indexData.push(indexItem)
    })
  }
  if (editInfoData.summaryTopList) {
    editInfoData.summaryTopList.forEach(item => {
      const topObj = JSON.parse(item.summaryJson)
      summaryTopData.push({
        id: item.id,
        summaryLabel: item.summaryLabel,
        summaryShow: item.summaryShow,
        summarySpan: topObj.summarySpan,
        summaryControl: topObj.summaryControl,
        summarySql: JSON.stringify(topObj.summarySql),
      })
    })
  }
  return { infoData, indexData, summaryTopData }
}

export const pageOption = {
  tableOptionColumn, customFormColumn, dataOriginObj,
  infoApiKey, indexApiKey,
  tableName_required
}
export const tableInfoOption = {
  infoColumn,
  infoDefaultData,
  disabledArr,
  getDefaultMysqlField,
  formattingInitData,
}
