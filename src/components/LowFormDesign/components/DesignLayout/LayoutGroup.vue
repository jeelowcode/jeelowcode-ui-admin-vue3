<template>
  <div
    class="layout-group hover"
    :class="{ active: selectItem.prop == option.prop, hide: !option.display }"
  >
    <div class="el-collapse-item__header">
      <div class="avue-group__header">
        <h1 class="avue-group__title pl-12px">{{ option.label }}</h1>
      </div>
      <div class="mr-10px">
        <el-button size="small" v-if="isShow" @click="isShow = false">折叠</el-button>
        <el-button size="small" v-else @click="isShow = true">展开</el-button>
      </div>
    </div>
    <el-collapse-transition>
      <div v-show="isShow" class="h-100%">
        <draggable
          class="layout-group__body flex flex-wrap"
          :class="[customClass, { empty: !option.column?.length }]"
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
            <div
              class="flex"
              :style="{
                width: `${((element.span + (propCount[element.prop] || 0)) / 24) * 100}%`,
                marginLeft: `${(element.offset / 24) * 100}%`
              }"
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
                  @click.stop="handleselectItem(index)"
                ></LayoutTable>
                <LayoutTabs
                  v-else-if="element.type == 'layoutTabs'"
                  :ref="(el) => handleSetRef(el, element)"
                  v-model="option.column[index]"
                  v-model:select="selectItem"
                  @del-tabs="handleDelColumn(index)"
                  @copy-tabs="handleCopyColumn(index)"
                  @select-tabs="handleselectItem(index)"
                  @click.stop="handleselectItem(index)"
                ></LayoutTabs>
                <el-form-item
                  v-else
                  class="layout-group__item hover drag"
                  :label="element.label"
                  :prop="element.prop"
                  :class="[
                    {
                      'active-item': selectItem.prop == element.prop,
                      required: element.required,
                      hide: !element.display,
                      comboBox: element.type == 'comboBox'
                    },
                    'avue-form__item--' +
                      (element.labelPosition ||
                        option.labelPosition ||
                        formOption.labelPosition ||
                        '')
                  ]"
                  :label-width="
                    element.labelWidth === 0 && element.hideLabel ? '0px' : element.labelWidth
                  "
                  @click.stop="handleselectItem(index)"
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
                    type="group-item"
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
            </div>
          </template>
        </draggable>
      </div>
    </el-collapse-transition>

    <LayoutButton
      v-if="selectItem.prop == option.prop"
      :type="isShow ? 'group' : 'groupFold'"
      :isDelTip="true"
      @del-column="emit('del-group')"
      @copy-column="emit('copy-group')"
    ></LayoutButton>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import useDrageed from '@/hooks/design/useDrageed'
import { LayoutItem, LayoutTable, LayoutTabs, LayoutComboBox, LayoutButton } from '../index'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import { calcCount } from '../../utils/util'

defineOptions({ name: 'LayoutGroup' })

const props = defineProps({
  // 当前选中的链接
  modelValue: Object,
  select: Object,
  customClass: String
})
const { formOption, historyCommit, setParentData } = inject<lowFormDesignType>(
  lowFormDesignKey
) as lowFormDesignType

const emit = defineEmits([
  'update:modelValue',
  'update:select',
  'del-group',
  'copy-group',
  'select-group'
])

const { onMove } = useDrageed()

const option = ref<any>(props.modelValue)
const selectItem = ref<any>(props.select)
const isShow = ref(true)

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

const handleSetRef = (el, item) => {
  if (!el || item.prop === undefined) return
  switch (item.type) {
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

defineExpose({ handleAddGroupColumn, layoutTable, layoutTabs })
</script>

<style lang="scss" scoped></style>
