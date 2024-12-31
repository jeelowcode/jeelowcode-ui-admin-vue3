<template>
  <el-main class="design-layout">
    <el-form
      :label-position="option.labelPosition || 'left'"
      :label-width="option.labelWidth ? `${option.labelWidth}px` : '100px'"
      :label-suffix="option.labelSuffix"
      :model="formData"
      :gutter="option.gutter"
      :size="option.size || 'default'"
      ref="widgetForm"
    >
      <el-row>
        <draggable
          class="layout-list"
          :class="{ full: !option.column.length }"
          :list="option.column"
          :group="{ name: 'layout' }"
          ghost-class="draggable-ghost"
          :animation="300"
          item-key="prop"
          @add="handleAddColumn"
          @start="historyCommit"
          @end="handleEnd"
          :move="onMove"
        >
          <template #item="{ element, index }">
            <LayoutGroup
              v-if="element.type == 'layoutGroup'"
              :ref="(el) => handleSetRef(el, element)"
              v-model="option.column[index]"
              v-model:select="selectItem"
              @del-group="handleDelColumn(index)"
              @copy-group="handleCopyColumn(index)"
              @select-group="handleselectItem(index)"
              @click="handleselectItem(index)"
            ></LayoutGroup>
            <el-col
              v-else
              :md="element.span + (propCount[element.prop] || 0)"
              :xs="24"
              :offset="element.offset"
              class="flex!"
            >
              <div class="flex-1">
                <LayoutTable
                  v-if="element.type == 'layoutTable'"
                  :ref="(el) => handleSetRef(el, element)"
                  v-model="option.column[index]"
                  v-model:select="selectItem"
                  @del-table="handleDelColumn(index)"
                  @copy-table="handleCopyColumn(index)"
                  @select-table="handleselectItem(index)"
                  @click="handleselectItem(index)"
                ></LayoutTable>
                <LayoutTabs
                  v-else-if="element.type == 'layoutTabs'"
                  :ref="(el) => handleSetRef(el, element)"
                  v-model="option.column[index]"
                  v-model:select="selectItem"
                  @del-tabs="handleDelColumn(index)"
                  @copy-tabs="handleCopyColumn(index)"
                  @select-tabs="handleselectItem(index)"
                  @click="handleselectItem(index)"
                ></LayoutTabs>
                <el-form-item
                  v-else
                  class="layout-item hover drag"
                  :label="element.label"
                  :prop="element.prop"
                  :size="option.size || element.size || 'default'"
                  :class="[
                    {
                      active: selectItem.prop == element.prop,
                      required: element.required,
                      hide: !element.display,
                      comboBox: element.type == 'comboBox'
                    },
                    'avue-form__item--' + (element.labelPosition || option.labelPosition || '')
                  ]"
                  @click="handleselectItem(index)"
                  :label-width="
                    element.labelWidth === 0 || element.hideLabel ? '0px' : element.labelWidth
                  "
                >
                  <template #label="{ label }">
                    <Icon
                      v-if="element.labelTip && !element.hideLabel"
                      :size="12"
                      icon="ep:info-filled"
                    ></Icon>
                    <span>{{ element.label && !element.hideLabel ? label : '' }}</span>
                  </template>
                  <LayoutComboBox
                    v-if="element.type == 'comboBox'"
                    v-model="option.column[index]"
                    v-model:select="selectItem"
                    @del-tabs="handleDelColumn(index)"
                    @copy-tabs="handleCopyColumn(index)"
                    @select-tabs="handleselectItem(index)"
                    @click="handleselectItem(index)"
                  ></LayoutComboBox>
                  <LayoutItem
                    v-else
                    :columnItem="element"
                    :controlParams="element.params"
                  ></LayoutItem>
                  <LayoutButton
                    v-if="selectItem.prop == element.prop"
                    @del-column="handleDelColumn(index)"
                    @copy-column="handleCopyColumn(index)"
                  ></LayoutButton>
                </el-form-item>
              </div>
              <div
                class="avue-form__line"
                v-if="element.row && element.span !== 24 && propCount[element.prop]"
                :style="{
                  width:
                    100 /
                      ((element.span + (propCount[element.prop] || 0)) /
                        (propCount[element.prop] || 0)) +
                    '%'
                }"
              ></div>
            </el-col>
          </template>
        </draggable>
      </el-row>
    </el-form>
  </el-main>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import useDrageed from '@/hooks/design/useDrageed'
import { LayoutItem, LayoutGroup, LayoutTable, LayoutTabs, LayoutButton, LayoutComboBox } from '../index'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import { calcCount } from '../../utils/util'

defineOptions({ name: 'DesignLayout' })

const props = defineProps({
  // 当前选中的链接
  modelValue: Object,
  select: Object
})
const { historyCommit, setParentData } = inject<lowFormDesignType>(
  lowFormDesignKey
) as lowFormDesignType

const emit = defineEmits(['update:modelValue', 'update:select'])

const { onMove, handleDragPosition } = useDrageed()

const option = ref<any>(props.modelValue)
const formData = ref({})
const selectItem = ref<any>(props.select)

const layoutGroup = ref({})
const layoutTable = ref({})
const layoutTabs = ref({})

const propCount = computed(() => calcCount(option.value.column))

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

const handleAddColumn = (e) => {
  const newIndex = e.newIndex
  const data = cloneDeep(option.value.column[newIndex])
  if (!data.prop) data.prop = `fields_${Math.ceil(Math.random() * 9999999)}`
  delete data.icon
  option.value.column[newIndex] = data
  handleselectItem(newIndex)
  handleDragPosition(newIndex, option.value.column)
  historyCommit()
}
const handleEnd = (e) => {
  const newIndex = e.newIndex
  handleDragPosition(newIndex, option.value.column)
  historyCommit()
}

const handleselectItem = (index) => {
  selectItem.value = option.value.column[index]
  setParentData(option.value.type, option.value.prop)
}
const handleDelColumn = (index) => {
  if (option.value.column.length - 1 == index) {
    if (index == 0) selectItem.value = {}
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

const handleSetRef = (el, item) => {
  if (!el || item.prop === undefined) return
  switch (item.type) {
    case 'layoutGroup':
      layoutGroup.value[item.prop] = el
      break
    case 'layoutTable':
      layoutTable.value[item.prop] = el
      break
    case 'layoutTabs':
      layoutTabs.value[item.prop] = el
      break
    default:
      break
  }
}

defineExpose({ handleAddColumn, layoutGroup, layoutTable, layoutTabs })
</script>

<style lang="scss" scoped>
.design-layout {
  height: calc(100% - 42px);
  padding: 0;

  & > form {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  .layout-list {
    display: flex;
    width: 100%;
    padding-bottom: 50px;
    overflow: hidden;
    overflow-y: auto;
    flex-wrap: wrap;
    align-content: flex-start;

    &.full {
      height: calc(100vh - 152px);
    }
  }
}
</style>
