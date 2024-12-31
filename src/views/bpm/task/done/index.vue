<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      v-model:page="tablePage"
      v-model:search="tableSearch"
      :data="tableData"
      :option="tableOption"
      :before-open="beforeOpen"
      @search-change="searchChange"
      @search-reset="resetChange"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu="{ row }">
        <el-button link type="primary" @click="handleAudit(row)">流程</el-button>
      </template>
      <template #result="scope">
        <dict-tag
          v-if="scope.row.result"
          :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT"
          :value="scope.row.result"
        />
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as TaskApi from '@/api/bpm/task'

defineOptions({ name: 'BpmDoneTask' })

const { push } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  viewBtnText: '详情',
  viewBtnIcon: 'none',
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
      width: 300
    },
    name: {
      label: '任务名称',
      search: true
    },
    processInstanceName: {
      label: '所属流程',
      bind: 'processInstance.name'
    },
    processInstanceStartUserNickname: {
      label: '流程发起人',
      bind: 'processInstance.startUserNickname'
    },
    result: {
      label: '状态',
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT)
    },
    reason: {
      label: '原因'
    },
    searchCreateTime: {
      label: '创建时间',
      search: true,
      display: false,
      hide: true,
      type: 'daterange',
      searchRange: true,
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    },
    createTime: {
      label: '创建时间',
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
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

  if (searchObj.searchCreateTime?.length) {
    searchObj.createTime = [
      `${searchObj.searchCreateTime[0]} 00:00:00`,
      `${searchObj.searchCreateTime[1]} 23:59:59`
    ]
  } else delete searchObj.createTime
  delete searchObj.searchCreateTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await TaskApi.getDoneTaskPage(searchObj)
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

const beforeOpen = (done, type) => {
  done()
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

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
