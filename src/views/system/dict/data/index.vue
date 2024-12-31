<template>
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
        v-hasPermi="['system:dict:export']"
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
  </avue-crud>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as DictDataApi from '@/api/system/dict/dict.data'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemDictData' })

interface Props {
  dicType: string
}
const props = defineProps<Props>()

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
  calcHeight: 20,
  column: {
    dictType: {
      label: '所属字典',
      type: 'select',
      minWidth: 90,
      disabled: true,
      value: props.dicType,
      hide: true,
      clearable: false,
      filterable: true,
      dicUrl: '/system/dict-type/list-all-simple',
      props: { label: 'name', value: 'type' },
      dicFlag: true
    },
    label: {
      label: '标签',
      search: true,
      minWidth: 90,
      rules: [{ required: true, message: '标签不能为空', trigger: 'blur' }]
    },
    value: {
      label: '键值',
      minWidth: 90,
      rules: [{ required: true, message: '键值不能为空', trigger: 'blur' }]
    },
    sort: {
      label: '排序',
      type: 'number',
      span: 12,
      value: 0,
      minWidth: 90,
      rules: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      width: 80,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    colorType: {
      label: '颜色类型',
      type: 'select',
      span: 12,
      minWidth: 90,
      dicData: [
        { value: 'default', label: '默认' },
        { value: 'primary', label: '主要' },
        { value: 'success', label: '成功' },
        { value: 'info', label: '信息' },
        { value: 'warning', label: '警告' },
        { value: 'danger', label: '危险' }
      ]
    },
    cssClass: {
      label: 'CSS Class'
    },
    remark: {
      label: '备注',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      minWidth: 150
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
const tableForm = ref<{ id?: number }>({})
const tableData = ref([])
const tableSearch = ref({
  dictType: props.dicType
})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const exportLoading = ref(false) // 导出的加载中
const permission = getCurrPermi(['system:dict'])
const crudRef = ref()

useCrudHeight(crudRef)

const init = () => {
  tableOption.column.dictType.value = props.dicType
  tableSearch.value.dictType = props.dicType
  resetChange()
}

/** 查询列表 */
const getTableData = async () => {
  loading.value = true

  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await DictDataApi.getDictDataPage(searchObj)
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
    tableForm.value = await DictDataApi.getDictData(tableForm.value.id)
  }
  if (['edit'].includes(type)) {
    tableOption.column.dictType.disabled = true
  } else if (['add'].includes(type)) {
    tableOption.column.dictType.disabled = false
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await DictDataApi.createDictData(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await DictDataApi.updateDictData(form).catch(() => false)
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
    await DictDataApi.deleteDictData(form.id)
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
    const data = await DictDataApi.exportDictData(searchObj)
    download.excel(data, '字典数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})

defineExpose({ init })
</script>
