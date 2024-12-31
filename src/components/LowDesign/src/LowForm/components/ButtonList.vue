<template>
  <div :style="stlyeData">
    <template v-for="(item, index) in params.buttonList" :key="item.prop">
      <el-button
        :disabled="disabled && (type != 'view' || (type == 'view' && !item.viewShow))"
        :size="size"
        v-if="item.display && (type != 'view' || (type == 'view' && item.viewShow))"
        v-bind="btnParams[index] ? { ...item, ...btnParams[index] } : item"
        @click="handleClick(item, index)"
        icon=""
      >
        <span class="mr-3px" v-if="item.icon && !btnParams[index]?.loading">
          <Icon :size="14" :icon="item.icon" />
        </span>
        <span>{{ item.label }}</span>
      </el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue'

defineOptions({ name: 'ButtonList' })

interface Params {
  location: string
  buttonList: any[]
  clickObj: object
}
interface Props {
  params: Params
  type?: string
  disabled?: boolean
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  params: () => {
    return {
      location: 'left',
      buttonList: [],
      clickObj: {}
    }
  }
})
const btnParams = ref<any[]>([])

const emit = defineEmits(['execute-click'])

const stlyeData = computed(() => {
  return { textAlign: props.params.location } as CSSProperties
})

const handleClick = (btn, index) => {
  let clickStr = props.params.clickObj[btn.prop]
  if (!clickStr) return console.warn(btn.label + '未配置点击事件')
  btnParams.value = []
  if (btn.btnLoading) {
    props.params.buttonList.forEach(
      (item, i) => (btnParams.value[i] = { loading: false, disabled: true })
    )
    btnParams.value[index].loading = true
  }
  const loading = () => (btnParams.value = [])
  emit('execute-click', clickStr, { btn, loading }, `${btn.label}点击事件执行异常，请检查`)
}
</script>

<style lang="scss" scoped></style>
