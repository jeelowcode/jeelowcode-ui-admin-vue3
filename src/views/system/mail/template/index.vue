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
      <!-- 表格 -->
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
          link
          type="primary"
          @click="openSendForm(row.id)"
          v-hasPermi="['system:mail-template:send-mail']"
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
    title="发送邮箱模板测试"
    :is-footer="true"
    width="40%"
    class="mail-template-popup"
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as MailTemplateApi from '@/api/system/mail/template'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemMailTemplate' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  searchLabelWidth: 140,
  labelSuffix: ' ',
  labelWidth: 160,
  span: 24,
  dialogWidth: '70%',
  overHidden: true,
  column: {
    code: {
      label: '模板编码',
      search: true,
      minWidth: 100,
      span: 12,
      rules: [{ required: true, message: '模板编码不能为空', trigger: 'blur' }]
    },
    name: {
      label: '模板名称',
      search: true,
      minWidth: 100,
      span: 12,
      rules: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
    },
    title: {
      label: '模板标题',
      minWidth: 100,
      overHidden: true
    },
    content: {
      label: '模板内容',
      minWidth: 100,
      type: 'ueditor',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (!value || !value.replace(/<[\s\S]*?>|[' ']/g, '')) {
              callback(new Error('模板内容不能为空'))
            } else callback()
          },
          required: true,
          trigger: 'blur'
        }
      ]
    },
    accountId: {
      label: '邮箱账号',
      minWidth: 120,
      search: true,
      type: 'select',
      span: 12,
      dicUrl: '/system/mail-account/simple-list',
      props: { label: 'mail', value: 'id' },
      dicFlag: true,
      rules: [{ required: true, message: '邮箱账号不能为空', trigger: 'blur' }]
    },
    nickname: {
      label: '发送人名称',
      minWidth: 100,
      span: 12
    },
    status: {
      label: '开启状态',
      search: true,
      type: 'select',
      span: 12,
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '开启状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    remark: {
      label: '备注',
      minWidth: 130
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
const permission = getCurrPermi(['system:mail-template'])
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
    const data = await MailTemplateApi.getMailTemplatePage(searchObj)
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
    tableForm.value = await MailTemplateApi.getMailTemplate(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await MailTemplateApi.createMailTemplate(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await MailTemplateApi.updateMailTemplate(form).catch(() => false)
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
    await MailTemplateApi.deleteMailTemplate(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
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
  const formDatas = await MailTemplateApi.getMailTemplate(id)
  testFormData.value = {
    content: formDatas.content,
    params: formDatas.params,
    templateCode: formDatas.code,
    templateParams: {}
  }
  testFormOption.value.column = {
    content: {
      label: '模板内容',
      type: 'ueditor',
      disabled: true,
      className: 'mail-template-ueditor',
      customConfig: {
        toolbarKeys: []
      }
    },
    mail: {
      label: '收件邮箱',
      rules: [
        { required: true, message: '收件邮箱不能为空', trigger: 'blur' },
        {
          type: 'email',
          message: t('profile.rules.truemail'),
          trigger: ['blur', 'change']
        }
      ]
    }
  }
  // 设置动态参数
  if (formDatas.params?.length) {
    formDatas.params.forEach((item) => {
      testFormData.value.templateParams[item] = ''
      testFormOption.value.column[item] = {
        label: `参数 ${item}`,
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
      const logId = await MailTemplateApi.sendMail({
        mail: testFormData.value.mail,
        templateCode: testFormData.value.templateCode,
        templateParams: testFormData.value.templateParams
      })
      if (logId) {
        message.success('提交发送成功！发送结果见邮件记录，编号：' + logId)
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
.mail-template-popup {
  .el-form-item__label {
    height: auto;
    min-height: 32px;
    overflow-wrap: anywhere;
  }
}

.mail-template-ueditor {
  .avue-ueditor {
    div:nth-child(2) {
      height: 200px !important;
    }
  }
}
</style>
