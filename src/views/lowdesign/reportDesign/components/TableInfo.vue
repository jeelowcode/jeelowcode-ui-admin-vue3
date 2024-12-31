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
  />
  <template v-for="tab in tabsOption.column" :key="tab.prop">
    <div v-show="tabsValue.prop === tab.prop">
      <InfoVxeTable
        v-model="infoData[tab.dataKey]"
        :ref="(el) => (tableRefObj[tab.prop] = el)"
        :tabItem="tab"
        :column="tableInfoOption.infoColumn[`${tab.key}Column`]"
        @selection-change="infoSelectionChange"
        @cell-click="cellClick"
        @dropdown-command="dorpdownHandleCommand"
      ></InfoVxeTable>
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
import { SqlOption, InfoVxeTable, InfoVxeTopBtn } from '../../tableDesign/components'
import { MonacoEditor } from '@/components/MonacoEditor/index'
import { tableInfoOption } from '../designData'
import { cloneDeep } from 'lodash-es'
import * as DictDataApi from '@/api/system/dict/dict.type'

defineOptions({ name: 'TableInfo' })
const message = useMessage()

interface Props {
  formType: string
  editInfoData: any
  size: any
}
const props = withDefaults(defineProps<Props>(), {
  formType: ''
})
const tabsOption = ref({
  column: [{ label: '字段属性', prop: 'tab_field', key: 'field', dataKey: 'basics', edit: true }]
})
const tabsValue = ref(tabsOption.value.column[0])

const infoData = ref({
  basics: [] as any[]
})
const infoSelect = ref({
  basics: []
})
const tableInfoDefault = ref<any[]>([])
const optionsDialog = ref<any>({ dialog: {}, controlData: {} })
const tableRefObj = ref({})

const optionComponents = markRaw({
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
  return dicData
})

watch(
  () => fieldList.value,
  (dicData: any) => {
    const dicDataObj = {}
    dicData.forEach(({ value, label }) => (dicDataObj[value] = label))
  }
)

const dorpdownHandleCommand = (command) => {
  let { dataKey } = tabsValue.value
  if (!dataKey) return
  let { index, type } = command
  if (type == 'up' || type == 'down') {
    const delItem = infoData.value[dataKey].splice(index, 1)[0]
    nextTick(() => infoData.value[dataKey].splice(type == 'up' ? index - 1 : index + 1, 0, delItem))
  } else if (type == 'add') cellAddData(index + 1)
}
const setInfoOrder = () => {
  let { dataKey } = tabsValue.value
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

const infoSelectionChange = (selectObj) => {
  let { dataKey } = tabsValue.value
  if (!dataKey) return
  infoSelect.value[dataKey] = selectObj.records
}

const delTableInfoData = () => {
  let { dataKey, prop } = tabsValue.value
  if (!dataKey) return
  const keyArr = infoSelect.value[dataKey].map((item) => item._X_ROW_KEY)
  infoData.value[dataKey] = infoData.value[dataKey].filter(
    (item) => !keyArr.includes(item._X_ROW_KEY)
  )
  tableRefObj.value[prop].vxeTableRef.clearCheckboxRow()
  infoSelect.value[dataKey] = []
}

const tabsHandleChange = (column) => {
  tabsValue.value = column
}

const setTabsValue = (prop) => {
  tabsOption.value.column.forEach((item, index) => {
    if (item.prop == prop) {
      tabsRef.value.changeTabs(index)
    }
  })
}

const cellAddData = (addIndex) => {
  let { key, dataKey } = tabsValue.value
  if (!dataKey) return
  let addData = cloneDeep(tableInfoOption.infoDefaultData[dataKey]) || {}
  let index = infoData.value[dataKey].length
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
    tableRefObj.value[`tab_${key}`].vxeTableRef.setEditRow(
      tableRefObj.value[`tab_${key}`].vxeTableRef.getData(addIndex ? addIndex : index)
    )
  }, 300)
}

const cellClick = ({ rowIndex }) => {
  let { prop } = tabsValue.value
  tableRefObj.value[prop].vxeTableRef.setEditRow(
    tableRefObj.value[prop].vxeTableRef.getData(rowIndex)
  )
}

const initEditInfoData = () => {
  const data = tableInfoOption.formattingInitData(props.editInfoData)
  const fieldList: any[] = []
  tableInfoDefault.value = data.infoData.filter((item) => {
    fieldList.push(cloneDeep(item))
    return false
  })
  infoData.value.basics = fieldList
}

onMounted(() => {
  tableInfoDefault.value = []
  infoData.value.basics = []
  if (props.formType != 'add') initEditInfoData()
  const { fieldColumn } = tableInfoOption.infoColumn
  DictDataApi.getSimpleDictTypeList().then((dicData) => {
    const dicObj = {}
    dicData = dicData.map(({ type, name }) => {
      dicObj[type] = `${type}（${name}）`
      return { label: dicObj[type], value: type }
    })
    Object.assign(fieldColumn.dictCode.editRender, { dicData, dicObj })
  })
})

defineExpose({
  infoData,
  tableInfoDefault,
  fieldList,
  tableRefObj,
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
