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
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.COMMON_STATUS"
          :value="scope.row.status"
        />
      </template>
      <template #menuIds-form="">
        <el-card class="w-full h-400px !overflow-y-scroll" shadow="never">
          <template #header>
            全选/全不选:
            <el-switch
              v-model="treeNodeAll"
              active-text="是"
              inactive-text="否"
              inline-prompt
              @change="handleCheckedTreeNodeAll"
            />
            全部展开/折叠:
            <el-switch
              v-model="menuExpand"
              active-text="展开"
              inactive-text="折叠"
              inline-prompt
              @change="handleCheckedTreeExpand"
            />
          </template>
          <el-tree
            ref="treeRef"
            :data="menuOptions"
            :props="defaultProps"
            empty-text="加载中，请稍候"
            node-key="id"
            show-checkbox
          />
        </el-card>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import { defaultProps, handleTree } from '@/utils/tree'
import * as TenantPackageApi from '@/api/system/tenantPackage'
import { CommonStatusEnum } from '@/utils/constants'
import * as MenuApi from '@/api/system/menu'
import { ElTree } from 'element-plus'
import { nextTick } from 'vue'

defineOptions({ name: 'SystemTenantPackage' })

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
  span: 24,
  dialogWidth: '50%',
  column: {
    id: {
      label: '套餐编号',
      display: false,
      width: 90
    },
    name: {
      label: '套餐名',
      search: true,
      minWidth: 80,
      rules: [{ required: true, message: '套餐名不能为空', trigger: 'blur' }]
    },
    menuIds: {
      label: '套餐编号',
      hide: true
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    remark: {
      label: '备注',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      minWidth: 120
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
const permission = getCurrPermi(['system:tenant-package'])

const crudRef = ref()

useCrudHeight(crudRef)

// 菜单权限表单
const menuOptions = ref<any[]>([]) // 树形结构数据
const menuExpand = ref(false) // 展开/折叠
const treeRef = ref<InstanceType<typeof ElTree>>() // 树组件 Ref
const treeNodeAll = ref(false) // 全选/全不选
const formData = ref({
  id: null,
  name: null,
  remark: null,
  menuIds: [],
  status: CommonStatusEnum.ENABLE
})

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
    const data = await TenantPackageApi.getTenantPackagePage(searchObj)
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
  // 加载 Menu 列表。注意，必须放在前面，不然下面 setChecked 没数据节点
  menuOptions.value = handleTree(await MenuApi.getSimpleMenusList())
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    loading.value = true
    const res = await TenantPackageApi.getTenantPackage(tableForm.value.id)
    tableForm.value = res
    // 设置选中
    formData.value = res

    // 设置选中
    res.menuIds.forEach((menuId: number) => {
      nextTick(() => {
        treeRef.value!.setChecked(menuId, true, false)
      })
    })

    loading.value = false
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  form.menuIds = [
    ...(treeRef.value!.getCheckedKeys(false) as unknown as Array<number>), // 获得当前选中节点
    ...(treeRef.value!.getHalfCheckedKeys() as unknown as Array<number>) // 获得半选中的父节点
  ]
  let bool = await TenantPackageApi.createTenantPackage(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  form.menuIds = [
    ...(treeRef.value!.getCheckedKeys(false) as unknown as Array<number>), // 获得当前选中节点
    ...(treeRef.value!.getHalfCheckedKeys() as unknown as Array<number>) // 获得半选中的父节点
  ]

  let bool = await TenantPackageApi.updateTenantPackage(form).catch(() => false)
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
    await TenantPackageApi.deleteTenantPackage(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}
/** 全选/全不选 */
const handleCheckedTreeNodeAll = () => {
  treeRef.value!.setCheckedNodes(treeNodeAll.value ? menuOptions.value : [])
}

/** 展开/折叠全部 */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === menuExpand.value) {
      continue
    }
    nodes[node].expanded = menuExpand.value
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
