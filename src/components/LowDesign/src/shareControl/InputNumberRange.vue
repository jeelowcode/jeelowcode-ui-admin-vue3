<template>
  <div class="flex flex-row! items-center">
    <div class="pos-relative!">
      <avue-input-number
        v-model="startNum"
        :placeholder="`开始${column.label}`"
        :min="column.min"
        :max="column.max"
        :step="column.step"
        :stepStrictly="column.stepStrictly"
        :precision="column.precision"
        :controls="true"
        controlsPosition="right"
        :size="size"
      ></avue-input-number>
    </div>
    <div class="px-5px">至</div>
    <div class="pos-relative!">
      <avue-input-number
        v-model="endNum"
        :placeholder="`结束${column.label}`"
        :min="endMin"
        :max="column.max"
        :step="column.step"
        :stepStrictly="column.stepStrictly"
        :precision="column.precision"
        :controls="true"
        controlsPosition="right"
        :size="size"
      ></avue-input-number>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'InputNumberRange' })

interface Column {
  label: string
  min?: number
  max?: number
  step?: number
  stepStrictly?: boolean
  precision?: number
  controls?: boolean
  controlsPosition?: 'right' | 'top' | ''
  placeholder?: string
}
interface Props {
  column: Column
  size?: 'small' | 'large' | 'default'
  disabled?: boolean
}
const props = defineProps<Props>()
const model = defineModel<string>()

const startNum = ref<number | null>(null)
const endNum = ref<number | null>(null)

const endMin = computed(() => {
  const isStart = startNum.value === null || (startNum.value !== null && isNaN(startNum.value))
  if (isStart) return props.column.min
  else return startNum.value
})

watch([() => startNum.value, () => endNum.value], (newVal) => {
  const isStart = newVal[0] === null || (newVal[0] !== null && isNaN(newVal[0]))
  const isEnd = newVal[1] === null || (newVal[1] !== null && isNaN(newVal[1]))
  const str = `${isStart ? null : newVal[0]},${isEnd ? null : newVal[1]}`
  model.value = str == 'null,null' ? '' : str
})

watch(
  () => model.value,
  (value, oldVal) => {
    if (value) {
      const numList = (value + '').split(',')
      startNum.value = numList[0] !== undefined ? Number(numList[0]) : null
      endNum.value = numList[1] !== undefined ? Number(numList[1]) : null
    } else {
      startNum.value = null
      endNum.value = null
    }
    if (oldVal !== undefined) {
      if (props.column['onChange']) props.column['onChange']({ value, column: props.column })
      else if (props.column['change']) props.column['change']({ value, column: props.column })
    }
  }
)
</script>

<style lang="scss" scoped></style>
