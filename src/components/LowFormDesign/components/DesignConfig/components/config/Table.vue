<template>
  <el-form-item label="表格、字段配置">
    <el-input
      v-model="option.tableConfigStr"
      readonly
      placeholder="表格、字段配置"
      @click="openEditView('tableConfigStr', '表格、字段配置')"
    ></el-input>
  </el-form-item>
  <el-form-item
    label="表格请求、回显、存储配置"
    @click="openEditView('tableOptionStr', '表格请求、回显、存储配置')"
  >
    <el-input
      v-model="option.tableOptionStr"
      readonly
      placeholder="表格请求、回显、存储配置"
    ></el-input>
  </el-form-item>
  <el-form-item label="操作配置">
    <el-checkbox v-model="option.multiple"> 多选 </el-checkbox>
  </el-form-item>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigTable' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)

const exampleObj = {
  tableConfigStr: example.tableConfigExample,
  tableOptionStr: example.tableOptionExample
}

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

const openEditView = (prop, label) => {
  emit('open-med', {
    prop,
    label,
    params: {
      headerBtn: [
        {
          name: `复制配置示例`,
          icon: 'solar:copy-outline',
          clickFun: () => {
            emit('copy-text', exampleObj[prop] || '')
          },
          params: {
            size: 'small',
            type: 'primary'
          }
        }
      ]
    }
  })
}
</script>

<style lang="scss" scoped></style>
