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
      <template #menu-left="{ size }">
        <el-button
          type="success"
          plain
          :size="size"
          icon="el-icon-download"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:login-log:export']"
          >导出</el-button
        >
      </template>
      <!-- 表格 -->
      <template #logType="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_LOGIN_TYPE"
          :value="scope.row.logType != undefined ? scope.row.logType : ''"
        />
      </template>
      <template #result="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_LOGIN_RESULT"
          :value="scope.row.result != undefined ? scope.row.result : ''"
        />
      </template>
      <!-- 表单 -->
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as LoginLogApi from '@/api/system/loginLog'

defineOptions({ name: 'SystemLoginLog' })

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
    logType: {
      label: '操作类型',
      width: 100,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_LOGIN_TYPE),
      value: ''
    },
    username: {
      label: '用户名称'
    },
    userIp: {
      label: '登录地址',
      minWidth: 120
    },
    userAgent: {
      label: '浏览器',
      width: 400,
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      overHidden: true
    },
    searchCreateTime: {
      label: '登录日期',
      search: true,
      hide: true,
      display: false,
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    },
    createTime: {
      label: '登录日期',
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    result: {
      label: '登陆结果',
      width: 90,
      search: true,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_LOGIN_RESULT),
      value: ''
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
const exportLoading = ref(false) // 导出的加载中
const permission = getCurrPermi(['system:login-log'])
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
  }
  delete searchObj.searchCreateTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await LoginLogApi.getLoginLogPage(searchObj)
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
    let searchObj = { ...tableSearch.value }
    if (searchObj.searchCreateTime?.length) {
      searchObj.createTime = [
        `${searchObj.searchCreateTime[0]} 00:00:00`,
        `${searchObj.searchCreateTime[1]} 23:59:59`
      ]
    }
    delete searchObj.searchCreateTime
    for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
    const data = await LoginLogApi.exportLoginLog(searchObj)
    download.excel(data, '登录日志.xls')
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
