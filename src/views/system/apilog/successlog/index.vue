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
        <el-button type="danger" :size="size" @click="clearData.popup = true">
          <Icon :size="14" icon="ep:delete"></Icon>
          <span>清除日志</span>
        </el-button>
      </template>
    </avue-crud>
    <DesignPopup
      v-model="clearData.popup"
      title="清除日志"
      :width="400"
      :is-footer="true"
      :dialog-params="{}"
    >
      <div class="w-100% p-20px box-border">
        <div class="flex items-center">
          <div class="flex-basis-80px flex-shrink-0">保留时间：</div>
          <avue-select
            v-model="clearData.clearType"
            placeholder="请选择内容"
            type="tree"
            :dic="clearDic"
            :clearable="false"
          ></avue-select>
        </div>
        <avue-date
          v-show="clearData.clearType == 'custom'"
          class="ml-80px mt-5px"
          v-model="clearData.customValue"
          format="YYYY年MM月DD日"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        ></avue-date>
      </div>
      <template #footer>
        <el-button @click="clearData.popup = false">取 消</el-button>
        <el-button type="primary" @click="handleClear">确 定</el-button>
      </template>
    </DesignPopup>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { dateFormatter, formatDate } from '@/utils/formatTime'
import * as ApiLogApi from '@/api/system/apiLog'

defineOptions({ name: 'SystemApiSuccessLog' })

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
  labelWidth: 140,
  column: {
    tenantId: {
      label: '租户',
      search: true,
      type: 'select',
      dataType: 'number',
      dicUrl: '/system/tenant/page',
      props: { label: 'contactName', value: 'id' },
      dicFormatter: (res) => {
        return res.list
      }
    },
    modelTitle: {
      label: '模块名称',
      overHidden: true
    },
    title: {
      label: '请求名称',
      overHidden: true
    },
    requestUri: {
      label: '请求地址',
      search: true,
      overHidden: true
    },
    requestMethod: {
      label: '请求方式',
      hide: true
    },
    requestParams: {
      label: '请求参数',
      hide: true
    },
    ip: {
      label: '操作IP地址',
      width: 160
    },
    methodClass: {
      label: '方法类',
      hide: true
    },
    methodName: {
      label: '方法名',
      hide: true
    },
    time: {
      label: '执行时间（ms）',
      width: 130,
      search: true,
      searchLabel: '执行时间',
      searchPrepend: '大于',
      searchAppend: 'ms'
    },
    createUserName: {
      label: '请求用户',
      width: 120,
      search: true
    },
    createTime: {
      label: '请求时间',
      type: 'datetime',
      search: true,
      searchType: 'datetimerange',
      dataType: 'string',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
const clearData = ref({ popup: false, clearType: '7', customValue: '' })
const clearDic = [
  { label: '保留7天以内的数据', value: '7' },
  { label: '保留一个月以内的数据', value: '30' },
  { label: '保留三个月以内的数据', value: '90' },
  { label: '保留一年以内的数据', value: '365' },
  { label: '全部清除', value: 'all' },
  { label: '自定义', value: 'custom' }
]

const logType = 'info'
const permission = getCurrPermi(['system:login-log'])
const crudRef = ref()

useCrudHeight(crudRef)

const handleClear = async () => {
  let clearTime = ''
  const { clearType, customValue } = clearData.value
  if (clearType == 'custom') {
    if (!customValue) return message.info('请先选择保留时间')
    clearTime = customValue
  } else {
    const date = new Date()
    let time = 0
    if (clearType == 'all') time = 3600 * 1000 * 24
    else time = 3600 * 1000 * 24 * (Number(clearType) + 1)
    date.setTime(date.getTime() - time)
    clearTime = formatDate(date, 'YYYY-MM-DD')
  }
  clearData.value.popup = false
  loading.value = true
  await ApiLogApi.deleteLog(logType, clearTime).catch(() => false)
  tablePage.value.currentPage = 1
  await getTableData()
  loading.value = false
}

/** 表单打开前 */
const beforeOpen = async (done, type) => {
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await ApiLogApi.getLogDetail(logType, tableForm.value.id)
    tableForm.value.createTime = formatDate(tableForm.value.createTime, 'YYYY-MM-DD HH:mm:ss')
  }
  done()
}
/** 查询列表 */
const getTableData = async () => {
  loading.value = true

  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await ApiLogApi.getLogPage(logType, searchObj)
    tableData.value = data.records
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

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
