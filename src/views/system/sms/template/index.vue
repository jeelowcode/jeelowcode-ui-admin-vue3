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
      <template #menu-left="{ size }">
        <el-button
          type="success"
          plain
          :size="size"
          icon="el-icon-download"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:sms-template:export']"
          >导出</el-button
        >
      </template>
      <!-- 表格 -->
      <template #type="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE"
          :value="scope.row.type ? scope.row.type : ''"
        />
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.COMMON_STATUS"
          :value="scope.row.status"
        />
      </template>
      <template #channelCode="{ row }">
        <div>
          {{ channelObj[row.channelId] }}
        </div>
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE"
          :value="row.channelCode ? row.channelCode : ''"
        />
      </template>

      <!-- 自定义操作栏 -->
      <template #menu="{ row }">
        <el-button
          v-if="row.status === 0"
          class="ml-4px!"
          link
          type="primary"
          @click="openSendForm(row.id)"
          v-hasPermi="['system:sms-template:send-sms']"
        >
          <Icon :size="14" icon="ep:tickets"></Icon>
          <span>测试</span>
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 表单弹窗：测试发送 -->
  <DesignPopup
    v-model="testPopup"
    title="发送短信模板测试"
    :is-footer="true"
    width="40%"
    class="sms-template-popup"
  >
    <div class="p-20px">
      <avue-form
        ref="textFormRef"
        v-if="testPopup"
        v-model="testFormData"
        :option="testFormOption"
      ></avue-form>
    </div>
    <template #footer>
      <el-button :loading="textLoading" type="primary" @click="testSubmitFun">发 送</el-button>
      <el-button @click="testPopup = false">取 消</el-button>
    </template>
  </DesignPopup>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as SmsTemplateApi from '@/api/system/sms/smsTemplate'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemSmsTemplate' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const channelObj = ref({})
const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  labelWidth: 120,
  span: 24,
  dialogWidth: '50%',
  column: {
    channelId: {
      label: '短信渠道编号',
      type: 'select',
      hide: true,
      order: 10,
      searchOrder: 1,
      span: 12,
      dicUrl: '/system/sms-channel/simple-list',
      dicFormatter: (data) => {
        data = data.map((item) => {
          channelObj.value[item.id] = item.signature
          return {
            label: `${item.signature}【${getDictLabel(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, item.code)}】`,
            value: item.id
          }
        })
        return data
      },
      dicFlag: true,
      search: true,
      searchLabel: '短信渠道',
      rules: [{ required: true, message: '短信渠道编号不能为空', trigger: 'change' }]
    },

    code: {
      label: '模板编码',
      search: true,
      overHidden: true,
      minWidth: 100,
      span: 12,
      order: 8,
      searchOrder: 5,
      rules: [{ required: true, message: '模板编码不能为空', trigger: 'blur' }]
    },
    name: {
      label: '模板名称',
      overHidden: true,
      minWidth: 120,
      span: 12,
      order: 7,
      rules: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
    },
    content: {
      label: '模板内容',
      overHidden: true,
      type: 'textarea',
      minWidth: 120,
      order: 6,
      rules: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }]
    },
    type: {
      label: '短信类型',
      search: true,
      type: 'select',
      span: 12,
      minWidth: 100,
      order: 9,
      searchOrder: 4,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE),
      rules: [{ required: true, message: '短信类型不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      span: 24,
      width: 80,
      order: 5,
      searchOrder: 3,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    remark: {
      label: '备注',
      order: 3,
      minWidth: 150
    },
    apiTemplateId: {
      label: '短信 API 的模板编号',
      search: true,
      minWidth: 100,
      order: 4,
      searchOrder: 2,
      searchLabelWidth: 160,
      rules: [{ required: true, message: '短信 API 的模板编号不能为空', trigger: 'blur' }]
    },
    channelCode: {
      label: '短信渠道',
      display: false,
      span: 12,
      minWidth: 100
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
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const exportLoading = ref(false) // 导出的加载中
const permission = getCurrPermi(['system:sms-template'])

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
    const data = await SmsTemplateApi.getSmsTemplatePage(searchObj)
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
    tableForm.value = await SmsTemplateApi.getSmsTemplate(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await SmsTemplateApi.createSmsTemplate(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await SmsTemplateApi.updateSmsTemplate(form).catch(() => false)
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
    await SmsTemplateApi.deleteSmsTemplate(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
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
    const data = await SmsTemplateApi.exportSmsTemplate(searchObj)
    download.excel(data, '短信模板列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 发送短信按钮 */
const testPopup = ref(false)
const testFormData = ref<any>({})
const testFormOption = ref({
  submitBtn: false,
  emptyBtn: false,
  span: 24,
  labelWidth: 120,
  column: {}
})
const textLoading = ref(false)
const textFormRef = ref()

// 打开测试表单
const openSendForm = async (id: number) => {
  loading.value = true
  const formDatas = await SmsTemplateApi.getSmsTemplate(id)
  testFormData.value = {
    content: formDatas.content,
    params: formDatas.params,
    templateCode: formDatas.code,
    templateParams: {}
  }
  testFormOption.value.column = {
    content: { label: '模板内容', type: 'textarea', disabled: true },
    mobile: {
      label: '手机号',
      rules: [{ required: true, message: `手机号不能为空`, trigger: 'blur' }]
    }
  }
  // 设置动态参数
  if (formDatas.params?.length) {
    formDatas.params.forEach((item) => {
      testFormData.value.templateParams[item] = ''
      testFormOption.value.column[item] = {
        label: `参数 ${item} `,
        value: '',
        bind: `templateParams.${item}`,
        rules: [{ required: true, message: `参数 ${item} 不能为空`, trigger: 'blur' }]
      }
    })
  }
  loading.value = false
  testPopup.value = true
}

// 提交表单
const testSubmitFun = () => {
  textFormRef.value.validate(async (valid, hide) => {
    if (!valid) return hide()
    try {
      textLoading.value = true
      const logId = await SmsTemplateApi.sendSms({
        mobile: testFormData.value.mobile,
        templateCode: testFormData.value.templateCode,
        templateParams: testFormData.value.templateParams
      })
      if (logId) {
        message.success('提交发送成功！发送结果见短信日志，日志编号：' + logId)
      }
      testPopup.value = false
    } finally {
      hide()
      textLoading.value = false
    }
  })
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>

<style lang="scss">
.sms-template-popup {
  .el-form-item__label {
    height: auto;
    min-height: 32px;
    overflow-wrap: anywhere;
  }
}
</style>
