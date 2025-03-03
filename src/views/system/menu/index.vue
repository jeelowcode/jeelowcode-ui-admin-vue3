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
      <template #icon-form="{ column, size, disabled }">
        <IconSelectInput
          v-model="tableForm.icon"
          :prop="column.prop"
          :column="column"
          :size="size"
          :disabled="disabled"
        />
      </template>
      <template #icon="{ row }">
        <Icon v-if="row.icon" :size="14" :icon="row.icon" />
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
          placeholder="请选择上级菜单"
          value-key="deptId"
          style="width: 366px"
        />
      </template>
      <!-- 自定义按钮 -->
      <template #menu-left>
        <el-button plain @click="expandAll = !expandAll" type="danger" icon="el-icon-sort"
          >展开/折叠</el-button
        >
        <el-button plain @click="refreshMenu">
          <Icon class="mr-5px" icon="ep:refresh" />
          刷新菜单缓存
        </el-button>
      </template>
      <template #menu="{ row, size }">
        <el-button
          v-if="row.type === 1"
          icon="el-icon-circle-plus"
          :size="size"
          text
          type="primary"
          v-hasPermi="['system:menu:create']"
          @click="openForm(row)"
          >新增子级</el-button
        >
        <el-button v-if="row.type === 2" :size="size" text type="primary" @click="openBtnView(row)"
          >按钮管理</el-button
        >
      </template>
    </avue-crud>
    <DesignPopup
      v-model="btnDialog"
      :title="`【${currRow['name']}】按钮管理`"
      width="50%"
      :isBodyFull="true"
    >
      <template #default>
        <div class="h-100% p-20px box-border">
          <avue-crud
            ref="btnCrudRef"
            v-model="tableForm"
            :table-loading="btnLoading"
            :data="btnTableData"
            :option="btnTableOption"
            :permission="permission"
            :before-open="beforeOpen"
            @search-change="searchChange"
            @search-reset="resetChange"
            @row-save="rowSave"
            @row-update="rowUpdate"
            @row-del="rowDel"
            @refresh-change="getBtnTableData"
          >
            <template #menu-left>
              <el-button
                plain
                @click="autoCreatedBtn"
                v-if="designOnlyVal.val"
                v-hasPermi="['system:menu:create']"
              >
                <Icon class="mr-5px" icon="ep:refresh" />
                <span>根据配置创建</span>
              </el-button>
            </template>
          </avue-crud>
        </div>
      </template>
    </DesignPopup>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { defaultProps, handleTree } from '@/utils/tree'
import * as MenuApi from '@/api/system/menu'
import * as TableApi from '@/api/design/table'
import { CommonStatusEnum } from '@/utils/constants'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

defineOptions({ name: 'SystemMenu' })

const { wsCache } = useCache()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const expandAll = ref(false) // 默认展开所有表项
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  menuWidth: 260,
  labelSuffix: ' ',
  labelWidth: 100,
  span: 24,
  rowKey: 'id',
  rowParentKey: 'parentId',
  defaultExpandAll: expandAll,
  virtualize: true,
  dialogWidth: '50%',
  column: {
    parentId: {
      label: '上级菜单',
      hide: true,
      rules: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }]
    },
    name: {
      label: '菜单名称',
      headerAlign: 'left',
      align: 'left',
      search: true,
      minWidth: 120,
      rules: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]
    },
    type: {
      label: '菜单类型',
      type: 'radio',
      button: true,
      hide: true,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_MENU_TYPE).filter((item) => item.value !== 3),
      value: 1,
      control: (val) => {
        return {
          icon: { display: val !== 3 },
          path: { display: val !== 3 },
          visible: { display: val !== 3 },
          alwaysShow: { display: val !== 3 },
          component: { display: val === 2 },
          keepAlive: { display: val === 2 },
          componentName: { display: val === 2 },
          permission: { display: val !== 1 }
        }
      }
    },
    sort: {
      label: '排序',
      span: 12,
      type: 'number',
      width: 60,
      rules: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
    },
    icon: {
      label: '菜单图标',
      width: 85,
      span: 12,
      display: false
    },
    path: {
      label: '路由地址',
      hide: true,
      display: false,
      labelTip: '访问的路由地址，如：`user`。如需外网地址时，则以 `http(s)://` 开头',
      labelTipPlacement: 'right-end',
      rules: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
    },
    permission: {
      label: '权限标识',
      display: false,
      minWidth: 90,
      labelTip:
        'Controller 方法上的权限字符，如：@PreAuthorize(`@ss.hasPermission("system:user:list")`)',
      labelTipPlacement: 'right-end'
    },
    component: {
      label: '组件路径',
      placeholder: '例如说：system/user/index',
      display: false,
      minWidth: 90
    },
    componentName: {
      label: '组件名称',
      placeholder: '例如说：SystemUser',
      display: false,
      minWidth: 90
    },
    status: {
      label: '菜单状态',
      width: 85,
      search: true,
      type: 'radio',
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '菜单状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    visible: {
      label: '显示状态',
      type: 'radio',
      border: true,
      display: false,
      hide: true,
      dicData: [
        { label: '显示', value: true },
        { label: '隐藏', value: false }
      ],
      value: true,
      labelTip: '选择隐藏时，路由将不会出现在侧边栏，但仍然可以访问',
      labelTipPlacement: 'right-end'
    },
    alwaysShow: {
      label: '总是显示',
      type: 'radio',
      border: true,
      display: false,
      hide: true,
      dicData: [
        { label: '总是', value: true },
        { label: '不是', value: false }
      ],
      value: true,
      labelTip: '选择不是时，当该菜单只有一个子菜单时，不展示自己，直接展示子菜单',
      labelTipPlacement: 'right-end'
    },
    keepAlive: {
      label: '缓存状态',
      type: 'radio',
      border: true,
      display: false,
      hide: true,
      dicData: [
        { label: '缓存', value: true },
        { label: '不缓存', value: false }
      ],
      value: true,
      labelTip: '选择缓存时，则会被 `keep-alive` 缓存，必须填写「组件名称」字段',
      labelTipPlacement: 'right-end'
    }
  }
}) //表格配置
const tableForm = ref<any>({})
const tableData = ref()
const tableSearch = ref({})
const deptTree = ref() // 上级部门

const btnDialog = ref(false)
const btnLoading = ref(false)
const currRow = ref({})
const btnTableData = ref([])
const btnTableOption = reactive({
  dialogWidth: '40%',
  calcHeight: 200,
  column: {
    name: {
      label: '按钮名称',
      row: true,
      rules: [{ required: true, message: '按钮名称不能为空', trigger: 'blur' }],
      span: 24
    },
    permission: {
      ...tableOption.column.permission,
      span: 24,
      display: true,
      rules: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
    },
    sort: { ...tableOption.column.sort, span: 24 },
    status: {
      label: '按钮状态',
      type: 'radio',
      span: 24,
      width: 100,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '按钮状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    }
  }
})
const permission = getCurrPermi(['system:menu'])
const crudRef = ref()
const btnCrudRef = ref()

const designOnlyVal = computed(() => {
  let val = ''
  let type = ''
  const path = currRow.value['path'] || ''
  if (path.indexOf('table/view/') === 0) {
    const pathList = path.split('/')
    const len = pathList.length - 1
    if (/\d$/.test(pathList[len])) {
      val = pathList[len]
      type = 'table'
    }
  } else if (path.indexOf('report/view/') === 0) {
    const pathList = path.split('/')
    const len = pathList.length - 1
    if (pathList[len]) {
      val = pathList[len]
      type = 'report'
    }
  }
  return { val, type }
})

useCrudHeight([crudRef, btnCrudRef])

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    btnDisplay: 1
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await MenuApi.getMenuList(searchObj)
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
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await MenuApi.getMenu(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  if (btnDialog.value) {
    form.parentId = currRow.value['id']
    form.type = 3
  }
  let bool = await MenuApi.createMenu(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    if (btnDialog.value) getBtnTableData()
    else resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await MenuApi.updateMenu(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    if (btnDialog.value) getBtnTableData()
    else getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (form) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MenuApi.deleteMenu(form.id, form.type)
    message.success(t('common.delSuccess'))
    // 刷新列表
    if (btnDialog.value) getBtnTableData()
    else getTableData()
  } catch {}
}

/** 添加/修改操作 */
const openForm = (form) => {
  tableForm.value.parentId = form.id
  crudRef.value.rowAdd()
}

/** 刷新菜单缓存按钮操作 */
const refreshMenu = async () => {
  try {
    await message.confirm('即将更新缓存刷新浏览器！', '刷新菜单缓存')
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.USER)
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
    // 刷新浏览器
    location.reload()
  } catch {}
}

/** 获得部门树 */
const getTree = async () => {
  deptTree.value = []
  const data = await MenuApi.getSimpleMenusList()
  let dept: Tree = { id: 0, name: '顶级菜单', children: [] }
  dept.children = handleTree(data)
  deptTree.value.push(dept)
}

const openBtnView = (row) => {
  currRow.value = row
  btnDialog.value = true
  getBtnTableData()
}

const getBtnTableData = async () => {
  btnLoading.value = true
  let searchObj = {
    parentId: currRow.value['id']
  }
  try {
    const data = await MenuApi.getMenuList(searchObj)
    btnTableData.value = data
    btnTableData.value = data
  } finally {
    btnLoading.value = false
  }
}

const autoCreatedBtn = async () => {
  let createData: any = {}
  const type = designOnlyVal.value.type
  const defaultMenu = {
    sort: 1,
    status: 0,
    type: 3,
    parentId: currRow.value['id']
  }
  if (type == 'table') {
    createData = await createLowTable(defaultMenu)
  } else if (type == 'report') {
    createData = await createLowReport(defaultMenu)
  }
  const len = createData.apiData.length

  if (len) {
    await MenuApi.batchCreateMenu(createData.apiData)
    getBtnTableData()
  } else btnLoading.value = false
  const msg = len
    ? `已创建 <span style="color:#409EFF">${len}</span> 条数据`
    : `未发现需要创建的按钮数据`
  const tip = `<div style="font-size:12px;display:${createData.tipData?.length ? 'block' : 'none'}">
      发现不存在的按钮： ${createData.tipData?.join('、')}
      <span style="color:#E6A23C">（注：如不需要请自行删除）</span>
    </div>`
  message.alert(
    `<div>
        <div>${msg}</div>
        ${tip}
      </div>`,
    '提示',
    { dangerouslyUseHTMLString: true }
  )
}
const createLowTable = (defaultMenu) => {
  return new Promise(async (resolve) => {
    await message.confirm('是否确定根据表单开发配置创建按钮数据？')
    btnLoading.value = true
    const onlyVal = designOnlyVal.value.val
    const data = await TableApi.getWebConfig(onlyVal)
    const permissionKey = 'jeelowcode:dbform-data'
    const defaultBtnObj = {
      query: { name: '数据查询', permission: 'query' },
      addBtn: { name: '数据创建', permission: 'create' },
      editBtn: { name: '数据更新', permission: 'update' },
      delBtn: { name: '数据删除', permission: 'delete' },
      exportBtn: { name: '数据导出', permission: 'export' },
      importBtn: { name: '数据导入', permission: 'import' }
    }

    const btnData: Array<any> = []
    const basicBtn = data.dbForm.basicFunction.split(',')
    for (const key in defaultBtnObj) {
      const { name, permission } = defaultBtnObj[key]
      if (key == 'query' || basicBtn.includes(key))
        btnData.push({
          ...defaultMenu,
          name,
          permission: `${permissionKey}:${permission}:${onlyVal}`
        })
    }
    data.buttonList.forEach((item) => {
      if (item.buttonShow == 'Y' && item.buttonAuth == 'Y')
        btnData.push({
          ...defaultMenu,
          name: item.buttonName,
          permission: `${permissionKey}:${item.buttonCode}:${onlyVal}`
        })
    })
    const btnName = btnData.map((item) => item.name)
    const tipName: string[] = []
    const nameList: string[] = btnTableData.value.map((item) => {
      if (!btnName.includes(item['name'])) tipName.push(item['name'])
      return item['name']
    })
    const apiData = btnData.filter((item) => !nameList.includes(item.name))

    resolve({ apiData, tipData: tipName })
  })
}
const createLowReport = (defaultMenu) => {
  return new Promise(async (resolve) => {
    await message.confirm('是否确定根据报表配置创建按钮数据？')
    const onlyVal = designOnlyVal.value.val
    const permissionKey = 'jeelowcode:report-data'
    const defaultData = [
      { name: '数据查询', permission: `${permissionKey}:query:${onlyVal}` },
      { name: '数据导出', permission: `${permissionKey}:export:${onlyVal}` }
    ]
    const keys: string[] = btnTableData.value.map((item) => item['permission'])
    const apiData: any = []
    defaultData.forEach((item) => {
      if (!keys.includes(item.permission)) {
        apiData.push({ ...defaultMenu, ...item })
      }
    })
    resolve({ apiData })
  })
}

watch(expandAll, () => {
  crudRef.value.refreshTable()
})

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
