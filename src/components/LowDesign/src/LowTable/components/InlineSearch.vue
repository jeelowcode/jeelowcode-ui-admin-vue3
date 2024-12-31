<template>
  <div>
    <div>{{ column.label }}</div>
    <div class="flex">
      <template v-if="avueSlotType.includes(column.type)">
        <AvueSlot
          v-model="model"
          slotType="search"
          :scope="{ column, size: 'small' }"
          :control="{ controlType: column.type, prop, column: { placeholder: ' ' } }"
        ></AvueSlot>
      </template>
      <template v-else-if="column.type == 'number'">
        <avue-input-number
          v-model="model"
          v-bind="vBind"
          :controls="false"
          size="small"
          :focus="() => (oldValue = model)"
          :blur="searchHandle"
        ></avue-input-number>
      </template>
      <template v-else-if="selectType.includes(column.type)">
        <avue-select
          v-model="model"
          v-bind="vBind"
          size="small"
          :dic="vBind.searchDicData || column.dicData"
        ></avue-select>
      </template>
      <template v-else-if="column.type == 'tree'">
        <avue-input-tree
          v-model="model"
          v-bind="vBind"
          size="small"
          :dic="vBind.searchDicData || column.dicData"
        ></avue-input-tree>
      </template>
      <template v-else-if="column.type == 'cascader'">
        <avue-cascader
          v-model="model"
          placeholder=" "
          v-bind="vBind"
          size="small"
          :dic="vBind.searchDicData || column.dicData"
        ></avue-cascader>
      </template>
      <template v-else-if="timeType.includes(column.type)">
        <avue-time
          class="flex w-100%"
          v-model="model"
          v-bind="vBind"
          :format="column.searchFormat || column.format"
          :value-format="column.searchValueFormat || column.valueFormat"
          :type="column.searchRange ? 'timerange' : 'time'"
          size="small"
          :visible-change="timeVisibleChange"
        ></avue-time>
      </template>
      <template v-else-if="dateType.includes(column.type)">
        <avue-date
          class="flex w-100%"
          v-model="model"
          v-bind="vBind"
          :format="column.searchFormat || column.format"
          :value-format="column.searchValueFormat || column.valueFormat"
          :type="
            column.searchRange && column.type.indexOf('range') == -1
              ? `${column.type}range`
              : column.type
          "
          size="small"
        ></avue-date>
      </template>
      <template v-else>
        <avue-input
          class="flex flex-1"
          v-model="model"
          v-bind="vBind"
          size="small"
          :placeholder="column.searchPlaceholder || ''"
          @keyup.enter.stop="emit('execute-search', {}, () => {})"
        ></avue-input>
        <!-- 防止enter刷新界面 -->
        <avue-input v-show="false"></avue-input>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'InlineSearch' })

interface Props {
  prop: string
  column: any
  crudRef?: any
}
const props = defineProps<Props>()
const model = defineModel<any>()
const emit = defineEmits(['execute-search'])

const oldValue = ref<any>(null)

const timeType = ['time', 'timerange']
const dateType = [
  'date',
  'daterange',
  'datetime',
  'datetimerange',
  'year',
  'month',
  'monthrange',
  'week',
  'dates'
]
const treeType = ['tree', 'cascader']
const selectType = ['select', 'radio', 'checkbox', 'switch']
const avueSlotType = ['userSelect', 'deptSelect', 'dicTableSelect']

const changeType = [...timeType, ...dateType, ...treeType, ...selectType, ...avueSlotType]
const vBind = computed(() => {
  const obj: any = {}
  for (const key in props.column) {
    if (key.indexOf('search') === 0 && key != 'search') {
      obj[key] = props.column[key]
    }
  }

  if (treeType.includes(props.column.type)) {
    const loadKey = props.column.type == 'tree' ? 'treeLoad' : 'lazyLoad'
    if (props.column[loadKey]) {
      obj[loadKey] = props.column[loadKey]
    }
    if (props.column.props) {
      obj.props = props.column.props
    }
    if (props.column.dicUrl) {
      obj.searchDicData = props.crudRef.DIC[props.column.prop] || ''
    }
  }
  return obj
})

const searchHandle = () => {
  if (model.value != oldValue.value) {
    emit('execute-search', {}, () => {})
  }
}

const timeVisibleChange = (visible) => {
  if (!visible) emit('execute-search', {}, () => {})
}

watch(
  () => model.value,
  (val) => {
    const { type } = props.column
    if (changeType.includes(type)) {
      if (timeType.includes(type) && val?.length != 0) {
        return
      }
      emit('execute-search', {}, () => {})
    }
  }
)
</script>

<style lang="scss" scoped></style>
