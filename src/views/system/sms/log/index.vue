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
          v-hasPermi="['system:sms-log:export']"
          >导出</el-button
        >
      </template>
      <!-- 表格 -->
      <template #sendStatus="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_SEND_STATUS"
          :value="scope.row.sendStatus != undefined ? scope.row.sendStatus : ''"
        />
        <div>{{ formatDate(scope.row.sendTime) }}</div>
      </template>
      <template #receiveStatus="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS"
          :value="scope.row.receiveStatus != undefined ? scope.row.receiveStatus : ''"
        />
        <div>{{ formatDate(tableForm.receiveTime) }}</div>
      </template>
      <template #templateType="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE"
          :value="scope.row.templateType != undefined ? scope.row.templateType : ''"
        />
      </template>
      <template #channelCode="scope">
        <div>
          {{ channelObj[scope.row.channelId] }}
        </div>
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE"
          :value="scope.row.channelCode ? scope.row.channelCode : ''"
        />
      </template>
      <!-- 表单 -->
      <template #channelCode-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <span class="mr-5px"> {{ channelObj[tableForm.channelId] }}</span>
          <dict-tag
            :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
      <template #templateType-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <span class="mr-5px">{{ tableForm.templateId }} | {{ tableForm.templateCode }}</span>
          <dict-tag
            :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE"
            :value="value != undefined ? value : ''"
          />
        </div>
      </template>
      <template #templateParams-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          <span>{{ JSON.stringify(value) }}</span>
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
          {{ formatDate(tableForm.receiveTime) }}
        </div>
      </template>
      <template #apiReceiveMsg-form="{ value }">
        <div class="el-input__wrapper" style="box-shadow: none">
          {{ tableForm.apiReceiveCode }} | {{ value }}
        </div>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDate, dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import * as SmsLogApi from '@/api/system/sms/smsLog'

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
  labelWidth: 160,
  span: 24,
  dialogWidth: '50%',
  menuWidth: 120,
  column: {
    id: {
      label: '日志编号',
      width: 90
    },
    channelCode: {
      label: '短信渠道',
      type: 'select',
      minWidth: 110,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE),
      value: ''
    },
    templateId: {
      label: '模板编号',
      display: false,
      minWidth: 90
    },
    templateType: {
      label: '短信类型',
      type: 'select',
      minWidth: 100,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE),
      value: ''
    },
    apiTemplateId: {
      label: 'API 的模板编号',
      hide: true
    },
    mobile: {
      label: '手机号',
      width: 120
    },
    templateContent: {
      label: '短信内容',
      width: 300,
      overHidden: true
    },
    templateParams: {
      label: '短信参数',
      hide: true
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
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    sendStatus: {
      label: '发送状态',
      width: 200,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SMS_SEND_STATUS),
      value: ''
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
      hide: true,
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    apiSendMsg: {
      label: 'API 发送结果',
      hide: true
    },
    apiSerialNo: {
      label: 'API 短信编号',
      hide: true
    },
    apiRequestId: {
      label: 'API 请求编号',
      display: false,
      hide: true
    },
    receiveStatus: {
      label: 'API 接收状态',
      width: 110,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS),
      value: ''
    },
    apiReceiveMsg: {
      label: 'API 接收结果',
      hide: true
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
const channelObj = ref<object>({}) // 短信渠道
const permission = getCurrPermi(['system:sms-log'])
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
  if (searchObj.searchSendTime?.length) {
    searchObj.sendTime = [
      `${searchObj.searchSendTime[0]} 00:00:00`,
      `${searchObj.searchSendTime[1]} 23:59:59`
    ]
  }
  delete searchObj.searchSendTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await SmsLogApi.getSmsLogPage(searchObj)
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
    for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
    const data = await SmsLogApi.exportSmsLog(searchObj)
    download.excel(data, '短信日志.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
  // 加载渠道列表
  const channelList = await SmsChannelApi.getSimpleSmsChannelList()
  channelList.forEach((item) => {
    channelObj.value[item.id] = item.signature
  })
})
</script>
