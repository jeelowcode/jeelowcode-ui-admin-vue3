<template>
  <el-row class="w-100%">
    <draggable
      class="combo-box__body flex w-100%"
      :class="{ empty: !option.column?.length }"
      :list="option.column"
      :group="{ name: 'layout' }"
      ghost-class="draggable-ghost"
      :animation="200"
      item-key="prop"
      @add="handleAddGroupColumn"
      @start="historyCommit"
      @end="historyCommit"
      :move="onMove"
    >
      <template #item="{ element, index }">
        <el-col :md="element.span" :xs="24" :offset="element.offset" class="flex!">
          <div class="flex-1 w-100%">
            <div
              class="layout-item hover drag flex"
              :class="[
                {
                  active: isActive && selectItem.prop == element.prop,
                  required: element.required,
                  hide: !element.display
                }
              ]"
              @click.stop="handleselectItem(index)"
            >
              <LayoutItem
                class="flex w-100%"
                :columnItem="element"
                :controlParams="element.params"
              ></LayoutItem>
              <LayoutButton
                v-if="isActive && selectItem.prop == element.prop"
                type="combo"
                @del-column="handleDelColumn(index)"
                @copy-column="handleCopyColumn(index)"
              ></LayoutButton>
            </div>
          </div>
        </el-col>
      </template>
    </draggable>
  </el-row>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import useDrageed from '@/hooks/design/useDrageed'
import { cloneDeep } from 'lodash-es'
import { LayoutButton, LayoutItem } from '../index'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'LayoutComboBox' })

const props = defineProps({
  // 当前选中的链接
  modelValue: Object,
  select: Object,
  customClass: String
})

const emit = defineEmits([
  'update:modelValue',
  'update:select',
  'del-group',
  'copy-group',
  'select-group'
])

const { parentData, historyCommit, setParentData, setConfigTab } = inject<lowFormDesignType>(
  lowFormDesignKey
) as lowFormDesignType

const { onMove } = useDrageed()

const option = ref<any>(props.modelValue)
const selectItem = ref<any>(props.select)

const isActive = computed(() => {
  if (parentData.value.type == option.value.type && parentData.value.prop == option.value.prop) {
    return true
  }
  return false
})

watch(
  () => props.modelValue,
  (val: object) => {
    option.value = val
  }
)
watch(
  () => option.value,
  (val: object) => {
    emit('update:modelValue', val)
  }
)

watch(
  () => props.select,
  (val) => {
    if (val) selectItem.value = val
  }
)
watch(
  () => selectItem.value,
  (val) => {
    emit('update:select', val)
  },
  { deep: true }
)

const handleAddGroupColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(option.value.column[newIndex])
  if (!data.prop) data.prop = `fields_${Math.ceil(Math.random() * 9999999)}`
  delete data.icon
  option.value.column[newIndex] = data
  handleselectItem(newIndex)
  historyCommit()
}

const handleselectItem = (index) => {
  selectItem.value = option.value.column[index]
  setParentData(option.value.type, option.value.prop)
  setConfigTab('control')
}
const handleDelColumn = (index) => {
  if (option.value.column.length - 1 == index) {
    if (index == 0) emit('select-group')
    else handleselectItem(index - 1)
  } else handleselectItem(index + 1)
  nextTick(() => {
    option.value.column.splice(index, 1)
    historyCommit()
  })
}
const handleCopyColumn = (index) => {
  const data = cloneDeep(option.value.column[index])
  data.prop = `fields_${Math.ceil(Math.random() * 9999999)}`
  option.value.column.push(data)
  nextTick(() => {
    handleselectItem(option.value.column.length - 1)
    historyCommit()
  })
}
</script>

<style lang="scss" scoped></style>
