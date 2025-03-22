<template>
  <DesignPopup
    v-model="popupShow"
    :title="`JS增强历史版本【${tableDescribe}】（${tableName}）`"
    :width="800"
    v-model:isFull="isFull"
  >
    <div class="p-20px">
      <avue-crud
        ref="crudRef"
        v-model="tableForm"
        v-model:page="tablePage"
        v-model:search="tableSearch"
        :data="tableData"
        :option="tableOption"
        :table-loading="loading"
        @search-change="searchChange"
        @search-reset="resetChange"
        @refresh-change="getTableData"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template #menu="{ size, row }">
          <el-button :size="size" text type="primary" @click="handleJs('view', row)">
            查看
          </el-button>
          <el-button :size="size" text type="primary" @click="handleJs('diff', row)">
            比较
          </el-button>
        </template>
      </avue-crud>
    </div>
    <DesignPopup
      v-model="MEDialog.value"
      v-bind="MEDialog.params"
      class="js-enhance-history-dialog"
      :isBodyFull="true"
    >
      <template #title>{{ MEDialog.title }}</template>
      <template #default>
        <div class="relative h-100%">
          <MonacoEditor
            v-if="currType == 'view'"
            v-model="MEData.value"
            v-bind="MEData.params"
          ></MonacoEditor>
          <DeffEditor
            ref="deffRef"
            v-else
            v-model="MEData.value"
            v-bind="MEData.params"
          ></DeffEditor>
        </div>
      </template>
    </DesignPopup>
  </DesignPopup>
</template>
<script lang="ts" setup>
import * as GeneralApi from '@/api/design/general'
import * as JsApi from '@/api/design/table/jsEnhance'
import useMEDialog from '@/hooks/design/useMEDialog'
import { formatDate } from '@/utils/formatTime'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

defineOptions({ name: 'JavaEnhance' })
interface Props {
  dbformId?: string
  tableName?: string
  tableDescribe?: string
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = defineProps<Props>()

const { MEDialog, MEData, openMEDialog } = useMEDialog()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 8,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 12,
  border: true,
  calcHeight: 130,
  labelWidth: 100,
  dialogWidth: 900,
  selection: false,
  header: false,
  editBtn: false,
  delBtn: false,
  column: {
    createUserName: { label: '修改人', search: true, searchSpan: 8 },
    createTime: {
      label: '修改时间',
      type: 'datetime',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
      search: true,
      searchType: 'date',
      searchSpan: 8,
      searchFormat: 'YYYY-MM-DD'
    }
  }
}) //表格配置
const tableForm = ref<{ id?: number; button_exp?: string }>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const tableSelect = ref([])
const newJsData = ref({})
const currType = ref('')

const isFull = ref(true)

const crudRef = ref()
const deffRef = ref()
const { initTableLayout, windowSize } = useCrudHeight(crudRef)

const calcHeight = computed(() => {
  return isFull.value ? 20 : windowSize.height.value * 0.1 + 70
})

watch(
  () => popupShow.value,
  async (val: boolean) => {
    if (val) getTableData('getDetail')
  },
  { immediate: true }
)

watch(
  () => calcHeight.value,
  () => {
    tableOption.calcHeight = calcHeight.value
  }
)

watch(
  () => isFull.value,
  () => {
    initTableLayout()
  }
)

const handleJs = async (type, row) => {
  currType.value = type
  const data = await GeneralApi.getHistoryDetail({ historyId: row.id, type: 'js' })
  let params = {}
  if (type == 'view') {
    params = {
      title: `js增强历史版本 【${row.createUserName}】（${formatDate(new Date(row.createTime))}）`,
      fullscreen: true,
      providerType: 'tableJsEnhance',
      editorOption: { readOnly: true }
    }
    openMEDialog({ params, prop: 'jsJson' }, data)
  } else {
    params = {
      title: `js增强历史版本 【${row.createUserName}】（${formatDate(new Date(row.createTime))}）`,
      fullscreen: true,
      providerType: 'tableJsEnhance',
      oldValue: data.jsJson || '',
      footerBtn: [
        {
          params: { type: 'primary' },
          name: '保 存',
          icon: 'mingcute:save-line',
          loading: true,
          clickFun: async (loading) => {
            const bool = await message
              .confirm('是否将【右侧】内容保存为最新的JS增强内容?')
              .catch(() => false)
            if (!bool) return loading()
            const data = await getNewJsDetail(true)
            let isLock = true
            if (data && data.timeStr) {
              isLock = false
              const confirm = await message
                .confirm(
                  `<div>
                  <div>当前增强已锁定</div>
                  <div style="font-size:16px"><span style="font-size:14px">锁定操作人：</span>${data.userName}</div>
                  <div style="font-size:16px"><span style="font-size:14px">开始锁定时间：</span>${data.timeStr}</div>
                  <div style="color:#E6A23C">注：请确认没有其他人在编辑后再覆盖，避免增强被多次修改</div>
                </div>`,
                  '是否强制覆盖？',
                  { dangerouslyUseHTMLString: true, confirmButtonText: '确认覆盖保存' }
                )
                .catch(() => false)
              if (confirm !== 'confirm') return loading()
            }
            const upadteData = await JsApi.updateJsData({
              id: data.id,
              dbformId: props.dbformId,
              jsType: 'js',
              jsJson: deffRef.value.getValue()
            }).catch(() => false)

            if (upadteData !== false) {
              if (isLock) await JsApi.unlockJs(props.dbformId, 'js')
              message.success('保存成功')
              getTableData()
            }
            loading()
          }
        },
        {
          params: {},
          name: '关 闭',
          icon: 'material-symbols:close',
          clickFun: async () => {
            await message.confirm('是否确认关闭？')
            MEDialog.value.value = false
          }
        }
      ]
    }
    openMEDialog({ params, prop: 'jsJson' }, newJsData.value)
  }
}

const getNewJsDetail = (lock = false) => {
  return new Promise(async (resolve) => {
    const data = await JsApi.getJsDetail({
      dbformId: props.dbformId,
      type: 'js',
      lock
    })
    resolve(data)
  }) as Promise<any>
}

/** 查询列表 */
const getTableData = async (type?) => {
  if (type == 'getDetail') newJsData.value = await getNewJsDetail()
  if (!newJsData.value) {
    tableData.value = []
    tablePage.value.total = 0
    loading.value = false
    return
  }
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
    type: 'js',
    id: newJsData.value['id']
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await GeneralApi.getHistoryList(searchObj)
    tableData.value = data.records
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

const selectionChange = (data) => {
  tableSelect.value = data
}
</script>

<style lang="scss">
.js-enhance-history-dialog {
  .monaco-scrollable-element::before {
    position: absolute;
    top: 5px;
    right: 20px;
    z-index: 999;
    padding: 3px 10px;
    color: #f56c6c;
    border: 1px solid #f56c6c;
    border-radius: 20px;
  }

  .editor.original .monaco-scrollable-element::before {
    content: '旧版增强';
  }

  .editor.modified .monaco-scrollable-element::before {
    content: '最新增强（可修改）';
  }
}
</style>
