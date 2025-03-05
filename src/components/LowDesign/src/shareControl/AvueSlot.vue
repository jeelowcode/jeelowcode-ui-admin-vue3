<template>
  <template v-if="control.controlType == 'userSelect'">
    <!-- 用户选择 -->
    <UserSelect
      ref="slotRef"
      v-model="model"
      :column="currColumn"
      :disabled="scope.disabled"
      :size="scope.size"
      :type="currFormType"
      :prop="control.prop"
      @set-form-data="setFormData"
    ></UserSelect>
  </template>
  <template v-else-if="control.controlType == 'deptSelect'">
    <!-- 部门选择 -->
    <DeptSelect
      ref="slotRef"
      v-model="model"
      :column="currColumn"
      :disabled="scope.disabled"
      :size="scope.size"
      :type="currFormType"
      :prop="control.prop"
      @set-form-data="setFormData"
    ></DeptSelect>
  </template>
  <template v-else-if="control.controlType == 'dicTableSelect'">
    <!-- 表格选择 -->
    <DicTableSelect
      ref="slotRef"
      v-model="model"
      :column="currColumn"
      :disabled="scope.disabled"
      :size="scope.size"
      :type="currFormType"
      :prop="control.prop"
      @set-form-data="setFormData"
    ></DicTableSelect>
  </template>
  <template v-else-if="control.controlType == 'monacoEditor'">
    <!-- 代码编辑器 -->
    <avue-input
      ref="slotRef"
      v-model="model"
      :disabled="scope.disabled"
      :size="scope.size"
      :placeholder="scope.column.placeholder || `请输入 ${scope.column.label}`"
      readonly
      @click="control.click ? control.click(scope) : ''"
    ></avue-input>
  </template>
  <template v-else-if="control.controlType == 'markDown'">
    <MarkDown
      ref="slotRef"
      v-model="model"
      :column="currColumn"
      :disabled="scope.disabled"
      :type="currFormType"
      :prop="control.prop"
    ></MarkDown>
  </template>
  <template v-else-if="['image', 'file'].includes(control.controlType)">
    <!-- 图片、文件 -->
    <TableCellUpload
      ref="slotRef"
      :row="scope.row"
      :index="scope.index"
      :column="currColumn"
      :type="currFormType"
      :setCellData="control?.setCellData"
    ></TableCellUpload>
  </template>
  <template v-else-if="control.controlType == 'customControl'">
    <!-- 自定义控件 -->
    <component
      ref="slotRef"
      :is="control.getComponent ? control.getComponent(scope.column.componentKey) : ''"
      v-model="model"
      v-bind="scope.column.params || {}"
      :column="currColumn"
      :disabled="scope.disabled"
      :size="scope.size"
      :prop="control.prop"
      :type="currFormType"
    ></component>
  </template>
  <template v-else-if="control.controlType == 'buttonList'">
    <!-- 自定义按钮组 -->
    <ButtonList
      ref="slotRef"
      :params="scope.column.params"
      :disabled="scope.disabled"
      :size="scope.size"
      :type="currFormType"
      @execute-click="
        (clickStr, obj, errorTip) => (control.click ? control.click(clickStr, obj, errorTip) : '')
      "
    ></ButtonList>
  </template>
  <template v-else-if="control.controlType == 'comboBox'">
    <ComboBox
      ref="slotRef"
      v-model="model"
      :column="currColumn"
      :disabled="scope.disabled"
      :size="scope.size"
      :type="currFormType"
      :prop="control.prop"
      :control="control"
    ></ComboBox>
  </template>
  <template v-else-if="slotType == 'search' && control.controlType == 'number'">
    <input-number-range
      v-model="model"
      :column="currColumn"
      :disabled="scope.disabled"
      :size="scope.size"
    ></input-number-range>
  </template>

  <template v-else> <div></div> </template>
</template>

<script setup lang="ts">
defineOptions({ name: 'AvueSlot' })

interface Control {
  controlType: string
  prop: string
  placeholder?: string
  column?: object
  click?: Function
  getComponent?: Function
  setCellData?: Function
}

interface Props {
  slotType: 'search' | 'list' | 'form'
  formType?: string
  control: Control
  scope: any
}
const props = defineProps<Props>()

const model = defineModel<any>()
const emit = defineEmits(['set-form-data'])
const slotRef = ref()

const currFormType = computed(() => {
  if (props.slotType == 'search') return 'add'
  if (props.slotType == 'list') return 'view'
  return props.formType || props.scope.type
})

const currColumn = computed(() => {
  if (['userSelect', 'deptSelect', 'dicTableSelect'].includes(props.control.controlType)) {
    if (props.slotType == 'search' && props.control) {
      return Object.assign(props.scope.column, props.control.column || {})
    }
  }
  return props.scope.column
})

const setFormData = (prop, value) => {
  emit('set-form-data', prop, value)
}

defineExpose({ slotRef })
</script>

<style lang="scss" scoped></style>
