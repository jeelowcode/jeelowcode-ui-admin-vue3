<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <ContentWrap>
        <avue-tree
          ref="treeRef"
          :option="treeOption"
          :data="treeData"
          @node-click="nodeClick"
        ></avue-tree>
      </ContentWrap>
    </el-col>
    <el-col :span="20">
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
          @refresh-change="getTableData"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <template #menu-left="{ size }">
            <el-button
              type="warning"
              plain
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >
              <Icon icon="ep:upload" /> 导入
            </el-button>
            <el-button
              type="success"
              plain
              :size="size"
              icon="el-icon-download"
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['system:user:export']"
              >导出</el-button
            >
          </template>
          <template #menu="{ row }">
            <el-dropdown
              @command="(command) => handleCommand(command, row)"
              v-hasPermi="[
                'system:user:delete',
                'system:user:update-password',
                'system:permission:assign-user-role'
              ]"
            >
              <div class="pt-3px pr-2px pb-4px pl-2px cursor-pointer">
                <el-text type="primary">
                  <span>更多</span>
                  <Icon :size="16" icon="iconamoon:arrow-down-2-light" />
                </el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    command="handleRole"
                    v-if="checkPermi(['system:permission:assign-user-role'])"
                  >
                    <Icon icon="ep:circle-check" />分配角色
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="handleResetPwd"
                    v-if="checkPermi(['system:user:update-password'])"
                  >
                    <Icon icon="ep:key" />重置密码
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="handleDelete"
                    v-if="checkPermi(['system:user:delete'])"
                  >
                    <Icon icon="ep:delete" />删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #status="scope">
            <el-switch
              v-if="scope.row.status != undefined"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
          <template #deptId-form>
            <el-tree-select
              v-model="tableForm.deptId"
              :data="deptList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="请选择归属部门"
            />
          </template>
          <template #postIds-form>
            <el-select v-model="tableForm.postIds" multiple placeholder="请选择">
              <el-option
                v-for="item in postList"
                :key="item.id"
                :label="item.name"
                :value="item.id!"
              />
            </el-select>
          </template>
        </avue-crud>
      </ContentWrap>
    </el-col>
  </el-row>
  <!-- 用户导入对话框 -->
  <UserImportForm ref="importFormRef" @success="getTableData" />
  <!-- 分配角色 -->
  <UserAssignRoleForm ref="assignRoleFormRef" @success="getTableData" />
</template>

<script setup lang="ts">
import * as DeptApi from '@/api/system/dept'
import { defaultProps, handleTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import { checkPermi } from '@/utils/permission'
import * as PostApi from '@/api/system/post'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as UserApi from '@/api/system/user'
import UserImportForm from './UserImportForm.vue'
import UserAssignRoleForm from './UserAssignRoleForm.vue'

defineOptions({ name: 'SystemUser' })

// 树数据
const treeOption = reactive({
  defaultExpandAll: true,
  addBtn: false,
  formOption: {
    column: [{ label: '自定义项', prop: 'test' }]
  },
  props: { label: 'name', value: 'id', children: 'children' }
})
const treeData = ref<Tree[]>([])
const crudRef = ref()
const treeRef = ref()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  delBtn: false,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 12,
  dialogWidth: '50%',
  menuWidth: 160,
  column: {
    id: { label: '用户编号', display: false, width: 90 },
    username: {
      label: '用户账号',
      search: true,
      display: true,
      minWidth: 90,
      rules: [{ required: true, message: '用户账号不能为空', trigger: 'blur' }]
    },
    password: {
      label: '用户密码',
      hide: true,
      display: true,
      minWidth: 90,
      rules: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }]
    },
    nickname: {
      label: '用户昵称',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }]
    },
    deptName: { label: '部门', display: false, minWidth: 100 },
    deptId: { label: '归属部门', hide: true, minWidth: 100 },
    mobile: { label: '手机号码', width: 120, search: true },
    email: { label: '邮箱', hide: true },
    sex: {
      label: '用户性别',
      type: 'select',
      hide: true,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX),
      value: ''
    },
    postIds: {
      label: '岗位',
      type: 'select',
      hide: true,
      multiple: true,
      dicData: []
    },
    status: {
      label: '状态',
      display: false,
      search: true,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS)
    },
    remark: {
      label: '备注',
      span: 24,
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      hide: true
    },
    createTime: {
      label: '创建时间',
      search: true,
      searchRange: true,
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
const deptList = ref<Tree[]>([]) // 树形结构
const postList = ref([] as PostApi.PostVO[]) // 岗位列表
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  deptId: null
})
const permission = getCurrPermi(['system:user'])
const exportLoading = ref(false) // 导出的加载中

const nodeClick = (row: any) => {
  if (tablePage.value.deptId == row.id) {
    tablePage.value.deptId = null
    treeRef.value.setCurrentKey(null)
  } else {
    tablePage.value.deptId = row.id
  }
  getTableData()
}

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
    deptId: tablePage.value.deptId
  }

  if (searchObj.createTime?.length) {
    searchObj.createTime = getSearchDate(searchObj.createTime)
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await UserApi.getUserPage(searchObj)
    tableData.value = data.list
    tablePage.value.total = data.total
  } finally {
    loading.value = false
  }
}

useCrudHeight(crudRef)

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
    tableOption.column.username.display = false
    tableOption.column.password.display = false
    tableForm.value = await UserApi.getUser(tableForm.value.id)
    loading.value = false
  } else if (['add'].includes(type)) {
    tableOption.column.username.display = true
    tableOption.column.password.display = true
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await UserApi.createUser(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  delete form.password

  let bool = await UserApi.updateUser(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

/** 操作分发 */
const handleCommand = (command: string, row: UserApi.UserVO) => {
  switch (command) {
    case 'handleDelete':
      rowDel(row)
      break
    case 'handleResetPwd':
      handleResetPwd(row)
      break
    case 'handleRole':
      handleRole(row)
      break
    default:
      break
  }
}

/** 删除按钮操作 */
const rowDel = async (form) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await UserApi.deleteUser(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 重置密码 */
const handleResetPwd = async (row: UserApi.UserVO) => {
  try {
    // 重置的二次确认
    const result = await message.prompt(
      '请输入"' + row.username + '"的新密码',
      t('common.reminder')
    )
    const password = result.value
    // 发起重置
    await UserApi.resetUserPwd(row.id, password)
    message.success('修改成功，新密码是：' + password)
  } catch {}
}

/** 分配角色 */
const assignRoleFormRef = ref()
const handleRole = (row: UserApi.UserVO) => {
  assignRoleFormRef.value.open(row)
}

/** 修改用户状态 */
const handleStatusChange = async (row: UserApi.UserVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm('确认要"' + text + '""' + row.username + '"用户吗?')
    // 发起修改状态
    await UserApi.updateUserStatus(row.id, row.status)
    // 刷新列表
    await getTableData()
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

/** 用户导入 */
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    let searchObj = { ...tableSearch.value }
    if (tablePage.value.deptId) {
      searchObj.deptId = tablePage.value.deptId
    }
    for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
    const data = await UserApi.exportUser(searchObj)
    download.excel(data, '用户管理列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

onMounted(async () => {
  await getTableData()
  // 树数据
  DeptApi.getSimpleDeptList().then((res) => {
    const tree = handleTree(res)
    treeData.value = tree
    // 部门数据
    deptList.value = cloneDeep(tree)
  })
  // 岗位数据
  PostApi.getSimplePostList().then((res) => {
    postList.value = res
  })
})
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.el-dropdown {
  padding: 4px 2px;
}
</style>
