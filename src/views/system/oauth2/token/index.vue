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
      <template #type="scope">
        <dict-tag :type="DICT_TYPE.SYSTEM_NOTICE_TYPE" :value="scope.row.type" />
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
        <el-button
          link
          type="danger"
          @click="handleForceLogout(row.accessToken)"
          v-hasPermi="['system:oauth2-token:delete']"
        >
          强退
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as OAuth2AccessTokenApi from '@/api/system/oauth2/token'

defineOptions({ name: 'SystemTokenClient' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  menuWidth: 120,
  column: {
    accessToken: {
      label: '访问令牌',
      search: true,
      minWidth: 200
    },
    refreshToken: {
      label: '刷新令牌',
      minWidth: 200
    },
    userId: {
      label: '用户编号',
      search: true,
      width: 90
    },
    userType: {
      label: '用户类型',
      type: 'select',
      search: true,
      span: 12,
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.USER_TYPE)
    },
    expiresTime: {
      label: '过期时间',
      searchRange: true,
      display: false,
      type: 'datetime',
      width: 180,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
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
const permission = getCurrPermi(['system:oauth2-token'])
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
    const data = await OAuth2AccessTokenApi.getAccessTokenPage(searchObj)
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
    await OAuth2AccessTokenApi.deleteAccessToken(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 强制退出操作 */
const handleForceLogout = async (accessToken: string) => {
  try {
    // 删除的二次确认
    await message.confirm('是否要强制退出用户')
    // 发起删除
    await OAuth2AccessTokenApi.deleteAccessToken(accessToken)
    message.success(t('common.success'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
