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
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <!-- 表格 -->
      <template #type="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_SOCIAL_TYPE"
          :value="scope.row.type ? scope.row.type : ''"
        />
      </template>
      <template #avatar="scope">
        <el-image
          :src="scope.row.avatar"
          class="h-30px w-30px"
          @click="imagePreview(scope.row.avatar)"
        />
      </template>
      <!-- 表单 -->
      <template #avatar-form>
        <el-image :src="tableForm.avatar" class="h-30px w-30px" />
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as SocialUserApi from '@/api/system/social/user'
import { createImageViewer } from '@/components/ImageViewer'

defineOptions({ name: 'SocialUser' })
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  viewBtnText: '详情',
  viewBtnIcon: ' ',
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  searchLabelWidth: 100,
  labelWidth: 160,
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  menuWidth:120,
  column: {
    type: {
      label: '社交平台',
      type: 'select',
      search: true,
      minWidth: 100,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_SOCIAL_TYPE)
    },
    openid: {
      label: '社交 openid',
      search: true,
      minWidth: 100,
      display: false
    },
    nickname: {
      label: '用户昵称',
      minWidth: 100,
      search: true
    },
    avatar: {
      label: '用户头像',
      type: 'upload',
      span: 24,
      formslot: true,
      minWidth: 100,
      slot: true
    },
    token: {
      label: '社交 token',
      hide: true
    },
    rawTokenInfo: {
      label: '原始 Token 数据',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      hide: true
    },
    rawUserInfo: {
      label: '原始 User 数据',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      hide: true
    },
    code: {
      label: '最后一次的认证 code',
      hide: true
    },
    state: {
      label: '最后一次的认证 state',
      hide: true
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
    updateTime: {
      label: '更新时间',
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
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi([])

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
    const data = await SocialUserApi.getSocialUserPage(searchObj)
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
  if (['view'].includes(type) && tableForm.value.id) {
    // tableForm.value = await SocialUserApi.getDictType(tableForm.value.id)
  }
  done()
}

const imagePreview = (imgUrl: string) => {
  createImageViewer({
    urlList: [imgUrl]
  })
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
