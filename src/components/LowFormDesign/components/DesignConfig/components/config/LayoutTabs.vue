<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="12" :xs="24">
        <el-form-item label="风格类型">
          <avue-select
            v-model="option.params.type"
            placeholder="风格类型"
            :dic="typeList"
          ></avue-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :xs="24">
        <el-form-item label="选项卡位置">
          <avue-select
            v-model="option.params.tabPosition"
            placeholder="选项卡位置"
            :dic="positionList"
          ></avue-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="选项卡增强配置">
      <el-input
        v-model="option.tabsEnhanceStr"
        readonly
        placeholder="选项卡增强配置"
        @click="openEditView('tabsEnhanceStr', '选项卡增强配置')"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <template #label>
        <div class="flex">
          <div>选项卡数据配置：</div>
          <div class="mt--2px">
            <el-button v-if="isSimplify" type="primary" text link @click="isSimplify = false">
              展开配置
            </el-button>
            <el-button v-else type="primary" text link @click="isSimplify = true">
              收起配置
            </el-button>
          </div>
        </div>
      </template>
      <draggable
        tag="div"
        :list="option.column"
        :group="{ name: 'tabsdic' }"
        ghost-class="tabs-ghost"
        :animation="300"
        handle=".drag-item"
        item-key="id"
        @end="handleAddGroupColumn"
      >
        <template #item="{ element, index }">
          <div class="mb-10px flex items-center text-12px">
            <Icon class="drag-item cursor-move" :size="18" icon="fluent:drag-20-regular" />
            <div>
              <div class="mb-2px flex">
                <div class="ml-10px mr-10px w-60px">tab名称</div>
                <el-input v-model="element.label" placeholder="tab名称"></el-input>
              </div>
              <el-collapse-transition>
                <div v-show="!isSimplify">
                  <div class="flex">
                    <div class="ml-10px mr-10px w-60px">绑定key</div>
                    <el-input v-model="element.prop" placeholder="绑定key"></el-input>
                  </div>
                  <el-checkbox class="ml-62px" size="small" v-model="element.display">
                    可见
                  </el-checkbox>
                </div>
              </el-collapse-transition>
            </div>

            <el-popconfirm title="是否确认删除?" @confirm="handleRemoveTab(index)">
              <template #reference>
                <el-button
                  v-if="option.column.length > 1"
                  class="ml-10px h-22px! w-22px!"
                  circle
                  plain
                  type="danger"
                  icon="el-icon-minus"
                ></el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </draggable>
      <div class="ml-28px">
        <el-button type="primary" text link @click="handleAddTab">添加选项卡</el-button>
      </div>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigLayoutTabs' })

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType
const option = ref<any>(props.modelValue)
const typeList = [
  { label: '默认', value: '' },
  { label: '卡片风格', value: 'card' },
  { label: '边框卡片风格', value: 'border-card' }
]
const isSimplify = ref(false)
const positionList = [
  { label: '上', value: 'top' },
  { label: '下', value: 'bottom' },
  { label: '左', value: 'left' },
  { label: '右', value: 'right' }
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

const handleAddTab = () => {
  const code = Math.ceil(Math.random() * 9999)
  option.value.column.push({
    type: 'tab',
    id: new Date().getTime() + Math.ceil(Math.random() * 999999),
    label: '选项卡' + code,
    prop: 'tab_' + code,
    display: true,
    column: []
  })
}
const handleRemoveTab = (index) => {
  option.value.column.splice(index, 1)
}
const handleAddGroupColumn = () => {
  //处理拖拽排序后界面tabs不更新问题
  option.value.column.push({ label: '更新', value: '更新' })
  setTimeout(() => {
    option.value.column.splice(option.value.column.length - 1, 1)
  }, 0)
  return true
}

const exampleObj = {
  tabsEnhanceStr: example.tabsEnhanceExample
}
const openEditView = (prop, label) => {
  let params = {
    providerType: 'formTabsEnhance',
    headerBtn: [
      {
        name: `复制配置示例`,
        icon: 'solar:copy-outline',
        clickFun: () => {
          emit('copy-text', exampleObj[prop] || '')
        },
        params: { size: 'small', type: 'primary' }
      }
    ]
  }
  emit('open-med', { prop, label, params })
}
</script>

<style lang="scss" scoped></style>
