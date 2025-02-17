<template>
  <el-container class="low-form-design h-100%" v-loading="loading">
    <el-container>
      <el-aside class="w-270px!">
        <!-- 左边控件字段 -->
        <DesignControl
          @add-control="addControl"
          @set-option="setOption"
          :isShow="isShow"
          :dataId="formDesignData?.id"
        ></DesignControl>
      </el-aside>
      <el-main class="main-content p-0!">
        <!-- 顶部工具栏 -->
        <el-header
          class="w-100% flex items-center justify-between"
          :style="{ height: '40px !important', borderBottom: '1px solid #e0e0e0' }"
        >
          <div class="toolbar-left">
            <el-button type="primary" text link @click="handleToolbar('js')">
              <Icon :size="14" icon="akar-icons:edit" /><span class="ml-2px!">JS增强</span>
            </el-button>
            <el-button type="primary" text link @click="handleToolbar('scss')">
              <Icon :size="14" icon="akar-icons:edit" /><span class="ml-2px!">SCSS增强</span>
            </el-button>
            <el-button
              type="success"
              text
              link
              :disabled="!formOption.column.length"
              @click="handleToolbar('view')"
            >
              <Icon :size="14" icon="ep:view" /><span class="ml-3px!">预览表单</span>
            </el-button>
            <avue-select
              class="top-preview-select"
              v-model="previewData.formType"
              :dic="previewDic"
              :clearable="false"
            ></avue-select>

            <el-popover
              placement="bottom"
              :width="400"
              trigger="click"
              popper-class="quick-layout-popover"
            >
              <template #reference>
                <el-button type="primary" text link>
                  <Icon :size="14" icon="bi:magic" /><span class="ml-2px!">快速布局</span>
                </el-button>
              </template>
              <div class="flex p-5px">
                <div
                  class="flex-1 p-10px text-center cursor-pointer item"
                  v-for="item in spanDic"
                  :key="item.value"
                  @click="setSpanLayout(item.value)"
                >
                  <Icon :size="46" :icon="item.icon" />
                  <div>{{ item.label }}</div>
                </div>
              </div>
            </el-popover>
          </div>
          <div class="toolbar-right">
            <el-button type="danger" text link @click="handleUndo" :disabled="!canUndo">
              <Icon :size="14" icon="majesticons:undo" /><span class="ml-3px!">撤销</span>
            </el-button>
            <el-button class="mr-20px" type="primary" text link @click="redo" :disabled="!canRedo">
              <Icon :size="14" icon="majesticons:redo" /><span class="ml-3px!">重做</span>
            </el-button>
            <el-button type="success" text link @click="handleToolbar('save')">
              <Icon :size="14" icon="lucide:save" /><span class="ml-3px!">保存配置</span>
            </el-button>

            <el-button
              type="danger"
              text
              link
              @click="handleToolbar('clear')"
              :disabled="!formOption.column.length"
            >
              <Icon :size="14" icon="ant-design:clear-outlined" /><span class="ml-3px!"
                >清空配置</span
              >
            </el-button>
          </div>
        </el-header>
        <!-- 设计区域 -->
        <DesignLayout
          ref="designLayout"
          v-model="formOption"
          v-model:select="currSelect"
        ></DesignLayout>
      </el-main>
      <el-aside>
        <DesignConfig
          ref="configRef"
          v-model="formOption"
          v-model:select="currSelect"
        ></DesignConfig>
      </el-aside>
    </el-container>
  </el-container>
  <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
    <template #default>
      <el-container class="h-100%" v-loading="loading">
        <el-main class="p-0!">
          <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
        </el-main>
        <el-aside width="260px" v-if="MEDialog.otherParams">
          <TipView v-bind="MEDialog.otherParams"></TipView>
        </el-aside>
      </el-container>
    </template>
  </DesignPopup>
  <DesignPopup v-model="previewData.dialog" title="预览">
    <template #default>
      <LowForm
        v-if="previewData.dialog"
        :formOption="previewData.option"
        :formType="previewData.formType"
        :formId="formDesignData?.id"
        :isPreview="true"
        :beforeClose="previewBeforeClose"
      ></LowForm>
    </template>
  </DesignPopup>
  <DesignPopup
    v-model="previewData.dataDialog"
    title="提交数据预览"
    width="60%"
    :is-body-full="true"
  >
    <template #default>
      <MonacoEditor v-model="previewData.formData"></MonacoEditor>
    </template>
  </DesignPopup>
  <DesignPopup v-model="sampleDialog" title="控件使用示例" :width="280">
    <template #default>
      <div class="text-center p-20px">
        <div class="b b-b-0 b-solid b-#f1f1f1 .dark:b-[var(--el-border-color-dark)]">
          <div
            v-for="(item, key) in controlPath"
            :key="key"
            class="h-50px flex items-center b-b b-b-solid b-#f1f1f1 .dark:b-[var(--el-border-color-dark)] pr-10px"
          >
            <div class="text-14px flex-1">{{ item.name }}</div>
            <el-button
              class="flex-basis-80px flex-shrink-0"
              size="small"
              type="primary"
              @click="copySampleStr(key)"
              >点击复制</el-button
            >
          </div>
        </div>
      </div>
    </template>
  </DesignPopup>
</template>

<script setup lang="ts">
import { DesignControl, DesignConfig, DesignLayout } from './components'
import { TipView } from '@/views/lowdesign/general/components/index'
import useMEDialog from '@/hooks/design/useMEDialog'
import { useManualRefHistory } from '@vueuse/core'
import * as DictDataApi from '@/api/system/dict/dict.type'
import * as TableApi from '@/api/design/table'
import { lowFormDesignKey } from '@/utils/symbols'
import { findNode, findPathAll } from '@/utils/tree'
import { convertFormViewOption } from './utils/convert'
import * as Example from '@/components/LowDesign/src/utils/example'
import controlPath from '@/components/LowDesign/src/controlPath'
import { updateFormData } from '@/api/design/form'
import useCopyText from '@/hooks/design/useCopyText'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'LowFormDesign' })

const props = defineProps({
  isShow: Boolean,
  formDesignData: Object
})

const designLayout = ref()
const defaultOption = {
  labelPosition: 'right',
  labelSuffix: ' ',
  labelWidth: 120,
  gutter: 20,
  menuBtn: true,
  submitBtn: true,
  submitText: '提交',
  emptyBtn: false,
  emptyText: '清空',
  menuPosition: 'center',
  size: 'default',
  isSubmitTable: true,
  column: []
}
const formOption = ref<any>(cloneDeep(defaultOption))
const enhance = ref({ jsEnhance: Example.formJsEnhanceExample, scssEnhance: '' })
const currSelect = ref({})
const parentData = ref({ type: '', prop: '', tabsIndex: null })
const previewData = ref({
  dialog: false,
  dataDialog: false,
  formData: '',
  option: {},
  formType: 'edit' as 'add' | 'view' | 'edit',
  handleType: 'returnData'
})
const previewDic = [
  { label: '新增', value: 'add' },
  { label: '编辑', value: 'edit' },
  { label: '详情', value: 'view' }
]
const spanDic = [
  { label: '一列', value: 24, icon: 'tabler:columns-1' },
  { label: '二列', value: 12, icon: 'tabler:columns-2' },
  { label: '三列', value: 8, icon: 'tabler:columns-3' },
  { label: '四列', value: 6, icon: 'lucide:columns-4' }
]
const loading = ref(false)
const sampleDialog = ref(false)

const dictOptions = ref<DictDataApi.DictTypeVO[]>()
const tableDbOptions = ref({})
const tableSubDb = ref({})
const tableSubDbOptions = ref({})
const defaultField = [
  'id',
  'tenant_id',
  'create_user',
  'create_time',
  'create_dept',
  'update_user',
  'update_time',
  'is_deleted'
]

const configRef = ref()

const message = useMessage()
const { copyText } = useCopyText()
const { MEDialog, MEData, openMEDialog } = useMEDialog()
const { canUndo, canRedo, commit, undo, redo, clear } = useManualRefHistory(formOption, {
  clone: true
})

const saveBtnData = {
  params: { type: 'primary' },
  name: '保存配置',
  loading: true,
  icon: 'lucide:save',
  clickFun: async (loading) => {
    await saveFormOption()
    loading()
  }
}
const viewFormData = {
  params: { type: 'success' },
  name: '预览表单',
  icon: 'ep:view',
  clickFun: async () => {
    handleToolbar('view')
  }
}

const handleToolbar = (type) => {
  if (['js', 'scss'].includes(type)) openEnhance(type)
  else if (type == 'view') {
    if (MEDialog.value?.params) MEDialog.value.params['handleClose'](() => {})
    previewData.value.option = {
      ...convertFormViewOption(formOption.value, 'save'),
      ...enhance.value
    }
    previewData.value.dialog = true
  } else if (type == 'clear') {
    message.confirm('是否确认清空配置？', '清空配置').then(() => {
      commit()
      currSelect.value = {}
      formOption.value.column = []
    })
  } else if (type == 'save') saveFormOption()
}

const previewBeforeClose = (type, form, loading) => {
  if (type == 'submit') {
    try {
      previewData.value.formData = `return ${JSON.stringify(form, null, 2)}`
    } catch (error) {
      previewData.value.formData = `表单数据预览失败，请在控制台查看表单数据`
      console.warn('=== 表单数据 ===', form)
    }
    previewData.value.dataDialog = true
  }
  loading()
}

const openEnhance = (type) => {
  const obj = {
    prop: `${type}Enhance`,
    label: `${type.toUpperCase()}增强`,
    params: {
      language: type == 'js' ? 'javascript' : 'scss',
      fullscreen: true,
      providerType: type == 'js' ? 'formJsEnhance' : '',
      headerBtn: [saveBtnData, viewFormData] as any[]
    }
  }
  if (type == 'js') {
    obj.params['otherParams'] = { type: 'simple', tipKeyList: ['FormJsEnhance'] }
    obj.params['headerBtn'].push({
      params: { type: 'success' },
      name: '控件使用示例',
      icon: 'jam:code-sample',
      clickFun: async () => (sampleDialog.value = true)
    })
  }
  if (type == 'scss') {
    if (enhance.value[obj.prop]) {
      if (props.formDesignData?.id) {
        enhance.value[obj.prop] = enhance.value[obj.prop].replace(
          /.low-form__[\d]+/,
          `.low-form__${props.formDesignData.id}`
        )
      }
    } else {
      enhance.value[obj.prop] = `.low-form__${props.formDesignData?.id} {
  //样式请写在当前位置内
}`
    }
  }
  openMEDialog(obj, enhance.value)
}

//点击控件列表 在相应位置追加控件
const addControl = (controlItem: any) => {
  const currProp = currSelect.value['prop']
  const currType = currSelect.value['type']
  const { prop, type } = parentData.value
  const groupName = 'layoutGroup'
  const tableName = 'layoutTable'
  const tabsName = 'layoutTabs'

  let isAdd = true
  if (currProp) {
    const nodeListAll = findPathAll(
      formOption.value.column,
      (node) =>
        (node.prop == prop && node.type == type) ||
        (node.prop == currProp && node.type == currType),
      { children: 'column' }
    )
    const nodeList = nodeListAll[nodeListAll.length - 1]
    if (nodeList) {
      let length = nodeList.length
      let index = length - 1
      const findIndex = () => {
        if (index != -1) {
          let bool = false
          const nodeType = nodeList[index].type
          const itemType = controlItem.type
          if ([groupName, tableName, tabsName].includes(nodeType)) {
            if (itemType == groupName && [groupName, tableName].includes(nodeType)) bool = true
            if (itemType == tableName && [tableName].includes(nodeType)) bool = true
            if (itemType == tabsName) {
              let is_p_tabs = false
              nodeList.forEach((item, i) => {
                if (item.type == tabsName && i < index) is_p_tabs = true
              })
              if ([tabsName, tableName].includes(nodeType) || is_p_tabs) bool = true
            }
            if (['ueditor', 'buttonList', 'title'].includes(itemType) && nodeType == tableName) {
              bool = true
            }
          } else bool = true
          if (bool) {
            index--
            findIndex()
          }
        }
      }
      findIndex()
      if (index != -1) {
        const addKey = {
          layoutGroup: 'handleAddGroupColumn',
          layoutTable: 'handleAddTableColumn',
          layoutTabs: 'handleAddTabsColumn'
        }
        let currColumn = designLayout.value
        let parentTabValue: number | undefined = undefined
        nodeList.forEach((node, i) => {
          if (i <= index && node.type != 'tab') {
            if (parentTabValue === undefined) currColumn = currColumn[node.type][node.prop]
            else {
              currColumn = currColumn[node.type][`${parentTabValue}_${node.prop}`]
              parentTabValue = undefined
            }
            if (currColumn.tabValue) parentTabValue = currColumn.tabValue
          }
        })
        if (currColumn.tabValue !== undefined) {
          nodeList[index].column[currColumn.tabValue].column.push(controlItem)
          currColumn[addKey[nodeList[index].type]](
            {
              newIndex: nodeList[index].column[currColumn.tabValue].column.length - 1
            },
            Number(currColumn.tabValue)
          )
        } else {
          nodeList[index].column.push(controlItem)
          currColumn[addKey[nodeList[index].type]]({ newIndex: nodeList[index].column.length - 1 })
        }
        isAdd = false
      }
    }
  }
  if (isAdd) {
    formOption.value.column.push(controlItem)
    designLayout.value.handleAddColumn({ newIndex: formOption.value.column.length - 1 })
  }
}
//设置当前父级
const setParentData = (type: string, prop: string, tabsIndex?) => {
  parentData.value.type = type
  parentData.value.prop = prop
  parentData.value.tabsIndex = type == 'layoutTabs' ? tabsIndex : null
}
//撤销处理
const handleUndo = () => {
  undo()
  let prop = parentData.value.prop || currSelect.value['prop']
  let type = parentData.value.type || currSelect.value['type']
  const parentNode = findNode(
    formOption.value.column,
    (node) => node.prop == prop && node.type == type,
    { children: 'column' }
  )
  if (parentNode) {
    let isParent = false
    if (parentNode.column?.length) {
      const index = parentNode.column.findIndex((item) => item.prop == currSelect.value['prop'])
      if (index == -1) isParent = true
    } else isParent = true
    if (isParent) currSelect.value = parentNode
  } else currSelect.value = {}
}
const saveFormOption = () => {
  return new Promise(async (resolve) => {
    let option = convertFormViewOption(formOption.value, 'save')
    if (MEDialog.value?.params) MEDialog.value.params['handleClose'](() => {})
    option = { ...enhance.value, ...option }
    if (props.formDesignData?.id) {
      loading.value = true
      let bool = await updateFormData({
        id: props.formDesignData.id,
        desformJson: JSON.stringify(option)
      }).catch(() => false)
      if (bool) message.success('保存成功')
      loading.value = false
    }
    resolve(true)
  })
}
const setSpanLayout = (num) => {
  const setSpan = (column) => {
    column = column.map((item) => {
      if (
        !['textarea', 'array', 'buttonList', 'ueditor', 'markDown', 'customControl'].includes(
          item.type
        ) &&
        !['layout', 'upload'].includes(item.controlType)
      ) {
        item.span = num
      }
      if (item.type == 'layoutGroup') setSpan(item.column)
      if (item.type == 'layoutTabs') item.column.forEach((child) => setSpan(child.column))
      return item
    })
  }
  setSpan(formOption.value.column)
  setTimeout(() => {
    commit()
  }, 0)
}

const getDictOptions = async () => {
  dictOptions.value = await DictDataApi.getSimpleDictTypeList()
}
const getTableDesignOptions = async () => {
  const data = await TableApi.getAllDbDicData()
  data.forEach((item) => {
    const field = item.fieldModelList
      .map((child, index) => {
        return {
          label: `${child.fieldCode}（${child.fieldName}）`,
          value: child.fieldCode,
          name: child.fieldName,
          sort: defaultField.includes(child.fieldCode) ? 999 : index
        }
      })
      .sort((a, b) => a.sort - b.sort)

    const dicItem = {
      label: `${item.tableName}（${item.tableDescribe}）`,
      value: item.tableId,
      field,
      tableType: item.tableType
    }
    if (item.tableType == 4) {
      tableSubDb.value[item.tableId] = dicItem
      tableSubDbOptions.value[item.tableName] = dicItem
    } else {
      tableDbOptions.value[item.tableId] = dicItem
      if (item.tableType == 3 && item.subTableListStr) {
        const subList = item.subTableListStr.split(',')
        if (subList.length) {
          const dicItem = tableDbOptions.value[item.tableId]
          dicItem.subList = subList
        }
      }
    }
  })
  for (const key in tableDbOptions.value) {
    const dicItem = tableDbOptions.value[key]
    if (dicItem.subList) {
      dicItem.subList = dicItem.subList.map((tableName) => {
        const label = tableSubDbOptions.value[tableName]?.label || ''
        return { label, value: tableName }
      })
    }
  }
}
const initDic = () => {
  getDictOptions()
  getTableDesignOptions()
}

const copySampleStr = (type) => {
  copyText(Example.controlInitExample(type))
  sampleDialog.value = false
}

const setOption = (data, isConvert?) => {
  currSelect.value = {}
  parentData.value = { type: '', prop: '', tabsIndex: null }
  enhance.value = { jsEnhance: data.jsEnhance, scssEnhance: data.scssEnhance }
  delete data.jsEnhance
  delete data.scssEnhance

  formOption.value = isConvert ? convertFormViewOption(data, 'formDesign') : data
}

const setConfigTab = (type) => {
  configRef.value.setTabsVal(type)
}

watch(
  () => props.isShow,
  (val: boolean) => {
    let bool = true

    try {
      if (val && props.formDesignData && props.formDesignData.desformJson) {
        const data = JSON.parse(props.formDesignData.desformJson)
        setOption(data, true)
        bool = false
      } else {
        currSelect.value = {}
        parentData.value = { type: '', prop: '', tabsIndex: null }
      }
    } catch (error) {
      message.info('表单配置异常，请查看控制台打印')
      console.warn('配置转换异常：' + error)
    }
    if (bool) {
      formOption.value = cloneDeep(defaultOption)
      enhance.value = { jsEnhance: Example.formJsEnhanceExample, scssEnhance: '' }
    }
    if (val) {
      clear()
      commit()
      initDic()
    }
  },
  { immediate: true }
)

provide(lowFormDesignKey, {
  formOption,
  parentData,
  dictOptions,
  tableDbOptions,
  tableSubDb,
  tableSubDbOptions,
  example: Example,
  setParentData,
  historyCommit: commit,
  setConfigTab
})

onMounted(async () => {})
</script>

<style lang="scss">
@import url('./styles/index.scss');

.quick-layout-popover {
  .item:hover {
    background-color: #f4f4f5;
  }
}

.dark .quick-layout-popover .item:hover {
  background-color: var(--el-bg-color);
}
</style>
<style lang="scss" scoped>
.main-content {
  border: 1px solid #e0e0e0;
  border-top: 0;
  border-bottom: 0;

  .top-preview-select {
    width: 58px;
    margin-right: 20px;

    ::v-deep(.el-select__wrapper) {
      padding: 0 4px 0 8px;
      font-size: 12px;

      .el-icon {
        margin-left: 0;
      }
    }
  }
}
</style>
