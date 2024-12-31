<template>
  <DesignPopup
    v-model="popupShow"
    :title="`自定义按钮配置 【${tableDescribe}】（${tableName}）`"
    :fullscreen="true"
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
        :before-open="beforeOpen"
        @search-change="searchChange"
        @search-reset="resetChange"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @refresh-change="getTableData"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template #menu-left="{ size }">
          <el-button
            :size="size"
            type="danger"
            :disabled="!tableSelect.length"
            @click="rowDel(selectIds)"
          >
            <Icon :size="16" icon="mi:delete" class="mr-3px" />批量删除
          </el-button>
        </template>
        <template #buttonExp-form="scope">
          <avue-input
            v-model="tableForm[scope.column.prop]"
            :size="scope.size"
            readonly
            :placeholder="`请输入 ${scope.column.label}`"
            @click="openMEDialog(scope.column, tableForm)"
          ></avue-input>
        </template>
        <template #buttonIcon-form="{ column, size, disabled }">
          <IconSelectInput
            v-model="tableForm.buttonIcon"
            :prop="column.prop"
            :column="column"
            :size="size"
            :disabled="disabled"
          />
        </template>
        <template #buttonIcon="{ row }">
          <Icon :size="14" :icon="row.buttonIcon" />
        </template>
      </avue-crud>
    </div>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #title>{{ MEDialog.title }}</template>
      <template #default>
        <MonacoEditor
          class="bg-#1e1e1e"
          v-model="MEData.value"
          v-bind="MEData.params"
        ></MonacoEditor>
      </template>
    </DesignPopup>
  </DesignPopup>
</template>
<script lang="ts" setup>
import * as ButtonApi from '@/api/design/table/customButton'
import useMEDialog from '@/hooks/design/useMEDialog'
import { customButtonExample } from '@/components/LowDesign/src/utils/example'
import useCopyText from '@/hooks/design/useCopyText'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

defineOptions({ name: 'CustomButton' })
interface Props {
  dbformId?: string
  tableName?: string
  tableDescribe?: string
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = defineProps<Props>()

const { copyText } = useCopyText()
const { MEDialog, MEData, openMEDialog } = useMEDialog()

const loading = ref(true) // 列表的加载中消息弹窗
const defaultBtn = [
  'addBtn',
  'editBtn',
  'viewBtn',
  'delBtn',
  'importBtn',
  'exportBtn',
  'batchDelBtn'
]
const tableOption = reactive({
  border: true,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 12,
  calcHeight: 20,
  labelWidth: 100,
  dialogWidth: 900,
  selection: true,
  viewBtn: false,
  column: {
    buttonName: {
      label: '按钮名称',
      rules: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }]
    },
    buttonCode: {
      label: '按钮编码',
      rules: [
        { required: true, message: '请输入按钮编码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (defaultBtn.includes(value)) callback(`请不要以${value}作为按钮编码`)
            else callback()
          },
          trigger: 'blur'
        }
      ]
    },
    buttonLocation: {
      label: '按钮位置',
      type: 'select',
      clearable: false,
      dicData: [
        { label: '操作列按钮', value: 'menu' },
        { label: '表格头部按钮', value: 'header' }
      ],
      value: 'menu'
    },
    buttonType: {
      label: '按钮类型',
      type: 'select',
      clearable: false,
      dicData: [
        { label: '默认', value: '' },
        { label: '主要', value: 'primary' },
        { label: '成功', value: 'success' },
        { label: '信息', value: 'info' },
        { label: '警告', value: 'warning' },
        { label: '危险', value: 'danger' }
      ],
      value: ''
    },
    buttonIcon: {
      label: '按钮图标'
    },
    buttonSort: {
      label: '按钮排序',
      value: '1'
    },
    buttonShow: {
      label: '是否启用',
      type: 'radio',
      dicData: [
        { label: '启用', value: 'Y' },
        { label: '停用', value: 'N' }
      ],
      span: 12,
      value: 'Y'
    },
    buttonAuth: {
      label: '权限控制',
      type: 'radio',
      labelTip: '开启后可以通过菜单权限控制显隐',
      dicData: [
        { label: '启用', value: 'Y' },
        { label: '停用', value: 'N' }
      ],
      span: 12,
      value: 'N'
    },

    buttonExp: {
      label: '其他配置',
      span: 24,
      hide: true,
      params: {
        providerType: 'tableJsEnhance',
        width: '50%',
        headerBtn: [
          {
            name: `复制配置示例`,
            icon: 'solar:copy-outline',
            clickFun: () => {
              copyText(customButtonExample || '')
            },
            params: {
              size: 'small',
              type: 'primary'
            }
          }
        ]
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
const isFull = ref(true)
const tableSelect = ref([])

const crudRef = ref()
const { initTableLayout, windowSize } = useCrudHeight(crudRef)

const selectIds = computed(() => {
  return tableSelect.value.map((item) => item['id'])
})

const calcHeight = computed(() => {
  return isFull.value ? 20 : windowSize.height.value * 0.1 + 70
})

watch(
  () => popupShow.value,
  (val: boolean) => {
    if (val) getTableData()
  }
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

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
    dbformId: props.dbformId
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await ButtonApi.getBtnList(searchObj)
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

/** 表单打开前 */
const beforeOpen = async (done, type) => {
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    tableForm.value = await ButtonApi.getBtnDetail(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await ButtonApi.saveBtnData({ ...form, dbformId: props.dbformId }).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await ButtonApi.updateBtnData({ ...form, dbformId: props.dbformId }).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (data) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ButtonApi.deleteBtnData(data instanceof Array ? data : [data.id])
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

<style lang="scss">
.button-info-dialog {
  .el-dialog__body {
    padding: 20px;
    overflow-x: hidden;
  }
}
</style>
