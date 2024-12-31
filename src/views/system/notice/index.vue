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
      <template #type="scope">
        <dict-tag
          :type="DICT_TYPE.SYSTEM_NOTICE_TYPE"
          :value="scope.row.type ? scope.row.type : ''"
        />
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
          v-if="row.status !== 1"
          class="ml-4px!"
          link
          @click="handlePush(row.id)"
          type="primary"
        >
          <Icon :size="14" icon="ep:document"></Icon>
          <span>推送</span>
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as NoticeApi from '@/api/system/notice'
import { CommonStatusEnum } from '@/utils/constants'

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
  dialogWidth: '70%',
  column: {
    id: {
      label: '公告编号',
      display: false,
      width: 90
    },
    title: {
      label: '公告标题',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }]
    },
    content: {
      label: '公告内容',
      minWidth: 120,
      rules: [
        {
          validator: (rule, value, callback) => {
            if (!value || !value.replace(/<[\s\S]*?>|[' ']/g, '')) {
              callback(new Error('公告内容不能为空'))
            } else callback()
          },
          required: true,
          trigger: 'blur'
        }
      ],
      hide: true,
      type: 'ueditor'
    },
    type: {
      label: '公告类型',
      type: 'select',
      span: 12,
      width: 90,
      dicData: getIntDictOptions(DICT_TYPE.SYSTEM_NOTICE_TYPE),
      rules: [{ required: true, message: '公告类型不能为空', trigger: 'blur' }]
    },
    status: {
      label: '状态',
      search: true,
      type: 'select',
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
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi(['system:notice'])
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
    const data = await NoticeApi.getNoticePage(searchObj)
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
    tableForm.value = await NoticeApi.getNotice(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await NoticeApi.createNotice(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await NoticeApi.updateNotice(form).catch(() => false)
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
    await NoticeApi.deleteNotice(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 推送按钮操作 */
const handlePush = async (id: number) => {
  try {
    // 推送的二次确认
    await message.confirm('是否推送所选中通知？')
    // 发起推送
    await NoticeApi.pushNotice(id)
    message.success(t('推送成功'))
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
