import { languages } from 'monaco-editor'
const fieldKind = languages.CompletionItemKind.Field
const functionKind = languages.CompletionItemKind.Function

const defaultJsTriggerUseFun = [
  { label: 'cloneDeep', insertText: 'cloneDeep(object)', detail: '深拷贝', kind: functionKind },
  { label: 'listToTree', insertText: `listToTree(list, { id: 'id', children: 'children', pid: 'pid' })`, detail: '列表转树结构', kind: functionKind },
  { label: 'formatDate', insertText: 'formatDate(date,format)', detail: '时间格式化', kind: functionKind },
  { label: 'formatPast', insertText: 'formatPast(date)', detail: '将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`', kind: functionKind },
  { label: 'betweenDay', insertText: 'betweenDay(开始时间,结束时间)', detail: '计算两个日期间隔天数', kind: functionKind },
  { label: 'encryptAES', insertText: 'encryptAES(string)', detail: 'aes加密', kind: functionKind },
  { label: 'decryptAES', insertText: 'decryptAES(string)', detail: 'aes解密', kind: functionKind },
  { label: 'useUserStoreWithOut', insertText: 'useUserStoreWithOut()', detail: '当前登录人信息', kind: functionKind },
  {
    label: 'requestApi', insertText: `requestApi('post', 'requesUrl', {
  data:{}
}).then(res => { })    
`, detail: '接口调用', kind: functionKind
  },
  {
    label: 'dynamicImport', insertText: `dynamicImport('store/modules/user').then(module => {
  if (module) {
    console.log(module)
  }
})
`, detail: '动态导入本地模块', kind: functionKind
  },
]
const defaultMessage = [
  { label: 'info', insertText: `info('内容')`, detail: '消息提示', kind: functionKind },
  { label: 'error', insertText: `error('内容')`, detail: '错误消息', kind: functionKind },
  { label: 'success', insertText: `success('内容')`, detail: '成功消息', kind: functionKind },
  { label: 'warning', insertText: `warning('内容')`, detail: '警告消息', kind: functionKind },
  { label: 'alert', insertText: `alert('内容', '标题', { type: 'info' })`, detail: 'ElMessageBox alert 消息提示', kind: functionKind },
  { label: 'confirm', insertText: `confirm('内容', '标题', { type: 'info' })`, detail: 'ElMessageBox confirm 确认消息', kind: functionKind },
  { label: 'prompt ', insertText: `prompt('内容', '标题', { type: 'info' })`, detail: 'ElMessageBox prompt  提交内容', kind: functionKind },
  { label: 'notify', insertText: `notify('内容')`, detail: '通知提示', kind: functionKind },
  { label: 'notifyError', insertText: `notifyError('内容')`, detail: '错误通知提示', kind: functionKind },
  { label: 'notifySuccess', insertText: `notifySuccess('内容')`, detail: '成功通知提示', kind: functionKind },
  { label: 'notifyWarning', insertText: `notifyWarning('内容')`, detail: '警告通知提示', kind: functionKind },
]

//表单开发-js增强提示词
const tableJsEnhance = {
  tipList: [
    { label: 'useFun', insertText: 'useFun', detail: '增强可调用的方法', kind: fieldKind },
    { label: 'loading', insertText: 'loading.value', detail: '表格loading', kind: fieldKind },
    { label: 'tableOption', insertText: 'tableOption.value', detail: '表格配置', kind: fieldKind },
    { label: 'tableForm', insertText: 'tableForm.value', detail: '表单数据', kind: fieldKind },
    { label: 'tableData', insertText: 'tableData.value', detail: '表格数据', kind: fieldKind },
    { label: 'tableSearch', insertText: 'tableSearch.value', detail: '表格搜索数据', kind: fieldKind },
    { label: 'tablePage', insertText: 'tablePage.value', detail: '表格分页信息', kind: fieldKind },
    { label: 'tableSelect', insertText: 'tableSelect.value', detail: '表格勾选数据', kind: fieldKind },
    { label: 'selectIds', insertText: 'selectIds.value', detail: '表格勾选的ids', kind: fieldKind },
    { label: 'buttonObj', insertText: 'buttonObj.value', detail: '表格按钮数据', kind: fieldKind },
    { label: 'crudRef', insertText: 'crudRef.value', detail: 'Avue表格实例', kind: fieldKind },
    { label: 'props', insertText: 'props', detail: '组件参数', kind: fieldKind },
    { label: 'message', insertText: 'message', detail: '消息弹窗', kind: fieldKind },
    // { label: '', insertText: '.value', detail: '', kind: fieldKind },
    {
      label: 'initImport', detail: '导入其他模块', kind: functionKind,
      insertText: `initImport() { //初始化导入其他模块(其他增强可通过 useImport 获取)
  return new Promise(async resolve => {
    const userModule = await useFun.dynamicImport('store/modules/user')
    const userStore = userModule.useUserStoreWithOut()
    resolve({ userStore })
    //例如：在initOption中使用 useImport.userStore.user 可以获取到用户信息
  })
},`,
    },
    {
      label: 'initOption', detail: '表格显示前执行', kind: functionKind,
      insertText: `initOption() { //表格显示前执行

},`,
    },
    {
      label: 'beforeData', detail: '表格赋值前执行', kind: functionKind,
      insertText: `beforeData(data) { //表格赋值前执行
  return new Promise(resolve => {
      resolve(data)
  })
},`,
    },
    {
      label: 'beforeSearch', detail: '搜索前执行', kind: functionKind,
      insertText: `beforeSearch(search) { //搜索前执行
  return new Promise(resolve => {
    resolve(search)
  })
},`,
    },
    {
      label: 'beforeFormData', detail: '表单打开前执行', kind: functionKind,
      insertText: `beforeFormData(formData, type) { //表单打开前执行
  return new Promise(resolve => {
    resolve(formData)
  })
},`
    },
    {
      label: 'beforeRequest', detail: '新增、修改、删除请求接口前执行', kind: functionKind,
      insertText: `beforeRequest(type, apiData) { //新增、修改、删除请求接口前执行
  return new Promise((resolve, reject) => {

    resolve(apiData)
    // reject() 可以停止当前请求台的操作
  })
},`
    },
    {
      label: 'afterRequest', detail: '新增、修改、删除请求接口后执行', kind: functionKind,
      insertText: `afterRequest(type, data) { //新增、修改、删除请求接口后执行
  return new Promise((resolve) => {
    if (type == 'add') {
      //新增 data 包含提交的表单数据以及提交的数据返回id
    }
    if (type == 'edit') {
      //修改 data 修改的表单数据
    }
    if (type == 'del') {
      //删除 data 数组格式 删除的行数据（批量删除也会触发）
    }
    resolve(true)
  })
},`
    },
    {
      label: 'selectable', detail: '控制行是否可勾选', kind: functionKind,
      insertText: `selectable(row, index) { //控制行是否可勾选
      return true
},`,
    },

    {
      label: 'rowStyle', detail: '行样式', kind: functionKind,
      insertText: `rowStyle({ row, rowIndex }) { //行样式

},`,
    },
    {
      label: 'cellStyle', detail: '列样式', kind: functionKind,
      insertText: `cellStyle({ row, column, rowIndex, columnIndex }) { //列样式

},`,
    },
    {
      label: 'rowClick', detail: '行单击', kind: functionKind,
      insertText: `rowClick(row, column, event) { //行单击

},`,
    },
    {
      label: 'rowDblclick', detail: '行双击', kind: functionKind,
      insertText: `rowDblclick(row, column) { //行双击

},`,
    },
    {
      label: 'cellClick', detail: '单元格单击', kind: functionKind,
      insertText: `cellClick(row, column, cell, event) { //单元格单击

},`,
    },
    {
      label: 'cellDblclick', detail: '单元格双击', kind: functionKind,
      insertText: `cellDblclick(row, column, cell, event) { //单元格双击

}`,
    },
    {
      label: 'summaryBottomFormatting', detail: '表格底部统计格式化', kind: functionKind,
      insertText: `summaryBottomFormatting(sums, columns, tableData, summaryData) { //表格底部统计格式化
  console.log(sums, columns, tableData, summaryData)
  return sums
}`,
    },
    {
      label: 'summaryTopFormatting', detail: '表格头部统计格式化', kind: functionKind,
      insertText: `summaryTopFormatting(data) { //表格头部统计格式化
  console.log(data)
  return data
}`,
    }

  ],
  triggerObj: {
    'useFun.': [
      { label: 'setPropConfig', insertText: `setPropConfig('age', { label: '测试' })`, detail: '设置控件配置', kind: functionKind },
      { label: 'getPropConfig', insertText: `getPropConfig('age')`, detail: '获取控件配置', kind: functionKind },
      { label: 'refreshChange', insertText: `refreshChange()`, detail: '刷新当前页表格数据', kind: functionKind },
      { label: 'resetChange', insertText: `resetChange()`, detail: '清空搜索重新获取数据', kind: functionKind },
      { label: 'getSearchData', insertText: `getSearchData().then(searchObj => { })`, detail: '获取搜索参数', kind: functionKind },
      { label: 'clearSelection', insertText: `clearSelection()`, detail: '清空表格选择', kind: functionKind },
      ...defaultJsTriggerUseFun,
    ],
    'props.': [
      { label: 'enhanceData', insertText: 'enhanceData', detail: '外部传递的配置', kind: fieldKind },
      { label: 'tableId', insertText: 'tableId', detail: '表格ID', kind: fieldKind },
      { label: 'fixedSearch', insertText: 'fixedSearch', detail: '固定搜索参数', kind: fieldKind },
    ],
    'message.': defaultMessage
  }
}

//表单设计 默认增强提示词
const defaultJsEnhance = {
  tipList: [
    { label: 'formType', insertText: 'props.formType', detail: '当前表单类型', kind: fieldKind },
    { label: 'formOption', insertText: 'formOption.value', detail: '表单配置', kind: fieldKind },
    { label: 'formData', insertText: 'formData.value', detail: '表单数据', kind: fieldKind },
    { label: 'viewLoading', insertText: 'viewLoading.value', detail: '表单Loading', kind: fieldKind },
    { label: 'useFun', insertText: 'useFun', detail: '增强可调用的方法', kind: fieldKind },
    { label: 'avueFormRef', insertText: 'avueFormRef.value', detail: 'AVUE表单实例', kind: fieldKind },
    { label: 'formTableRef', insertText: 'formTableRef.value', detail: '表格布局实例', kind: fieldKind },
    { label: 'formTabsRef', insertText: 'formTabsRef.value', detail: '选项卡布局实例', kind: fieldKind },
    { label: 'enhanceData', insertText: 'props.enhanceData', detail: '外部传递的配置', kind: fieldKind },
    { label: 'message', insertText: 'message', detail: '消息弹窗', kind: fieldKind },
  ],
  triggerObj: {
    'useFun.': [
      { label: 'setPropConfig', insertText: `setPropConfig('age', { display: false })`, detail: '设置控件配置', kind: functionKind },
      { label: 'getPropConfig', insertText: `getPropConfig('age')`, detail: '获取控件配置', kind: functionKind },
      {
        label: 'submitForm', insertText: `submitForm(isVerify).then(res => {
  //isVerify 是否校验表单 true/false
  if (res) {
    //提交成功 res表单数据
  } else {
    //提交失败
  }
})`, detail: '提交表单数据', kind: functionKind
      },
      ...defaultJsTriggerUseFun,
    ],
    'message.': defaultMessage
  }
}

//表单设计-js增强提示词
const formJsEnhance = {
  tipList: [
    ...defaultJsEnhance.tipList,
    {
      label: 'initImport', detail: '导入其他模块', kind: functionKind,
      insertText: `initImport() { //初始化导入其他模块(其他增强可通过 useImport 获取)
  return new Promise(async resolve => {
    const userModule = await useFun.dynamicImport('store/modules/user')
    const userStore = userModule.useUserStoreWithOut()
    resolve({ userStore })
    //例如：在initOption中使用 useImport.userStore.user 可以获取到用户信息
  })
},`,
    },
    {
      label: 'initOption', detail: '表单显示前执行', kind: functionKind,
      insertText: `initOption() { //表单显示前执行

},`,
    },
    {
      label: 'initData', detail: '初始化默认值', kind: functionKind,
      insertText: `initData(formData) {
  return new Promise(resolve => { //初始化默认值
    resolve(formData)
  })
},`,
    },
    {
      label: 'beforeSubmit', detail: '提交前数据处理', kind: functionKind,
      insertText: `beforeSubmit(submitData) { //提交前数据处理
  return new Promise((resolve, reject) => {
    resolve(submitData)
  })
},`,
    },
    {
      label: 'afterSubmit', detail: '提交数据后触发', kind: functionKind,
      insertText: `afterSubmit(data) { //提交数据后触发
  return new Promise((resolve) => {
    resolve(true)
  })
},`,
    },


    {
      label: 'verifyError', detail: '校验失败回调', kind: functionKind,
      insertText: `verifyError(msg) {
  return new Promise(resolve => { //校验失败回调
    resolve(true)
  })
},`,
    },
    {
      label: 'afterReset', detail: '清空数据回调', kind: functionKind,
      insertText: `afterReset() { //清空数据回调

},`,
    },
  ],
  triggerObj: {
    ...defaultJsEnhance.triggerObj,
    'props.': [
      { label: 'formType', insertText: 'formType', detail: '表单类型', kind: fieldKind },
      { label: 'defaultData', insertText: 'defaultData', detail: '外部传入表单的默认值', kind: fieldKind },
      { label: 'enhanceData', insertText: 'enhanceData', detail: '外部传入表单的配置', kind: fieldKind },
      { label: 'beforeClose', insertText: 'beforeClose(type, data, loadingFun)', detail: '', kind: functionKind },
    ],
  }
}

//表单设计-选项卡增强提示词
const formTabsEnhance = {
  tipList: [
    { label: 'formType', insertText: 'props.formType', detail: '当前表单类型', kind: fieldKind },
    { label: 'tabsOption', insertText: 'tabsOption.value', detail: '选项卡配置', kind: fieldKind },
    { label: 'tabsData', insertText: 'tabsData.value', detail: '选项卡数据', kind: fieldKind },
    { label: 'tabsValue', insertText: 'tabsValue.value', detail: '当前选项卡下标值', kind: fieldKind },
    { label: 'useFun', insertText: 'useFun', detail: '增强可调用的方法', kind: fieldKind },
    { label: 'avueFormRef', insertText: 'avueFormRef.value', detail: '选项卡下的AVUE表单实例', kind: fieldKind },
    { label: 'formTableRef', insertText: 'formTableRef.value', detail: '选项卡下的表格布局实例', kind: fieldKind },
  ],
  triggerObj: defaultJsEnhance.triggerObj
}

//表单设计-表格布局增强提示词
const formTableEnhance = {
  tipList: [
    { label: 'formType', insertText: 'props.formType', detail: '当前表单类型', kind: fieldKind },
    { label: 'tableOption', insertText: 'tableOption.value', detail: '当前表格配置', kind: fieldKind },
    { label: 'tableData', insertText: 'tableData.value', detail: '表格数据', kind: fieldKind },
    { label: 'tableSelect', insertText: 'tableSelect.value', detail: '当前表格勾选数据', kind: fieldKind },
    { label: 'headerBtn', insertText: 'headerBtn.value', detail: '头部按钮配置', kind: fieldKind },
    { label: 'menuBtn', insertText: 'menuBtn.value', detail: '操作列按钮配置', kind: fieldKind },
    { label: 'useFun', insertText: 'useFun', detail: '增强可调用的方法', kind: fieldKind },
    { label: 'avueCrudRef', insertText: 'avueCrudRef.value', detail: '当前Avue表格实例', kind: fieldKind },
  ],
  triggerObj: defaultJsEnhance.triggerObj
}


export default {
  tableJsEnhance,
  defaultJsEnhance,
  formJsEnhance,
  formTabsEnhance,
  formTableEnhance
}