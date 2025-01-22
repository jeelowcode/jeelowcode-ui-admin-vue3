<template>
  <div
    class="layout-table hover"
    :class="{
      active: isCurrActive && selectItem.prop == option.prop,
      'required-title': option.required,
      hide: !option.display
    }"
  >
    <div v-if="option.label && !option.hideLabel" class="el-form-item__label ml-10px">{{
      option.label
    }}</div>
    <div class="table-content">
      <draggable
        class="layout-table__body"
        :list="option.column"
        :group="{ name: 'layout' }"
        ghost-class="draggable-ghost"
        :animation="200"
        handle=".layout-table__item"
        item-key="prop"
        @add="handleAddTableColumn"
        @start="historyCommit"
        @end="historyCommit"
        :move="onMove"
      >
        <template #item="{ element, index }">
          <div
            class="layout-table__item hover-item drag"
            :class="{
              'active-item': isSubActive && selectItem.prop == element.prop,
              required: element.required,
              hide: !element.display
            }"
            :style="{
              minWidth: element.width ? `${element.width}px` : '25%',
              width: element.width ? `${element.width}px` : '25%'
            }"
            @click.stop="handleselectItem(index)"
          >
            <div class="wf-table">
              <div class="wf-table__header">{{ element.label }}</div>
              <div class="wf-table__body">
                <LayoutItem :columnItem="element" :controlParams="element.params"></LayoutItem>
                <LayoutButton
                  v-if="isSubActive && selectItem.prop == element.prop"
                  type="tableItem"
                  @del-column="handleDelColumn(index)"
                  @copy-column="handleCopyColumn(index)"
                ></LayoutButton>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <div class="table-empty" v-if="option.column?.length == 0">
        <el-empty size="50" style="width: 100%" description="请拖拽控件到此位置"></el-empty>
      </div>
    </div>

    <LayoutButton
      v-if="selectItem.prop == option.prop"
      type="group"
      :isDelTip="true"
      @del-column="emit('del-table')"
      @copy-column="emit('copy-table')"
    ></LayoutButton>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import useDrageed from '@/hooks/design/useDrageed'
import { LayoutItem, LayoutButton } from '../index'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'LayoutTable' })

const props = defineProps({
  // 当前选中的链接
  modelValue: Object,
  select: Object,
  isCurrActive: Boolean
})
const { parentData, historyCommit, setParentData } = inject<lowFormDesignType>(
  lowFormDesignKey
) as lowFormDesignType

const emit = defineEmits([
  'update:modelValue',
  'update:select',
  'del-table',
  'copy-table',
  'select-table'
])

const { onMove } = useDrageed()

const option = ref<any>(props.modelValue)
const selectItem = ref<any>(props.select)

const isSubActive = computed(() => {
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

const handleAddTableColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(option.value.column[newIndex])
  if (!data.prop) data.prop = `fields_${Math.ceil(Math.random() * 9999999)}`
  if (data.hideLabel) data.hideLabel = false
  delete data.icon
  option.value.column[newIndex] = data
  handleselectItem(newIndex)
  historyCommit()
}

const handleselectItem = (index) => {
  selectItem.value = option.value.column[index]
  setParentData(option.value.type, option.value.prop)
}
const handleDelColumn = (index) => {
  if (option.value.column.length - 1 == index) {
    if (index == 0) emit('select-table')
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
    handleselectItem(option.value.column?.length - 1)
    historyCommit()
  })
}

defineExpose({ handleAddTableColumn })
</script>

<style lang="scss" scoped>
.layout-table {
  .table-content {
    position: relative;
  }

  .table-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 110px;
    transform: translate(-50%, -50%);

    :deep(.el-empty) {
      padding: 0;

      .el-empty__image {
        width: 70px;
      }

      .el-empty__description {
        margin-top: 10px;
      }
    }
  }
}
</style>
