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
      <template #type="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE"
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
      <!-- 自定义操作栏 -->
      <template #menu="{ row }">
        <el-button
          v-if="row.status === 0"
          class="ml-4px!"
          v-hasPermi="['system:notify-template:send-notify']"
          link
          @click="openSendForm(row)"
          type="primary"
        >
          <Icon :size="14" icon="ep:document"></Icon>
          <span>测试</span>
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 表单弹窗：测试发送 -->
  <DesignPopup
    v-model="testPopup"
    title="发送站内信模板测试"
    :is-footer="true"
    width="40%"
    class="notify-template-popup"
  >
    <div class="p-20px">
      <avue-form ref="textFormRef" v-if="testPopup" v-model="testFormData" :option="testFormOption">
        <template #userId="{ column, disabled }">
          <avue-input-number
            v-if="testFormData.userType == 1"
            v-model="testFormData.userId"
            placeholder="请输入 接收人ID"
            :controls="false"
          ></avue-input-number>
          <UserSelect
            v-if="testFormData.userType == 2"
            v-model="testFormData.userId"
            :column="column"
            :disabled="disabled"
            type="edit"
            prop="userId"
          ></UserSelect>
        </template>
      </avue-form>
    </div>
    <template #footer>
      <el-button :loading="textLoading" type="primary" @click="testSubmitFun">发 送</el-button>
      <el-button @click="testPopup = false">取 消</el-button>
    </template>
  </DesignPopup>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as NotifyTemplateApi from '@/api/system/notify/template'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'NotifySmsTemplate' })

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
  labelWidth: 100,
  span: 24,
  dialogWidth: '55%',
  overHidden: true,
  searchLabelWidth: 90,
  column: {
    code: {
      label: '模板编码',
      minWidth: 90,
      span: 12,
      rules: [{ required: true, message: '模板编码不能为空', trigger: 'blur' }]
    },
    name: {
      label: '模板名称',
      search: true,
      span: 12,
      minWidth: 90,
      rules: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
    },
    nickname: {
      label: '发送人名称',
      search: true,
      minWidth: 90,
      rules: [{ required: true, message: '发送人名称不能为空', trigger: 'blur' }]
    },
    content: {
      label: '模板内容',
      minWidth: 100,
      rules: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }],
      type: 'textarea',
      minRows: 2,
      maxRows: 4
    },
    type: {
      label: '类型',
      type: 'select',
      span: 12,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_NOTIFY_TEMPLATE_TYPE),
      rules: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      span: 12,
      width: 80,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    remark: {
      label: '备注',
      type: 'textarea',
      minWidth: 130,
      minRows: 2,
      maxRows: 4
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
const permission = getCurrPermi(['system:notify-template'])
const userOption: any = ref([])
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
    const data = await NotifyTemplateApi.getNotifyTemplatePage(searchObj)
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
    tableForm.value = await NotifyTemplateApi.getNotifyTemplate(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await NotifyTemplateApi.createNotifyTemplate(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await NotifyTemplateApi.updateNotifyTemplate(form).catch(() => false)
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
    await NotifyTemplateApi.deleteNotifyTemplate(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 发送站内信按钮 */
// 测试表单配置
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
const openSendForm = async (row: NotifyTemplateApi.NotifyTemplateVO) => {
  loading.value = true
  const formDatas = await NotifyTemplateApi.getNotifyTemplate(row.id || 0)
  testFormData.value = {
    content: formDatas.content,
    params: formDatas.params,
    templateCode: formDatas.code,
    userType: 1,
    templateParams: {}
  }
  testFormOption.value.column = {
    content: { label: '模板内容', type: 'textarea', disabled: true },
    userType: {
      label: '用户类型',
      type: 'radio',
      dicData: getIntDictOptions(DICT_TYPE.USER_TYPE),
      control: (val) => {
        const label = val != 1 ? '接收人' : '接收人ID'
        return {
          userId: {
            label,
            rules: [{ required: true, message: `${label}不能为空`, trigger: 'change' }]
          }
        }
      }
    },
    userId: {
      label: '接收人',
      findType: 'all',
      multiple: false,
      columnKey: ['sex', 'post', 'deptName']
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
      const logId = await NotifyTemplateApi.sendNotify({
        userId: testFormData.value.userId,
        userType: testFormData.value.userType,
        templateCode: testFormData.value.templateCode,
        templateParams: testFormData.value.templateParams
      })
      if (logId) {
        message.success('提交发送成功！发送结果见消息记录，编号：' + logId)
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
.notify-template-popup {
  .el-form-item__label {
    height: auto;
    min-height: 32px;
    overflow-wrap: anywhere;
  }
}
</style>
