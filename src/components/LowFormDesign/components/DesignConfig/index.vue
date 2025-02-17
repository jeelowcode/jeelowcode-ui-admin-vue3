<template>
  <div class="design-config h-100%">
    <avue-tabs
      ref="tabsRef"
      :option="tabsOption"
      v-model="tabsValue"
      @change="handleTabsChange"
    ></avue-tabs>
    <div class="config-content">
      <ControlConfig
        v-if="tabsValue.prop == 'control'"
        v-model="selectItem"
        :tableDesignId="option.tableDesignId"
      ></ControlConfig>
      <FormConfig v-if="tabsValue.prop == 'form'" v-model="option"></FormConfig>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ControlConfig, FormConfig } from './components'

defineOptions({ name: 'DesignConfig' })

const props = defineProps({
  // 当前选中的链接
  modelValue: Object,
  select: Object
})

const emit = defineEmits(['update:modelValue', 'update:select'])

const option = ref<any>(props.modelValue)
const selectItem = ref<any>(props.select)
const tabsOption = ref({
  column: [
    { label: '控件配置', prop: 'control' },
    { label: '表单配置', prop: 'form' }
  ]
})
const tabsValue = ref(tabsOption.value.column[0])

const tabsRef = ref()

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

const handleTabsChange = (column) => {
  tabsValue.value = column
}

const setTabsVal = (prop) => {
  const index = tabsOption.value.column.findIndex((item) => item.prop == prop)
  if (index != -1) tabsRef.value.active = index + ''
}

defineExpose({ setTabsVal })
</script>

<style lang="scss" scoped>
.design-config {
  :deep(.avue-tabs) {
    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__nav {
      width: 100%;
    }

    .el-tabs__item {
      flex: 1;
    }
  }

  .config-content {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
}
</style>
