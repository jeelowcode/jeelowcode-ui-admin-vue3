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
      @selection-change="selectionChange"
      @search-change="searchChange"
      @search-reset="resetChange"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu-left="{ size }">
        <el-button @click="handleUpdateList" :size="size" :disabled="!tableSelect.length">
          <Icon icon="ep:reading" class="mr-5px" /> 设置已读
        </el-button>
        <el-button @click="handleUpdateAll" :size="size">
          <Icon icon="ep:reading" class="mr-5px" /> 全部已读
        </el-button>
      </template>
      <!-- 表格 -->
      <template #readStatus="scope">
        <dict-tag
          :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
          :value="scope.row.readStatus != undefined ? scope.row.readStatus : ''"
        />
      </template>
      <template #templateType="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE"
          :value="scope.row.templateType != undefined ? scope.row.templateType : ''"
        />
      </template>
      <!-- 表单 -->
      <template #readStatus-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <dict-tag
            :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
      <template #templateType-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <dict-tag
            :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getBoolDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
defineOptions({ name: 'SystemNotifyMessage' })

const message = useMessage()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  viewBtnText: '查看',
  viewBtnIcon: ' ',
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  labelWidth: 160,
  span: 24,
  dialogWidth: '50%',
  menuWidth: 120,
  selection: true,
  reserveSelection: true,
  column: {
    templateNickname: {
      label: '发送人',
      width: 140
    },
    searchCreateTime: {
      label: '发送时间',
      search: true,
      hide: true,
      display: false,
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    },
    createTime: {
      label: '发送时间',
      searchRange: true,
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    templateType: {
      label: '类型',
      width: 120,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE)
    },
    templateContent: {
      label: '消息内容',
      type: 'textarea',
      overHidden: true
    },
    readStatus: {
      label: '是否已读',
      type: 'select',
      width: 90,
      search: true,
      dicData: getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)
    },
    readTime: {
      label: '阅读时间',
      type: 'datetime',
      width: 180,
      viewDisplay: true,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    }
  },
  selectable: (row) => {
    return !row.readStatus
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
const tableSelect = ref<any[]>([])
const crudRef = ref()

useCrudHeight(crudRef)

/** 标记一条站内信已读 */
const handleReadOne = async (id) => {
  loading.value = true
  await NotifyMessageApi.updateNotifyMessageRead(id)
  await getTableData()
}

/** 标记全部站内信已读 **/
const handleUpdateAll = async () => {
  loading.value = true
  await NotifyMessageApi.updateAllNotifyMessageRead()
  message.success('全部已读成功！')
  crudRef.value.clearSelection()
  await getTableData()
}

/** 标记一些站内信已读 **/
const handleUpdateList = async () => {
  if (tableSelect.value.length === 0) {
    return
  }
  const ids = tableSelect.value.map((item) => item.id)
  await NotifyMessageApi.updateNotifyMessageRead(ids)
  message.success('批量已读成功！')
  crudRef.value.clearSelection()
  await getTableData()
}

/** 查询列表 */
const getTableData = async () => {
  loading.value = true

  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }

  if (searchObj.searchCreateTime?.length) {
    searchObj.createTime = getSearchDate(searchObj.searchCreateTime)
  }
  delete searchObj.searchCreateTime
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await NotifyMessageApi.getMyNotifyMessagePage(searchObj)
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
  if (['view'].includes(type) && !tableForm.value.readStatus) {
    handleReadOne(tableForm.value.id)
  }
  tableOption.column.readTime.viewDisplay = tableForm.value.readStatus
  done()
}

const selectionChange = (data) => {
  tableSelect.value = data
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
