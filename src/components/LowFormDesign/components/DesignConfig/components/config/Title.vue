<template>
  <el-form-item label="文本样式配置">
    <el-input
      v-model="option.stylesStr"
      readonly
      placeholder="文本样式配置"
      @click="openEditView('stylesStr', '文本样式配置')"
    ></el-input>
  </el-form-item>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigTitle' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType
const option = ref<any>(props.modelValue)

const exampleObj = {
  stylesStr: example.titleStyleExample
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
