<template>
  <div>
    <el-form-item :label="option.controlType == 'date' ? '日期类型' : '时间类型'">
      <el-select
        class="w-100%"
        v-model="option.type"
        :placeholder="`请选择${option.controlType == 'date' ? '日期类型' : '时间类型'}`"
        @change="typeChange"
      >
        <template
          v-for="item in option.controlType == 'date' ? dateList : timeList"
          :key="item.value"
        >
          <el-option :label="item.label" :value="item.value"></el-option>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="占位内容">
      <div class="flex" v-if="option.type.indexOf('range') != -1">
        <el-input v-model="option.startPlaceholder" clearable placeholder="开始占位内容"></el-input>
        <el-input
          class="ml-10px"
          v-model="option.endPlaceholder"
          clearable
          placeholder="结束占位内容"
        ></el-input>
      </div>
      <el-input v-else v-model="option.placeholder" clearable placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="日期显示格式化">
      <el-input v-model="option.format" clearable placeholder="显示格式化"></el-input>
    </el-form-item>
    <el-form-item label="日期存储格式化">
      <el-input v-model="option.valueFormat" clearable placeholder="存储格式化"></el-input>
    </el-form-item>
    <el-form-item label="范围分隔符" label-width="110px" v-if="option.type.indexOf('range') != -1">
      <el-input v-model="option.rangeSeparator" clearable placeholder="-"></el-input>
    </el-form-item>
    <el-form-item
      label-width="110px"
      v-if="option.type.indexOf('range') != -1 && option.type != 'timerange'"
    >
      <div class="mt-10px flex flex-wrap">
        <el-checkbox :key="option.prop" v-model="option.unlinkPanels"> 取消范围联动 </el-checkbox>
      </div>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigDateTime' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const option = ref<any>(props.modelValue)
const dateList = ref([
  { label: '日期', value: 'date' },
  { label: '日期范围', value: 'daterange' },
  { label: '多个日期', value: 'dates' },
  { label: '日期时间', value: 'datetime' },
  { label: '日期时间范围', value: 'datetimerange' },
  { label: '年份', value: 'year' },
  { label: '年份范围', value: 'yearrange' },
  { label: '多个年份', value: 'years' },
  { label: '月份', value: 'month' },
  { label: '月份范围', value: 'monthrange' },
  { label: '多个月份', value: 'months' },
  { label: '周', value: 'week' }
])
const timeList = ref([
  { label: '时间', value: 'time' },
  { label: '时间范围', value: 'timerange' }
])
const formatObj = {
  year: 'YYYY',
  month: 'YYYY-MM',
  week: 'YYYY 第 ww 周',
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  datetime: 'YYYY-MM-DD HH:mm:ss'
}

const typeChange = (value) => {
  if (value) {
    const isRange = value.indexOf('range')
    let key = isRange ? value.replace('range', '') : value
    if (key[key.length - 1] === 's') key = key.substring(0, key.length - 1)
    option.value.format = formatObj[key]
    option.value.valueFormat = formatObj[key]
    option.value.value = isRange ? [] : ''
  }
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
</script>

<style lang="scss" scoped></style>
