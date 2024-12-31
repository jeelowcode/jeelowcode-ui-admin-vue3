<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      v-model:page="tablePage"
      v-model:search="tableSearch"
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
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as UserGroupApi from '@/api/bpm/userGroup'
import * as UserApi from '@/api/system/user'
import { CommonStatusEnum } from '@/utils/constants'

defineOptions({ name: 'SystemDictType' })

interface DictType {
  label: string
  value: number
}

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
      display: false
    },
    name: {
      label: '组名',
      search: true,
      rules: [{ required: true, message: '组名不能为空', trigger: 'blur' }]
    },
    description: {
      label: '描述',
      type: 'textarea',
      minRows: 2,
      maxRows: 4
    },
    memberUserIds: {
      label: '成员',
      type: 'select',
      span: 12,
      multiple: true,
      dicData: [] as DictType[],
      rules: [{ required: true, message: '成员不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
      value: CommonStatusEnum.ENABLE
    },
    createTime: {
      label: '创建时间',
      searchRange: true,
      search: true,
      display: false,
      type: "date",
      searchType:'daterange',
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
const permission = getCurrPermi(['bpm:user-group'])
const crudRef = ref()

useCrudHeight(crudRef)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true

  
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
  }

  if (searchObj.createTime?.length) {
    searchObj.createTime[0] = `${searchObj.createTime[0]} 00:00:00`
    searchObj.createTime[1] = `${searchObj.createTime[1]} 23:59:59`
  } else delete searchObj.createTime
  
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await UserGroupApi.getUserGroupPage(searchObj)
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
    tableForm.value = await UserGroupApi.getUserGroup(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await UserGroupApi.createUserGroup(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await UserGroupApi.updateUserGroup(form).catch(() => false)
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
    await UserGroupApi.deleteUserGroup(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  // 加载用户列表
  const data = await UserApi.getSimpleUserList()

  tableOption.column.memberUserIds.dicData = data.map((item) => {
    return {
      label: item.nickname,
      value: item.deptId
    }
  })
  await getTableData()
})
</script>
