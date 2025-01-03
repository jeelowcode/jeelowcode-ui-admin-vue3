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
          v-hasPermi="['system:operate-log:export']"
          >导出</el-button
        >
      </template>
      <!-- 表格 -->
      <template #type="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_OPERATE_TYPE"
          :value="scope.row.type != undefined ? scope.row.type : ''"
        />
      </template>
      <template #resultCode="scope">
        <span>{{ scope.row.resultCode === 0 ? '成功' : '失败' }}</span>
      </template>
      <template #duration="scope">
        <span>{{ scope.row.duration }} ms</span>
      </template>
      <!-- 表单 -->
      <template #resultCode-form="scope">
        <span>{{ scope.value === 0 ? '成功' : '失败' }}</span>
      </template>
      <template #requestUrl-form="scope">
        <span>{{ tableForm.requestMethod }} {{ scope.value }}</span>
      </template>
      <template #duration-form="scope">
        <span>{{ scope.value }} ms</span>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as OperateLogApi from '@/api/system/operatelog'

defineOptions({ name: 'SystemOperateLog' })

const message = useMessage() // 消息弹窗
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  viewBtnText: '详情',
  viewBtnIcon: ' ',
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  menuWidth: 120,
  column: {
    id: {
      label: '日志编号',
      width: 90
    },
    traceId: {
      label: '链路追踪',
      hide: true
    },
    userId: {
      label: '操作人编号',
      hide: true
    },
    userIp: {
      label: '操作人 IP',
      hide: true
    },
    userAgent: {
      label: '操作人 UA',
      hide: true,
      type: 'textarea',
      minRows: 2,
      maxRows: 4
    },
    module: {
      label: '操作模块',
      search: true,
      minWidth: 90
    },
    name: {
      label: '操作名',
      minWidth: 90
    },
    content: {
      label: '操作内容',
      hide: true
    },
    exts: {
      label: '操作拓展参数',
      hide: true
    },
    requestMethod: {
      label: '请求方式',
      display: false,
      hide: true
    },
    requestUrl: {
      label: '请求 URL',
      hide: true
    },
    javaMethod: {
      label: 'Java方法名',
      hide: true
    },
    javaMethodArgs: {
      label: 'Java方法参数',
      hide: true,
      type: 'textarea',
      minRows: 2,
      maxRows: 4
    },
    type: {
      label: '操作类型',
      width: 90,
      search: true,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_OPERATE_TYPE),
      value: ''
    },
    userNickname: {
      label: '操作人',
      search: true
    },
    resultCode: {
      label: '操作状态',
      width: 90,
      type: 'select'
    },
    searchStartTime: {
      label: '操作时间',
      search: true,
      hide: true,
      display: false,
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    },
    startTime: {
      label: '操作时间',
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    duration: {
      label: '执行时长',
      minWidth: 90
    }
  }
}) //表格配置
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const exportLoading = ref(false) // 导出的加载中
const permission = getCurrPermi(['system:operate-log'])

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

  if (searchObj.searchStartTime?.length) {
    searchObj.startTime = getSearchDate(searchObj.searchStartTime)
  }
  delete searchObj.searchStartTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await OperateLogApi.getOperateLogPage(searchObj)
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
  if (['view'].includes(type) && tableForm.value.id) {
    // tableForm.value = await OperateLogApi.getDictType(tableForm.value.id)
  }
  done()
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
    const data = await OperateLogApi.exportOperateLog(searchObj)
    download.excel(data, '操作日志.xls')
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
