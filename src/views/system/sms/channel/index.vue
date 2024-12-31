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
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #code="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE"
          :value="scope.row.code ? scope.row.code : ''"
        />
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.COMMON_STATUS"
          :value="scope.row.status"
        />
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as SmsChannelApi from '@/api/system/sms/smsChannel'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemSmsChannel' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  labelWidth: 140,
  span: 24,
  dialogWidth: '50%',
  menuWidth: 160,
  overHidden:true,
  column: {
    id: {
      label: '编号',
      width: 80,
      display: false
    },
    signature: {
      label: '短信签名',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '短信签名不能为空', trigger: 'blur' }]
    },
    code: {
      label: '渠道编码',
      type: 'select',
      span: 12,
      minWidth: 100,
      dicData: getStrDictOptions(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE),
      rules: [{ required: true, message: '渠道编码不能为空', trigger: 'blur' }]
    },
    status: {
      label: '启用状态',
      search: true,
      type: 'radio',
      span: 12,
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      value: CommonStatusEnum.ENABLE
    },
    remark: {
      label: '备注',
      minWidth: 100,
      overHidden: true
    },
    apiKey: {
      label: '短信 API 的账号',
      overHidden: true,
      minWidth: 150,
      rules: [{ required: true, message: '短信 API 的账号不能为空', trigger: 'blur' }]
    },
    apiSecret: {
      label: '短信 API 的密钥',
      minWidth: 150,
      overHidden: true
    },
    callbackUrl: {
      label: '短信发送回调 URL',
      minWidth: 120
    },
    createTime: {
      label: '创建时间',
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
}) //表格配置
const tableForm = ref<{ id?: number }>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi(['system:sms-channel'])

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
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await SmsChannelApi.getSmsChannelPage(searchObj)
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
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await SmsChannelApi.getSmsChannel(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await SmsChannelApi.createSmsChannel(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await SmsChannelApi.updateSmsChannel(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (form, index) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SmsChannelApi.deleteSmsChannel(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
