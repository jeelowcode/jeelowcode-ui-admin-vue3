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
          v-hasPermi="['system:tenant:export']"
          >导出</el-button
        >
      </template>
      <template #packageId="scope">
        <el-tag v-if="scope.row.packageId === 0" type="danger">系统租户</el-tag>
        <el-tag v-else type="success">
          {{ scope.row.$packageId }}
        </el-tag>
      </template>
      <template #accountCount="scope">
        <el-tag>{{ scope.row.accountCount }}</el-tag>
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as TenantApi from '@/api/system/tenant'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemTenant' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  span: 12,
  dialogWidth: '50%',
  menuWidth: 160,
  column: {
    id: {
      label: '租户编号',
      width: 90,
      display: false
    },
    name: {
      label: '租户名',
      search: true,
      minWidth: 80,
      rules: [{ required: true, message: '租户名不能为空', trigger: 'blur' }]
    },
    packageId: {
      label: '租户套餐',
      type: 'select',
      dicUrl: '/system/tenant-package/simple-list',
      dicFlag: true,
      props: {
        label: 'name',
        value: 'id'
      },
      width: 100,
      overHidden: false,
      rules: [{ required: true, message: '租户套餐不能为空', trigger: 'blur' }]
    },
    contactName: {
      label: '联系人',
      width: 80,
      search: true,
      rules: [{ required: true, message: '联系人不能为空', trigger: 'blur' }]
    },
    contactMobile: {
      label: '联系手机',
      width: 115,
      search: true
    },
    username: {
      label: '用户账号',
      rules: [{ required: true, message: '用户账号不能为空', trigger: 'blur' }],
      hide: true,
      showColumn: false,
      editDisplay: false,
      value: 'admin'
    },
    password: {
      label: '用户密码',
      rules: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
      type: 'password',
      hide: true,
      showColumn: false,
      editDisplay: false
    },
    accountCount: {
      label: '账号额度',
      width: 90,
      rules: [{ required: true, message: '账号额度不能为空', trigger: 'blur' }],
      type: 'number'
    },
    expireTime: {
      label: '过期时间',
      rules: [{ required: true, message: '过期时间不能为空', trigger: 'blur' }],
      type: 'date',
      width: 160,
      valueFormat: 'x',
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    website: {
      label: '绑定域名',
      rules: [{ required: true, message: '绑定域名不能为空', trigger: 'blur' }],
      alone: true,
      type: 'url',
      dataType: 'string',
      minWidth: 120
    },
    status: {
      label: '租户状态',
      search: true,
      type: 'radio',
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '租户状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },

    createTime: {
      label: '创建时间',
      search: true,
      searchRange: true,
      display: false,
      type: 'date',
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      width: 160,
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
const permission = getCurrPermi(['system:tenant'])
const exportLoading = ref(false) // 导出的加载中

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
  console.log(searchObj.createTime)
  if (searchObj.createTime?.length) {
    searchObj.createTime = getSearchDate(searchObj.createTime)
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await TenantApi.getTenantPage(searchObj)
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
    loading.value = true
    tableForm.value = await TenantApi.getTenant(tableForm.value.id)
    loading.value = false
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await TenantApi.createTenant(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  delete form.password
  delete form.username
  let bool = await TenantApi.updateTenant(form).catch(() => false)
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
    await TenantApi.deleteTenant(form.id)
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
    const data = await TenantApi.exportTenant(searchObj)
    download.excel(data, '租户列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
