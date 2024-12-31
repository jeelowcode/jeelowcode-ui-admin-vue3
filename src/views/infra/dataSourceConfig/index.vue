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
      <!-- 自定义操作栏 -->
      <template #menu="{ row, index }">
        <el-button
          link
          type="primary"
          @click="crudRef.rowEdit(row, index)"
          v-hasPermi="['infra:data-source-config:update']"
          :disabled="row.id === 0"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          @click="crudRef.rowDel(row, index)"
          v-hasPermi="['infra:data-source-config:delete']"
          :disabled="row.id === 0"
        >
          删除
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as DataSourceConfigApi from '@/api/infra/dataSourceConfig'

defineOptions({ name: 'InfraDataSourceConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  editBtn: false,
  delBtn: false,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  labelWidth: 120,
  span: 24,
  dialogWidth: '50%',
  column: {
    id: {
      label: '主键编号',
      width: 90,
      display: false
    },
    name: {
      label: '数据源名称',
      minWidth: 120,
      rules: [{ required: true, message: '数据源名称不能为空', trigger: 'blur' }]
    },
    url: {
      label: '数据源连接',
      overHidden: true,
      minWidth: 120,
      rules: [{ required: true, message: '数据源连接不能为空', trigger: 'blur' }]
    },
    username: {
      label: '用户名',
      minWidth: 120,
      rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
    },
    password: {
      label: '密码',
      rules: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      hide: true
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
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi(['infra:data-source-config'])

const crudRef = ref()
useCrudHeight(crudRef)

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
    const data = await DataSourceConfigApi.getDataSourceConfigList()
    tableData.value = data
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
    tableForm.value = await DataSourceConfigApi.getDataSourceConfig(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await DataSourceConfigApi.createDataSourceConfig(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await DataSourceConfigApi.updateDataSourceConfig(form).catch(() => false)
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
    await DataSourceConfigApi.deleteDataSourceConfig(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
