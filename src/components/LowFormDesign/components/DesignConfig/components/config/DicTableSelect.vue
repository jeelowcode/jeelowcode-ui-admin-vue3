<template>
  <TableDicOption v-model="option" type="dicTableSelect"></TableDicOption>
  <el-form-item label="操作配置">
    <el-checkbox :key="option.prop" v-model="option.multiple"> 多选 </el-checkbox>
  </el-form-item>
  <div class="flex items-center gap-x-20px">
    <el-form-item label="最大选择数" class="flex-1">
      <avue-input-number v-model="option.limit"> </avue-input-number>
    </el-form-item>
    <el-form-item label="分隔符" class="flex-1">
      <avue-input v-model="option.separator"> </avue-input>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { TableDicOption } from '../index'

defineOptions({ name: 'DicTableSelect' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])

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
