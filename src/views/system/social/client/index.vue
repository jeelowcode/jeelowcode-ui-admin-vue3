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
      <template #socialType="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SOCIAL_TYPE"
          :value="scope.row.socialType ? scope.row.socialType : ''"
        />
      </template>
      <template #userType="scope">
        <dict-tag
          :type="DICT_TYPE.USER_TYPE"
          :value="scope.row.userType ? scope.row.userType : ''"
        />
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status != undefined"
          :type="DICT_TYPE.COMMON_STATUS"
          :value="scope.row.status"
        />
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as SocialClientApi from '@/api/system/social/client'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SocialClient' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelWidth: 100,
  searchLabelWidth: 100,
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  column: {
    id: {
      label: '编号',
      display: false,
      width: 80
    },
    name: {
      label: '应用名',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '应用名不能为空', trigger: 'blur' }]
    },
    socialType: {
      label: '社交平台',
      type: 'radio',
      search: true,
      minWidth: 100,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SOCIAL_TYPE),
      rules: [{ required: true, message: '社交平台不能为空', trigger: 'blur' }]
    },
    userType: {
      label: '用户类型',
      type: 'radio',
      search: true,
      minWidth: 100,
      dicData: getIntDictOptions(DICT_TYPE.USER_TYPE),
      rules: [{ required: true, message: '用户类型不能为空', trigger: 'blur' }]
    },
    clientId: {
      label: '客户端编号',
      search: true,
      minWidth: 120,
      rules: [{ required: true, message: '客户端编号不能为空', trigger: 'blur' }]
    },
    clientSecret: {
      label: '客户端密钥',
      hide: true,
      rules: [{ required: true, message: '客户端密钥不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      type: 'radio',
      search: true,
      span: 12,
      width: 80,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
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
const permission = getCurrPermi(['system:social-client'])

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
    const data = await SocialClientApi.getSocialClientPage(searchObj)
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
    tableForm.value = await SocialClientApi.getSocialClient(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await SocialClientApi.createSocialClient(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await SocialClientApi.updateSocialClient(form).catch(() => false)
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
    await SocialClientApi.deleteSocialClient(form.id)
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
