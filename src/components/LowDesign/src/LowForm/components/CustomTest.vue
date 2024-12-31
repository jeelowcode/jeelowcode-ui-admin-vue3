<template>
  <!-- 自定义控件例子 -->
  <div>测试控件,值：{{ text }} </div>
  <avue-input v-model="text"></avue-input>
</template>

<script setup lang="ts">
defineOptions({ name: 'CustomTest' })

interface Props {
  prop: string
  size: string
  modelValue: string
  column: Object
  disabled?: boolean

}
const props = defineProps<Props>()
const text = ref(props.modelValue)

const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (val: string) => {
    text.value = val
  }
)
watch(
  () => text.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)
</script>

<style lang="scss" scoped></style>
