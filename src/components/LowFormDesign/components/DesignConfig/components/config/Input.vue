<template>
  <div>
    <el-form-item label="占位内容">
      <avue-input
        class="w-100%"
        :type="option.type"
        v-model="option.placeholder"
        clearable
        :minRows="2"
        :maxRows="3"
        placeholder="占位内容"
      ></avue-input>
    </el-form-item>
    <el-form-item label="前后缀" v-if="!['textarea', 'number'].includes(option.type)">
      <div class="relative flex">
        <el-input class="mr-10px" v-model="option.prepend" clearable placeholder="前缀"></el-input>
        <el-input v-model="option.append" clearable placeholder="后缀"></el-input>
        <span class="item-tip left-115px top--17px">前</span>
        <span class="item-tip right-5px top--17px">后</span>
      </div>
    </el-form-item>
    <el-form-item label="最大小行" v-if="option.type == 'textarea'">
      <div class="relative w-100% flex">
        <el-input-number
          class="mr-10px flex-1"
          v-model="option.minRows"
          placeholder="5"
          :min="1"
        ></el-input-number>
        <el-input-number
          class="flex-1"
          v-model="option.maxRows"
          placeholder="10"
          :min="1"
        ></el-input-number>
        <span class="item-tip left-85px top--16px">小</span>
        <span class="item-tip right-35px top--16px">大</span>
      </div>
    </el-form-item>
    <el-form-item label="是否切换显示隐藏密码" v-if="option.type == 'password'">
      <el-switch v-model="option.showPassword"></el-switch>
    </el-form-item>
    <div v-if="option.type == 'number'">
      <el-form-item label="最大小值">
        <div class="relative w-100% flex">
          <el-input-number
            class="mr-10px flex-1"
            v-model="option.min"
            placeholder="最小值"
          ></el-input-number>
          <el-input-number
            class="flex-1"
            v-model="option.max"
            placeholder="最大值"
          ></el-input-number>
          <span class="item-tip left-85px top--16px">小</span>
          <span class="item-tip right-35px top--16px">大</span>
        </div>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :md="12" :xs="24">
          <el-form-item label="步长">
            <el-input-number v-model="option.step" placeholder="步长"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :md="12" :xs="24">
          <el-form-item label="数值精度">
            <el-input-number
              v-model="option.precision"
              placeholder="数值精度"
              :min="0"
              :max="10"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="控制器" label-width="100px">
        <div class="flex items-center">
          <el-switch class="mr-10px mt-6px" v-model="option.controls"></el-switch>
          <avue-radio
            v-model="option.controlsPosition"
            :disabled="!option.controls"
            button
            :dic="positionList"
          ></avue-radio>
        </div>
      </el-form-item>
      <el-form-item label="内容位置" label-width="100px">
        <div class="flex items-center">
          <avue-radio
            v-model="option.textPosition"
            :disabled="!option.controls"
            button
            :dic="textPositionDic"
          ></avue-radio>
        </div>
      </el-form-item>
    </div>
    <el-form-item label="字数统计" v-if="!['password', 'number'].includes(option.type)">
      <div class="relative w-100% flex items-center">
        <el-switch class="mr-10px" v-model="option.showWordLimit"></el-switch>
        <el-input-number
          class="mr-10px flex-1"
          v-model="option.minlength"
          :controls="false"
          placeholder="最小字数"
          :disabled="!option.showWordLimit"
        ></el-input-number>
        <el-input-number
          class="flex-1"
          v-model="option.maxlength"
          :controls="false"
          placeholder="最大字数"
          :disabled="!option.showWordLimit"
        ></el-input-number>
        <span class="item-tip right-120px top--17px">小</span>
        <span class="item-tip right-5px top--17px">大</span>
      </div>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigInput' })

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])

const option = ref<any>(props.modelValue)
const positionList = [
  { label: '左右两边', value: '' },
  { label: '右边', value: 'right' }
]
const textPositionDic = [
  { label: '靠左', value: 'left' },
  { label: '居中', value: 'center' }
]

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
.item-tip {
  position: absolute;
  z-index: 1;
  font-size: 12px;
  color: #999;
}
</style>
