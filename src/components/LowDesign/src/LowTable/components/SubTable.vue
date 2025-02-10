<template>
  <div class="sub-table" :class="[subClassName]">
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      :table-loading="loading"
      :data="tableData"
      :option="tableOption"
      @selection-change="selectionChange"
    >
      <!-- 自定义表格头部操作 -->
      <template #menu-left="{ size }">
        <TableButton
          type="header"
          :size="size"
          :buttonObj="buttonObj"
          :selectLength="tableSelect.length"
          @menu-left-handle="menuLeftHandle"
        ></TableButton>
      </template>
      <!-- 自定义操作列 -->
      <template #menu="{ size, row, index }">
        <TableButton
          :type="tableInfo['menuStyle'] == 'more' ? 'more' : 'menu'"
          :size="size"
          :buttonObj="buttonObj"
          :row="row"
          :index="index"
          @menu-handle="menuHandle"
        ></TableButton>
      </template>
      <!-- 自定义表单 -->
      <template v-for="c in slotData.form" :key="c.prop" #[`${c.prop}-form`]="scope">
        <AvueSlot
          slotType="form"
          :scope="{ ...scope, type, disabled }"
          :control="c"
          v-model="tableData[scope.index][c.prop]"
        ></AvueSlot>
      </template>
      <!-- 自定义列 -->
      <template v-for="c in slotData.list" :key="c.prop" #[c.prop]="scope">
        <AvueSlot slotType="list" :scope="{ ...scope, type, disabled }" :control="c"></AvueSlot>
      </template>
    </avue-crud>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import useMEDialog from '@/hooks/design/useMEDialog'
import { setFormLazyCacheData } from '../../utils/tableUtil'
import { cloneDeep } from 'lodash-es'
defineOptions({ name: 'SubTable' })

interface Props {
  prop: string
  tableId: string
  optionData: object
  type: string
  disabled: boolean
}
const props = defineProps<Props>()

const tableForm = ref({})
const tableData = defineModel<Array<object>>({ default: () => [] })

const { MEDialog, MEData, openMEDialog } = useMEDialog()

const loading = ref(true)
const tableOption = ref({
  refreshBtn: false,
  columnBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  height: null,
  maxHeight: 310,
  menuWidth: 170,
  selection: true,
  index: true,
  tip: false,
  menu: true,
  header: true,
  column: {}
})
const tableInfo = ref({})
const tableSelect = ref<any>([])

const buttonObj = ref<any>({})
const controlObj = ref<any>({})
const componentObj = ref({})

const crudRef = ref()

const selectIndexs = computed(() => {
  return tableSelect.value.map((item) => item.$index)
})
const subClassName = computed(() => {
  return `sub-table-${props.prop}`
})

const slotData = computed(() => {
  const slotObj = { list: [] as any[], form: [] as any[] }
  for (let key in controlObj.value) {
    controlObj.value[key].forEach((item) => {
      const { slotList } = item
      if (!slotList.length) return
      const obj: any = { controlType: key }
      if (key == 'monacoEditor') {
        obj.click = (scope) => {
          openMEDialog(
            Object.assign(scope.column, { disabled: scope.disabled }),
            tableData.value[scope.index]
          )
        }
      }
      if (key == 'customControl') obj.getComponent = (key) => componentObj.value[key]
      if (['image', 'file'].includes(key)) {
        obj.setCellData = (data, index) => {
          tableData.value[index] = { ...tableData.value[index], ...data }
        }
        slotObj.form.push({ ...item, ...obj })
      }
      slotList.forEach((type) => {
        if (type == 'search') return
        if (slotObj[type]) slotObj[type].push({ ...item, ...obj })
      })
    })
  }
  return slotObj
})

const initTable = () => {
  const optionData = props.optionData
  tableInfo.value = optionData['tableInfo']
  componentObj.value = optionData['componentData']
  buttonObj.value = optionData['buttonObj']
  controlObj.value = optionData['control']
  const column = optionData['tableOption'].column

  for (let prop in column) {
    if (props.type != 'view') column[prop].cell = true
    // 附表（一对多） 不支持富文本
    if (column[prop].type == 'ueditor') column[prop].type = 'input'
    column[prop].search = false
    column[prop].sortable = false
  }

  if (props.type == 'view') {
    tableOption.value = {
      ...tableOption.value,
      selection: false,
      index: false,
      menu: false,
      header: false
    }
  }
  tableOption.value.column = column
  initOnlyRule(optionData['ruleObj'], tableOption.value.column)
  loading.value = false
  setTimeout(() => {
    if (crudRef.value) crudRef.value.dicInit()
    setFormLazyCacheData(tableOption.value.column, controlObj.value, tableData.value).then(
      (lazyData) => {
        for (const key in lazyData) {
          lazyData[key].props.forEach(
            (prop) => (tableOption.value.column[prop].cacheData = lazyData[key].data)
          )
        }
      }
    )
  }, 100)
}
const initOnlyRule = (ruleObj, column) => {
  for (let prop in ruleObj) {
    ruleObj[prop].forEach(({ index, rule, type }) => {
      if (type == 'only') {
        const ruleData = cloneDeep(rule)
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
        column[prop].rules.splice(index, 0, ruleData)
      }
    })
  }
}

const verifyForm = () => {
  const errorObj = { valid: true, prop: '', errorMsg: '', tabProp: props.prop }
  return new Promise((resolve) => {
    crudRef.value.validateCellForm().then((res) => {
      if (res) {
        const oneKey = Object.keys(res)[0]
        const oneKeyList = oneKey.split('.')
        errorObj.prop = oneKeyList[2]
        errorObj.errorMsg = res[oneKey].message
        errorObj.valid = false
      }
      resolve(errorObj)
    })
  })
}

const menuLeftHandle = (type) => {
  if (type == 'addBtn') rowAdd()
  if (type == 'batchDelBtn') rowDel(selectIndexs.value)
}
const menuHandle = ({ type, row, index }) => {
  if (type == 'delBtn') rowDel(row)
}

const rowDel = (row) => {
  tableData.value = tableData.value.filter((item, index) => {
    if (row instanceof Array) {
      return !selectIndexs.value.includes(index)
    } else {
      return row.$index !== index
    }
  })
}

const rowAdd = () => {
  crudRef.value.rowCellAdd()
  setTimeout(() => {
    const tableDom = document.querySelector(
      `.${subClassName.value} .el-table__body-wrapper .el-table__body`
    )
    if (tableDom) crudRef.value.$refs.table.setScrollTop(tableDom['offsetHeight'], 0)
  }, 30)
}

const selectionChange = (data) => {
  tableSelect.value = data
}

onMounted(() => {
  initTable()
})

defineExpose({
  prop: props.prop,
  tableId: props.tableId,
  tableOption: tableOption.value,
  verifyForm
})
</script>

<style lang="scss" scoped>
.sub-table {
  ::v-deep(.avue-crud) {
    .el-table__empty-text {
      .avue-crud__empty {
        padding: 0;

        .el-empty {
          padding-top: 10px;
          padding-bottom: 0;

          .el-empty__description {
            margin-top: 0;
          }
        }
      }
    }

    .el-table .el-form-item__content .el-slider__button-wrapper .el-tooltip__trigger {
      width: var(--el-slider-button-size);
    }

    // .el-table__cell {
    //   .el-upload-list__item {
    //     width: 50px;
    //     height: 50px;

    //     .el-upload-list__item-delete{
    //       margin-left: 5px;
    //     }
    //   }

    //   .el-upload {
    //     width: 50px;
    //     height: 50px;
    //   }
    // }
  }
}
</style>
