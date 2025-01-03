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
      <template #tags="scope">
        <el-tag v-for="tag in scope.row.tags" :key="tag" :disable-transitions="true" class="mr-5px">
          {{ tag }}
        </el-tag>
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.COMMON_STATUS"
          :value="scope.row.status"
        />
      </template>
      <!-- 自定义操作栏 -->
      <template #menu-left="{ size }">
        <el-button
          type="success"
          plain
          :size="size"
          icon="el-icon-download"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['system:sensitive-word:export']"
          >导出</el-button
        >
        <el-button :size="size" plain type="warning" @click="openTest">
          <Icon class="mr-5px" icon="ep:document-checked" />
          测试
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 表单弹窗：测试敏感词 -->
  <DesignPopup v-model="testPopup" title="敏感词测试" :is-footer="true" width="40%">
    <div class="p-20px">
      <avue-form
        ref="textFormRef"
        v-if="testPopup"
        v-model="testFormData"
        :option="testFormOption"
      ></avue-form>
    </div>
    <template #footer>
      <el-button :loading="textLoading" type="primary" @click="testSubmitFun">检 测</el-button>
      <el-button @click="testPopup = false">取 消</el-button>
    </template>
  </DesignPopup>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as SensitiveWordApi from '@/api/system/sensitiveWord'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemSensitiveWord' })

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
      label: '编号',
      width: 80,
      display: false
    },
    name: {
      label: '敏感词',
      width: 80,
      search: true,
      rules: [{ required: true, message: '敏感词不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      width: 80,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      value: CommonStatusEnum.ENABLE
    },
    description: {
      label: '描述',
      minWidth: 150
    },
    tags: {
      label: '标签',
      search: true,
      searchType: 'input',
      type: 'select',
      multiple: true,
      filterable: true,
      allowCreate: true,
      dicUrl: '/system/sensitive-word/get-tags',
      dicFormatter: (data) => {
        data = [...new Set(data)]
        return data.map((tag) => {
          return { label: tag, value: tag }
        })
      },
      minWidth: 120,
      rules: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
      value: ''
    },
    createTime: {
      label: '创建时间',
      searchRange: true,
      search: true,
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
const permission = getCurrPermi(['system:sensitive-word'])
const exportLoading = ref(false) // 导出的加载中
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
    searchObj.createTime = getSearchDate(searchObj.createTime)
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await SensitiveWordApi.getSensitiveWordPage(searchObj)
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
  crudRef.value.dicInit()
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await SensitiveWordApi.getSensitiveWord(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await SensitiveWordApi.createSensitiveWord(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await SensitiveWordApi.updateSensitiveWord(form).catch(() => false)
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
    await SensitiveWordApi.deleteSensitiveWord(form.id)
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
    const data = await SensitiveWordApi.exportSensitiveWord(searchObj)
    download.excel(data, '敏感词列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 测试敏感词按钮操作 */
const testPopup = ref(false)
const testFormData = ref<any>({})
const testFormOption = ref({
  submitBtn: false,
  emptyBtn: false,
  span: 24,
  labelWidth: 120,
  column: {
    text: { label: '测试文本', type: 'textarea' },
    tags: tableOption.column.tags
  }
})
const textLoading = ref(false)
const textFormRef = ref()

const openTest = () => {
  testFormData.value = {}
  testPopup.value = true
}

// 提交表单
const testSubmitFun = () => {
  textFormRef.value.validate(async (valid, hide) => {
    if (!valid) return hide()
    try {
      textLoading.value = true
      const data = await SensitiveWordApi.validateText({
        text: testFormData.value.text,
        tag: testFormData.value.tags
      })
      if (data.length === 0) message.success('不包含敏感词！')
      else message.warning('包含敏感词：' + data.join(', '))
    } finally {
      hide()
      textLoading.value = false
    }
  })
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
