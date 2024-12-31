<template>
  <avue-crud
    ref="crudRef"
    v-model="tableForm"
    v-model:page="tablePage"
    v-model:search="tableSearch"
    :table-loading="loading"
    :data="tableData"
    :option="tableOption"
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
        v-hasPermi="['system:tenant:export']"
        >导出</el-button
      >
    </template>
    <template #status="scope">
      <dict-tag
        v-if="scope.row.status !== undefined"
        :type="DICT_TYPE.INFRA_JOB_LOG_STATUS"
        :value="scope.row.status"
      />
    </template>
    <template #beginTimeText-form>
      {{ formatDate(tableForm.beginTime) + ' ~ ' + formatDate(tableForm.endTime) }}
    </template>
    <template #duration-form="{ value }">
      {{ value + ' 毫秒' }}
    </template>
    <template #status-form="{ value }">
      <dict-tag v-if="value !== undefined" :type="DICT_TYPE.INFRA_JOB_LOG_STATUS" :value="value" />
    </template>
  </avue-crud>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as JobLogApi from '@/api/infra/jobLog'

defineOptions({ name: 'InfraJobLog' })

interface Props {
  jobId?: number
}
const props = defineProps<Props>()

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  viewBtnText: '详情',
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  searchLabelWidth: 100,
  labelSuffix: ' ',
  labelWidth: 120,
  span: 24,
  dialogWidth: '50%',
  calcHeight: 20,
  menuWidth: 120,
  column: {
    id: {
      label: '日志编号'
    },
    jobId: {
      label: '任务编号'
    },
    handlerName: {
      label: '处理器的名字',
      search: true,
      searchSpan: 5
    },
    beginTime: {
      label: '执行时间',
      hide: true,
      display: false,
      search: true,
      type: 'date',
      searchRange: true,
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始执行时间',
      endPlaceholder: '结束执行时间',
      searchSpan: 8
    },
    handlerParam: {
      label: '处理器的参数'
    },
    executeIndex: {
      label: '第几次执行',
      width: 100
    },
    beginTimeText: {
      label: '执行时间',
      html: true,
      width: 160,
      formatter: (row) => {
        return `<div>
          <div>${formatDate(row.beginTime)}</div>
          <div> ~ </div>
          <div>${formatDate(row.endTime)}</div>
        </div>`
      }
    },
    duration: {
      label: '执行时长',
      width: 100,
      formatter: (row) => {
        return row.duration + '毫秒'
      }
    },
    status: {
      label: '任务状态',
      searchSpan: 5,
      search: true,
      width: 90,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.INFRA_JOB_LOG_STATUS)
    },
    result: {
      label: '执行结果',
      hide: true
    }
  }
}) //表格配置
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const exportLoading = ref(false) // 导出的加载中
const crudRef = ref()

useCrudHeight(crudRef)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj: any = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  if (searchObj.beginTime) {
    searchObj.endTime = `${searchObj.beginTime[1]} 23:59:59`
    searchObj.beginTime = `${searchObj.beginTime[0]} 00:00:00`
  }
  if (props.jobId !== 0) searchObj['jobId'] = props.jobId
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await JobLogApi.getJobLogPage(searchObj)
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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    let searchObj: any = { ...tableSearch.value }
    if (props.jobId) searchObj.jobId = props.jobId
    for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]

    const data = await JobLogApi.exportJobLog(searchObj)
    download.excel(data, '调度日志列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})

defineExpose({ resetChange })
</script>
