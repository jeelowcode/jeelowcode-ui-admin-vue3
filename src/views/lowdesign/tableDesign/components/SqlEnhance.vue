<template>
  <DesignPopup
    v-model="popupShow"
    :title="`SQL增强 【${tableDescribe}】（${tableName}）`"
    :fullscreen="true"
    v-model:isFull="isFull"
  >
    <div class="p-20px">
      <avue-crud
        ref="crudRef"
        v-model="tableForm"
        v-model:page="tablePage"
        v-model:search="tableSearch"
        :data="tableData"
        :option="tableOption"
        :table-loading="loading"
        :before-open="beforeOpen"
        @search-change="searchChange"
        @search-reset="resetChange"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @refresh-change="getTableData"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <template #menu-left="{ size }">
          <el-button
            :size="size"
            type="danger"
            :disabled="!tableSelect.length"
            @click="rowDel(selectIds)"
          >
            <Icon :size="16" icon="mi:delete" class="mr-3px" />批量删除
          </el-button>
        </template>
        <template #executeSql-form="{ size, column }">
          <avue-input
            type="textarea"
            :minRows="3"
            :maxRows="5"
            v-model="tableForm[column.prop]"
            :size="size"
            readonly
            :placeholder="`请输入 ${column.label}`"
            @click="openMEDialog(column, tableForm)"
          ></avue-input>
        </template>
      </avue-crud>
    </div>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #title>{{ MEDialog.title }}</template>
      <template #default>
        <el-container class="h-100%">
          <el-main class="p-0!">
            <MonacoEditor
              class="bg-#1e1e1e"
              style="flex: 1"
              v-model="MEData.value"
              v-bind="MEData.params"
            ></MonacoEditor>
          </el-main>
          <el-aside width="430px">
            <TipView v-bind="MEDialog.otherParams"></TipView>
          </el-aside>
        </el-container>
      </template>
    </DesignPopup>
  </DesignPopup>
</template>
<script lang="ts" setup>
import { TipView } from '../../general/components/index'
import * as SqlApi from '@/api/design/table/qslEnhance'
import useMEDialog from '@/hooks/design/useMEDialog'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

defineOptions({ name: 'SqlEnhance' })
interface Props {
  dbformId?: string
  tableName?: string
  tableDescribe?: string
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = defineProps<Props>()

const { MEDialog, MEData, openMEDialog } = useMEDialog()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  border: true,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 12,
  calcHeight: 20,
  labelWidth: 120,
  dialogWidth: 900,
  selection: true,
  column: {
    buttonCode: {
      label: '页面功能',
      type: 'select',
      rules: [{ required: true, message: '请选择 页面功能', trigger: 'blur' }],
      dicData: [
        { label: '新增', value: 'add' },
        { label: '编辑', value: 'edit' },
        { label: '详情', value: 'detail' },
        { label: '删除', value: 'delete' },
        { label: '列表', value: 'list' },
        { label: '导入', value: 'import' },
        { label: '导出', value: 'export' }
      ],
      sortable: true,
      editDisabled: true,
      width: 140,
      span: 12,
      control: (val) => {
        let bool = false
        if (typeObj.value[val] !== undefined && typeObj.value[val] >= 1) bool = true
        return {
          listResultHandleType: { display: bool }
        }
      }
    },
    listResultHandleType: {
      label: '结果处理类型',
      type: 'select',
      width: 120,
      rules: [{ required: true, message: '请选择 结果处理类型', trigger: 'blur' }],
      dicData: [
        { label: '串行', value: 0 },
        { label: '合集', value: 1 },
        { label: '差集', value: 2 },
        { label: '并集', value: 3 },
        { label: '交集', value: 4 }
      ],
      value: 0,
      span: 12,
      dataType: 'number',
      display: false
    },
    executeSql: {
      label: 'SQL增强',
      span: 24,
      rules: [{ required: true, message: '请输入 SQL增强', trigger: 'change' }],
      params: {
        language: 'mysql',
        otherParams: {
          type: 'simple',
          valueStyle: 'simple',
          tipKeyList: ['SqlEnhance']
        }
      },
      minWidth: 140,
      overHidden: true
    },
    activeStatus: {
      label: '状态',
      type: 'radio',
      dicData: [
        { label: '启用', value: 'Y' },
        { label: '禁用', value: 'N' }
      ],
      value: 'Y',
      width: 100,
      span: 24
    },
    sort: {
      label: '排序',
      type: 'number',
      value: 1,
      span: 12,
      width: 100
    },
    remark: {
      label: '备注',
      span: 24,
      minWidth: 120
    }
  }
}) //表格配置
const tableForm = ref<{ id?: number; button_exp?: string }>({})
const tableData = ref<any>([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const tableSelect = ref([])
const typeObj = ref({ list: 0, export: 0 })
const tableSort = ref({ column: '', order: '' })
const isFull = ref(true)

const crudRef = ref()
const { initTableLayout, windowSize } = useCrudHeight(crudRef)

const selectIds = computed(() => {
  return tableSelect.value.map((item) => item['id'])
})

const calcHeight = computed(() => {
  return isFull.value ? 20 : windowSize.height.value * 0.1 + 70
})

watch(
  () => popupShow.value,
  (val: boolean) => {
    if (val) getTableData()
  }
)

watch(
  () => calcHeight.value,
  () => {
    tableOption.calcHeight = calcHeight.value
  }
)

watch(
  () => isFull.value,
  () => {
    initTableLayout()
  }
)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
    dbformId: props.dbformId
  }
  if (tableSort.value.column) searchObj = { ...searchObj, ...tableSort.value }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await SqlApi.getSqlList(searchObj)
    tableData.value = data.records
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

const selectionChange = (data) => {
  tableSelect.value = data
}

/** 表单打开前 */
const beforeOpen = async (done, type) => {
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await SqlApi.getSqlDetail(tableForm.value.id)
  }
  typeObj.value = { list: 0, export: 0 }
  tableData.value.forEach((item) => {
    if (tableForm.value.id != item.id && typeObj.value[item.buttonCode] !== undefined) {
      typeObj.value[item.buttonCode]++
    }
  })
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await SqlApi.saveSqlData({ ...form, dbformId: props.dbformId }).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await SqlApi.updateSqlData({ ...form, dbformId: props.dbformId }).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (data) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SqlApi.deleteSqlData(data instanceof Array ? data : [data.id])
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

const sortChange = ({ order, prop }) => {
  const sortKey = { ascending: 'asc', descending: 'desc' }
  tableSort.value = { order: sortKey[order], column: prop }
  if (tablePage.value) tablePage.value['currentPage'] = 1
  getTableData()
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>

<style lang="scss">
.button-info-dialog {
  .el-dialog__body {
    padding: 20px;
    overflow-x: hidden;
  }
}
</style>
