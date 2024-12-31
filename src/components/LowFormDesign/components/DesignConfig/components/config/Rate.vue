<template>
  <div>
    <el-form-item label="最大星星数">
      <el-input-number v-model="option.max" :min="1" placeholder="最大星星数"></el-input-number>
    </el-form-item>
    <el-form-item label="操作配置">
      <el-checkbox v-model="option.showText" :disabled="option.showScore">
        显示辅助文字
      </el-checkbox>
      <el-checkbox v-model="option.showScore" :disabled="option.showText">
        显示当前分数
      </el-checkbox>
      <el-checkbox v-model="option.allowHalf"> 半选 </el-checkbox>
    </el-form-item>
    <el-form-item label="辅助文字" v-if="option.showText">
      <div class="flex pl-10px">
        <div class="w-60px">颜色：</div>
        <avue-input-color placeholder="辅助文字颜色" v-model="option.textColor"></avue-input-color>
      </div>
      <div class="flex pl-10px">
        <div class="w-60px">文字：</div>
        <avue-array
          :class="{ 'pt-5px': option.texts.length }"
          size="small"
          :limit="option.max ? option.max : 5"
          v-model="option.texts"
        ></avue-array>
      </div>
    </el-form-item>
    <el-form-item label="分数显示模板" v-if="option.showScore">
      <el-input v-model="option.scoreTemplate" placeholder="{value} 表示当前分数"></el-input>
    </el-form-item>
    <el-form-item label="自定义星星颜色">
      <avue-array
        class="custom-color-array"
        size="small"
        :limit="option.max ? option.max : 5"
        v-model="option.colors"
      ></avue-array>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigRate' })

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
