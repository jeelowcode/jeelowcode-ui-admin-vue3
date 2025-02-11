<template>
  <div class="table-button">
    <div v-if="type == 'header'" class="header-button">
      <template v-for="btn in btnData.header" :key="btn.prop">
        <el-button
          :type="btn.type"
          :size="size"
          v-bind="btn.params"
          @click="menuLeftHandle(btn.prop)"
        >
          <Icon v-if="btn.icon" :size="getIconSize(btn.size)" :icon="btn.icon" />
          <span>{{ btn.label }}</span>
        </el-button>
      </template>
    </div>
    <div v-else class="menu-button flex justify-center flex-items-center">
      <template v-for="btn in btnData.menu" :key="btn.prop">
        <el-button
          :type="btn.type"
          :size="size"
          text
          v-bind="btn.params"
          @click="menuHandle({ type: btn.prop, row, index })"
        >
          <Icon v-if="btn.icon" :size="getIconSize(btn.size)" :icon="btn.icon" />
          <span>{{ btn.label }}</span>
        </el-button>
      </template>
      <span
        v-if="isMore"
        class="ml-8px mr-8px mt-2px inline-block h-16px w-1px bg-#e8e8e8 .dark:bg-[var(--el-border-color-dark)]"
      ></span>
      <el-dropdown @command="menuHandle" v-if="isMore">
        <div class="mt--2px cursor-pointer flex-basis-48px flex-shrink-0">
          <el-text :size="size" type="primary">
            更多
            <Icon class="ml--2px" :size="getIconSize() + 2" icon="iconamoon:arrow-down-2-light" />
          </el-text>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-for="btn in btnData.more" :key="btn.prop">
              <el-dropdown-item :command="{ type: btn.prop, row, index }">
                <div class="flex items-center">
                  <Icon v-if="btn.icon" :size="getIconSize(btn.size)" :icon="btn.icon" />
                  <span>{{ btn.label }}</span>
                </div>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
interface ButtonObj {
  header: Array<any>
  menu: Array<any>
}

interface Props {
  type: 'header' | 'menu' | 'more'
  size: '' | 'default' | 'small' | 'large'
  buttonObj: ButtonObj
  selectLength?: number
  row?: object
  index?: number
}
const props = defineProps<Props>()
const emit = defineEmits(['menu-handle', 'menu-left-handle'])

const btnData = computed(() => {
  if (props.type == 'header') {
    const headerObj = cloneDeep(props.buttonObj.header)
    const header: any = {}
    for (let key in headerObj) {
      if (key == 'batchDelBtn') headerObj[key].display = props.selectLength ? true : false
      if (!headerObj[key].display) continue
      header[key] = headerObj[key]
    }
    return { header }
  } else {
    const menuObj = cloneDeep(props.buttonObj.menu)
    const menu: any = {}
    const more: any = {}
    for (let key in menuObj) {
      if (props.row && props.row[`$btn__${key}`] !== undefined) {
        menuObj[key].display = props.row[`$btn__${key}`]
      }
      if (!menuObj[key].display) continue
      if (props.type == 'more' && Object.keys(menu).length == 1) more[key] = menuObj[key]
      else menu[key] = menuObj[key]
    }
    return { menu, more }
  }
})
const isMore = computed(() => {
  if (props.type == 'more') {
    let bool = false
    for (let key in btnData.value.more) {
      if (btnData.value.more[key].display) {
        bool = true
        break
      }
    }
    return bool
  }
  return false
})

const getIconSize = (size?) => {
  if (!size) size = props.size
  if (size == 'small') return 12
  else if (size == 'large') return 16
  else return 14
}

const menuHandle = (params) => {
  emit('menu-handle', params)
}
const menuLeftHandle = (type) => {
  emit('menu-left-handle', type)
}
</script>

<style lang="scss" scoped></style>
