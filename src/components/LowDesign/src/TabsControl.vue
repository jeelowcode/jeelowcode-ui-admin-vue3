<template>
  <el-tabs v-model="tabsValue" class="tabs-control" @tab-click="tabClick" v-bind="tabsParams">
    <el-tab-pane
      v-for="(item, key) in tabsData"
      :label="item.tabText"
      :name="key"
      :key="key"
      :disabled="item.disabled"
      :lazy="item.lazy"
    >
      <div
        :style="{ height: heightData.tabHeight }"
        class="overflow-y-auto"
        v-if="!lazy || (lazy && lazyObj[key])"
      >
        <template v-if="item.type == 'form'">
          <FormView
            v-bind="item.params"
            show-type="view"
            :ref="(el) => (controlRef[key] = el)"
          ></FormView>
        </template>
        <template v-else-if="item.type == 'table'">
          <TableView
            v-bind="item.params"
            show-type="view"
            :calc-num="heightData.calcNum"
            :ref="(el) => (controlRef[key] = el)"
          ></TableView>
        </template>
        <template v-else-if="item.type == 'control'">
          <ControlView
            v-bind="item.params"
            show-type="view"
            :ref="(el) => (controlRef[key] = el)"
          ></ControlView>
        </template>
        <template v-else-if="item.type == 'tabs'">
          <TabsView
            v-bind="item.params"
            show-type="view"
            :calcTabsNum="
              (calcTabsNum ? calcTabsNum : 55) +
              (item.params?.tabsParams?.tabPosition == 'top' ? 40 : 0)
            "
            :ref="(el) => (controlRef[key] = el)"
          ></TabsView>
        </template>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { FormView, TableView, ControlView } from '../index'
defineOptions({ name: 'TabsControl' })
interface HeightData {
  tabHeight: string
  calcNum: number
}
interface Props {
  tabsData: any
  tabsParams: object
  heightData: HeightData
  calcTabsNum: number
  defaultTab?: string | number
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tabsData: () => {
    return {}
  },
  tabsParams: () => {
    return {}
  }
})

const lazyObj = ref({})

const tabsValue = ref(props.defaultTab || Object.keys(props.tabsData)[0])

const controlRef = ref({})

const tabClick = (tab) => {}

watch(
  () => tabsValue.value,
  (val) => {
    if (val) {
      if (!props.tabsData[val]) return
      if (props.lazy) lazyObj.value[val] = true
      const { type, refresh } = props.tabsData[val]
      if (type == 'table') {
        const table = controlRef.value[val]?.controlRef
        table?.initTableLayout()
        if (refresh) table?.resetChange()
      } else {
        if (refresh) controlRef.value[val]?.initControl()
      }
    }
  },
  { immediate: true }
)

defineExpose({ controlRef })
</script>

<style lang="scss" scoped>
.tabs-control {
  height: 100%;

  & > ::v-deep(.el-tabs__header) {
    margin-top: 0;
    margin-bottom: 0;

    &.is-bottom {
      height: 41px;
    }

    &.is-left,
    &.is-right {
      height: 100%;
    }
  }

  & > ::v-deep(.el-tabs__content) {
    padding: 0;
  }
}
</style>
