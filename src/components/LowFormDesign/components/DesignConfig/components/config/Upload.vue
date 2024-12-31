<template>
  <el-form-item label="文件上传类型">
    <el-input
      v-model="option.accept"
      clearable
      placeholder="接受文件类型，如：image/png,image/jpg"
    ></el-input>
  </el-form-item>
  <el-form-item label="上传回调配置">
    <el-input
      v-model="option.callBackStr"
      placeholder="上传回调配置"
      readonly
      @click="openEditView('callBackStr', '上传回调配置')"
    ></el-input>
  </el-form-item>
  <el-form-item v-if="!isFile" label="图片列表类型">
    <avue-select
      v-model="option.listType"
      placeholder="图片列表类型"
      :dic="imgTypeList"
    ></avue-select>
  </el-form-item>
  <el-form-item
    v-if="parentData.type == 'layoutTable'"
    :label="`列表最大显示${isFile ? '文件' : '图片'}数量`"
  >
    <avue-input-number v-model="option.showNum" placeholder="默认 1"></avue-input-number>
  </el-form-item>
  <el-form-item label="操作配置">
    <el-checkbox v-model="option.multiple"> 多选 </el-checkbox>
    <el-checkbox v-model="option.showFileList" v-if="option.type == 'file'">
      显示文件列表
    </el-checkbox>
    <el-checkbox v-model="option.dragFile" v-if="isFile"> 拖拽上传 </el-checkbox>
    <el-checkbox v-model="option.drag"> 拖拽排序 </el-checkbox>
    <el-checkbox v-model="option.showCanvas" v-if="!isFile"> 图片水印 </el-checkbox>
  </el-form-item>
  <div v-if="option.canvasOption" class="el-form-item el-form-item--small el-form--label-top">
    <label class="el-form-item__label" style="padding: 0">水印设置：</label>
    <div class="el-form-item__content ml-20px">
      <div class="canvas-option-box">
        <span class="box-label">水印文字</span>
        <el-input
          v-model="option.canvasOption.text"
          size="small"
          clearable
          placeholder="水印文字"
        ></el-input>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">字体类型</span>
        <el-input
          v-model="option.canvasOption.fontFamily"
          size="small"
          clearable
          placeholder="microsoft yahei"
        ></el-input>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">字体颜色</span>
        <avue-input-color
          v-model="option.canvasOption.color"
          size="small"
          placeholder="字体颜色"
        ></avue-input-color>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">字体大小</span>
        <el-input-number
          v-model="option.canvasOption.fontSize"
          size="small"
          placeholder="字体大小"
        ></el-input-number>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">透明度</span>
        <el-input-number
          v-model="option.canvasOption.opacity"
          size="small"
          placeholder="文字的透明度"
          :step="10"
          :min="10"
          :max="100"
        ></el-input-number>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">bottom</span>
        <el-input-number
          v-model="option.canvasOption.bottom"
          placeholder="文字距离图片底部的距离"
          :step="10"
          size="small"
        ></el-input-number>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">right</span>
        <el-input-number
          v-model="option.canvasOption.right"
          placeholder="文字距离图片右边的距离"
          :step="10"
          size="small"
        ></el-input-number>
      </div>
      <div class="canvas-option-box">
        <span class="box-label">压缩比率</span>
        <el-input-number
          v-model="option.canvasOption.ratio"
          placeholder="压缩图片比率"
          :step="0.1"
          :min="0"
          :max="1"
          size="small"
        ></el-input-number>
      </div>
    </div>
  </div>
  <el-form-item :label="isFile ? '文件大小' : '图片大小'">
    <el-input-number
      v-model="option.fileSize"
      :placeholder="isFile ? '文件大小' : '图片大小'"
      style="width: 100%"
    ></el-input-number>
  </el-form-item>
  <el-form-item label="上传按钮文本" v-if="isFile">
    <el-input v-model="option.fileText" clearable placeholder="上传按钮文本"></el-input>
  </el-form-item>
  <el-form-item label="提示文本">
    <el-input v-model="option.tip" clearable placeholder="提示文本"></el-input>
  </el-form-item>
  <el-form-item label="上传中提示">
    <el-input v-model="option.loadText" clearable placeholder="上传中提示"></el-input>
  </el-form-item>
  <el-form-item v-if="option.multiple" label="最大允许上传个数">
    <el-input-number
      v-model="option.limit"
      placeholder="最大允许上传个数"
      :min="1"
      style="width: 100%"
    ></el-input-number>
  </el-form-item>
</template>

<script setup lang="ts">
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigUpload' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example, parentData } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)
const imgTypeList = ref([
  { label: '缩略图', value: 'picture' },
  { label: '照片墙', value: 'picture-card' },
  { label: '单个图片', value: 'picture-img' }
])

const exampleObj = {
  callBackStr: example.uplaodExample
}

const isFile = computed(() => {
  return option.value.type == 'file'
})

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
watch(
  () => option.value.showCanvas,
  (val: boolean) => {
    if (val) option.value.canvasOption = {}
    else delete option.value.canvasOption
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

<style lang="scss" scoped>
.canvas-option-box {
  display: flex;
  width: 100%;
  margin-bottom: 5px;

  .box-label {
    flex: 0 0 60px;
  }
}
</style>
