<template>
  <el-form-item label="默认值">
    <el-input
      v-model="option.value"
      readonly
      placeholder="默认值"
      @click="dialog = true"
    ></el-input>
  </el-form-item>
  <el-form-item label="wangEditor配置">
    <div class="mb-4px flex items-center text-12px">
      <div>配置请参考：</div>
      <a
        class="el-link el-link--primary is-underline"
        href="https://www.wangeditor.com/v5/getting-started.html"
        target="_blank"
      >
        <span class="el-link__inner h-18px text-12px">wangEditor文档</span>
      </a>
    </div>
    <el-input
      v-model="option.wangEditorStr"
      readonly
      placeholder="wangEditor配置"
      @click="openEditView('wangEditorStr', 'wangEditor')"
    ></el-input>
  </el-form-item>
  <DesignPopup v-model="dialog" title="默认值" class="config-ueditor-default">
    <template #default="{ isFull }">
      <div class="default-box" :class="{ full: isFull }">
        <avue-ueditor v-model="option.value"></avue-ueditor>
      </div>
    </template>
  </DesignPopup>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigUeditor' })
const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)
const dialog = ref(false)

const exampleObj = {
  wangEditorStr: example.wangEditorExample
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

<style lang="scss">
.config-ueditor-default {
  .default-box {
    .avue-ueditor {
      & > div:nth-child(2) {
        height: calc(65vh - 80px) !important;
      }
    }

    &.full {
      .avue-ueditor {
        & > div:nth-child(2) {
          height: calc(100vh - 136px) !important;
        }
      }
    }
  }
}
</style>
