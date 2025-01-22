<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
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
    >
      <!-- 表格 -->
      <template #type="scope">
        <dict-tag :type="DICT_TYPE.SYSTEM_NOTICE_TYPE" :value="scope.row.type" />
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.COMMON_STATUS"
          :value="scope.row.status"
        />
      </template>
      <!-- 表单 -->
      <template #parentId-form>
        <el-tree-select
          v-model="tableForm.parentId"
          :data="deptTree"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="请选择上级部门"
          value-key="deptId"
          style="width: 366px"
        />
      </template>
      <template #leaderUserId-form="scope">
        <UserSelect
          v-model="tableForm.leaderUserId"
          :column="scope.column"
          :disabled="scope.disabled"
          :size="scope.size"
          :type="scope.type"
          prop="leaderUserId"
        ></UserSelect>
      </template>
      <!-- 自定义按钮 -->
      <template #menu-left="{ size }">
        <el-button
          plain
          :size="size"
          @click="defaultExpandAllShow = !defaultExpandAllShow"
          type="danger"
          icon="el-icon-sort"
          >展开/折叠</el-button
        >
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { defaultProps, handleTree } from '@/utils/tree'
import * as DeptApi from '@/api/system/dept'
import { CommonStatusEnum } from '@/utils/constants'
import { useLowStoreWithOut } from '@/store/modules/low'

defineOptions({ name: 'SystemDept' })

const crudRef = ref()
useCrudHeight(crudRef)

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()
const lowStore = useLowStoreWithOut()

const loading = ref(true) // 列表的加载中
const defaultExpandAllShow = ref(true) // 默认展开所有表项
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  rowKey: 'id',
  rowParentKey: 'parentId',
  defaultExpandAll: defaultExpandAllShow,
  dialogWidth: '50%',
  column: {
    parentId: {
      label: '上级部门',
      hide: true,
      minWidth: 100,
      rules: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }]
    },
    name: {
      label: '部门名称',
      align: 'left',
      headerAlign: 'left',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
    },
    leaderUserId: {
      label: '负责人',
      span: 12,
      minWidth: 90,
      findType: 'all',
      columnKey: ['mobile', 'sex', 'post', 'deptName'],
      defaultSearchDept: '',
      type: 'select',
      dicUrl: '/system/user/simple-list',
      dicFormatter: (data) => {
        const dicObj = {}
        data.forEach((item) => (dicObj[item.id] = item.nickname))
        lowStore.setDicObj('userSelect', dicObj)
        return data
      },
      props: {
        label: 'nickname',
        value: 'id'
      }
    },
    sort: {
      label: '排序',
      width: 80,
      span: 12,
      type: 'number',
      rules: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
    },
    phone: {
      label: '联系电话',
      width: 120,
      rules: [
        {
          pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          message: '请输入正确的手机号码',
          trigger: 'blur'
        }
      ]
    },
    email: {
      label: '邮箱',
      minWidth: 90,
      rules: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
    },
    status: {
      label: '状态',
      width: 80,
      search: true,
      type: 'select',
      span: 12,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
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
const tableForm = ref<any>({})
const tableData = ref()
const tableSearch = ref({})
const deptTree = ref() // 上级部门
const permission = getCurrPermi(['system:dept'])

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await DeptApi.getDeptPage(searchObj)

    tableData.value = handleTree(data)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const searchChange = (params, done) => {
  getTableData().finally(() => {
    done()
  })
}

/** 清空按钮操作 */
const resetChange = () => {
  searchChange({}, () => {})
}

/** 表单打开前 */
const beforeOpen = async (done, type) => {
  await getTree()
  const id = tableForm.value.id
  if (['edit', 'view'].includes(type) && id) {
    tableForm.value = await DeptApi.getDept(id)
  }
  tableOption.column.leaderUserId.defaultSearchDept = id || ''
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await DeptApi.createDept(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await DeptApi.updateDept(form).catch(() => false)
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
    await DeptApi.deleteDept(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 获得部门树 */
const getTree = async () => {
  deptTree.value = []
  const data = await DeptApi.getSimpleDeptList()
  let dept: Tree = { id: 0, name: '顶级部门', children: [] }
  dept.children = handleTree(data)
  deptTree.value.push(dept)
}

watch(
  () => defaultExpandAllShow.value,
  () => {
    if (crudRef.value) crudRef.value?.refreshTable()
  }
)

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
