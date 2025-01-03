<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      v-model:page="tablePage"
      v-model:search="tableSearch"
      :data="tableData"
      :option="tableOption"
      :permission="permission"
      @search-change="searchChange"
      @search-reset="resetChange"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #suspensionState="scope">
        <el-tag v-if="scope.row.suspensionState === 1" type="success">激活</el-tag>
        <el-tag v-if="scope.row.suspensionState === 2" type="warning">挂起</el-tag>
      </template>
      <template #processInstanceName="scope">
        {{ scope.row.processInstance.name }}
      </template>
      <template #processInstanceStartUserNickname="scope">
        {{ scope.row.processInstance.startUserNickname }}
      </template>
      <template #menu="{ row }">
        <el-button link type="primary" @click="handleAudit(row)">审批</el-button>
        <el-button link type="primary" @click="handleCC(row)">抄送</el-button>
      </template>
    </avue-crud>
    <TaskCCDialogForm ref="taskCCDialogForm" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import * as TaskApi from '@/api/bpm/task'
import TaskCCDialogForm from '../../processInstance/detail/TaskCCDialogForm.vue'

const { getCurrPermi } = useCrudPermi()

defineOptions({ name: 'BpmDoneTask' })

// const message = useMessage() // 消息弹窗
// const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  column: {
    id: {
      label: '任务编号',
      width: 300,
      display: false
    },
    name: {
      label: '任务名称',
      search: true
    },
    processInstanceName: {
      label: '所属流程'
    },
    processInstanceStartUserNickname: {
      label: '流程发起人'
    },
    suspensionState: {
      label: '任务状态',

      type: 'select',
      span: 12,
      dicData: []
    },
    createTime: {
      label: '创建时间',
      searchRange: true,
      search: true,
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

const popupObj = ref({ detail: false })
const currRow = ref<any>({})
const permission = getCurrPermi(['bpm:task'])
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
    const data = await TaskApi.getTodoTaskPage(searchObj)
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

/** 处理审批按钮 */
const handleAudit = (row) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstance.id
    }
  })
}

const taskCCDialogForm = ref()
/** 处理抄送按钮 */
const handleCC = (row) => {
  taskCCDialogForm.value.open(row)
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
