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
      <!-- 表格 -->
      <template #userType="scope">
        <dict-tag
          :type="DICT_TYPE.USER_TYPE"
          :value="scope.row.userType != undefined ? scope.row.userType : ''"
        />
      </template>
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
      <template #templateParams-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">{{ JSON.stringify(value) }}</div>
      </template>
      <template #readStatus-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <dict-tag
            :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
      <template #userType-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="value != undefined ? value : ''" />
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
defineOptions({ name: 'SystemNotifyMessage' })

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
  labelWidth: 160,
  span: 24,
  dialogWidth: '50%',
  menuWidth: 120,
  column: {
    id: {
      label: '编号',
      width: 80
    },
    userType: {
      label: '用户类型',
      search: true,
      minWidth: 90,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.USER_TYPE),
      value: ''
    },
    userId: {
      label: '用户编号',
      search: true,
      minWidth: 90
    },
    templateId: {
      label: '模板编号',
      minWidth: 90,
      hide: true
    },
    templateCode: {
      label: '模板编码',
      minWidth: 90,
      search: true
    },
    templateNickname: {
      label: '发送人名称',
      minWidth: 100
    },
    templateContent: {
      label: '模版内容',
      width: 200,
      overHidden: true
    },
    templateParams: {
      label: '模版参数',
      width: 200,
      overHidden: true
    },
    templateType: {
      label: '模版类型',
      search: true,
      type: 'select',
      minWidth: 100,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE),
      value: ''
    },
    readStatus: {
      label: '是否已读',
      type: 'select',
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING),
      value: ''
    },
    readTime: {
      label: '阅读时间',
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    searchCreateTime: {
      label: '创建时间',
      search: true,
      hide: true,
      display: false,
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    },
    createTime: {
      label: '创建时间',
      type: 'datetime',
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
const permission = getCurrPermi(['system:notify-message'])
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
    searchObj.createTime = getSearchDate(searchObj.searchCreateTime)
  }
  delete searchObj.searchCreateTime
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await NotifyMessageApi.getNotifyMessagePage(searchObj)
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
    // tableForm.value = await NotifyMessageApi.getDictType(tableForm.value.id)
  }
  done()
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
