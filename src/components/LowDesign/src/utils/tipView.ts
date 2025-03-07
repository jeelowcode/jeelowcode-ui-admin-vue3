const TableJsEnhance = {
  title: '可用增强列表',
  list: [
    { label: '导入其他模块', value: 'initImport' },
    { label: '表格显示前执行', value: 'initOption' },
    { label: '表格赋值前执行', value: 'beforeData' },
    { label: '搜索前执行', value: 'beforeSearch' },
    { label: '表单打开前执行', value: 'beforeFormData' },
    { label: '自定义新增处理', value: 'customAddHandle' },
    { label: '自定义编辑处理', value: 'customEditHandle' },
    { label: '自定义删除处理', value: 'customDelHandle' },
    { label: '新增、修改、删除请求接口前执行', value: 'beforeRequest' },
    { label: '新增、修改、删除请求接口后执行', value: 'afterRequest' },
    { label: '控制行是否可勾选', value: 'selectable' },
    { label: '表格底部统计格式化', value: 'summaryBottomFormatting' },
    { label: '表格头部统计格式化', value: 'summaryTopFormatting' },
    { label: '行样式', value: 'rowStyle' },
    { label: '列样式', value: 'cellStyle' },
    { label: '行单击', value: 'rowClick' },
    { label: '行双击', value: 'rowDblclick' },
    { label: '单元格单击', value: 'cellClick' },
    { label: '单元格双击', value: 'cellDblclick' },
    { label: '自定义按钮', value: '按钮编码' },
  ]
}

const FormJsEnhance = {
  title: '可用增强列表',
  list: [
    { label: '导入其他模块', value: 'initImport' },
    { label: '表单显示前执行', value: 'initOption' },
    { label: '表单赋值前执行', value: 'initData' },
    { label: '表单提交前执行', value: 'beforeSubmit' },
    { label: '提交数据后触发', value: 'afterSubmit' },
    { label: '表单校验失败后执行', value: 'verifyError' },
    { label: '清空数据后执行', value: 'afterReset' },
  ]
}

const SqlEnhance = {
  title: '可用占位字段',
  list: [
    { label: '生成id', value: '#{jeelowcode_id}' },
    { label: '生成时间日期', value: '#{jeelowcode_date_time}' },
    { label: '生成日期', value: '#{jeelowcode_date}' },
    { label: '生成时间', value: '#{jeelowcode_time}' },
    { label: '是否删除', value: '#{jeelowcode_is_deleted}' },
    { label: '获取当前登录人租户编号', value: '#{jeelowcode_tenant_id}' },
    { label: '获取当前登录人id', value: '#{jeelowcode_user_id}' },
    { label: '获取当前登录人部门id', value: '#{jeelowcode_user_dept}' },
    { label: '获取当前人账号', value: '#{jeelowcode_user_name}' },
    { label: '获取当前人名称', value: '#{jeelowcode_user_nickname}' },
    { label: '获取主表id', value: '#{jeelowcode_main_id}' },
    { label: '根据页面参数构造where条件', value: '#{jeelowcode_auto_where}' },
  ]
}


export default {
  TableJsEnhance, FormJsEnhance, SqlEnhance
}