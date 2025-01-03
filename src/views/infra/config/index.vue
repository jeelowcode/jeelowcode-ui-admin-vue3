<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      v-model:page="tablePage"
      v-model:search="tableSearch"
      :table-loading="loading"
      :data="tableData"
      :option="tableOption"
      :permission="permission"
      :before-open="beforeOpen"
      @search-change="searchChange"
      @search-reset="resetChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu-left="{ size }">
        <el-button
          type="success"
          plain
          :size="size"
          icon="el-icon-download"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['infra:config:export']"
          >导出</el-button
        >
      </template>
      <template #accountCount="scope">
        <el-tag>{{ scope.row.accountCount }}</el-tag>
      </template>
      <template #visible="scope">
        <dict-tag
          v-if="scope.row.visible !== undefined"
          :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
          :value="scope.row.visible"
        />
      </template>
      <template #type="scope">
        <dict-tag
          v-if="scope.row.type !== undefined"
          :type="DICT_TYPE.INFRA_CONFIG_TYPE"
          :value="scope.row.type"
        />
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getBoolDictOptions, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ConfigApi from '@/api/infra/config'

defineOptions({ name: 'InfraConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 12,
  dialogWidth: '50%',
  column: {
    id: {
      label: '参数主键',
      width: 90,
      display: false
    },
    category: {
      label: '参数分类',
      width: 90,
      rules: [{ required: true, message: '参数分类不能为空', trigger: 'blur' }]
    },
    name: {
      label: '参数名称',
      search: true,
      minWidth: 120,
      rules: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }]
    },
    key: {
      label: '参数键名',
      search: true,
      minWidth: 120,
      rules: [{ required: true, message: '参数键名不能为空', trigger: 'blur' }]
    },
    value: {
      label: '参数键值',
      rules: [{ required: true, message: '参数键值不能为空', trigger: 'blur' }]
    },
    visible: {
      label: '是否可见',
      type: 'radio',
      width: 90,
      dicData: getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING),
      rules: [{ required: true, message: '是否可见不能为空', trigger: 'blur' }],
      value: true
    },
    type: {
      label: '系统内置',
      search: true,
      width: 100,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.INFRA_CONFIG_TYPE),
      display: false
    },
    remark: {
      label: '备注',
      type: 'textarea',
      minRows: 2,
      span: 24,
      maxRows: 4
    },
    createTime: {
      label: '创建时间',
      search: true,
      searchRange: true,
      display: false,
      type: 'date',
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      width: 180,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    }
  }
}) //表格配置
const tableForm = ref<{ id?: number }>({})
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi(['infra:config'])
const exportLoading = ref(false) // 导出的加载中
const crudRef = ref()

useCrudHeight(crudRef)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true

  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }

  if (searchObj.createTime?.length) {
    searchObj.createTime = getSearchDate(searchObj.createTime)
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await ConfigApi.getConfigPage(searchObj)
    tableData.value = data.list
    tablePage.value.total = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const searchChange = (params, done) => {
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
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await ConfigApi.getConfig(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await ConfigApi.createConfig(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await ConfigApi.updateConfig(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (form, index) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ConfigApi.deleteConfig(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    let searchObj = { ...tableSearch.value }
    for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
    const data = await ConfigApi.exportConfig(searchObj)
    download.excel(data, '配置管理列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
