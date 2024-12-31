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
      <template #sslEnable="scope">
        <template v-if="scope.row.sslEnable && scope.row.sslEnable === true">
          <el-tag type="success">是</el-tag>
        </template>
        <template v-else>
          <el-tag type="danger">否</el-tag>
        </template>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as MailAccountApi from '@/api/system/mail/account'

defineOptions({ name: 'SystemMailAccount' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  viewBtn: true,
  viewBtnText: '详情',
  viewBtnIcon: 'el-icon-view',
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  labelWidth: 140,
  span: 12,
  dialogWidth: '50%',
  overHidden: true,
  column: {
    mail: {
      label: '邮箱',
      search: true,
      minWidth: 100,
      rules: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        {
          type: 'email',
          message: t('profile.rules.truemail'),
          trigger: ['blur', 'change']
        }
      ]
    },
    username: {
      label: '用户名',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
    },
    password: {
      label: '密码',
      hide: true,
      rules: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    },
    host: {
      label: 'SMTP 服务器域名',
      minWidth: 100,
      rules: [{ required: true, message: 'SMTP 服务器域名不能为空', trigger: 'blur' }]
    },
    port: {
      label: 'SMTP 服务器端口',
      span: 12,
      type: 'number',
      value: 465,
      width: 90,
      rules: [{ required: true, message: 'SMTP 服务器端口不能为空', trigger: 'blur' }]
    },
    sslEnable: {
      label: '是否开启 SSL',
      type: 'radio',
      width: 90,
      span: 12,
      dicData: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      rules: [{ required: true, message: '是否开启 SSL不能为空', trigger: 'blur' }],
      value: true
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
const permission = getCurrPermi(['system:mail-account'])
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
    const data = await MailAccountApi.getMailAccountPage(searchObj)
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
    tableForm.value = await MailAccountApi.getMailAccount(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await MailAccountApi.createMailAccount(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await MailAccountApi.updateMailAccount(form).catch(() => false)
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
    await MailAccountApi.deleteMailAccount(form.id)
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
