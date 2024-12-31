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
      @search-change="searchChange"
      @search-reset="resetChange"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #category="{row}">
        <dict-tag :type="DICT_TYPE.BPM_MODEL_CATEGORY" :value="row.category || ''" />
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS"
          :value="scope.row.status"
        />
      </template>
      <template #tasks="scope">
        <el-button type="primary" v-for="task in scope.row.tasks" :key="task.id" link>
          <span>{{ task.name }}</span>
        </el-button>
      </template>
      <template #result="scope">
        <dict-tag
          v-if="scope.row.result !== undefined"
          :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT"
          :value="scope.row.result"
        />
      </template>
      <template #menu-left>
        <el-button type="primary" v-hasPermi="['bpm:process-instance:query']" @click="handleCreate">
          <Icon icon="ep:plus" class="mr-5px" /> 发起流程
        </el-button>
      </template>
      <!-- 自定义操作栏 -->
      <template #menu="{ row }">
        <el-button
          link
          type="primary"
          v-hasPermi="['bpm:process-instance:cancel']"
          @click="handleDetail(row)"
        >
          详情
        </el-button>
        <el-button
          link
          type="danger"
          v-if="row.result === 1"
          v-hasPermi="['bpm:process-instance:query']"
          @click="handleCancel(row)"
        >
          取消
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'

defineOptions({ name: 'BpmCCProcessInstance' })
const router = useRouter() // 路由
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

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
  menuWidth: 170,
  column: {
    id: {
      label: '流程编号',
      width: 320
    },
    name: {
      label: '流程名称',
      search: true
    },
    category: {
      label: '流程分类',
      search: true,
      type: 'select',
      span: 12,
      dicData: getIntDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY),
      rules: [{ required: true, message: '流程分类不能为空', trigger: 'blur' }]
    },
    tasks: {
      label: '当前审批任务'
    },
    status: {
      label: '状态',
      search: true,
      type: 'select',
      span: 12,
      dicData: getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
    },
    result: {
      label: '结果',
      search: true,
      type: 'select',
      span: 12,
      dicData: getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT),
      rules: [{ required: true, message: '结果不能为空', trigger: 'blur' }]
    },
    createTime: {
      label: '提交时间',
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
    },
    endTime: {
      label: '结束时间',
      searchRange: true,
      display: false,
      type: 'datetime',
      width: 180,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    }
  }
})
//表格配置
const tableForm = ref<{ id?: number }>({})
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const permission = getCurrPermi(['bpm:process-instance'])
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
    searchObj.createTime[0] = `${searchObj.createTime[0]} 00:00:00`
    searchObj.createTime[1] = `${searchObj.createTime[1]} 23:59:59`
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await ProcessInstanceApi.getMyProcessInstancePage(searchObj)
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
/** 取消按钮操作 */
const handleCancel = async (row) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空'
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstance(row.id, value)
  message.success('取消成功')
  // 刷新列表
  await getTableData()
}

/** 发起流程操作 **/
const handleCreate = () => {
  router.push({
    name: 'BpmProcessInstanceCreate'
  })
}
/** 查看详情 */
const handleDetail = (row) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.id
    }
  })
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
