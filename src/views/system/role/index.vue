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
          v-hasPermi="['system:role:export']"
          >导出</el-button
        >
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
          v-hasPermi="['system:permission:assign-role-menu']"
          link
          preIcon="ep:basketball"
          title="菜单权限"
          type="primary"
          @click="openAssignMenuForm(row)"
        >
          <Icon :size="14" icon="ep:menu"></Icon>
          <span>菜单权限</span>
        </el-button>
        <el-button
          v-hasPermi="['system:permission:assign-role-data-scope']"
          link
          preIcon="ep:coin"
          title="数据权限"
          type="primary"
          @click="openDataPermissionForm(row)"
        >
          <Icon :size="14" icon="ep:menu"></Icon>
          <span>数据权限</span>
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 表单弹窗：菜单权限 -->
  <RoleAssignMenuForm ref="assignMenuFormRef" @success="getTableData" />
  <!-- 表单弹窗：数据权限 -->
  <RoleDataPermissionForm ref="dataPermissionFormRef" @success="getTableData" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as RoleApi from '@/api/system/role'
import { CommonStatusEnum } from '@/utils/constants'
import RoleAssignMenuForm from './RoleAssignMenuForm.vue'
import RoleDataPermissionForm from './RoleDataPermissionForm.vue'

defineOptions({ name: 'SystemRole' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  menuWidth: 360,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 12,
  dialogWidth: '50%',
  column: {
    id: { label: '角色编号', display: false, width: 90 },
    name: {
      label: '角色名称',
      search: true,
      minWidth: 90,
      rules: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
    },
    type: {
      label: '角色类型',
      type: 'select',
      minWidth: 90,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_ROLE_TYPE),
      rules: [{ required: true, message: '角色类型不能为空', trigger: 'blur' }],
      display: false
    },
    code: {
      label: '角色标识',
      search: true,
      minWidth: 90,
      rules: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }]
    },
    sort: {
      label: '显示顺序',
      width: 85,
      type: 'number',
      rules: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'select',
      width: 85,
      span: 24,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    remark: {
      label: '备注',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      minWidth: 120,
      span: 24
    },
    createTime: {
      label: '创建时间',
      search: true,
      searchRange: true,
      type: 'date',
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      width: 180,
      display: false,
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
const permission = getCurrPermi(['system:role'])

const crudRef = ref()

useCrudHeight(crudRef)

const exportLoading = ref(false) // 导出的加载中

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
    const data = await RoleApi.getRolePage(searchObj)
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
    const res = await RoleApi.getRole(tableForm.value.id)
    tableForm.value = res
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await RoleApi.createRole(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await RoleApi.updateRole(form).catch(() => false)
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
    await RoleApi.deleteRole(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 数据权限操作 */
const dataPermissionFormRef = ref()
const openDataPermissionForm = async (row: RoleApi.RoleVO) => {
  dataPermissionFormRef.value.open(row)
}

/** 菜单权限操作 */
const assignMenuFormRef = ref()
const openAssignMenuForm = async (row: RoleApi.RoleVO) => {
  assignMenuFormRef.value.open(row)
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
    const data = await RoleApi.exportRole(searchObj)
    download.excel(data, '角色列表.xls')
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
<style lang="scss" scoped>
.cardHeight {
  width: 100%;
  max-height: 340px;
  overflow-y: scroll;
}
</style>
