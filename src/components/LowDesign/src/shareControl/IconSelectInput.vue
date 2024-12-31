<template>
  <div class="icon-select-box" ref="iconRef">
    <el-popover :disabled="disabled" :width="600" trigger="click" @show="popHandleShow">
      <template #reference>
        <el-input
          :placeholder="column?.placeholder"
          v-model="model"
          :size="size"
          ref="main"
          :clearable="disabled ? false : true"
          :disabled="disabled"
        >
          <template #append>
            <div v-if="model" class="flex items-center">
              <Icon :size="14" :icon="model" />
            </div>
            <div v-else class="min-w-14px"></div>
          </template>
        </el-input>
      </template>
      <el-tabs v-model="tabsValue" class="demo-tabs">
        <el-tab-pane
          v-for="item in iconList"
          :label="item.label"
          :name="item.prop"
          :key="item.prop"
        >
          <template v-if="item.prop !== 'iconifyDesign'">
            <el-input v-model="searchText" placeholder="输入图标名称 搜索" class="mb-5px">
              <template #prefix>
                <Icon :size="14" icon="el:search"></Icon>
              </template>
            </el-input>
            <div
              class="grid grid-cols-6 gap-x-10px text-center overflow-y-auto overflow-x-hidden"
              :style="{ height: iconListHeight + 'px' }"
            >
              <div
                v-for="child in item.list"
                :key="child.value"
                class="icon-box"
                @click="model = child.value"
              >
                <Icon :size="28" :icon="child.value" />
                <div class="text-12px min-h-30px" style="word-break: break-word">
                  {{ child.label }}
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="px-20px pb-20px pt-10px">
              <el-link href="https://icon-sets.iconify.design" target="_blank" type="primary">
                <span>点击前往图标库获取图标名称</span>
                <Icon :size="14" icon="el:pointer"></Icon>
              </el-link>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import iconData from '../utils/iconData'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'IconSelectInput' })

interface Column {
  label: string
  readonly?: boolean
  placeholder?: string
}
interface Props {
  column?: Column
  prop?: string
  size?: '' | 'default' | 'small' | 'large'
  disabled?: boolean
}

defineProps<Props>()
const model = defineModel<string>()

const tabsValue = ref('elementPlus')
const iconRef = ref()
const iconListHeight = ref(120)
const searchText = ref('')

const iconList = computed(() => {
  if (searchText.value) {
    const regExp = new RegExp(searchText.value, 'i')
    return cloneDeep(iconData).map((item) => {
      if (item.prop == tabsValue.value && item.list.length) {
        item.list = item.list.filter((child) => regExp.test(child.label))
      }
      return item
    })
  }
  return iconData
})

const popHandleShow = () => {
  const rect = iconRef.value.getBoundingClientRect()
  const wHeight = document.documentElement.clientHeight
  const h = wHeight - rect.top - 170
  iconListHeight.value = h > 200 ? h : 200
}
</script>

<style lang="scss" scoped>
.icon-box {
  display: flex;
  height: 75px;
  padding: 10px 5px 0;
  cursor: pointer;
  border: 1px solid #fff;
  border-radius: 5px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--el-color-primary);
    border-color: #f1f1f1;
  }
}
</style>
