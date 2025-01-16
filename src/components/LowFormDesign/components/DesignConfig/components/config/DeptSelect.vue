<template>
  <el-form-item label="查询类型">
    <avue-select v-model="option.findType" :dic="controlOption.dicObj.deptFindType"></avue-select>
  </el-form-item>
  <el-form-item label="操作配置">
    <el-checkbox :key="option.prop" v-model="option.multiple"> 多选 </el-checkbox>
    <el-checkbox :key="option.prop" v-model="option.checkStrictly"> 父子不互相关联 </el-checkbox>
    <el-checkbox :key="option.prop" v-model="option.accordion"> 每次只展开一个同级树节点 </el-checkbox>
  </el-form-item>
  <div class="flex items-center gap-x-20px">
    <el-form-item label="分隔符" class="flex-1">
      <avue-input v-model="option.separator"> </avue-input>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
import controlOption from '@/components/LowDesign/src/utils/controlOption'

defineOptions({ name: 'DicTableSelect' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const {} = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

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
