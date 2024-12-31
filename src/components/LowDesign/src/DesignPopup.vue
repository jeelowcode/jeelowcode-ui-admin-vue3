<template>
  <component
    :is="getComponent"
    v-model="model"
    :width="width"
    :size="width"
    :fullscreen="isFull"
    :before-close="handleClose"
    :append-to-body="true"
    :show-close="false"
    :draggable="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    top="10vh"
    class="avue-dialog"
    :class="[{ footer: footerBtn.length || isFooter }, `design-${controlType}`]"
    :style="popupStyle"
    v-bind="dialogParams || {}"
  >
    <template #header="{ close }">
      <div class="relative h-24px flex items-center p-0">
        <div class="el-dialog__title" v-html="title"></div>
        <div class="ml-20px" v-if="headerBtn.length || isHeader">
          <template v-for="(item, index) in headerBtn" :key="index">
            <el-button
              v-if="item.display !== false"
              v-bind="
                btnParams.headerBtn[index]
                  ? { ...(item.params || {}), ...btnParams.headerBtn[index] }
                  : item.params
              "
              @click="executeClick('headerBtn', index)"
            >
              <span v-if="item.icon" v-show="!btnParams.headerBtn[index]?.loading" class="mr-3px">
                <Icon :size="14" :icon="item.icon" />
              </span>
              <span>{{ item.name }}</span>
            </el-button>
          </template>
          <slot name="header"></slot>
        </div>
        <div
          class="absolute right-6px top-[50%] h-24px flex translate-y-[-50%] items-center justify-between"
        >
          <Icon
            v-if="controlType == 'dialog' && showFull"
            class="is-hover mr-6px cursor-pointer"
            :icon="isFull ? 'radix-icons:exit-full-screen' : 'radix-icons:enter-full-screen'"
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            @click="isFull = !isFull"
          />
          <Icon
            v-if="dialogParams?.['showClose'] !== false"
            class="is-hover cursor-pointer"
            icon="ep:close"
            hover-color="var(--el-color-primary)"
            color="var(--el-color-info)"
            @click="close"
          />
        </div>
      </div>
    </template>
    <div :style="bodyStyle">
      <slot :isFull="isFull"></slot>
    </div>
    <template #footer v-if="footerBtn.length || isFooter">
      <div class="avue-dialog__footer avue-dialog__footer--right">
        <template v-for="(item, index) in footerBtn" :key="index">
          <el-button
            v-if="item.display !== false"
            v-bind="
              btnParams.footerBtn[index]
                ? { ...(item.params || {}), ...btnParams.footerBtn[index] }
                : item.params
            "
            @click="executeClick('footerBtn', index)"
          >
            <span v-if="item.icon" v-show="!btnParams.footerBtn[index]?.loading" class="mr-3px">
              <Icon :size="14" :icon="item.icon" />
            </span>
            <span>{{ item.name }}</span>
          </el-button>
        </template>
        <slot name="footer"></slot>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { designPopup } from './types/designPopup'
defineOptions({ name: 'DesignPopup' })

const props = withDefaults(defineProps<designPopup>(), {
  title: '',
  width: '80%',
  controlType: 'dialog',
  fullscreen: false,
  showFull: true,
  isBodyFull: false,
  isFooter: false,
  isHeader: false,
  headerBtn: () => [],
  footerBtn: () => []
})

const model = defineModel({ default: false, type: Boolean })
const isFull = defineModel('isFull', { type: Boolean, default: false })

const btnParams = ref<any>({
  headerBtn: [],
  footerBtn: []
})

const getComponent = computed(() => {
  return props.controlType === 'dialog' ? 'ElDialog' : 'ElDrawer'
})
const popupStyle = computed(() => {
  const styleObj: any = {}
  if (props.controlType == 'dialog') {
    if (isFull.value) styleObj.maxHeight = '100%'
    else {
      let top = '10vh'
      if (props.dialogParams && props.dialogParams['top']) top = props.dialogParams['top']
      styleObj.maxHeight = `calc(100vh - ${top} - 50px)`
    }
  }
  return styleObj
})
const bodyStyle = computed(() => {
  const styleObj: any = {}
  let num = 0
  if (props.isFooter || (props.footerBtn && props.footerBtn.length)) num = num + 53
  if (props.controlType == 'dialog') {
    if (isFull.value) styleObj.height = '100%'
    else {
      if (props.isBodyFull) {
        num = num + 107
        let top = '10vh'
        if (props.dialogParams && props.dialogParams['top']) top = props.dialogParams['top']
        styleObj.height = `calc(100vh - ${top} - ${num}px)`
      }
    }
  } else if (props.controlType == 'drawer' && props.isBodyFull) {
    num = num + 57
    styleObj.height = `calc(100vh - ${num}px)`
  }
  return styleObj
})

const executeClick = (currBtnKey, index) => {
  let { loading, clickFun } = props[currBtnKey][index]
  btnParams.value = { headerBtn: [], footerBtn: [] }
  if (loading === true) {
    for (const btnKey in btnParams.value) {
      props[btnKey].forEach((item, index) => {
        btnParams.value[btnKey][index] = { loading: false, disabled: true }
      })
    }
    btnParams.value[currBtnKey][index].loading = true
    clickFun(() => {
      btnParams.value = { headerBtn: [], footerBtn: [] }
    })
  } else clickFun()
}

watch(
  () => model.value,
  (val) => {
    if (val) isFull.value = props.fullscreen
  }
)
</script>

<style lang="scss">
.design-dialog {
  padding: 0;

  .el-dialog__header {
    padding-right: 10px;
    margin-right: 0;
  }

  .el-dialog__body {
    padding: 0;
    overflow: hidden auto;
  }

  &.footer {
    .el-dialog__footer {
      padding: 26px;
    }
  }
}

.design-drawer {
  .el-drawer__header {
    .el-dialog__title {
      font-size: 18px !important;
    }
  }

  .el-drawer__body {
    padding: 0;

    & > div {
      height: 100%;
    }
  }
}
</style>
