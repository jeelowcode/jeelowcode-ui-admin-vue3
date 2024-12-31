<template>
  <div>
    <el-form-item label="操作配置">
      <el-checkbox v-model="option.arrow"> 折叠 </el-checkbox>
      <el-checkbox v-model="option.collapse"> 默认展开 </el-checkbox>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigLayoutGroup' })

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])
const option = ref<any>(props.modelValue)

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
</script>

<style lang="scss" scoped></style>
