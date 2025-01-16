<template>
  <div class="dic-table-select-box w-100%">
    <div class="table-input" :class="[{ disabled }, type, size]" @click="openTableSelect">
      <div class="table-text-list" v-if="selectId.length">
        <el-tag
          v-for="id in selectId"
          :key="id"
          :closable="!disabled && !column.readonly"
          type="info"
          :size="size"
          @close="tagValueClose(id)"
        >
          {{ lowStore.dicObj[dicKey]?.[id] || id }}
        </el-tag>
      </div>
      <div class="empty-text" v-else>{{ placeholderText }}</div>
      <div class="table-num" v-if="column.multiple && selectId.length >= 2">
        共
        <span>{{ selectId.length }}</span>
        条
      </div>
    </div>

    <DesignPopup
      v-if="['add', 'edit'].includes(type)"
      v-model="dialogData.value"
      v-model:isFull="dialogData.isFull"
      v-bind="dialogData.params"
    >
      <template #default>
        <el-container class="w-100% h-100%">
          <el-main class="pb-0!">
            <LowTable
              v-if="dicConfigStr"
              ref="tableRef"
              :tableId="column.dictTable"
              model="dicTable"
              :isPermi="false"
              :dicConfigStr="dicConfigStr"
              :calcHeight="calcHeight"
              :dic-max-limit="column.limit"
              :dic-select-type="column.multiple ? 'multiple' : 'radio'"
              :dic-row-key="dicCode"
            />
          </el-main>
          <el-aside width="200px">
            <div class="h-100%" :style="{ borderLeft: 'var(--el-border)' }">
              <div
                class="box-border h-31px pb-5px pt-5px text-center"
                :style="{ borderBottom: 'var(--el-border)' }"
              >
                <span>已选择（{{ tableSelectId.length }}）</span>
                <el-button
                  class="mt--3px p-0"
                  type="primary"
                  link
                  v-if="tableSelectId.length"
                  @click="tableRef.clearSelection()"
                >
                  清空
                </el-button>
              </div>
              <div
                class="box-border flex flex-wrap items-center overflow-x-hidden overflow-y-auto p-10px"
                :style="{
                  height: 'calc(100% - 31px)',
                  columnGap: '6px',
                  rowGap: '6px',
                  alignContent: 'start'
                }"
              >
                <el-tag
                  v-for="id in tableSelectId"
                  :key="id"
                  :closable="true"
                  type="info"
                  :size="size"
                  @close="tagTableClose(id)"
                >
                  {{ lowStore.dicObj[dicKey]?.[id] || id }}
                </el-tag>
              </div>
            </div>
          </el-aside>
        </el-container>
      </template>
    </DesignPopup>
    <DesignPopup
      v-else
      v-model="detailDialog"
      :width="800"
      :title="`<span>${column.label}</span><span class='text-14px'>（共${selectId.length}条）</span>`"
      :dialogParams="{ alignCenter: true }"
    >
      <template #default>
        <div class="box-border flex p-20px h-100%">
          <div
            class="box-border flex flex-wrap items-center overflow-x-hidden overflow-y-auto"
            :style="{
              height: '100%',
              columnGap: '6px',
              rowGap: '6px',
              alignContent: 'start'
            }"
          >
            <el-tag v-for="id in selectId" :key="id" type="info" :size="size">
              {{ lowStore.dicObj[dicKey]?.[id] || id }}
            </el-tag>
          </div>
        </div>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'
import { useLowStoreWithOut } from '@/store/modules/low'
defineOptions({ name: 'DicTableSelect' })

interface Column {
  label: string
  dictTable: string
  dictText: string
  dictCode: string
  dictTableColumn: Array<string>
  placeholder?: string
  multiple?: boolean //多选
  limit?: number //最大选择数
  separator?: string //分隔符
  readonly?: boolean
}

interface Props {
  column: Column
  prop: string
  type: string
  size?: 'small' | 'large' | 'default'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const lowStore = useLowStoreWithOut()

const model = defineModel<string>()
const tableSelectId = ref<Array<number | string>>([])
const windowSize = useWindowSize()

const dialogData = ref({
  value: false,
  isFull: false,
  params: {
    title: '选择 ' + props.column.label,
    footerBtn: [
      {
        params: {},
        name: '取消',
        icon: 'material-symbols:close-rounded',
        clickFun: () => {
          dialogData.value.value = false
        }
      },
      {
        params: { type: 'primary' },
        name: '确定',
        icon: 'material-symbols:check-rounded',
        clickFun: () => {
          dialogData.value.value = false
          model.value = getCurrTableSelect().join(',')
        }
      }
    ]
  }
})
const detailDialog = ref(false)
const times = ref<any>(null)

const tableRef = ref()

const dicCode = computed(() => {
  return props.column?.dictCode || 'id'
})
const selectId = computed(() => {
  if (!model.value) return []
  if (typeof model.value != 'string') {
    try {
      return (model.value as Number).toString()
    } catch (error) {
      return []
    }
  }
  return model.value.split(',')
})

const calcHeight = computed(() => {
  return dialogData.value.isFull ? 130 : windowSize.height.value * 0.1 + 188
})
const placeholderText = computed(() => {
  let text = ''
  if (!props.disabled && !props.column.readonly) {
    text = props.column.placeholder || `请选择 ${props.column.label}`
  }
  return text
})
const dicKey = computed(() => {
  return props.column.dictTable + '&' + props.column.dictText
})

const dicConfigStr = computed(() => {
  let text = ''
  const { dictTable, dictCode, dictText, dictTableColumn } = props.column
  if (dictTable) {
    text = encryptAES(
      JSON.stringify({
        dbformId: dictTable,
        fieldCodeList: [...new Set([dictCode, dictText, ...dictTableColumn])]
      })
    )
  }
  return text
})

const getCurrTableSelect = () => {
  const dicObj = {}
  const ids = tableRef.value.tableSelect.map((item) => {
    if (item[props.column.dictText]) dicObj[item[dicCode.value]] = item[props.column.dictText]
    return item[dicCode.value]
  })
  lowStore.setDicObj(dicKey.value, dicObj)
  return ids
}

const openTableSelect = () => {
  if (props.column['onClick']) props.column['onClick']({ value: model.value, column: props.column })
  else if (props.column['click'])
    props.column['click']({ value: model.value, column: props.column })
  if (props.disabled || props.column.readonly) {
    if (selectId.value && selectId.value.length) detailDialog.value = true
    return
  }
  dialogData.value.value = true
}

const setTableSelect = (ids) => {
  const defaultSelect = ids.map((id) => {
    return { [dicCode.value]: id, initSelect: true }
  })
  tableRef.value.tableSelect = defaultSelect
  tableRef.value.initSelectChange()
}

const tagValueClose = (id) => {
  let list = model.value ? model.value.split(',') : []
  list = list.filter((key) => key != id)
  model.value = list.join(',')
}
const tagTableClose = (id) => {
  const currRow = tableRef.value.tableSelect.filter((item) => item[dicCode.value] == id)
  tableRef.value.crudRef.toggleSelection(currRow, false)
}

watch(
  () => model.value,
  (value, oldVal) => {
    if (oldVal !== undefined) {
      if (props.column['onChange']) props.column['onChange']({ value, column: props.column })
      else if (props.column['change']) props.column['change']({ value, column: props.column })
    }
  }
)

watch(
  () => dialogData.value.value,
  (val) => {
    clearInterval(times.value)
    if (!val) {
      if (tableRef.value) tableRef.value.clearSelection()
      return
    }
    if (tableRef.value) {
      tableRef.value.initTableLayout()
      tableRef.value.resetChange()
    }
    times.value = setInterval(() => {
      if (tableRef.value && tableRef.value.loading == false) {
        clearInterval(times.value)
        setTableSelect(selectId.value)
      }
    }, 100)
  }
)
watch(
  () => tableRef.value?.tableSelect,
  (val) => {
    tableSelectId.value = getCurrTableSelect()
    dialogData.value.params.footerBtn[1].name = `确定（${val.length}）`
  }
)
</script>

<style lang="scss" scoped>
.table-input {
  display: flex;
  height: var(--el-component-size);
  font-size: var(--el-text-base);
  color: var(--el-input-text-color, var(--el-text-color-regular));
  cursor: pointer;
  background-color: var(--el-input-bg-color);
  background-image: none;
  border: var(--el-border);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-sizing: border-box;
  align-items: center;

  .table-text-list {
    display: flex;
    height: 100%;
    flex: 1;
    padding: 0 11px;
    overflow: hidden;
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 6px;
  }

  .empty-text {
    margin: 0 10px;
    overflow: hidden;
    color: #999;
    text-align: left;
    flex: 1;
    text-wrap: nowrap;
  }

  .table-num {
    height: 100%;
    padding-right: 10px;
    padding-left: 10px;
    line-height: var(--el-component-size);
    color: var(--el-text-color-regular);
    background-color: var(--el-fill-color-light);

    span {
      display: inline-block;
      padding: 0 2px;
      color: var(--el-color-primary);
    }
  }

  &.disabled {
    &.edit,
    &.add {
      background-color: var(--el-disabled-bg-color);
    }

    &.view {
      border: none;

      .table-text-list {
        padding: 0;
      }

      .table-num {
        margin-right: -20px;
      }
    }
  }

  &.small {
    height: var(--el-component-size-small);
    font-size: var(--el-font-size-extra-small);

    .table-num {
      height: var(--el-component-size-small);
    }
  }

  &.large {
    height: var(--el-component-size-large);
    font-size: var(--el-font-size-large);

    .table-num {
      height: var(--el-component-size-large);
    }
  }
}
</style>
