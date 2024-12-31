<template>
  <el-form-item label="高德地图配置">
    <div class="text-12px c-red" v-if="aMapTip">{{ aMapTip }}</div>
    <el-input
      v-model="option.mapOptionStr"
      readonly
      placeholder="高德地图配置"
      @click="openEditView('mapOptionStr', '高德地图配置')"
    ></el-input>
  </el-form-item>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigMap' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)

const aMapTip =
  window['_AMapSecurityConfig'].securityJsCode != 'xxxxx'
    ? ''
    : '请前往 index.html 文件完善高德地图相关配置'
const exampleObj = {
  mapOptionStr: example.mapExample
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
