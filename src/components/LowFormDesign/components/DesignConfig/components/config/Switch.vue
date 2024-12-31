<template>
  <div>
    <el-form-item>
      <div class="w-100% flex">
        <div class="flex-1 text-center">开启配置</div>
        <div class="flex-1 text-center">关闭配置</div>
      </div>
      <div class="w-100% flex">
        <div>
          <el-input
            class="switch-value-input mb-5px"
            v-model="option.dicData[1].value"
            placeholder="开启值"
          >
            <template #prepend>值</template>
          </el-input>
          <!-- <avue-input-color
            placeholder="打开时背景色"
            v-model="option.activeColor"
          ></avue-input-color> -->
        </div>
        <div class="ml-10px">
          <el-input
            class="switch-value-input mb-5px"
            v-model="option.dicData[0].value"
            placeholder="关闭值"
          >
            <template #prepend>值</template>
          </el-input>
          <!-- <avue-input-color
            placeholder="关闭时背景色"
            v-model="option.inactiveColor"
          ></avue-input-color> -->
        </div>
      </div>
    </el-form-item>
    <el-form-item label="默认值" v-if="option.dicType != 'remote'">
      <avue-switch v-model="option.value" :dic="option.dicData"></avue-switch>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigSwitch' })

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

<style lang="scss" scoped>
.switch-value-input {
  :deep(.el-input-group__prepend) {
    padding: 0 10px;
  }
}

:deep(.avue-input-color) {
  .el-input-group__append {
    padding: 0 4px;
  }
}
</style>
