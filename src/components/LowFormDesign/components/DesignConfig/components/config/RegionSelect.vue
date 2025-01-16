<template>
  <div>
    <el-form-item label="区域类型">
      <avue-select v-model="option.regionType" :dic="controlOption.dicObj.regionType"></avue-select>
    </el-form-item>
    <el-form-item label="操作配置">
      <el-checkbox :key="option.prop" v-model="option.multiple"> 多选 </el-checkbox>
      <el-checkbox :key="option.prop" v-model="option.collapseTags"> 多选值折叠 </el-checkbox>
      <el-checkbox :key="option.prop" v-model="option.collapseTagsTooltip">
        鼠标悬停展示全部折叠值
      </el-checkbox>
    </el-form-item>
    <el-form-item label="从第几个值开始折叠">
      <avue-input-number v-model="option.maxCollapseTags"></avue-input-number>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import controlOption from '@/components/LowDesign/src/utils/controlOption'
defineOptions({ name: 'ConfigRegionSelect' })

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
