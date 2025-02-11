<template>
  <ContentWrap>
    <div class="flex gap-x-10px">
      <div class="flex-basis-180px flex-shrink-0">
        <avue-tree
          ref="treeRef"
          v-model="treeForm"
          :option="treeOption"
          :data="treeData"
          :permission="treePermission"
          :before-open="treeBeforeOpen"
          @node-click="treeNodeClick"
          @update="treeUpdate"
          @save="treeSave"
          @del="treeDel"
        >
        </avue-tree>
      </div>
      <avue-crud
        class="table-content flex-1"
        ref="crudRef"
        v-model="tableForm"
        v-model:page="tablePage"
        v-model:search="tableSearch"
        :table-loading="loading"
        :data="tableData"
        :option="tableOption"
        :permission="permission"
        :before-open="beforeOpen"
        :before-close="beforeClose"
        @search-change="searchChange"
        @search-reset="resetChange"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @refresh-change="getTableData"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #menu="{ size, row }">
          <div class="flex justify-center flex-items-center">
            <el-button
              type="primary"
              text
              :size="size"
              v-hasPermi="['jeelowcode:report:update']"
              @click="menuHandle({ type: 'edit', row, index: row.$index })"
            >
              <Icon :size="14" icon="ep:edit-pen"></Icon>
              <span>编辑</span>
            </el-button>
            <span
              v-if="checkPermi(['jeelowcode:report:update'])"
              class="ml-8px mr-8px mt-2px inline-block h-16px w-1px bg-#e8e8e8 .dark:bg-[var(--el-border-color-dark)]"
            ></span>
            <el-dropdown @command="menuHandle">
              <div class="mt--2px cursor-pointer">
                <el-text :size="size" type="primary">
                  更多
                  <Icon :size="16" icon="iconamoon:arrow-down-2-light" />
                </el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <template v-for="item in menuMoreList" :key="item.type">
                    <el-dropdown-item
                      v-if="!item.isShow || item.isShow()"
                      :command="{ type: item.type, row }"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <template #menu-form-before="{ disabled, size, type }">
          <el-button
            v-if="type == 'edit'"
            type="primary"
            :size="size"
            :disabled="disabled"
            :loading="saveLoading"
            @click="rowUpdate(tableForm)"
          >
            <Icon :size="14" icon="ep:circle-check"></Icon>
            <span>修改</span>
          </el-button>
        </template>
        <template #custom_form-form>
          <avue-form
            class="table-design-custom-form"
            ref="customFormRef"
            :option="customFormOption"
            v-model="tableForm"
          >
            <template #originButton>
              <div>
                <el-button
                  type="primary"
                  class="ml-2px"
                  @click="openDataOrigin"
                  :disabled="!tableForm.dataOrigin"
                >
                  <Icon :size="14" icon="lucide:text-search"></Icon> <span>数据源SQL配置</span>
                </el-button>
                <el-button
                  type="primary"
                  class="ml-2px"
                  @click="analysisDataOrigin"
                  :loading="analysisLoading"
                  :disabled="!tableForm.originButton"
                >
                  <Icon v-if="!analysisLoading" :size="14" icon="streamline:code-analysis"></Icon>
                  <span>解析配置生成字段</span>
                </el-button>
              </div>
            </template>
            <template #dataConfig="scope">
              <div class="flex">
                <avue-checkbox
                  class="flex-basis-60px flex-shrink-0"
                  v-model="tableForm.dataConfig"
                  :dic="scope.column.dicData"
                ></avue-checkbox>
                <avue-select
                  class="flex-basis-160px flex-shrink-0"
                  v-model="authValue"
                  :dic="dicObj.dataConfigSelect"
                  :clearable="false"
                ></avue-select>
              </div>
            </template>
          </avue-form>
        </template>

        <template #custom_info-form="scope">
          <TableInfo
            v-if="isTableInfo"
            ref="tableInfoRef"
            :formType="scope.type"
            :editInfoData="editInfoData"
            :size="scope.size"
          ></TableInfo>
        </template>
      </avue-crud>
    </div>

    <DesignPopup
      v-model="dataOriginPopup.show"
      title="数据源SQL配置"
      width="90%"
      :isBodyFull="true"
      :dialogParams="{ top: '5vh' }"
      :handleClose="(done) => handlePopupClose(done, 'originButton')"
    >
      <template #default>
        <DataOriginOption
          :ref="(el) => (optionRef.originButton = el)"
          v-model="tableForm.originButton"
          :show="dataOriginPopup.show"
          :tableList="dataOriginPopup.tableList"
          :viewField="dataOriginPopup.viewField"
        ></DataOriginOption>
      </template>
    </DesignPopup>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { TableInfo } from './components'
import { DataOriginOption } from '../tableDesign/components'
import * as TableApi from '@/api/design/table'
import * as ReportApi from '@/api/design/report'
import { pageOption, tableInfoOption, dicObj } from './designData'
import { ElMessage, ElButton, ElLoading } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import useCopyText from '@/hooks/design/useCopyText'
import { useRenderVxeColumn } from '../general/components/useRenderVxeColumn'
import { useGroup } from '../useGroup'
import { checkPermi } from '@/utils/permission'

defineOptions({ name: 'TableDesign' })

const { copyText } = useCopyText()
useRenderVxeColumn()

const message = useMessage() // 消息弹窗
const router = useRouter() // 路由
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const saveLoading = ref(false)
const isTableInfo = ref(false)
const analysisLoading = ref(false)

//表格配置
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  searchIndex: 3,
  searchIcon: true,
  labelSuffix: ' ',
  span: 8,
  dialogWidth: '100%',
  dialogFullscreen: true,
  editBtn: false,
  delBtn: false,
  border: true,
  index: true,
  menuWidth: 150,
  updateBtnText: '修改并关闭',
  column: pageOption.tableOptionColumn
})

const tableForm = ref<any>({})
const tableData = ref([])
const authValue = ref('')
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const customFormOption = ref({
  labelWidth: 120,
  span: 8,
  menuBtn: false,
  column: pageOption.customFormColumn
})
const editInfoData = ref({})
const apiDetailData = ref<any>({})
const dataOriginPopup = ref({
  show: false,
  tableList: [] as any[],
  viewField: [] as any[]
})

const crudRef = ref()
const tableInfoRef = ref()
const customFormRef = ref()
const treeRef = ref()
const optionRef = ref<any>({})
const isUnload = ref(false)

const permission = getCurrPermi(['jeelowcode:report'])

const menuMoreList = [
  { label: '功能测试', type: 'test' },
  { label: '路由地址', type: 'address' },
  { label: '接口地址', type: 'apiUrl' },
  { label: '复制报表', type: 'copy', isShow: () => checkPermi(['jeelowcode:report:create']) },
  { label: '删除', type: 'del', isShow: () => checkPermi(['jeelowcode:report:delete']) }
]

useCrudHeight(crudRef)
const {
  treeForm,
  treeOption,
  treeData,
  groupValue,
  treePermission,
  treeBeforeOpen,
  treeNodeClick,
  getTreeData,
  treeUpdate,
  treeSave,
  treeDel
} = useGroup(treeRef, ReportApi, () => resetChange())

const openDataOrigin = () => {
  dataOriginPopup.value.tableList = []

  tableForm.value.dataOrigin.split(',').forEach((key) => {
    const tableItem = pageOption.dataOriginObj[key]
    if (tableItem) dataOriginPopup.value.tableList.push(tableItem)
  })
  const filedData = [...tableInfoRef.value.infoData.basics, ...tableInfoRef.value.tableInfoDefault]
  dataOriginPopup.value.viewField = filedData.map((item) => {
    return { label: item.fieldName, value: item.fieldCode }
  })
  dataOriginPopup.value.show = true
}

watch(
  () => authValue.value,
  () => {
    if (tableForm.value.dataConfig) {
      tableForm.value.dataConfig = tableForm.value.dataConfig.filter(
        (key) => !['authFalse', 'authTrue', 'authOpen', ''].includes(key)
      )
    }
    if (authValue.value) tableForm.value.dataConfig.push(authValue.value)
  }
)

const tableFormVerify = (type) => {
  return new Promise((resolve, reject) => {
    customFormRef.value.validate((bool, done, msg) => {
      done()
      if (!bool) return reject(msg)

      let infoData = {}
      let errText = ''
      let fieldCodeArr: any[string] = []
      const filedData = [...tableInfoRef.value.infoData.basics]
      tableInfoRef.value.tableInfoDefault.forEach((item) => {
        filedData.splice(item.sortNum || 999, 0, item)
      })

      for (const i in filedData) {
        const index = Number(i)
        const item = filedData[index]
        item.sortNum = index + 1

        let messageText = ''
        let tabKey = 'mysql'
        if (!item.fieldCode || !item.fieldName) {
          messageText = `<div style="line-height:24px">
              <div>${!item.fieldCode ? '字段编码' : '字段名称'}必须填写</div>
              <div>序号：${index + 1}</div>
            </div>`
        }
        if (fieldCodeArr.includes(item.fieldCode)) {
          messageText = `<div style="line-height:24px">
            <div>
              <span>字段编码重复：</span>
              <span style="color:red">${item.fieldCode}</span>
            </div>
            <div>序号：${index + 1}</div>
          </div>`
        }
        fieldCodeArr.push(item.fieldCode)
        if (!/(^[a-zA-Z]{2}(_?[a-zA-Z0-9])*_?$)/.test(item.fieldCode)) {
          messageText = `<div style="line-height:24px">
            <div>
              <span>字段编码不符合规范</span>
              <span style="color:red">${item.fieldCode}</span>
            </div>
            <div>命名规则：只能由字母、数字、下划线组成;必须以字母开头;不能以单个字母加下滑线开头</div>
            <div>序号：${index + 1}</div>
          </div>`
        }

        if (messageText) {
          handleVerifyError(tabKey, item._X_ROW_KEY, index)
          ElMessage({ dangerouslyUseHTMLString: true, message: messageText })
          errText = 'message'
          break
        }

        for (let key in pageOption.infoApiKey) {
          if (!infoData[key]) infoData[key] = []
          let itemObj: any = {}
          pageOption.infoApiKey[key].forEach((prop) => {
            itemObj[prop] = item[prop] !== undefined ? item[prop] : ''
          })
          if (type == 'edit' && item[`${key}_id`]) itemObj['id'] = item[`${key}_id`]
          infoData[key].push(itemObj)
        }
      }

      if (errText) return reject(errText)

      if (type == 'edit') {
        infoData['delIdVo'] = {}
        contrastEditData(infoData)
      }
      resolve(infoData)
    })
  })
}

const contrastEditData = (infoData) => {
  for (const key in infoData) {
    if (!apiDetailData.value[key] || key == 'delIdVo') break
    infoData.delIdVo[key] = cloneDeep(apiDetailData.value.delIdVo[key])
    infoData[key] = infoData[key].map((item) => {
      const contrastObj = apiDetailData.value[key][item.id]
      if (item.id) {
        const index = infoData.delIdVo[key].indexOf(item.id)
        if (index != -1) infoData.delIdVo[key].splice(index, 1)
        if (contrastObj) {
          for (const k in item) {
            if (item[k] != contrastObj[k]) {
              item.isModify = 'Y'
              // console.log(key, k, '修改了','原：'+contrastObj[k], '新：'+item[k], )
              break
            }
          }
        }
      }
      return item
    })
  }
}

const setApiDetailData = (data) => {
  apiDetailData.value = { delIdVo: {} }
  for (const key in data) {
    let listKey = key
    if (listKey != 'report') {
      if (!apiDetailData.value[listKey]) apiDetailData.value[listKey] = {}
      if (!apiDetailData.value.delIdVo[listKey]) apiDetailData.value.delIdVo[listKey] = []
      data[key]?.forEach((item) => {
        if (item.id) {
          apiDetailData.value[listKey][item.id] = item
          apiDetailData.value.delIdVo[listKey].push(item.id)
        }
      })
    }
  }
  for (const key in apiDetailData.value) {
    if (key == 'delIdVo') break
    if (!Object.keys(apiDetailData.value[key]).length) delete apiDetailData.value[key]
  }
}

const handleVerifyError = (key, rowId, index) => {
  const tabKey = `tab_${key}`
  const vxeTableRef = tableInfoRef.value.tableRefObj[tabKey]?.vxeTableRef
  if (vxeTableRef) {
    tableInfoRef.value.setTabsValue(tabKey)
    setTimeout(() => {
      vxeTableRef.setEditRow(vxeTableRef.getRowById(rowId))
      tableInfoRef.value.tableScrollIndex(key, index, index)
    }, 300)
  }
}

const menuHandle = async ({ type, row, index }) => {
  if (type == 'edit') crudRef.value.rowEdit(row, index)
  else if (type == 'test') router.push({ path: '/low/report/test/' + row.reportCode })
  else if (type == 'address') showAddress(row)
  else if (type == 'apiUrl') showApiUrl(row)
  else if (type == 'copy') copyReport(row)
  else if (type == 'del') rowDel(row)
}

const showAddress = (row) => {
  const url = `report/view/` + row.reportCode
  message.alert(`路由地址：</br>${url}`, '菜单的路由地址', {
    confirmButtonText: '复制',
    dangerouslyUseHTMLString: true,
    callback: (action) => {
      if (action == 'confirm') copyText(url)
    }
  })
}

const showApiUrl = async (row) => {
  loading.value = true
  const detailData = await ReportApi.getDbDetail(row.id).finally(() => (loading.value = false))
  const isOpen = detailData.report.dataConfig.indexOf('authOpen') != -1
  const apiList = [
    {
      label: '获取报表数据[post]',
      value: `/jeelowcode/report-data/list/${row.reportCode}`
    },
    {
      label: '批量获取报表数据[post]',
      value: `/jeelowcode/report-data/batch/list/报表code,报表code,...`
    }
  ]
  if (isOpen) {
    apiList.push({
      label: '未登录时获取报表数据[post]',
      value: `/jeelowcode/open/report/list/${row.reportCode}`
    })
  }

  let list: VNode[] = []
  apiList.forEach((item) => {
    list.push(
      h('div', { style: { marginBottom: '10px', border: ' 1px solid #eee', padding: '10px' } }, [
        h('div', [
          h('span', { style: { fontWeight: 600, fontSize: '14px' } }, item.label + '：'),
          h(
            ElButton,
            { size: 'small', type: 'primary', onClick: () => copyText(item.value) },
            () => '复制'
          )
        ]),
        h('div', { style: { fontSize: '12px' } }, item.value)
      ])
    )
  })
  message.alert('', '接口地址', {
    message: () => {
      return h('div', { width: '360px' }, list)
    },
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true,
    customStyle: { width: '384px' }
  })
}

const copyReport = (row) => {
  message
    .prompt('新报表编码', '复制报表', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: '',
      inputValidator: (value) => {
        if (!value) return '请输入报表编码'
        let RExp = /([a-zA-Z_$][a-zA-Z\d_$]*\.)*[a-zA-Z_$][a-zA-Z\d_$]*/
        if (!RExp.test(value)) return '报表编码格式错误！'
      }
    })
    .then(async ({ value }) => {
      loading.value = true
      const bool = await ReportApi.verifyReportCode(value)
      if (bool) {
        loading.value = false
        return message.info('报表编码已存在')
      }
      await ReportApi.copyReportData(row.reportCode, value)
      message.success('复制成功')
      resetChange()
    })
}

const handlePopupClose = (done, prop) => {
  const str = optionRef.value[prop]?.getOptionStr() || ''
  done()
  setTimeout(() => {
    tableForm.value[prop] = str
  }, 30)
}

const setInfoBasics = (infoData) => {
  const basics_id: any[] = []
  const basics_defaule: any[] = []
  tableInfoRef.value.infoData.basics.forEach((item) => {
    if (item.only) {
      if (item.fieldCode == 'id') basics_id.push(item)
      else basics_defaule.push(item)
    }
  })
  tableInfoRef.value.infoData.basics = [...basics_id, ...infoData, ...basics_defaule]
}

const analysisDataOrigin = async () => {
  await message.confirm('解析后将会覆盖现有的字段配置，是否确定解析？')
  analysisLoading.value = true
  const dataOption = JSON.parse(tableForm.value.originButton)
  TableApi.viewDataOriginAnalysis(dataOption.optionObj.select)
    .then((analysisData) => {
      let { infoData } = tableInfoOption.formattingInitData(analysisData)
      infoData = infoData.map((item) => {
        for (const key in item) {
          if (item[key] === null || item[key] === undefined || key == 'fieldList_id') {
            delete item[key]
          }
        }
        return { ...cloneDeep(tableInfoOption.infoDefaultData.basics), ...item }
      })
      setInfoBasics(infoData)
      message.success('解析成功')
    })
    .finally(() => (analysisLoading.value = false))
}

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  if (groupValue.value) searchObj['groupReportId'] = groupValue.value
  for (const key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await ReportApi.getDbList(searchObj)

    tableData.value = data.records
    tablePage.value.total = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const searchChange = (params, done) => {
  if (Object.keys(params).length && groupValue.value) {
    treeRef.value.setCurrentKey(0)
    groupValue.value = 0
  }
  tablePage.value.currentPage = 1
  getTableData().finally(() => {
    done()
  })
}

/** 清空按钮操作 */
const resetChange = () => {
  searchChange({}, () => {})
}

const sizeChange = (pageSize) => {
  tablePage.value.pageSize = pageSize
  resetChange()
}

const currentChange = (currentPage) => {
  tablePage.value.currentPage = currentPage
  getTableData()
}

/** 表单打开前 */
const beforeOpen = async (done, type) => {
  isTableInfo.value = false
  const groupData = cloneDeep(treeData.value)
  customFormOption.value.column.groupReportId.dicData = groupData[0].children
  const { reportCode } = customFormOption.value.column
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    loading.value = true
    const data = await ReportApi.getDbDetail(tableForm.value.id)
    setApiDetailData(cloneDeep(data))
    data.report.tableConfig = data.report.tableConfig?.split(',') || []
    data.report.dataConfig = data.report.dataConfig?.split(',') || []
    editInfoData.value = data
    tableForm.value = { ...data.report }
    reportCode['disabled'] = true
    reportCode['rules'] = []
    if (tableForm.value.dataSourcesConfig) {
      const dataSourcesConfig = JSON.parse(tableForm.value.dataSourcesConfig)
      delete tableForm.value.dataSourcesConfig
      tableForm.value.dataOrigin = dataSourcesConfig.dataOrigin
      tableForm.value.originButton = JSON.stringify({
        ...dataSourcesConfig.optionData,
        executeSql: dataSourcesConfig.executeSql
      })
    }

    const dataConfig = tableForm.value.dataConfig
    dicObj.dataConfigSelect.forEach((item) => {
      if (dataConfig.includes(item.value)) authValue.value = item.value
    })

    loading.value = false
  } else {
    tableForm.value = { ...tableForm.value, dataConfig: ['page', 'authFalse'] }
    reportCode['disabled'] = false
    reportCode['rules'] = [{ validator: pageOption.reportCode_required, trigger: 'blur' }] as any
    if (groupValue.value) tableForm.value.groupReportId = groupValue.value
    authValue.value = ''
  }
  if (!authValue.value) authValue.value = 'authFalse'
  isUnload.value = ['edit', 'add'].includes(type)
  done()
  //延迟显示
  setTimeout(() => (isTableInfo.value = true), 300)
}

const beforeClose = async (done, type) => {
  isUnload.value = false
  done()
}

const handleApiFormData = (formData) => {
  const form = cloneDeep(formData)
  form.dataConfig = form.dataConfig.join(',')
  form.groupReportId = form.groupReportId || ''
  if (form.dataOrigin || form.originButton) {
    const dataSourcesConfig = {
      dataOrigin: form.dataOrigin || '',
      executeSql: '',
      optionData: {}
    }
    if (form.originButton) {
      const originButton = JSON.parse(form.originButton)
      if (form.dataOrigin) dataSourcesConfig.executeSql = originButton.executeSql
      delete originButton.executeSql
      dataSourcesConfig.optionData = originButton
    }
    delete form.dataOrigin
    delete form.originButton
    form.dataSourcesConfig = JSON.stringify(dataSourcesConfig)
  } else form.dataSourcesConfig = ''
  return form
}

/** 新增操作 */
const rowSave = async (formData, done, loading) => {
  const form = handleApiFormData(formData)
  tableFormVerify('add')
    .then(async (infoData: object) => {
      const elLoading = ElLoading.service({ fullscreen: true })
      let bool = await ReportApi.saveDbData({ report: { ...form }, ...infoData }).catch(() => false)
      if (bool) {
        message.success(t('common.createSuccess'))
        resetChange()
        done()
      } else loading()
      elLoading.close()
    })
    .catch((error) => {
      if (typeof error == 'object') {
        let key = Object.keys(error)[0]
        message.info(error[key][0].message)
      } else if (error !== 'message') {
        message.alert(error, '请修改', { dangerouslyUseHTMLString: true })
      }
      loading()
    })
}

/** 编辑操作 */
const rowUpdate = async (formData, index?, done?, loading?) => {
  let isGetDetail = false
  if (!loading || !done) {
    saveLoading.value = true
    loading = () => (saveLoading.value = false)
    done = () => (saveLoading.value = false)
    isGetDetail = true
  }
  const form = handleApiFormData(formData)
  tableFormVerify('edit')
    .then(async (infoData: object) => {
      let bool = await ReportApi.updateDbData({ report: { ...form }, ...infoData }).catch(
        () => false
      )
      if (bool) {
        if (isGetDetail) {
          const data = await ReportApi.getDbDetail(form.id)
          setApiDetailData(cloneDeep(data))
          editInfoData.value = data
          setTimeout(() => {
            tableInfoRef.value.initEditInfoData()
          }, 30)
        }
        message.success(t('common.updateSuccess'))
        getTableData()
        done()
      } else loading()
    })
    .catch((error) => {
      if (typeof error == 'object') {
        let key = Object.keys(error)[0]
        message.info(error[key][0].message)
      } else if (error !== 'message') {
        message.alert(error, '请修改', { dangerouslyUseHTMLString: true })
      }
      loading()
    })
}

/** 删除按钮操作 */
const rowDel = async (form) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    loading.value = true
    // 发起删除
    await ReportApi.deleteDbData([form.id])
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

const beforeUnload = (event) => {
  if (isUnload.value) return (event.returnValue = '您确定要关闭页面吗？')
}

onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnload)
  getTableData()
  getTreeData()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload)
})
</script>
<style lang="scss" scoped>
.table-content {
  max-width: calc(100% - 190px);
}
</style>
<style lang="scss">
.table-design-custom-form {
  .el-form-item {
    margin-bottom: 18px !important;

    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
}

.dark {
  .table-design-option {
    .view-field-content {
      .content-item {
        color: var(--el-text-color-seconda) !important;
        background-color: var(--el-fill-color-light) !important;
      }
    }

    .integrality-content,
    .left-tree,
    .option-content,
    .view-field,
    .view-field .title,
    .alias-item {
      border-color: var(--el-border-color-dark) !important;
    }

    .integrality-content > div {
      background-color: var(--el-fill-color-light) !important;
    }
  }
}
</style>
