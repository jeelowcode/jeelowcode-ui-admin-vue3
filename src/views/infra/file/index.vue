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
      @search-change="searchChange"
      @search-reset="resetChange"
      @row-del="rowDel"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu-left>
        <el-button type="primary" plain @click="openForm">
          <Icon icon="ep:upload" class="mr-5px" /> 上传文件
        </el-button>
      </template>
      <template #urlValue="scope">
        {{ scope.row.url }}
      </template>
      <template #url="{ row }">
        <el-image
          v-if="row.type.includes('image')"
          class="h-80px w-80px"
          lazy
          :src="row.url"
          :preview-src-list="[row.url]"
          preview-teleported
          fit="cover"
        />
        <el-link
          v-else-if="row.type.includes('pdf')"
          type="primary"
          :href="row.url"
          :underline="false"
          target="_blank"
          >预览</el-link
        >
        <el-link v-else type="primary" download :href="row.url" :underline="false" target="_blank"
          >下载</el-link
        >
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <FileForm ref="formRef" @success="getTableData" />
</template>
<script lang="ts" setup>
import { fileSizeFormatter } from '@/utils'
import { dateFormatter } from '@/utils/formatTime'
import * as FileApi from '@/api/infra/file'
import FileForm from './FileForm.vue'

defineOptions({ name: 'InfraFile' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  menuWidth:120,
  column: {
    name: {
      label: '文件名',
      minWidth: 100,
      overHidden: true
    },
    path: {
      label: '文件路径',
      minWidth: 100,
      search: true,
      overHidden: true
    },
    urlValue: {
      label: 'URL',
      minWidth: 100,
      overHidden: true
    },
    size: {
      label: '文件大小',
      minWidth: 100,
      formatter: fileSizeFormatter,
      width: '120px'
    },
    type: {
      label: '文件类型',
      minWidth: 180,
      search: true
    },
    url: {
      label: '文件内容',
      minWidth: 120
    },
    createTime: {
      label: '上传时间',
      searchRange: true,
      search: true,
      type: 'date',
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
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
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi(['infra:file'])
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

  if (searchObj.createTime?.length) {
    searchObj.createTime[0] = `${searchObj.createTime[0]} 00:00:00`
    searchObj.createTime[1] = `${searchObj.createTime[1]} 23:59:59`
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await FileApi.getFilePage(searchObj)
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

/** 删除按钮操作 */
const rowDel = async (form, index) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FileApi.deleteFile(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = () => {
  formRef.value.open()
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
