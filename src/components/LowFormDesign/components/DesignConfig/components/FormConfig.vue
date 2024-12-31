<template>
  <div class="form-config">
    <el-form label-position="top" label-suffix="：" label-width="130px">
      <el-form-item label="绑定表单开发">
        <el-select
          class="w-100%"
          v-model="option.tableDesignId"
          clearable
          filterable
          placeholder="请选择表单开发"
        >
          <el-option
            v-for="item in tableDbOptions"
            :key="item['value']"
            :label="item['label']"
            :value="item['value']"
          ></el-option>
        </el-select>
        <el-checkbox v-model="option.isSubmitTable">表单数据提交到绑定的表单开发中</el-checkbox>
      </el-form-item>
      <el-form-item label="表单基础配置">
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">label对齐方式</div>
          <el-select class="flex-1" v-model="option.labelPosition" placeholder="按钮位置">
            <el-option label="左对齐" value="left"></el-option>
            <el-option label="右对齐" value="right"></el-option>
            <el-option label="顶部对齐" value="top"></el-option>
          </el-select>
        </div>
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">表单尺寸</div>
          <el-select class="flex-1" v-model="option.size" placeholder="表单尺寸">
            <el-option label="大尺寸" value="large"></el-option>
            <el-option label="默认尺寸" value="default"></el-option>
            <el-option label="小尺寸" value="small"></el-option>
          </el-select>
        </div>
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">label宽度</div>
          <el-input-number
            v-model="option.labelWidth"
            class="flex-1"
            :min="0"
            :step="10"
            placeholder="label宽度"
          ></el-input-number>
        </div>
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">标签后缀</div>
          <el-input class="flex-1" v-model="option.labelSuffix" placeholder="标签后缀"></el-input>
        </div>
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">控件间隔</div>
          <el-input-number
            v-model="option.gutter"
            class="flex-1"
            :min="0"
            :max="60"
            :step="5"
            placeholder="控件间隔"
            style="width: 100%"
          ></el-input-number>
        </div>
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">按钮位置</div>
          <el-select class="flex-1" v-model="option.menuPosition" placeholder="按钮位置">
            <el-option label="居左" value="left"></el-option>
            <el-option label="居中" value="center"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </div>
        <div class="mb-5px w-100% flex">
          <el-checkbox v-model="option.submitBtn"></el-checkbox>
          <div class="option-btn-label ml-5px text-13px">提交按钮</div>
          <el-input
            v-model="option.submitText"
            :disabled="!option.submitBtn"
            placeholder="提交按钮文本"
          ></el-input>
        </div>
        <div class="mb-5px w-100% flex">
          <el-checkbox v-model="option.emptyBtn"></el-checkbox>
          <div class="option-btn-label ml-5px text-13px">清空按钮</div>
          <el-input
            v-model="option.emptyText"
            :disabled="!option.emptyBtn"
            placeholder="清空按钮文本"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="其他配置">
        <div class="mb-5px w-100% flex">
          <div class="option-label text-13px">外部链接标题</div>
          <avue-input v-model="option.externalTitle"></avue-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'
defineOptions({ name: 'FormConfig' })

const props = defineProps({
  modelValue: Object
})

const { tableDbOptions } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

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
.form-config {
  :deep(.el-form) {
    padding: 10px 10px 0;

    .option-label {
      flex: 0 0 90px;
    }

    .option-btn-label {
      flex: 0 0 70px;
    }

    .el-form-item {
      margin-bottom: 10px;

      input {
        font-size: 13px;

        &::placeholder {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
