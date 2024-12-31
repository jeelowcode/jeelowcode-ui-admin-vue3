<template>
  <!-- 自定义控件例子 -->
  <div class="low-form-comboBox" :class="{ view: props.type == 'view' }">
    <el-row class="flex-nowrap pos-relative">
      <template v-for="(value, key) in column.column" :key="key">
        <el-col
          :md="value.span"
          :offset="value.offset"
          :class="[value.className, { is_danger: errorObj[value.prop] }]"
        >
          <template v-if="['input', 'password'].includes(value.type)">
            <avue-input
              v-model="model[key]"
              v-bind="{
                placeholder: `请输入 ${value.label}`,
                ...value,
                className: '',
                column: value,
                ...allBind
              }"
              :onBlur="handleBlur"
              :onChange="handleChange"
            ></avue-input>
          </template>
          <template v-if="value.type == 'number'">
            <avue-input-number
              v-model="model[key]"
              v-bind="{
                placeholder: `请输入 ${value.label}`,
                ...value,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-input-number>
          </template>
          <template v-if="value.type == 'select'">
            <avue-select
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                dic: value.dicData,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-select>
          </template>
          <template v-if="value.type == 'tree'">
            <avue-input-tree
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                dic: value.dicData,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-input-tree>
          </template>
          <template v-if="value.type == 'cascader'">
            <avue-cascader
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                dic: value.dicData,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-cascader>
          </template>
          <template v-if="value.type == 'map'">
            <avue-input-map
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-input-map>
          </template>
          <template v-if="value.type == 'color'">
            <avue-input-color
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-input-color>
          </template>
          <template
            v-if="
              [
                'date',
                'daterange',
                'dates',
                'datetime',
                'datetimerange',
                'year',
                'yearrange',
                'years',
                'month',
                'monthrange',
                'months',
                'week'
              ].includes(value.type)
            "
          >
            <avue-date
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-date>
          </template>
          <template v-if="['time', 'timerange'].includes(value.type)">
            <avue-time
              v-model="model[key]"
              v-bind="{
                placeholder: `请选择 ${value.label}`,
                ...value,
                className: '',
                column: value,
                ...allBind
              }"
            ></avue-time>
          </template>
          <template v-else>
            <AvueSlot
              slotType="form"
              :scope="{ column: value, disabled, size, type, ...allBind }"
              :control="{ ...control, prop: value.prop, controlType: value.type }"
              :formType="type"
              v-model="model[key]"
            ></AvueSlot>
          </template>
          <div
            v-if="errorObj[value.prop]"
            class="pos-absolute text-12px h-16px lh-16px flex left-0 top-100% c-[var(--el-color-danger)]"
            >{{ errorObj[value.prop] }}</div
          >
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getNetworkDicData } from '../../utils/util'
defineOptions({ name: 'ComboBox' })

interface Column {
  column: any[]
}
interface Props {
  column: Column
  prop: string
  type: string
  size?: 'small' | 'large' | 'default'
  disabled?: boolean
  control?: object
}
const props = defineProps<Props>()
const model = defineModel({ type: Object, default: {} })
const errorObj = ref<any>({})

const emit = defineEmits(['update:modelValue'])

const allBind = computed(() => {
  if (props.type == 'view') {
    return { disabled: true, readonly: true }
  }
  return {}
})

const handleBlur = (event) => {
  handleRules(event, 'blur')
  if (event.column.onBlur) event.column.onBlur(event)
}
const handleChange = (event) => {
  handleRules(event, 'change')
  if (event.column.onChange) event.column.onChange(event)
}

const handleRules = (event, trigger?) => {
  return new Promise((resolve) => {
    const rules = event.column.rules
    const promiseArr: any[] = []
    if (rules?.length) {
      rules.forEach((rule) => {
        if (!trigger || rule.trigger == trigger) {
          if (rule.pattern) {
            promiseArr.push(
              new Promise((res, rej) => {
                if (rule.pattern?.test(event.value)) res(true)
                else rej(rule.message)
              })
            )
          }
          if (rule.validator) {
            promiseArr.push(
              new Promise((res, rej) => {
                rule.validator(rule, event.value, (error) => {
                  if (error && error.name == 'Error') {
                    rej(error.message)
                  } else res(true)
                })
              })
            )
          }
        }
      })
    } else {
      errorObj.value[event.column.prop] = ''
      resolve(true)
      return
    }
    Promise.all(promiseArr)
      .then(() => {
        errorObj.value[event.column.prop] = ''
        resolve(true)
      })
      .catch((err) => {
        errorObj.value[event.column.prop] = err
        resolve(false)
      })
  })
}

const validate = () => {
  return new Promise(async (resolve) => {
    const promiseArr: any[] = []
    for (const prop in props.column.column) {
      const column = props.column.column[prop]
      promiseArr.push(handleRules({ column, value: model.value[column.prop] }))
    }
    const resList = await Promise.all(promiseArr)
    resolve(!resList.includes(false))
  })
}

watch(
  () => model.value,
  (val) => {
    if (!val) model.value = {}
  },
  { immediate: true }
)
onMounted(() => {
  for (const key in props.column.column) {
    const item = props.column.column[key]
    if (item.dicUrl) {
      getNetworkDicData(item).then((list) => {
        item.dicData = list
      })
    }
  }
})

defineExpose({ validate })
</script>

<style lang="scss" scoped>
.low-form-comboBox {
  padding-right: 1px;
  box-sizing: border-box;

  :deep(.el-col) {
    &.control-input,
    &.control-number,
    &.control-password,
    &.control-buttonList,
    &.control-select,
    &.control-tree,
    &.control-cascader,
    &.control-regionSelect,
    &.control-userSelect,
    &.control-deptSelect,
    &.control-dicTableSelect,
    &.control-map,
    &.control-color,
    &.control-date,
    &.control-time {
      .el-input__wrapper,
      .el-select__wrapper,
      .el-button,
      .user-input,
      .dept-input,
      .table-input {
        margin-right: -1px;
        border-radius: 0;
      }

      &:nth-last-child(1) {
        .el-input__wrapper,
        .el-select__wrapper,
        .user-input,
        .dept-input,
        .table-input,
        .el-button:nth-last-child(1),
        .el-input-number__increase {
          border-top-right-radius: var(--el-border-radius-base);
          border-bottom-right-radius: var(--el-border-radius-base);
        }

        .el-input.el-input-group--append {
          .el-input-group__append {
            border-top-right-radius: var(--el-border-radius-base);
            border-bottom-right-radius: var(--el-border-radius-base);
          }

          .el-input__wrapper,
          .el-input-group__prepend {
            margin-right: 0;
            border-radius: 0;
          }
        }
      }

      &:nth-child(1) {
        .el-input__wrapper,
        .el-select__wrapper,
        .el-button,
        .user-input,
        .dept-input,
        .table-input,
        .el-input-number__decrease {
          border-bottom-left-radius: var(--el-border-radius-base);
          border-top-left-radius: var(--el-border-radius-base);
        }

        .el-input.el-input-group--prepend {
          .el-input-group__prepend {
            border-bottom-left-radius: var(--el-border-radius-base);
            border-top-left-radius: var(--el-border-radius-base);
          }

          .el-input__wrapper {
            margin-right: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
          }
        }
      }

      .el-input-number__increase {
        margin-right: -1px;
      }

      .el-input-number__increase,
      .el-input-number__decrease {
        height: calc(100% - 3px);
      }
    }

    &.control-input > div,
    &.control-number > div,
    &.control-password > div,
    &.control-cascader,
    &.control-regionSelect,
    .control-map {
      display: flex;
    }

    &.control-buttonList > div {
      display: flex;
      width: 100%;

      .el-button {
        padding: 0;
        text-align: center;
        border-radius: 0;
        flex: 1;
      }

      .el-button + .el-button {
        margin-left: 0;
      }
    }

    & > div > .el-input {
      width: 100%;
    }

    .el-input__wrapper,
    .el-select__wrapper,
    .user-input,
    .dept-input,
    .table-input {
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }

    &.is_danger {
      .el-input__wrapper,
      .el-select__wrapper,
      .user-input,
      .dept-input,
      .table-input {
        box-shadow: 0 0 0 1px var(--el-color-danger) inset;
      }
    }
  }

  &.view {
    .el-row {
      border: 0;

      .el-col {
        border: 0;
      }
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
    }

    :deep(.avue-input) {
      margin-top: 0 !important;
    }
  }
}
</style>
