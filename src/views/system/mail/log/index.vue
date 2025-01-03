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
      <template #sendStatus="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_MAIL_SEND_STATUS"
          :value="scope.row.sendStatus != undefined ? scope.row.sendStatus : ''"
        />
      </template>
      <template #receiveStatus="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS"
          :value="scope.row.receiveStatus != undefined ? scope.row.receiveStatus : ''"
        />
      </template>
      <!-- 表单 -->
      <template #templateParams-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          {{ JSON.stringify(value) }}
        </div>
      </template>
      <template #sendStatus-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <dict-tag
            :type="DICT_TYPE.SYSTEM_SMS_SEND_STATUS"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
      <template #receiveStatus-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <dict-tag
            :type="DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
      <template #templateContent-form="{ value }">
        <div v-html="value"></div>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import * as MailLogApi from '@/api/system/mail/log'
defineOptions({ name: 'SystemMailLog' })
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  viewBtnText: '详情',
  viewTitle: '详情',
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
    searchSendTime: {
      label: '发送时间',
      search: true,
      hide: true,
      display: false,
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间'
    },
    sendTime: {
      label: '发送时间',
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    toMail: {
      label: '接收邮箱',
      minWidth: 100
    },
    userId: {
      label: '用户编号',
      search: true,
      minWidth: 100,
      hide: true
    },
    userType: {
      label: '用户类型',
      search: true,
      type: 'select',
      hide: true,
      dicData: getIntDictOptions(DICT_TYPE.USER_TYPE),
      value: ''
    },
    templateTitle: {
      label: '邮件标题',
      overHidden: true,
      minWidth: 100
    },
    templateContent: {
      label: '邮件内容',
      hide: true
    },
    templateParams: {
      label: '邮箱参数',
      hide: true
    },
    sendStatus: {
      label: '发送状态',
      search: true,
      width: 100,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_MAIL_SEND_STATUS),
      value: ''
    },
    accountId: {
      label: '邮箱账号',
      search: true,
      type: 'select',
      hide: true,
      dicUrl: '/system/mail-account/simple-list',
      props: { label: 'mail', value: 'id' },
      dicFlag: true
    },
    fromMail: {
      label: '发送邮箱地址',
      overHidden: true
    },
    templateId: {
      label: '模板编号',
      minWidth: 90,
      search: true
    },
    templateCode: {
      label: '模板编码',
      hide: true
    },
    templateNickname: {
      label: '模版发送人名称',
      hide: true
    },
    sendMessageId: {
      label: '发送返回的消息编号',
      hide: true
    },
    sendException: {
      label: '发送异常',
      hide: true
    },
    createTime: {
      label: '创建时间',
      searchRange: true,
      type: 'datetime',
      hide: true,
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
const permission = getCurrPermi(['system:mail-log'])
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

  if (searchObj.searchSendTime?.length) {
    searchObj.sendTime = getSearchDate(searchObj.searchSendTime)
  }
  delete searchObj.searchSendTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await MailLogApi.getMailLogPage(searchObj)
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
    tableForm.value = await MailLogApi.getMailLog(tableForm.value.id)
  }
  done()
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
