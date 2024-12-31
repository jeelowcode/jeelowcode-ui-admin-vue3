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
      <!-- 自定义操作栏 -->
      <template #menu="{ row }">
        <el-button link type="primary" @click="openDicData(row)" class="ml-4px!">
          <Icon :size="14" icon="ep:document"></Icon>
          <span>数据</span>
        </el-button>
      </template>
    </avue-crud>
    <DesignPopup v-model="popupData.show" :title="popupData.title" width="80%" controlType="drawer">
      <div class="p-20px">
        <SystemDictData ref="dicDataRef" :dicType="popupData.dicType"></SystemDictData>
      </div>
    </DesignPopup>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as DictTypeApi from '@/api/system/dict/dict.type'
import { CommonStatusEnum } from '@/utils/constants'
import SystemDictData from './data/index.vue'

defineOptions({ name: 'SystemDictType' })

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
    name: {
      label: '字典名称',
      search: true,
      minWidth: 120,
      rules: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }]
    },
    type: {
      label: '字典编码',
      search: true,
      minWidth: 120,
      rules: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }]
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
    },
    remark: {
      label: '备注',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      minWidth: 120
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      width: 80,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
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
const exportLoading = ref(false) // 导出的加载中
const permission = getCurrPermi(['system:dict'])
const popupData = ref({
  show: false,
  dicType: '',
  title: ''
})
const crudRef = ref()
const dicDataRef = ref()

useCrudHeight(crudRef)

const openDicData = (row) => {
  popupData.value = {
    show: true,
    dicType: row.type,
    title: `${row.name}（${row.type}）`
  }
  setTimeout(() => {
    if (dicDataRef.value) dicDataRef.value?.init()
  }, 300)
}

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
    const data = await DictTypeApi.getDictTypePage(searchObj)
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
    tableForm.value = await DictTypeApi.getDictType(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await DictTypeApi.createDictType(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await DictTypeApi.updateDictType(form).catch(() => false)
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
    await DictTypeApi.deleteDictType(form.id)
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
    const data = await DictTypeApi.exportDictType(searchObj)
    download.excel(data, '字典类型.xls')
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
