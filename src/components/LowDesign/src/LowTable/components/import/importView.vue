<template>
  <avue-crud
    ref="crudRef"
    v-model:search="tableSearch"
    :option="tableOption"
    :data="tableData"
    :page="tablePage"
    :table-loading="loading"
    @row-update="rowUpdate"
    @row-del="rowDel"
    @current-change="currentChange"
    @size-change="sizeChange"
    @search-change="searchChange"
  ></avue-crud>
</template>

<script setup lang="ts">
import * as TableApi from '@/api/design/table'

interface Props {
  dbformId: string
  batchCode: string | number
  calcHeight?: number
  type?: 'edit' | 'view'
}
const props = defineProps<Props>()
const emit = defineEmits(['set-import-info'])
const message = useMessage() // 消息弹窗

const crudRef = ref()
const tableOption = ref({
  addBtn: false,
  header: false,
  calcHeight: props.calcHeight || 20,
  menuWidth: 160,
  menu: true,
  dialogType: 'drawer',
  dialogWidth: '60%',
  column: {}
})
if (props.type == 'view') tableOption.value.menu = false
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({ currentPage: 1, pageSize: 10, total: 0 })
const loading = ref(false)

const { initTableLayout } = useCrudHeight(crudRef)

const getColumn = async () => {
  const data = await TableApi.getDbDetail(props.dbformId, ['export'])
  const { exportList, fieldList } = data
  const showList: string[] = []
  tableOption.value.column = {}
  exportList.forEach((item) => {
    if (item.isExport == 'Y') showList.push(item.fieldCode)
  })
  fieldList.forEach((item) => {
    if (showList.includes(item.fieldCode)) {
      tableOption.value.column[item.fieldCode] = {
        label: item.fieldName,
        bind: `dataJson.${item.fieldCode}`
      }
    }
  })
  if (props.type == 'view') {
    tableOption.value.column['handleResult'] = {
      label: '导入结果',
      type: 'select',
      dicData: [
        { label: '导入成功', value: 'SUCCESS' },
        { label: '导入失败', value: 'FAIL' }
      ],
      searchValue: 'SUCCESS',
      search: true,
      hide: false,
      clearable: false
    }
    initTableLayout()
  }
}
const getTableData = async () => {
  loading.value = true
  const searchObj = {
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
    batchCode: props.batchCode
  }
  if (props.type == 'view') {
    searchObj['handleResult'] = tableSearch.value.handleResult || 'SUCCESS'
  }
  const data = await TableApi.getUploadImportData(props.dbformId, searchObj)
  tableData.value = data.records.map((item) => {
    item.dataJson = JSON.parse(item.dataJson)
    return item
  })
  tablePage.value.total = data.total
  emit('set-import-info', { totalCou: data.total })
  loading.value = false
}

const rowUpdate = async (form, index, done, loading) => {
  const data = await TableApi.updateUploadImportData(props.dbformId, {
    id: form.id,
    jsonStr: JSON.stringify(form.dataJson)
  }).catch(() => false)
  if (!data) return loading()
  done()
  message.success('编辑成功')
  getTableData()
}
const rowDel = async (data) => {
  await message.delConfirm()
  loading.value = true
  await TableApi.deleteUploadImportData(props.dbformId, data.id)
  message.success('删除成功')
  getTableData()
}
const sizeChange = (pageSize) => {
  tablePage.value.pageSize = pageSize
  tablePage.value.currentPage = 1
  getTableData()
}
const currentChange = (currentPage) => {
  tablePage.value.currentPage = currentPage
  getTableData()
}
const searchChange = async (params, done) => {
  tablePage.value.currentPage = 1
  await getTableData()
  done()
}

const setCalcHeight = (num?) => {
  tableOption.value.calcHeight = num || props.calcHeight || 20
  initTableLayout()
}

onMounted(async () => {
  loading.value = true
  if (!Object.keys(tableOption.value.column).length) {
    await getColumn()
  }
  getTableData()
})

defineExpose({ setCalcHeight })
</script>

<style lang="scss" scoped></style>
