<template>
  <div>
    <el-form-item>
      <div class="w-100% flex">
        <div class="flex-1">
          <div>最小值：</div>
          <el-input-number v-model="option.min" placeholder="最小值" :min="0"></el-input-number>
        </div>
        <div class="ml-10px flex-1">
          <div>最大值：</div>
          <el-input-number v-model="option.max" placeholder="最大值" :min="0"></el-input-number>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="步长">
      <el-input-number v-model="option.step" placeholder="步长"></el-input-number>
    </el-form-item>
    <el-form-item label="操作配置">
      <el-checkbox v-model="option.range"> 范围选择 </el-checkbox>
      <el-checkbox v-model="option.showStops"> 间断点 </el-checkbox>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigSlider' })

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
