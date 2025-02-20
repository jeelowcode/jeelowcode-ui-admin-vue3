<template>
  <avue-tabs ref="tabsRef" :option="tabsOption" @change="tabsHandleChange"></avue-tabs>
  <InfoVxeTopBtn
    v-show="tabsValue.edit"
    :selectNum="tabsValue.dataKey ? infoSelect[tabsValue.dataKey].length : 0"
    :tabItem="tabsValue"
    :size="size"
    @cell-add="cellAddData"
    @del-data="delTableInfoData"
    @order-data="setInfoOrder"
  >
    <template #default>
      <el-button @click.stop="setDefaultField" v-show="tabsValue.key == 'mysql'">
        <span>{{ viewDefaultField == 'Y' ? '隐藏' : '显示' }}系统字段</span>
        <el-tooltip effect="dark" content="仅影响当前界面显示，不影响系统字段的创建">
          <Icon :size="14" icon="ep:info-filled"></Icon>
        </el-tooltip>
      </el-button>
    </template>
  </InfoVxeTopBtn>
  <template v-for="tab in tabsOption.column" :key="tab.prop">
    <div v-show="tabsValue.prop === tab.prop">
      <template v-if="tab.children">
        <el-tabs
          :class="{ 'h-430px': childTabsValue.edit, 'h-386px': !childTabsValue.edit }"
          v-model="childTabsValue.prop"
          tabPosition="left"
          type="border-card"
          @tab-change="childTabChange"
        >
          <InfoVxeTopBtn
            v-show="childTabsValue.edit"
            :selectNum="childTabsValue.dataKey ? infoSelect[childTabsValue.dataKey].length : 0"
            :tabItem="childTabsValue"
            :size="size"
            @cell-add="cellAddData"
            @del-data="delTableInfoData"
            @order-data="setInfoOrder"
          />
          <el-tab-pane
            v-for="child in tab.children"
            :key="child.prop"
            :name="child.prop"
            :label="child.label"
          >
            <InfoVxeTable
              v-model="infoData[child.dataKey]"
              :ref="(el) => (tableRefObj[child.prop] = el)"
              :tabItem="child"
              :column="tableInfoOption.infoColumn[`${child.key}Column`]"
              @selection-change="infoSelectionChange"
              @cell-click="cellClick"
              @dropdown-command="dorpdownHandleCommand"
            ></InfoVxeTable>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <InfoVxeTable
          v-model="infoData[tab.dataKey]"
          :ref="(el) => (tableRefObj[tab.prop] = el)"
          :tabItem="tab"
          :column="tableInfoOption.infoColumn[`${tab.key}Column`]"
          :checkboxConfig="tab.key == 'mysql' ? { checkMethod: mysqlCheckMethod } : {}"
          :row-class-name="tab.key == 'virtual' ? virtualRowClassName : ''"
          @selection-change="infoSelectionChange"
          @cell-click="cellClick"
          @dropdown-command="dorpdownHandleCommand"
        ></InfoVxeTable>
      </template>
    </div>
  </template>
  <DesignPopup
    v-model="optionsDialog.dialog.value"
    v-bind="optionsDialog.dialog"
    :isBodyFull="true"
  >
    <template #default>
      <template v-for="(control, key) in optionComponents" :key="key">
        <component
          :ref="(el) => (optionRef[key] = el)"
          v-if="key == optionsDialog.controlType"
          :is="control"
          v-model="optionsDialog.controlValue"
          v-bind="optionsDialog.controlData"
          :show="optionsDialog.dialog.value"
        ></component>
      </template>
    </template>
  </DesignPopup>
</template>

<script setup lang="ts">
import ConfigOption from './ConfigOption.vue'
import FormattingOption from './FormattingOption.vue'
import SqlOption from './SqlOption.vue'
import InfoVxeTable from './InfoVxeTable.vue'
import InfoVxeTopBtn from './InfoVxeTopBtn.vue'
import { MonacoEditor } from '@/components/MonacoEditor/index'
import { VerifyOption } from '../../general/components/index'
import { tableInfoOption, dicObj } from '../designData'
import { cloneDeep } from 'lodash-es'

import * as DictDataApi from '@/api/system/dict/dict.type'
import * as TableApi from '@/api/design/table/index'

defineOptions({ name: 'TableInfo' })
const message = useMessage()

interface Props {
  formType: string
  editInfoData: any
  showDef?: string
  size: any
  tableName: string
}
const props = withDefaults(defineProps<Props>(), {
  formType: ''
})
const emit = defineEmits(['set-tree-label'])
const tabsOption = ref({
  column: [
    { label: '数据库属性', prop: 'tab_mysql', key: 'mysql', dataKey: 'basics', edit: true },
    { label: '页面属性', prop: 'tab_view', key: 'view', dataKey: 'basics' },
    { label: '查询属性', prop: 'tab_query', key: 'query', dataKey: 'basics' },
    { label: '字典配置', prop: 'tab_dic', key: 'dic', dataKey: 'basics' },
    { label: '导入/导出配置', prop: 'tab_exp', key: 'exp', dataKey: 'basics' },
    {
      label: '统计配置',
      prop: 'tab_summary',
      children: [
        {
          label: '表格底部统计',
          prop: 'tab_summary_bottom',
          key: 'summaryBottom',
          dataKey: 'basics'
        },
        {
          label: '表格顶部统计',
          prop: 'tab_summary_top',
          key: 'summaryTop',
          dataKey: 'summaryTop',
          edit: true
        }
      ]
    },
    { label: '虚拟字段格式化', prop: 'tab_virtual', key: 'virtual', dataKey: 'basics' },
    { label: '外键', prop: 'tab_key', key: 'key', dataKey: 'basics' },
    { label: '索引', prop: 'tab_index', key: 'index', dataKey: 'index', edit: true }
  ]
})
const tabsValue = ref(tabsOption.value.column[0])
const childTabsValue = ref<any>({})
const viewDefaultField = ref('N')

const infoData = ref({
  basics: [] as any[],
  index: [],
  summaryTop: []
})
const infoSelect = ref({
  basics: [],
  index: [],
  summaryTop: []
})
const tableInfoDefault = ref<any[]>([])
const optionsDialog = ref<any>({ dialog: {}, controlData: {} })
const tableRefObj = ref({})

const optionComponents = markRaw({
  config: ConfigOption,
  verify: VerifyOption,
  formatting: FormattingOption,
  sqlOption: SqlOption,
  meditor: MonacoEditor
})
const optionRef = ref({})
const tabsRef = ref()

const fieldList = computed(() => {
  let dicData: Array<{ label: string; value: string; type: string }> = []
  infoData.value.basics.forEach((item) => {
    if (item.fieldCode && item.isDb == 'Y')
      dicData.push({
        label: `${item.fieldCode}${item.fieldName ? '（' + item.fieldName + '）' : ''}`,
        value: item.fieldCode,
        type: item.fieldType
      })
  })
  if (viewDefaultField.value == 'N') {
    dicData = [...dicData, ...dicObj.indexFieldDefault]
  }
  return dicData
})

const treeLabel = computed(() => {
  let dicData: Array<{ label: string; value: string }> = []
  infoData.value.basics.forEach((item) => {
    if (item.fieldCode && !item.only)
      dicData.push({
        label: `${item.fieldCode}${item.fieldName ? '（' + item.fieldName + '）' : ''}`,
        value: item.fieldCode
      })
  })
  return dicData
})

watch(
  () => fieldList.value,
  (dicData: any) => {
    const dicDataObj = {}
    dicData.forEach(({ value, label }) => (dicDataObj[value] = label))
    Object.assign(tableInfoOption.infoColumn.indexColumn.indexFieldCodeList.editRender, {
      dicData: dicData,
      dicObj: dicDataObj
    })
  }
)

watch(
  () => treeLabel.value,
  (val: any) => {
    emit('set-tree-label', val)
  }
)

const dorpdownHandleCommand = (command) => {
  let { dataKey, children } = tabsValue.value
  if (children) dataKey = childTabsValue.value.dataKey
  if (!dataKey) return
  let { index, type } = command
  if (type == 'up' || type == 'down') {
    const delItem = infoData.value[dataKey].splice(index, 1)[0]
    nextTick(() => infoData.value[dataKey].splice(type == 'up' ? index - 1 : index + 1, 0, delItem))
  } else if (type == 'add') cellAddData(index + 1)
}
const setInfoOrder = () => {
  let { dataKey, children } = tabsValue.value
  if (children) dataKey = childTabsValue.value.dataKey
  if (!dataKey) return
  message
    .prompt('请输入序号（格式：原序号/最终序号）', '调整排序', { inputValue: '/', type: '' })
    .then(({ value }) => {
      let orderArr = value.split('/')
      if (orderArr.length == 2) {
        const delItem = infoData.value[dataKey].splice(Number(orderArr[0].trim()) - 1, 1)[0]
        nextTick(() => infoData.value[dataKey].splice(Number(orderArr[1].trim()) - 1, 0, delItem))
      } else message.error('请输入正确的格式，如：2/3')
    })
    .catch(() => {})
}
const setDefaultField = () => {
  let defaultData = [] as any
  let basicsData = [] as any
  if (viewDefaultField.value == 'Y') {
    //隐藏
    infoData.value.basics.forEach((item, index) => {
      item.sortNum = index + 1
      if (
        tableInfoOption.disabledArr.includes(item.fieldCode) &&
        !['id', 'pid'].includes(item.fieldCode)
      ) {
        defaultData.push(item)
      } else {
        basicsData.push(item)
      }
    })
    viewDefaultField.value = 'N'
  } else {
    basicsData = [...infoData.value.basics]
    tableInfoDefault.value.forEach((item) => {
      basicsData.splice(item.sortNum - 1, 0, item)
    })
    viewDefaultField.value = 'Y'
  }
  tableInfoDefault.value = defaultData
  infoData.value.basics = basicsData
}

const mysqlCheckMethod = ({ row }) => {
  return !row.only
}
const virtualRowClassName = ({ row }) => {
  if (row.isDb == 'Y') return 'virtual-hide-row'
}

const infoSelectionChange = (selectObj) => {
  let { dataKey, children } = tabsValue.value
  if (children) dataKey = childTabsValue.value.dataKey
  if (!dataKey) return
  infoSelect.value[dataKey] = selectObj.records
}

const delTableInfoData = () => {
  let { dataKey, prop, children } = tabsValue.value
  if (children) {
    dataKey = childTabsValue.value.dataKey
    prop = childTabsValue.value.prop
  }
  if (!dataKey) return
  const keyArr = infoSelect.value[dataKey].map((item) => item._X_ROW_KEY)
  infoData.value[dataKey] = infoData.value[dataKey].filter(
    (item) => !keyArr.includes(item._X_ROW_KEY)
  )
  tableRefObj.value[prop].vxeTableRef.clearCheckboxRow()
  infoSelect.value[dataKey] = []
}

const setTableInfoTree = (tableType) => {
  infoData.value.basics = infoData.value.basics.filter((item) => {
    if (item.only && item.fieldCode == 'pid') return false
    return true
  })
  if (tableType == 2)
    infoData.value.basics.splice(1, 0, ...tableInfoOption.getDefaultMysqlField('tree'))
}

const tabsHandleChange = (column) => {
  tabsValue.value = column
  if (column.children?.length) childTabsValue.value = cloneDeep(column.children[0])
}
const childTabChange = (prop) => {
  if (tabsValue.value.children) {
    const index = tabsValue.value.children.findIndex((item) => item.prop == prop)
    childTabsValue.value = cloneDeep(tabsValue.value.children[index])
  } else childTabsValue.value = []
}
const setTabsValue = (prop) => {
  tabsOption.value.column.forEach((item, index) => {
    if (item.prop == prop) {
      tabsRef.value.changeTabs(index)
    }
  })
}

const cellAddData = (addIndex) => {
  let { prop, key, dataKey, children } = tabsValue.value
  if (children) {
    prop = childTabsValue.value.prop
    key = childTabsValue.value.key
    dataKey = childTabsValue.value.dataKey
  }
  if (!dataKey) return
  let addData = cloneDeep(tableInfoOption.infoDefaultData[dataKey]) || {}
  let index = infoData.value[dataKey].length
  if (key == 'mysql' && addIndex === undefined) {
    const indexList = [] as any
    infoData.value[dataKey].forEach((item, index) => {
      if (
        tableInfoOption.disabledArr.includes(item.fieldCode) &&
        !['id', 'pid'].includes(item.fieldCode)
      )
        indexList.push({ label: item.fieldCode, value: index })
    })
    indexList.sort((a, b) => a.value - b.value)
    if (indexList.length) {
      for (const i in indexList) {
        const currIndex = Number(i)
        if (indexList[currIndex + 1] === undefined) break
        if (indexList[currIndex].value != indexList[currIndex + 1].value - 1) {
          index = indexList[currIndex + 1].value
        }
      }
    }
  }
  infoData.value[dataKey].splice(addIndex === undefined ? index : addIndex, 0, addData)
  tableScrollIndex(key, index, addIndex)
}

const tableScrollIndex = (key, index, addIndex?) => {
  setTimeout(() => {
    const tableBodyDom = document.querySelector(`.${key}-vxe-table .vxe-table--body-wrapper`)
    if (tableBodyDom) {
      const bool = addIndex === undefined
      tableBodyDom.scrollTop =
        (bool ? index : addIndex) * 40 - (bool ? 0 : tableBodyDom['offsetHeight'] / 2)
    }
    if (key == 'summaryTop') key = 'summary_top'
    tableRefObj.value[`tab_${key}`].vxeTableRef.setEditRow(
      tableRefObj.value[`tab_${key}`].vxeTableRef.getData(addIndex ? addIndex : index)
    )
  }, 300)
}

const openOptions = (type, { row, dataKey, index, typeText, infoKey }, otherData = {}) => {
  const { viewColumn } = tableInfoOption.infoColumn
  const controlText = viewColumn.controlType.editRender.dicObj[row.controlType]
  let title = ''
  if (['virtual_sql_str', 'virtual_java_str'].includes(dataKey))
    title = `${row.fieldCode} ${typeText}`
  else if (!row.fieldCode) title = typeText
  else if (row.fieldCode) title = `${row.fieldCode} ${row.fieldName} ${typeText}（${controlText}）`

  optionsDialog.value = {
    controlValue: row[dataKey],
    controlType: type,
    controlData: { ...otherData },
    dialog: {
      value: true,
      title,
      handleClose: (done) => {
        let optionStr = ''
        const controlRef = optionRef.value[type]
        if (controlRef?.getOptionStr) optionStr = controlRef.getOptionStr()
        else if (controlRef?.getValue) optionStr = controlRef.getValue()
        done()
        setTimeout(() => {
          infoData.value[infoKey][index][dataKey] = optionStr
          if (infoKey == 'summaryTop' && dataKey == 'summarySql') {
            const data = JSON.parse(optionStr || '{}')
            infoData.value[infoKey][index].summaryControl = data.summaryControl || 'text'
          }
        }, 30)
      },
      dialogParams: { closeOnPressEscape: true, closeOnClickModal: true }
    }
  }
}

const lowClickInputClick = (row, dataKey, index, type) => {
  let typeText = ''
  let infoKey = 'basics'
  const otherData: any = {}
  if (['controlsConfig', 'queryConfig'].includes(dataKey)) {
    typeText = dataKey == 'controlsConfig' ? '控件配置' : '查询配置'
    otherData.configKey =
      dataKey == 'controlsConfig'
        ? [row.controlType + 'Config', 'cellConfig', 'formConfig']
        : ['queryConfig']
  } else if (dataKey == 'verifyConfig') {
    typeText = '校验配置'
  } else if (dataKey == 'summarySql') {
    typeText = '统计SQL配置'
    infoKey = 'summaryTop'
    otherData.type = 'summaryTop'
  } else if (dataKey == 'virtual_sql_str') {
    typeText = '格式化配置处理'
    otherData.type = 'virtualSql'
    otherData.tableName = props.tableName
  }
  if (['summarySql', 'virtual_sql_str', 'virtual_java_str'].includes(dataKey)) {
    otherData.fieldList = fieldList.value
  }

  openOptions(type, { row, dataKey, index, typeText, infoKey }, otherData)
}

const cellClick = ({ rowIndex }) => {
  let { prop, children } = tabsValue.value
  if (children) prop = childTabsValue.value.prop
  tableRefObj.value[prop].vxeTableRef.setEditRow(
    tableRefObj.value[prop].vxeTableRef.getData(rowIndex)
  )
}

const initEditInfoData = () => {
  const data = tableInfoOption.formattingInitData(props.editInfoData)
  if (viewDefaultField.value == 'Y') infoData.value.basics = data.infoData
  else {
    const fieldList: any[] = []
    tableInfoDefault.value = data.infoData.filter((item) => {
      if (
        tableInfoOption.disabledArr.includes(item.fieldCode) &&
        !['id', 'pid'].includes(item.fieldCode)
      ) {
        return true
      }
      fieldList.push(cloneDeep(item))
      return false
    })
    infoData.value.basics = fieldList
  }
  infoData.value.index = data.indexData
  infoData.value.summaryTop = data.summaryTopData
}

onMounted(() => {
  tableInfoDefault.value = []
  infoData.value.basics = []
  infoData.value.index = []
  if (props.formType == 'add') {
    viewDefaultField.value = 'N'
    tableInfoDefault.value = tableInfoOption.getDefaultMysqlField().filter((item) => {
      if (item.fieldCode == 'id') {
        infoData.value.basics.push(item)
        return false
      }
      return true
    })
  } else {
    viewDefaultField.value = props.showDef || 'N'
    initEditInfoData()
  }

  const { viewColumn, dicColumn, keyColumn } = tableInfoOption.infoColumn
  const clickOption = {
    viewColumn: ['controlsConfig', 'verifyConfig'],
    queryColumn: ['queryConfig'],
    summaryTopColumn: ['summarySql'],
    virtualColumn: ['virtualValue']
  }
  for (let key in clickOption) {
    clickOption[key].forEach((prop) => {
      let type = ''
      if (
        (key == 'viewColumn' && prop == 'controlsConfig') ||
        (key == 'queryColumn' && prop == 'queryConfig')
      )
        type = 'config'
      else if (key == 'viewColumn' && prop == 'verifyConfig') type = 'verify'
      else if (key == 'summaryTopColumn' && prop == 'summarySql') type = 'sqlOption'
      else if (key == 'virtualColumn' && prop == 'virtualValue') type = 'virtual'

      tableInfoOption.infoColumn[key][prop].editRender.events = {
        click: (row, dataKey, index) => {
          if (type == 'virtual') {
            let controlType = ''
            if (row.virtualType == 'sql') controlType = 'sqlOption'
            else if (row.virtualType == 'java') controlType = 'formatting'
            if (controlType) return lowClickInputClick(row, dataKey, index, controlType)
          } else {
            return lowClickInputClick(row, dataKey, index, type)
          }
        }
      }
    })
  }
  viewColumn.controlType.editRender.events = {
    change: (row) => {
      nextTick(() => {
        if (
          !['select', 'radio', 'checkbox', 'tree', 'cascader', 'dicTableSelect'].includes(
            row.controlType
          )
        ) {
          tableRefObj.value['tab_dic'].vxeTableRef.setRow(row, {
            dictType: '',
            dictCode: '',
            dictTable: '',
            dictText: '',
            dictTableColumn: []
          })
        }
      })
    }
  }
  dicColumn.dictType.editRender.events = {
    change: (row) => {
      nextTick(() => {
        if (row.dictType == 'table' && row.dictTable) return
        if (row.dictType == 'dict' && !row.dictTable) return
        tableRefObj.value['tab_dic'].vxeTableRef.setRow(row, {
          dictCode: '',
          dictTable: '',
          dictText: '',
          dictTableColumn: []
        })
      })
    }
  }
  keyColumn.mainTable.editRender.events = {
    change: (row) => {
      nextTick(() => {
        if (!row.mainTable) tableRefObj.value['tab_key'].vxeTableRef.setRow(row, { mainField: '' })
        if (row.mainTable && row.mainField) {
          tableRefObj.value['tab_query'].vxeTableRef.setRow(row, { queryIsDb: 'Y' })
        }
      })
    }
  }
  keyColumn.mainField.editRender.events = {
    change: (row) => {
      nextTick(() => {
        if (row.mainField) {
          tableRefObj.value['tab_mysql'].vxeTableRef.setRow(row, { fieldType: 'BigInt' })
        }
        if (row.mainTable && row.mainField) {
          tableRefObj.value['tab_query'].vxeTableRef.setRow(row, { queryIsDb: 'Y' })
        }
      })
    }
  }
  DictDataApi.getSimpleDictTypeList().then((dicData) => {
    const dicObj = {}
    dicData = dicData.map(({ type, name }) => {
      dicObj[type] = `${type}（${name}）`
      return { label: dicObj[type], value: type }
    })
    Object.assign(dicColumn.dictCode.editRender, { dictDicData: dicData, dictDicObj: dicObj })
  })
  TableApi.getAllDbDicData().then((dbData) => {
    const dicObj = {}
    const tableDicData = {}
    const tableDicObj = {}
    const codeDicData = {}

    const keyTableDicData: Array<object> = []
    const keyTreeTableDicData: Array<object> = []
    const keyTableDicObj = {}
    const keyFieldDicData = {}
    const keyFieldDicObj = {}

    if (props.formType == 'edit') {
      dbData = dbData.filter((item) => item.tableName != props.editInfoData.dbForm.tableName)
    }
    const dicData = dbData.map(
      ({ tableName, tableDescribe, tableId, tableType, fieldModelList }) => {
        tableDicData[tableId] = []
        codeDicData[tableId] = []
        tableDicObj[tableId] = {}

        keyFieldDicData[tableName] = []
        keyFieldDicObj[tableName] = {}

        tableDicData[tableId] = fieldModelList.map(({ fieldCode, fieldName }) => {
          tableDicObj[tableId][fieldCode] = `${fieldCode}（${fieldName}）`
          keyFieldDicObj[tableName][fieldCode] = `${fieldCode}（${fieldName}）`
          const currItem = { label: tableDicObj[tableId][fieldCode], value: fieldCode }
          codeDicData[tableId].push(currItem)
          if (fieldCode == 'id') {
            keyFieldDicData[tableName].push(currItem)
          }
          return currItem
        })
        dicObj[tableId] = `${tableName}（${tableDescribe}）`
        const returnData = { label: dicObj[tableId], value: tableId }
        if (tableType == 3) {
          keyTableDicData.push({ label: dicObj[tableId], value: tableName })
          keyTableDicObj[tableName] = `${tableName}（${tableDescribe}）`
        }
        if (tableType == 2) keyTreeTableDicData.push(returnData)
        if (codeDicData[tableId].length) {
          codeDicData[tableId] = [
            {
              label: '请确保绑定的字段在表内值是唯一的,否会导致数据异常（一般绑定id）',
              value: 'jeelowcode-tiop',
              disabled: true
            },
            ...codeDicData[tableId]
          ]
        }
        return returnData
      }
    )
    Object.assign(dicColumn.dictTable.editRender, {
      tableDicData: dicData,
      tableDicObj: dicObj,
      treeDicData: keyTreeTableDicData
    })
    Object.assign(dicColumn.dictCode.editRender, { tableDicData: codeDicData, tableDicObj })
    Object.assign(dicColumn.dictText.editRender, {
      dictDicData: [],
      dictDicObj: {},
      tableDicData,
      tableDicObj
    })
    Object.assign(dicColumn.dictTableColumn.editRender, {
      dictDicData: [],
      dictDicObj: {},
      tableDicData,
      tableDicObj
    })
    Object.assign(keyColumn.mainTable.editRender, {
      dicData: keyTableDicData,
      dicObj: keyTableDicObj
    })
    Object.assign(keyColumn.mainField.editRender, {
      dicData: keyFieldDicData,
      dicObj: keyFieldDicObj
    })
  })
})

defineExpose({
  infoData,
  tableInfoDefault,
  viewDefaultField,
  fieldList,
  tableRefObj,
  setTableInfoTree,
  setTabsValue,
  tableScrollIndex,
  initEditInfoData
})
</script>

<style lang="scss">
.low-summary-buttom-sql__popover {
  .el-popper__arrow {
    left: 20px !important;
  }
}
</style>
<style lang="scss" scoped>
::v-deep(.virtual-hide-row) {
  display: none;
}
</style>
