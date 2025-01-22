<template>
  <div
    class="form-table"
    :class="[`form-table__${prop}`, { 'mt--1px': formType == 'view' && !tableOption.header }]"
  >
    <avue-crud
      v-if="isInit"
      :ref="(el) => (avueCrudRef = el)"
      v-model="tableForm"
      :option="tableOption"
      :data="tableData"
      @selection-change="selectionChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
    >
      <template #menu-left="scope">
        <template v-for="(item, index) in headerBtn" :key="item.prop">
          <el-button
            v-bind="btnParams.headerBtn[index] ? { ...item, ...btnParams.headerBtn[index] } : item"
            icon=""
            @click="menuHandle({ item, btnKey: 'headerBtn' }, index)"
            v-if="item.display"
            :size="item.size || scope.size"
          >
            <span v-if="item.icon" v-show="!btnParams.headerBtn[index]?.['loading']" class="mr-3px">
              <Icon :size="14" :icon="item.icon" />
            </span>
            <span>{{ item.label }}</span>
          </el-button>
        </template>
        <el-button
          type="danger"
          :size="scope.size"
          v-if="isBatchDel"
          @click="menuHandle({ item: { prop: 'batchDelBtn' } })"
          v-show="tableSelect.length"
        >
          <Icon :size="14" icon="fluent:delete-16-regular" class="mr-3px" />批量删除
        </el-button>
      </template>
      <template #menu="scope">
        <div class="flex justify-center flex-items-center">
          <template v-for="(item, index) in menuBtn" :key="item.prop">
            <el-button
              text
              v-bind="btnParams.menuBtn[index] ? { ...item, ...btnParams.menuBtn[index] } : item"
              icon=""
              :size="item.size || scope.size"
              @click="
                menuHandle(
                  {
                    item,
                    row: scope.row,
                    dataIndex: scope.row.$index,
                    btnKey: 'menuBtn'
                  },
                  index
                )
              "
              v-if="item.display"
            >
              <span v-if="item.icon" v-show="!btnParams.menuBtn[index]?.['loading']" class="mr-3px">
                <Icon :size="14" :icon="item.icon" />
              </span>
              <span>{{ item.label }}</span>
            </el-button>
          </template>
        </div>
      </template>
      <!-- 自定义表单 -->
      <template v-for="c in slotData.form" :key="c.prop" #[`${c.prop}-form`]="scope">
        <AvueSlot
          v-if="isCell"
          slotType="form"
          :scope="scope"
          :control="c"
          :formType="formType"
          v-model="tableData[scope.index][c.prop]"
        ></AvueSlot>
        <AvueSlot
          v-else
          slotType="form"
          :scope="scope"
          :control="c"
          :formType="formType"
          v-model="tableForm[c.prop]"
        ></AvueSlot>
      </template>
      <!-- 自定义列 -->
      <template v-for="c in slotData.list" :key="c.prop" #[c.prop]="scope">
        <AvueSlot slotType="list" :scope="scope" :control="c"></AvueSlot>
      </template>
    </avue-crud>
    <div v-else class="h-100px" v-loading="!isInit"></div>
    <DesignPopup
      v-if="controlObj[parentKey] && controlObj[parentKey].monacoEditor"
      v-model="MEDialog.value"
      v-bind="MEDialog.params"
      :isBodyFull="true"
    >
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import useMEDialog from '@/hooks/design/useMEDialog'
import { lowFormKey, LowFormType } from '@/utils/symbols'
import { formattingStrFunction } from '@/utils/lowDesign'
import { TableEnhanceObj } from '../../utils/formUtil'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'FormTable' })

interface Props {
  prop: string
  disabled: boolean
  size: string
  formType: string
  modelValue: Array<object>
  column: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => {
    return []
  }
})

const { controlObj, rulesObj, useFun, getComponent, enhanceErrorTip, handleMonacoEditorClick } =
  inject<LowFormType>(lowFormKey) as LowFormType

const message = useMessage()

const avueCrudRef = ref<any>(null)
const tableOption = ref({}) as any
const tableForm = ref({})
const tableData = ref(props.modelValue || [])
const tableSelect = ref([])
const headerBtn = ref<any[]>([])
const menuBtn = ref<any[]>([])
const tableEnhanceObj = ref<TableEnhanceObj>({})
const isInit = ref(false)
const componentObj = ref({})
const btnParams = ref({
  headerBtn: [] as object[],
  menuBtn: [] as object[]
})

const { MEDialog, MEData, openMEDialog } = useMEDialog()

const parentKey = computed(() => {
  return 'layoutTable_' + props.prop
})
const isCell = computed(() => {
  return props.column.tableType == 'cellEdit'
})

const isBatchDel = computed(() => {
  let bool = false
  menuBtn.value.forEach((item) => {
    if (item.prop == 'delBtn' && item.display) bool = true
  })
  return bool
})

const slotData = computed(() => {
  const slotObj = { list: [] as any[], form: [] as any[] }
  const controlData = controlObj.value[parentKey.value]
  for (let key in controlData) {
    controlData[key].forEach((item) => {
      const { slotList } = item
      if (!slotList.length) return
      const obj: any = { controlType: key }
      if (key == 'monacoEditor') {
        obj.click = (scope) => {
          let params = scope.column.params
          params = handleMonacoEditorClick(params, executeStrFunction)
          openMEDialog(
            Object.assign(scope.column, { disabled: scope.disabled }),
            tableData.value[scope.index]
          )
        }
      }
      if (key == 'customControl') obj.getComponent = (key) => componentObj.value[key]
      if (isCell.value && ['image', 'file'].includes(key)) {
        obj.setCellData = (data, index) => {
          tableData.value[index] = { ...tableData.value[index], ...data }
        }
        slotObj.form.push({ ...item, ...obj })
      }
      slotList.forEach((type) => {
        if (slotObj[type]) slotObj[type].push({ ...item, ...obj })
      })
    })
  }
  return slotObj
})
const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (val) => {
    tableData.value = val
  }
)
watch(
  () => tableData.value,
  (val) => {
    emit('update:modelValue', val)
  }
)
const initFun = () => {
  componentObj.value = getComponent()
  const tableEnhanceFun = executeJsEnhance(
    props.column.tableEnhanceStr,
    props.prop + ' 表格增强配置初始化异常，请检查增强内容'
  )
  tableEnhanceObj.value = tableEnhanceFun || {}
  headerBtn.value = props.column.btnData['header']
  menuBtn.value = props.column.btnData['menu']
  tableOption.value = {
    rowKey: 'id',
    ...props.column.params,
    ...props.column.formOption,
    column: props.column.column || [],
    addBtn: false,
    editBtn: false,
    delBtn: false,
    columnBtn: false,
    tip: false,
    filterBtn: false,
    refreshBtn: false,
    gridBtn: false,
    size: props.size,
    header: headerBtn.value.some((item) => item.display),
    menu: menuBtn.value.some((item) => item.display),
    height: undefined,
    calcHeight: undefined,
    maxHeight: 300
  }
  if (tableOption.value.selection) tableOption.value.selection = tableOption.value.header
  if (isBatchDel.value) tableOption.value.header = true
  initRule(tableOption.value.column)
  try {
    if (tableEnhanceObj.value.initTable) tableEnhanceObj.value.initTable()
  } catch (error) {
    enhanceErrorTip(props.prop + ' 表格增强配置【initTable】方法执行异常，请检查', error)
  }
  executeDataEnhance({ type: 'init' })

  isInit.value = true
}

const initRule = (column) => {
  for (const prop in rulesObj.value[parentKey.value]) {
    rulesObj.value[parentKey.value][prop].forEach(({ index, rule, ruleStr, type }) => {
      const ruleData = cloneDeep(rule)
      if (type == 'only') {
        ruleData['validator'] = (rule, value, callback) => {
          const dataIndex = rule.field.split('.')[1]
          if (value !== undefined && value !== null && value !== '') {
            let bool = false
            tableData.value.forEach((item, i) => {
              if (dataIndex != i && item[prop] == value) bool = true
            })
            if (bool) return callback(new Error('当前值已存在，请修改'))
          }
          callback()
        }
      } else if (type == 'customRule') {
        const obj = executeStrFunction(`()=>{${ruleStr}}`)
        if (obj instanceof Object) for (const k in obj) ruleData[k] = obj[k]
      }
      column[prop].rules.splice(index, 0, ruleData)
    })
  }
}

// 表格数据格式化增强执行
const executeDataEnhance = (params) => {
  if (tableEnhanceObj.value.setTableData) {
    let data = cloneDeep(tableData.value)
    try {
      data = tableEnhanceObj.value.setTableData(data, params)
      if (data) tableData.value = data
    } catch (error) {
      enhanceErrorTip(props.prop + ' 表格增强配置【setTableData】方法执行异常，请检查', error)
    }
  }
}

const addTable = () => {
  if (isCell.value) {
    avueCrudRef.value.rowCellAdd()
    nextTick(() => {
      const id = `custom_${Math.ceil(Math.random() * 9999999)}`
      const index = tableData.value.length - 1
      Object.assign(tableData.value[index], { [tableOption.value.rowKey]: id })
      executeDataEnhance({ type: 'add', index, [tableOption.value.rowKey]: id })
    })
    setTimeout(() => {
      const tableDom = document.querySelector(
        `.form-table__${props.prop} .el-table__body-wrapper .el-table__body`
      )
      if (tableDom) avueCrudRef.value.$refs.table.setScrollTop(tableDom['offsetHeight'], 0)
    }, 30)
  } else {
    avueCrudRef.value.rowAdd()
  }
}

// 按钮事件处理
const menuHandle = (menuData, btnIndex?) => {
  let { item, row, dataIndex, btnKey } = menuData
  const prop = item.prop
  if (prop == 'addBtn') addTable()
  else if (prop == 'editBtn') avueCrudRef.value.rowEdit(row, dataIndex)
  else if (prop == 'delBtn') {
    tableData.value.splice(dataIndex, 1)
    executeDataEnhance({ type: 'del', id: row.id })
  } else if (prop == 'batchDelBtn') {
    let ids = tableSelect.value.map((item: any) => item.id)
    tableData.value = tableData.value.filter((item: any) => !ids.includes(item.id))
    executeDataEnhance({ type: 'batchDel', id: ids })
  } else {
    const clickStr = props.column.btnClickObj[prop]
    if (clickStr) {
      let params: any = { btn: item }
      if (item.btnLoading) {
        btnParams.value = { headerBtn: [], menuBtn: [] }
        for (const key in btnParams.value) {
          const btnData = key == 'headerBtn' ? headerBtn.value : menuBtn.value
          btnData.forEach((item, index) => {
            btnParams.value[key][index] = { loading: false, disabled: true }
          })
        }
        btnParams.value[btnKey][btnIndex].loading = true
        params.loading = () => {
          btnParams.value = { headerBtn: [], menuBtn: [] }
        }
      }
      if (btnKey == 'menuBtn') params = { ...params, row: row, index: dataIndex }
      executeStrFunction(clickStr, [params], `${item.label}点击事件执行异常，请检查`)
    }
  }
}
const rowSave = async (form, done) => {
  form[tableOption.value.rowKey] = `custom_${Math.ceil(Math.random() * 9999999)}`
  tableData.value.push(form)
  executeDataEnhance({ type: 'add', index: tableData.value.length - 1, id: form.id })
  done()
}
const rowUpdate = async (form, index, done) => {
  Object.assign(tableData.value[index], form)
  executeDataEnhance({ type: 'edit', index, id: form.id })
  done()
}
const selectionChange = (data) => {
  tableSelect.value = data
}
const verifyForm = () => {
  let errorObj = {
    dom: null,
    valid: true,
    prop: '',
    errorMsg: ''
  }
  return new Promise((resolve) => {
    if (!isCell.value) return resolve(errorObj)
    avueCrudRef.value.validateCellForm().then((res) => {
      if (res) {
        const oneKey = Object.keys(res)[0]
        const oneKeyList = oneKey.split('.')
        const tableDom = document.querySelector(`.control-${props.prop}`)
        if (tableDom) {
          errorObj.prop = oneKeyList[2]
          errorObj.errorMsg = res[oneKey].message
          errorObj.dom = tableDom.querySelectorAll('.el-table__body-wrapper .el-table__row')[
            oneKeyList[1]
          ]
        }
        errorObj.valid = false
      }
      resolve(errorObj)
    })
  })
}
const clearValue = () => {
  avueCrudRef.value.clearSelection()
  tableData.value = []
  tableSelect.value = []
}
const executeJsEnhance = (enhance: string, errTip?: string) => {
  if (!enhance) return
  enhance = formattingStrFunction(enhance)
  try {
    const fun = eval(`(function getEnhance(){
      ${enhance}
    })`)
    return fun()
  } catch (error) {
    enhanceErrorTip(errTip || '', error)
  }
}
const executeStrFunction = (str: string, params?: Array<any>, errTip?: string) => {
  try {
    const fun = eval(`(function getFun(){return ${str}})()`)
    if (params) return fun.apply(null, params)
    else return fun()
  } catch (error) {
    enhanceErrorTip(errTip || '', error)
  }
}

onMounted(() => {
  initFun()
})
defineExpose({
  prop: props.prop,
  type: props.column.type,
  tableOption,
  tableData,
  tableSelect,
  verifyForm,
  clearValue
})
</script>
<style lang="scss" scoped>
.form-table {
  ::v-deep(.avue-crud__empty) {
    padding: 0;

    .el-empty {
      padding: 10px 0 0;

      .el-empty__image {
        width: 80px !important;
      }

      .el-empty__description {
        height: 60px;
        margin-top: 0;
      }
    }
  }
}
</style>
