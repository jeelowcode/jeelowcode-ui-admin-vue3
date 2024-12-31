<template>
  <div
    class="low-reoprt"
    :class="[`low-report__${reportCode}`, { summary: tableOption.showSummary }]"
  >
    <avue-crud
      ref="crudRef"
      v-model:search="tableSearch"
      :table-loading="loading"
      :data="tableData"
      :option="tableOption"
      v-bind="crudBind"
      @search-change="searchChange"
      @search-reset="resetChange"
      @refresh-change="refreshChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
      @sort-change="sortChange"
    >
      <!-- 自定义表格头部操作 -->
      <template #menu-left="{ size }">
        <ElButton
          type="primary"
          :size="size"
          :loading="exportLoading"
          @click="exportTableData"
          v-if="
            !tableInfo.isPermi ||
            (tableInfo.isPermi && checkPermi([`jeelowcode:report-data:export:${reportCode}`]))
          "
        >
          <Icon :size="14" icon="clarity:export-line"></Icon>
          <span>导出</span>
        </ElButton>
      </template>
    </avue-crud>
  </div>
</template>
<script lang="ts" setup>
import * as ReportApi from '@/api/design/report'
import download from '@/utils/download'
import { cloneDeep } from 'lodash-es'
import { useWindowSize } from '@vueuse/core'
import { checkPermi } from '@/utils/permission'
import Avue from '@smallwei/avue'
defineOptions({ name: 'LowReport' })

interface Props {
  reportCode: string
  calcHeight?: number
  fixedSearch?: object //固定报表搜索值（每次查询都会带上）
}

const props = withDefaults(defineProps<Props>(), {
  model: 'default',
  fixedSearch: () => {
    return {}
  }
})
const windowSize = useWindowSize()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const isInit = ref(false)

const tableOption = ref<any>({})
const tableData = ref<any>([])
const tableSearch = ref({})
const tablePage = ref<any>({ currentPage: 1, pageSize: 10, total: 0 })
const tableSelect = ref<any>([])
const tableSort = ref({ column: '', order: '' })
const tableInfo = ref<any>({})
const timerObj = ref<any>({})
const crudRef = ref()

const exportLoading = ref(false)

const selectIds = computed(() => {
  return tableSelect.value.map((item) => item['id'])
})
const crudBind = computed(() => {
  const obj = {}
  if (tableInfo.value.isPage) obj['page'] = tablePage.value
  return obj
})

const initTable = async () => {
  isInit.value = false
  loading.value = true
  const { fieldList, reportVo } = await ReportApi.getWebConfig(props.reportCode)
  const isHeight = reportVo.tableConfig?.includes('height')
  const isPage = reportVo.dataConfig?.includes('page')
  const isPermi = reportVo.dataConfig?.includes('authTrue')
  tableInfo.value = { ...reportVo, isPage, isHeight, isPermi }
  tableOption.value = {
    selection: true,
    reserveSelection: true,
    menu: false,
    addBtn: false,
    height: isHeight ? 'auto' : undefined,
    calcHeight: isHeight ? 160 : '',
    index: reportVo.tableConfig.includes('index'),
    border: reportVo.tableConfig.includes('border'),
    stripe: reportVo.tableConfig.includes('stripe'),
    column: {}
  }
  fieldList.forEach((item) => {
    const config: any = {
      prop: item.fieldCode,
      label: item.fieldName,
      type: 'input',
      overHidden: true,
      isExport: item.isExport == 'Y',
      sortable: item.isShowSort == 'Y' ? 'custom' : false,
      search: item.queryIsWeb == 'Y'
    }
    if (item.queryMode == 'RANGE') config.searchRange = true
    if (['Integer', 'BigInt', 'BigDecimal'].includes(item.fieldType)) config.type = 'number'
    else if (item.fieldType == 'Date') {
      config.type = 'date'
      config.format = 'YYYY-MM-DD'
      config.valueFormat = 'YYYY-MM-DD'
    } else if (item.fieldType == 'Time') {
      config.type = 'time'
      config.format = 'HH:mm:ss'
      config.valueFormat = 'HH:mm:ss'
    } else if (item.formType == 'DateTime') {
      config.type = 'datetime'
      config.format = 'YYYY-MM-DD HH:mm:ss'
      config.valueFormat = 'YYYY-MM-DD HH:mm:ss'
    }
    tableOption.value.column[item.fieldCode] = config
  })
  isInit.value = true
  searchChange()
  initTableLayout()
}

const initTableLayout = () => {
  if (tableOption.value.height != 'auto' && tableOption.value.height !== undefined) return

  if (tableInfo.value.isHeight || props.calcHeight) {
    const calcH = props.calcHeight
    let calcHeight = calcH || 160
    if (calcH) tableOption.value.height = 'auto'
    tableOption.value.calcHeight = calcHeight
  }

  if (timerObj.value.layout) clearTimeout(timerObj.value.layout)
  timerObj.value.layout = setTimeout(() => {
    if (crudRef.value) crudRef.value.getTableHeight()
  }, 100)
}

const selectionChange = (data) => {
  tableSelect.value = data
}
const clearSelection = () => {
  crudRef.value.clearSelection()
  tableSelect.value = []
}

const sortChange = ({ order, prop }) => {
  const sortKey = { ascending: 'asc', descending: 'desc' }
  tableSort.value = { order: sortKey[order], column: prop }
  if (tablePage.value) tablePage.value['currentPage'] = 1
  getTableData()
}
const getSearchData = () => {
  return new Promise(async (resolve) => {
    let searchObj: any = {}
    if (tableInfo.value.isPage) {
      const { currentPage, pageSize } = tablePage.value
      searchObj.pageNo = currentPage
      searchObj.pageSize = pageSize
    }
    for (let key in tableSearch.value) {
      if (tableSearch.value[key] instanceof Array) searchObj[key] = tableSearch.value[key].join(',')
      else searchObj[key] = tableSearch.value[key]
    }
    //排序
    if (tableSort.value.order) searchObj = { ...searchObj, ...tableSort.value }

    searchObj = { ...searchObj, ...props.fixedSearch }

    for (let key in searchObj) {
      if (searchObj[key] === '' || searchObj[key] == null) delete searchObj[key]
    }
    resolve(searchObj)
  })
}

const getTableData = async (isLoading = true) => {
  if (timerObj.value.getTableData) clearTimeout(timerObj.value.getTableData)
  await new Promise((resolve) => {
    timerObj.value.getTableData = setTimeout(() => resolve(true), 100)
  })
  return new Promise(async (resolve) => {
    if (isLoading) loading.value = true
    const searchObj = await getSearchData()
    try {
      const data = await ReportApi.getTableList(props.reportCode, searchObj)
      if (tablePage.value) tablePage.value['total'] = data.total
      tableData.value = data.records
      resolve(data.records)
    } finally {
      if (isLoading) loading.value = false
    }
  })
}

const exportTableData = async () => {
  const isSelect = tableSelect.value.length
  await message.confirm(`是否确定导出${isSelect ? '当前勾选的' : '所有'}数据？`)
  exportLoading.value = true
  if (isSelect) {
    const columnObj = cloneDeep(tableOption.value.column)
    const column: object[] = []
    for (let key in columnObj) {
      const { hide, isExport } = columnObj[key]
      if (!hide && isExport) column.push(columnObj[key])
    }
    let exportData = cloneDeep(tableSelect.value)
    exportData = exportData.map((item) => {
      for (let key in item) {
        if (key != '$index' && key.indexOf('$') === 0 && item[key]) {
          const prop = key.split('$')[1]
          item[prop] = item[key]
        }
      }
      return item
    })
    Avue.$Export.excel({ title: tableInfo.value.reportName, columns: column, data: exportData })
    exportLoading.value = false
  } else {
    const searchObj = await getSearchData()
    ReportApi.exportExcelData(props.reportCode, searchObj)
      .then((data) => download.excel(data, tableInfo.value.reportName))
      .finally(() => (exportLoading.value = false))
  }
}

const searchChange = (params?, done?) => {
  if (tablePage.value) tablePage.value['currentPage'] = 1
  getTableData().finally(() => {
    if (done) done()
  })
}
const resetChange = () => {
  return new Promise(async (resolve) => {
    tableSearch.value = {}
    if (tablePage.value) tablePage.value['currentPage'] = 1
    await getTableData()
    resolve(true)
  })
}
const sizeChange = (pageSize) => {
  if (tablePage.value) tablePage.value['pageSize'] = pageSize
  resetChange()
}
const currentChange = (currentPage) => {
  if (tablePage.value) tablePage.value['currentPage'] = currentPage
  getTableData()
}
const refreshChange = () => {
  getTableData()
}

watch(
  () => props.reportCode,
  (value: string) => {
    if (value) initTable()
  },
  { immediate: true }
)

watch(
  [() => windowSize.height.value, () => props.calcHeight],
  () => {
    initTableLayout()
  },
  { immediate: true }
)

onUnmounted(() => {
  for (let key in timerObj.value) {
    clearInterval(timerObj.value[key])
    clearTimeout(timerObj.value[key])
  }
})

defineExpose({
  crudRef,
  tableSelect,
  selectIds,
  loading,
  clearSelection,
  resetChange
})
</script>

<style lang="scss" scoped></style>
