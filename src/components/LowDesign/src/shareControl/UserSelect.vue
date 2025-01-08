<template>
  <div class="user-select-box w-100%">
    <div class="user-input" :class="[{ disabled }, type, size]" @click="openTableSelect">
      <div class="user-text-list" v-if="selectId.length">
        <el-tag
          v-for="id in selectId"
          :key="id"
          :closable="!disabled && !column.readonly"
          type="info"
          :size="size"
          @close="tagValueClose(id)"
        >
          {{ lowStore.dicObj[dicKey]?.[id] || id }}
        </el-tag>
      </div>
      <div class="empty-text" v-else>{{ placeholderText }}</div>
      <div class="user-num" v-if="column.multiple && selectId.length >= 2">
        已选择
        <span>{{ selectId.length }}</span>
        人
      </div>
    </div>

    <DesignPopup
      v-if="['add', 'edit'].includes(type)"
      v-model="dialogData.value"
      v-model:isFull="dialogData.isFull"
      v-bind="dialogData.params"
    >
      <template #default>
        <el-container class="h-100%">
          <el-aside width="200px">
            <avue-tabs ref="tasbRef" :option="tabsOption" @change="tabsHandleChange"></avue-tabs>
            <div class="tree-box" v-show="tabValue.prop == 'dept'">
              <avue-tree
                ref="deptRef"
                :option="treeDeptOption"
                :data="currTreeDeptData"
                @node-click="nodeClick"
              >
                <template #default="{ data }">
                  <span
                    class="el-tree-node__label"
                    :class="{ active: data[treeDeptOption.props.value] == deptId }"
                  >
                    {{ data[treeDeptOption.props.label] }}
                  </span>
                </template>
              </avue-tree>
            </div>
            <div class="tree-box" v-show="tabValue.prop == 'role'">
              <avue-tree
                ref="roleRef"
                :option="treeRoleOption"
                :data="currRoleData"
                @node-click="nodeClick"
              >
                <template #default="{ data }">
                  <span
                    class="el-tree-node__label"
                    :class="{ active: data[treeRoleOption.props.value] == roleId }"
                  >
                    {{ data[treeRoleOption.props.label] }}
                  </span>
                </template>
              </avue-tree>
            </div>
          </el-aside>
          <el-main class="pb-0!">
            <avue-crud
              ref="crudRef"
              v-model:page="tablePage"
              v-model:search="tableSearch"
              :table-loading="loading"
              :option="Object.assign(tableOption, { calcHeight })"
              :data="tableData"
              @search-change="searchChange"
              @search-reset="resetChange"
              @size-change="sizeChange"
              @current-change="currentChange"
              @selection-change="selectionChange"
              @select-all="selectAll"
            >
              <!-- 单选 -->
              <template #lowSelectRadio="{ row, index }">
                <el-radio
                  class="low-select-radio"
                  v-model="radioValue"
                  :label="row.userId"
                  :disabled="!tableOption['selectable'](row)"
                  @click="radioClick(row, index)"
                />
              </template>
              <template #nickName="{ row }">
                <div class="flex items-center justify-center">
                  <el-avatar
                    class="mr-5px"
                    v-if="column.avatar && row.avatar"
                    :size="22"
                    :src="row.avatar"
                  />
                  <el-avatar class="mr-5px" v-else-if="column.avatar" :size="22">
                    {{ row.nickName && row.nickName.substring(0, 1) }}
                  </el-avatar>
                  <span>{{ row.nickName }}</span>
                </div>
              </template>
            </avue-crud>
          </el-main>
          <el-aside width="200px">
            <div
              class="h-100% flex-basis-200px flex-shrink-0"
              :style="{ borderLeft: 'var(--el-border)' }"
            >
              <div
                class="box-border h-31px pb-5px pt-5px text-center"
                :style="{ borderBottom: 'var(--el-border)' }"
              >
                <span>已选择（{{ tableSelectId.length }}）</span>
                <el-button
                  class="mt--3px p-0"
                  type="primary"
                  link
                  v-if="tableSelectId.length"
                  @click="clearSelect"
                >
                  清空
                </el-button>
              </div>
              <div
                class="box-border flex flex-wrap items-center overflow-x-hidden overflow-y-auto p-10px"
                :style="{
                  height: 'calc(100% - 31px)',
                  columnGap: '6px',
                  rowGap: '6px',
                  alignContent: 'start'
                }"
              >
                <el-tag
                  v-for="id in tableSelectId"
                  :key="id"
                  :closable="true"
                  type="info"
                  :size="size"
                  @close="tagTableClose(id)"
                >
                  {{ lowStore.dicObj[dicKey]?.[id] || id }}
                </el-tag>
              </div>
            </div>
          </el-aside>
        </el-container>
      </template>
    </DesignPopup>
    <DesignPopup
      v-else
      v-model="detailDialog"
      :width="800"
      :title="`<span>${column.label}</span><span class='text-14px'>（共${selectId.length}条）</span>`"
      :dialogParams="{ alignCenter: true }"
    >
      <template #default>
        <div class="box-border flex p-20px h-100%">
          <div
            class="box-border flex flex-wrap items-center overflow-x-hidden overflow-y-auto"
            :style="{
              height: '100%',
              columnGap: '6px',
              rowGap: '6px',
              alignContent: 'start'
            }"
          >
            <el-tag v-for="id in selectId" :key="id" type="info" :size="size">
              {{ lowStore.dicObj[dicKey]?.[id] || id }}
            </el-tag>
          </div>
        </div>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import { listToTree, filter } from '@/utils/tree'
import { useLowStoreWithOut } from '@/store/modules/low'
import * as DicApi from '@/api/design/dic/index'
defineOptions({ name: 'UserSelect' })

interface Column {
  label: string
  findType: 'all' | 'now' | 'sub' //查询类型
  columnKey: Array<'mobile' | 'email' | 'sex' | 'post' | 'deptName'> //扩展显示列
  disabledIds?: Array<string> //禁止选择的用户id
  assignDeptIds?: Array<string> //指定的部门
  assignRoleIds?: Array<string> //指定的角色
  filterDeptIds?: Array<string> //过滤的部门
  filterRoleIds?: Array<string> //过滤的角色
  defaultSearchDept?: string //默认部门id
  defaultSearchRole?: string //默认角色id
  hideTabsKey?: string[] //需要隐藏的tab：dept role
  requiredKey?: string[] //必填：dept role

  avatar?: boolean //是否显示头像
  multiple?: boolean //多选
  limit?: number //最大选择数
  separator?: string //分隔符
  readonly?: boolean
  placeholder?: string
}
interface Props {
  column: Column
  prop: string
  type: string
  size?: 'small' | 'large' | 'default'
  disabled?: boolean
}
const props = defineProps<Props>()
const model = defineModel<string | number>()
const lowStore = useLowStoreWithOut()
const dicKey = 'userSelect'

const columnObj = {
  nickName: { label: '用户昵称', search: true, minWidth: 100 },
  mobile: { label: '手机号码', search: true, minwidth: 120 },
  email: { label: '邮箱', minwidth: 140, overHidden: true },
  sex: { label: '性别', minWidth: 50 },
  post: { label: '岗位', minWidth: 100, overHidden: true },
  deptName: { label: '部门', minWidth: 100, overHidden: true }
}
const deptConfig = { id: 'deptId', pid: 'deptPid', children: 'children' }
const dialogData = ref({
  value: false,
  isFull: false,
  params: {
    title: '选择 ' + (props.column.label || '用户'),
    footerBtn: [
      {
        params: {},
        name: '取消',
        icon: 'material-symbols:close-rounded',
        clickFun: () => {
          dialogData.value.value = false
        }
      },
      {
        params: { type: 'primary' },
        name: '确定',
        icon: 'material-symbols:check-rounded',
        clickFun: () => {
          dialogData.value.value = false
          model.value = getCurrTableSelect().join(',')
        }
      }
    ]
  }
})
const detailDialog = ref(false)
const tabsOption = computed(() => {
  const option = {
    column: [
      { label: '按部门', prop: 'dept' },
      { label: '按角色', prop: 'role' }
    ]
  }
  const { hideTabsKey } = props.column
  if (hideTabsKey?.length) {
    option.column = option.column.filter((tab) => !hideTabsKey.includes(tab.prop))
  }

  return option
})

const tabValue = ref(tabsOption.value.column[0])

const treeDeptOption = ref({
  addBtn: false,
  nodeKey: 'deptId',
  props: { label: 'deptName', value: 'deptId', childern: 'childern' }
})
const treeDeptData = ref([])
const currTreeDeptData = computed(() => {
  const { assignDeptIds, filterDeptIds } = props.column
  const isAssign = !!assignDeptIds?.length
  const isfilter = !!filterDeptIds?.length
  if (isAssign || isfilter) {
    return filter(
      treeDeptData.value,
      (item: any) => {
        if (isAssign && assignDeptIds.includes(item.deptId)) {
          return true
        }
        if (isfilter && !filterDeptIds.includes(item.deptId)) {
          return true
        }
        return false
      },
      deptConfig
    )
  } else return treeDeptData.value
})
const deptId = ref('')

const treeRoleOption = ref({
  addBtn: false,
  nodeKey: 'roleId',
  props: { label: 'roleName', value: 'roleId' }
})
const roleData = ref([])
const currRoleData = computed(() => {
  const { assignRoleIds, filterRoleIds } = props.column
  const isAssign = !!assignRoleIds?.length
  const isfilter = !!filterRoleIds?.length
  if (isAssign || isfilter) {
    return roleData.value.filter((item: any) => {
      if (isAssign && assignRoleIds.includes(item.roleId)) {
        return true
      }
      if (isfilter && !filterRoleIds.includes(item.roleId)) {
        return true
      }
      return false
    })
  } else return roleData.value
})
const roleId = ref('')

const loading = ref(true)
const tableOption = ref({
  rowKey: 'userId',
  height: 'auto',
  addBtn: false,
  selection: true,
  refreshBtn: false,
  columnBtn: false,
  searchShowBtn: false,
  header: false,
  menu: false,
  reserveSelection: true,
  tip: false,
  searchMenuSpan: 8,
  searchSpan: 8,
  column: {},
  selectable: (row) => {
    if (props.column.limit) {
      const leng = tableSelect.value.length
      if (leng >= props.column.limit && !tableSelectId.value.includes(row.userId)) return false
    }
    if (props.column.disabledIds) {
      const disabledIds = props.column.disabledIds.map((id) => id + '')
      return !disabledIds.includes(row.userId)
    }
    return true
  }
})
const tableData = ref<any>([])
const tablePage = ref({ total: 1, currentPage: 1, pageSize: 10 })
const tableSearch = ref({})
const tableSelect = ref<any>([])
const tableSelectId = ref<Array<number | string>>([])
const radioValue = ref('')
const valueTimer = ref<any>(null)

const crudRef = ref()
const deptRef = ref()
const roleRef = ref()
const tasbRef = ref()

const { initTableLayout, windowSize } = useCrudHeight(crudRef)

const selectId = computed(() => {
  if (!model.value) return []
  if (typeof model.value != 'string') {
    try {
      return [(model.value as Number).toString()]
    } catch (error) {
      return []
    }
  }
  return model.value.split(',')
})

const calcHeight = computed(() => {
  return dialogData.value.isFull ? 60 : windowSize.height.value * 0.1 + 100 + 20
})
const placeholderText = computed(() => {
  let text = ''
  if (!props.disabled && !props.column.readonly) {
    text = props.column.placeholder || `请选择 ${props.column.label || '用户'}`
  }
  return text
})

const getTableData = () => {
  return new Promise(async (resolve) => {
    loading.value = true
    const apiData = {
      pageNo: tablePage.value.currentPage,
      pageSize: tablePage.value.pageSize,
      fieldList: ['userId', 'nickName', ...props.column.columnKey],
      type: props.column.findType,
      ...tableSearch.value
    }
    if (props.column.avatar) apiData.fieldList.push('avatar')
    if (deptId.value) apiData['deptId'] = deptId.value
    if (roleId.value) apiData['roleId'] = roleId.value
    const data = await DicApi.getUserSelectList(apiData)
    tableData.value = data.records
    tablePage.value.total = data.total
    loading.value = false
    resolve(true)
  })
}
const getDeptAndRoleData = () => {
  DicApi.getUserSelectDeptList(props.column.findType).then((data) => {
    treeDeptData.value = listToTree(data, deptConfig)
    nextTick(() => {
      if (deptId.value) deptRef.value.setCurrentKey(deptId.value)
    })
  })
  DicApi.getUserSelectRoleList().then((data) => {
    roleData.value = data
    nextTick(() => {
      if (roleId.value) roleRef.value.setCurrentKey(roleId.value)
    })
  })
}

const tabsHandleChange = (column) => {
  tabValue.value = column
}

const nodeClick = (data) => {
  const { requiredKey, hideTabsKey, defaultSearchRole, defaultSearchDept } = props.column
  if (tabValue.value.prop == 'dept') {
    if (deptId.value == data.deptId) {
      //不是必填 清空部门id
      if (!requiredKey?.includes('dept')) {
        deptId.value = ''
        deptRef.value.setCurrentKey(null)
      }
    } else deptId.value = data.deptId
    //判断是否清空角色
    if (!(hideTabsKey?.includes('role') && defaultSearchRole)) {
      roleId.value = ''
      roleRef.value.setCurrentKey(null)
    }
  } else if (tabValue.value.prop == 'role') {
    if (roleId.value == data.roleId) {
      //不是必填 清空角色id
      if (!requiredKey?.includes('role')) {
        roleId.value = ''
        roleRef.value.setCurrentKey(null)
      }
    } else roleId.value = data.roleId
    //判断是否清空部门
    if (!(hideTabsKey?.includes('dept') && defaultSearchDept)) {
      deptId.value = ''
      deptRef.value.setCurrentKey(null)
    }
  }
  resetChange()
}

const radioClick = (row, index) => {
  const bool = tableOption.value['selectable'](row)
  if (!bool) return
  if (row.userId == radioValue.value) {
    setTimeout(() => {
      radioValue.value = ''
      tableSelect.value = []
    }, 30)
  } else {
    tableSelect.value = [row]
  }
}

const getCurrTableSelect = () => {
  const dicObj = {}
  const ids = tableSelect.value.map((item) => {
    if (item.userId) dicObj[item.userId] = item.nickName
    return item.userId
  })
  lowStore.setDicObj(dicKey, dicObj)
  return ids
}

const openTableSelect = () => {
  if (props.column['onClick']) props.column['onClick']({ value: model.value, column: props.column })
  else if (props.column['click']) {
    props.column['click']({ value: model.value, column: props.column })
  }
  if (props.disabled || props.column.readonly) {
    if (selectId.value && selectId.value.length) detailDialog.value = true
    return
  }
  const { defaultSearchDept, defaultSearchRole } = props.column
  if (!deptId.value && defaultSearchDept) deptId.value = defaultSearchDept
  if (!roleId.value && defaultSearchRole) roleId.value = defaultSearchRole

  if (!deptId.value && roleId.value) {
    tabValue.value.prop = 'role'
    setTimeout(() => {
      nextTick(() => {
        tasbRef.value.active = '1'
      })
    }, 10)
  }

  dialogData.value.value = true
}

const setTableSelect = (ids) => {
  const dicObj = {}
  const rows: Array<any> = []
  tableData.value.forEach((item) => (dicObj[item.userId] = item))
  ids.forEach((id) => {
    if (dicObj[id]) rows.push(dicObj[id])
    else rows.push({ id })
  })
  if (tableOption.value['column']['lowSelectRadio']) {
    tableSelect.value = rows
    radioValue.value = rows[0]?.userId || ''
  } else {
    crudRef.value.clearSelection()
    crudRef.value.toggleSelection(rows, true)
  }
}

const selectAll = () => {
  if (props.column.limit) {
    const limit = props.column.limit
    if (tableSelect.value.length > limit) {
      const clearSelect = tableSelect.value.filter((item, index) => limit <= index)
      crudRef.value.toggleSelection(clearSelect)
    }
  }
}

const tagValueClose = (id) => {
  let list = model.value ? (model.value + '').split(',') : []
  list = list.filter((key) => key != id)
  model.value = list.join(',')
}
const tagTableClose = (id) => {
  if (props.column.multiple) {
    const selelctData = crudRef.value.$refs.table.getSelectionRows()
    const currRow = selelctData.filter((item) => item.userId == id)
    crudRef.value.toggleSelection(currRow, false)
  } else {
    tableSelect.value = []
    radioValue.value = ''
  }
}

const selectionChange = (data) => {
  tableSelect.value = data
}
const searchChange = (params, done) => {
  tablePage.value['currentPage'] = 1
  getTableData().finally(() => {
    done()
  })
}
const resetChange = () => {
  for (let prop in tableSearch.value) tableSearch.value[prop] = ''
  searchChange({}, () => {})
}

const sizeChange = (pageSize) => {
  tablePage.value['pageSize'] = pageSize
  resetChange()
}

const currentChange = (currentPage) => {
  tablePage.value['currentPage'] = currentPage
  getTableData()
}

const clearSelect = () => {
  if (tableOption.value['column']['lowSelectRadio']) {
    tableSelect.value = []
    radioValue.value = ''
  } else crudRef.value.clearSelection()
}

const initSelect = (val) => {
  delete tableOption.value.column['lowSelectRadio']
  tableOption.value.selection = val || false
  if (!val) {
    tableOption.value.column = {
      lowSelectRadio: {
        label: '',
        display: false,
        width: 50,
        overHidden: false,
        fixed: true,
        showColumn: false
      },
      ...tableOption.value.column
    }
  }
}

watch(
  () => model.value,
  (value, oldVal) => {
    if (oldVal !== undefined) {
      if (props.column['onChange']) props.column['onChange']({ value, column: props.column })
      else if (props.column['change']) props.column['change']({ value, column: props.column })
    }
  }
)

watch(
  () => props.column.multiple,
  (val) => initSelect(val),
  { immediate: true }
)

watch(
  () => props.column.columnKey,
  (val) => {
    const column = { nickName: columnObj.nickName }
    val.forEach((prop) => (column[prop] = { ...columnObj[prop] }))
    Object.keys(tableOption.value.column).forEach((prop) => {
      if (prop != 'lowSelectRadio') delete tableOption.value.column[prop]
    })
    tableOption.value.column = { ...tableOption.value.column, ...column }
  },
  { immediate: true }
)

watch(
  () => dialogData.value.isFull,
  () => initTableLayout()
)

watch(
  () => dialogData.value.value,
  (val) => {
    clearInterval(valueTimer.value)
    if (!val) {
      if (crudRef.value) crudRef.value.clearSelection()
      deptId.value = ''
      roleId.value = ''
      deptRef.value.setCurrentKey(null)
      roleRef.value.setCurrentKey(null)
      return
    }
    getDeptAndRoleData()
    initTableLayout()
    resetChange()
    valueTimer.value = setInterval(() => {
      if (loading.value == false) {
        clearInterval(valueTimer.value)
        setTableSelect(selectId.value)
      }
    }, 100)
  }
)

watch(
  () => tableSelect.value,
  (val) => {
    tableSelectId.value = getCurrTableSelect()
    dialogData.value.params.footerBtn[1].name = `确定（${val.length}）`
  }
)
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-aside:nth-child(1) {
    border-right: var(--el-border);
  }
}

::v-deep(.el-tabs__header) {
  margin-bottom: 0;
}

.tree-box {
  height: calc(100% - 44px);
  padding: 10px;
  box-sizing: border-box;

  .el-tree-node__label {
    &.active {
      color: var(--el-color-primary);
    }
  }
}

.select-box {
  height: 100%;
  padding: 10px;
  border-left: var(--el-border);
  box-sizing: border-box;
}

.user-input {
  display: flex;
  height: var(--el-component-size);
  font-size: var(--el-text-base);
  color: var(--el-input-text-color, var(--el-text-color-regular));
  cursor: pointer;
  background-color: var(--el-bg-color);
  background-image: none;
  border: var(--el-border);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-sizing: border-box;
  align-items: center;

  .user-text-list {
    display: flex;
    height: 100%;
    flex: 1;
    padding: 0 11px;
    overflow-x: hidden;
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 6px;
  }

  .empty-text {
    margin: 0 10px;
    overflow: hidden;
    color: #999;
    text-align: left;
    flex: 1;
    text-wrap: nowrap;
  }

  .user-num {
    height: 100%;
    padding-right: 10px;
    padding-left: 10px;
    line-height: var(--el-component-size);
    color: var(--el-text-color-regular);
    background-color: var(--el-fill-color-light);

    span {
      display: inline-block;
      padding: 0 2px;
      color: var(--el-color-primary);
    }
  }

  &.disabled {
    &.edit,
    &.add {
      background-color: var(--el-disabled-bg-color);
    }

    &.view {
      border: none;

      .user-text-list {
        padding: 0;
      }

      .user-num {
        margin-right: -20px;
      }
    }
  }

  &.small {
    height: var(--el-component-size-small);
    font-size: var(--el-font-size-extra-small);

    .user-num {
      height: var(--el-component-size-small);
    }
  }

  &.large {
    height: var(--el-component-size-large);
    font-size: var(--el-font-size-large);

    .user-num {
      height: var(--el-component-size-large);
    }
  }
}
</style>
