<template>
  <div
    class="layout-tabs hover"
    :class="{ active: isCurrActive && selectItem.prop == option.prop, hide: !option.display }"
  >
    <div class="tabs-content">
      <el-tabs v-model="tabValue" v-bind="option.params" class="demo-tabs">
        <el-tab-pane v-for="(tab, tabIndex) in option.column" :key="tab.prop" :label="tab.label">
          <template #label>
            <span :class="{ 'tab-label': true, hide: !tab.display }">{{ tab.label }}</span>
          </template>
          <el-collapse-transition>
            <div v-show="isShow" class="h-100%">
              <div class="tabs-item-content">
                <draggable
                  class="layout-tabs__body flex flex-wrap"
                  :class="{ empty: !option.column[tabIndex].column?.length }"
                  :list="option.column[tabIndex].column"
                  :group="{ name: 'layout' }"
                  ghost-class="draggable-ghost"
                  :animation="200"
                  item-key="prop"
                  @add="handleAddTabsColumn($event, tabIndex)"
                  @start="historyCommit"
                  @end="handleTabsEnd($event, tabIndex)"
                  :move="onMove"
                >
                  <template #item="{ element, index }">
                    <LayoutGroup
                      v-if="element.type == 'layoutGroup'"
                      :ref="(el) => handleSetRef(el, element, tabIndex)"
                      custom-class="tabs-layout-group__body"
                      v-model="option.column[tabIndex].column[index]"
                      v-model:select="selectItem"
                      :is-active="
                        parentData.type == element.type && parentData.prop == element.prop
                      "
                      :is-curr-active="isActive && parentData.tabsIndex === tabIndex"
                      @del-group="handleDelColumn(index, tabIndex)"
                      @copy-group="handleCopyColumn(index, tabIndex)"
                      @select-group="handleselectItem(index, tabIndex)"
                      @click.stop="handleselectItem(index, tabIndex)"
                    ></LayoutGroup>
                    <div
                      v-else
                      class="flex"
                      :style="{
                        width: `${
                          ((element.span + (propCount[tab.prop][element.prop] || 0)) / 24) * 100
                        }%`,
                        marginLeft: `${(element.offset / 24) * 100}%`
                      }"
                    >
                      <div class="flex-1 w-100%">
                        <LayoutTable
                          v-if="element.type == 'layoutTable'"
                          :ref="(el) => handleSetRef(el, element, tabIndex)"
                          v-model="option.column[tabIndex].column[index]"
                          v-model:select="selectItem"
                          :is-curr-active="isActive"
                          @del-table="handleDelColumn(index, tabIndex)"
                          @copy-table="handleCopyColumn(index, tabIndex)"
                          @select-table="handleselectItem(index, tabIndex)"
                          @click.stop="handleselectItem(index, tabIndex)"
                        ></LayoutTable>
                        <el-form-item
                          v-else
                          class="layout-tabs__item hover drag"
                          :label="element.label"
                          :prop="element.prop"
                          :class="[
                            {
                              'active-item':
                                isActive &&
                                parentData.tabsIndex === tabIndex &&
                                selectItem.prop == element.prop,
                              required: element.required,
                              hide: !element.display,
                              comboBox: element.type == 'comboBox'
                            },
                            'avue-form__item--' +
                              (element.labelPosition ||
                                option.column[tabIndex].labelPosition ||
                                formOption.labelPosition ||
                                '')
                          ]"
                          :label-width="
                            element.labelWidth === 0 && element.hideLabel
                              ? '0px'
                              : element.labelWidth
                          "
                          @click.stop="handleselectItem(index, tabIndex)"
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
                            v-model="option.column[tabIndex].column[index]"
                            v-model:select="selectItem"
                            @del-tabs="handleDelColumn(index, tabIndex)"
                            @copy-tabs="handleCopyColumn(index, tabIndex)"
                            @select-tabs="handleselectItem(index, tabIndex)"
                            @click="handleselectItem(index, tabIndex)"
                          ></LayoutComboBox>
                          <LayoutItem
                            v-else
                            :columnItem="element"
                            :controlParams="element.params"
                          ></LayoutItem>
                          <LayoutButton
                            v-if="
                              isActive &&
                              parentData.tabsIndex === tabIndex &&
                              selectItem.prop == element.prop
                            "
                            type="group-item"
                            @del-column="handleDelColumn(index, tabIndex)"
                            @copy-column="handleCopyColumn(index, tabIndex)"
                          ></LayoutButton>
                        </el-form-item>
                      </div>
                      <div
                        class="avue-form__line"
                        v-if="
                          element.row && element.span !== 24 && propCount[tab.prop][element.prop]
                        "
                        :style="{
                          width:
                            100 /
                              ((element.span + (propCount[tab.prop][element.prop] || 0)) /
                                (propCount[tab.prop][element.prop] || 0)) +
                            '%'
                        }"
                      ></div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </el-collapse-transition>
        </el-tab-pane>
      </el-tabs>
      <div class="tabs-btn" :class="option.params.tabPosition">
        <el-button size="small" v-if="isShow" @click="isShow = false">折叠</el-button>
        <el-button size="small" v-else @click="isShow = true">展开</el-button>
      </div>
    </div>
    <LayoutButton
      v-if="selectItem.prop == option.prop"
      :type="isShow ? 'tabs' : 'tabsFold'"
      :isDelTip="true"
      @del-column="emit('del-tabs')"
      @copy-column="emit('copy-tabs')"
    ></LayoutButton>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'
import useDrageed from '@/hooks/design/useDrageed'
import { LayoutItem, LayoutGroup, LayoutTable, LayoutComboBox, LayoutButton } from '../index'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import { calcCount } from '../../utils/util'

defineOptions({ name: 'LayoutTabs' })

const props = defineProps({
  // 当前选中的链接
  modelValue: Object,
  select: Object,
  isCurrActive: Boolean
})
const { formOption, parentData, historyCommit, setParentData, setConfigTab } =
  inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const emit = defineEmits([
  'update:modelValue',
  'update:select',
  'del-tabs',
  'copy-tabs',
  'select-tabs'
])

const { onMove, handleDragPosition } = useDrageed()

const option = ref<any>(props.modelValue)
const selectItem = ref<any>(props.select)
const isShow = ref(true)
const tabValue = ref('0')

const layoutTable = ref({})
const layoutGroup = ref({})

const propCount = computed(() => {
  let tabCount = {}
  option.value.column.forEach((item) => {
    tabCount[item.prop] = calcCount(item.column)
  })
  return tabCount
})

const isActive = computed(() => {
  if (parentData.value.type == 'layoutTabs' && parentData.value.prop == option.value.prop) {
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

watch(
  () => option.value.column?.length,
  (index) => {
    if (index - 1 < Number(tabValue.value)) tabValue.value = '0'
  }
)

const handleAddTabsColumn = (e, tabsIndex) => {
  const newIndex = e.newIndex
  const data = cloneDeep(option.value.column[tabsIndex].column[newIndex])
  if (!data.prop) data.prop = `fields_${Math.ceil(Math.random() * 9999999)}`
  delete data.icon
  option.value.column[tabsIndex].column[newIndex] = data
  handleselectItem(newIndex, tabsIndex)
  handleDragPosition(newIndex, option.value.column[tabsIndex].column)
  historyCommit()
}

const handleTabsEnd = (e, tabsIndex) => {
  const newIndex = e.newIndex
  handleDragPosition(newIndex, option.value.column[tabsIndex].column)
  historyCommit()
}

const handleselectItem = (index, tabsIndex) => {
  selectItem.value = option.value.column[tabsIndex].column[index]
  setParentData(option.value.type, option.value.prop, tabsIndex)
  setConfigTab('control')
}
const handleDelColumn = (index, tabsIndex) => {
  if (option.value.column[tabsIndex].column.length - 1 == index) {
    if (index == 0) emit('select-tabs')
    else handleselectItem(index - 1, tabsIndex)
  } else handleselectItem(index + 1, tabsIndex)
  nextTick(() => {
    option.value.column[tabsIndex].column.splice(index, 1)
    historyCommit()
  })
}
const handleCopyColumn = (index, tabsIndex) => {
  const data = cloneDeep(option.value.column[tabsIndex].column[index])
  data.prop = `fields_${Math.ceil(Math.random() * 9999999)}`
  option.value.column[tabsIndex].column.push(data)
  nextTick(() => {
    handleselectItem(option.value.column[tabsIndex].column.length - 1, tabsIndex)
    historyCommit()
  })
}

const handleSetRef = (el, item, tabIndex) => {
  if (!el || item.prop === undefined) return
  switch (item.type) {
    case 'layoutGroup':
      layoutGroup.value[`${tabIndex}_${item.prop}`] = el
      break
    case 'layoutTable':
      layoutTable.value[`${tabIndex}_${item.prop}`] = el
      break
    default:
      break
  }
}

defineExpose({ tabValue, handleAddTabsColumn, layoutGroup, layoutTable })
</script>

<style lang="scss" scoped>
.tabs-content {
  position: relative;

  :deep(.el-tabs) {
    .el-tabs__header {
      &.is-left {
        margin-right: 0;
      }

      &.is-right {
        margin-left: 0;
      }

      &.is-top {
        margin-bottom: 0;
      }

      &.is-bottom {
        margin-top: 0;
      }

      .el-tabs__item.is-bottom:nth-child(2) {
        padding-left: 20px;
      }
    }
  }

  .tabs-btn {
    position: absolute;

    &.top {
      top: 5px;
      right: 5px;
    }

    &.bottom {
      right: 5px;
      bottom: 10px;
    }

    &.left,
    &.right {
      display: none;
    }
  }

  :deep(.el-tabs.el-tabs--border-card) {
    .el-tabs__content {
      padding: 0 !important;
    }
  }
}
</style>
