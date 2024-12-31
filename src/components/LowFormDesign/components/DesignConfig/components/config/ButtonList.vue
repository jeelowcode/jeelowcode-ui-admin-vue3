<template>
  <div>
    <el-form-item label="按钮位置">
      <avue-radio v-model="option.params.location" button :dic="locationList"></avue-radio>
    </el-form-item>
    <div class="el-form-item el-form-item--small el-form--label-top block!">
      <div class="flex pb-10px text-14px">
        <span>按钮配置：</span>
        <div class="mt--1px">
          <el-button v-if="isSimplify" type="primary" text link @click="isSimplify = false">
            展开配置
          </el-button>
          <el-button v-else type="primary" text link @click="isSimplify = true">
            收起配置
          </el-button>
        </div>
      </div>
      <draggable
        tag="div"
        :list="option.params.buttonList"
        :group="{ name: 'buttonList' }"
        ghost-class="buttom-list-ghost"
        :animation="300"
        handle=".drag-item"
        item-key="id"
      >
        <template #item="{ element, index }">
          <div class="item-border mb-10px flex items-center text-12px">
            <Icon class="drag-item cursor-move" :size="18" icon="fluent:drag-20-regular" />
            <div class="ml-5px">
              <div class="btn-item" :style="{ marginBottom: isSimplify ? '0' : '5px' }">
                <div class="item-label">按钮名称</div>
                <el-input size="small" v-model="element.label" placeholder="按钮名称"></el-input>
              </div>
              <el-collapse-transition>
                <div v-show="!isSimplify">
                  <div class="btn-item">
                    <div class="item-label">按钮编码</div>
                    <el-input size="small" v-model="element.prop" placeholder="按钮编码"></el-input>
                  </div>
                  <div class="btn-item">
                    <div class="item-label">按钮图标</div>
                    <IconSelectInput v-model="element.icon" size="small"></IconSelectInput>
                  </div>
                  <div class="btn-item">
                    <div class="item-label">按钮类型</div>
                    <avue-select size="small" v-model="element.type" :dic="typeList"></avue-select>
                  </div>
                  <div class="btn-item items-start!">
                    <div class="item-label">按钮样式</div>
                    <div class="shape-list">
                      <el-checkbox
                        size="small"
                        v-for="item in shapeList"
                        :key="item.value"
                        v-model="element[item.value]"
                        >{{ item.label }}</el-checkbox
                      >
                    </div>
                  </div>
                  <div class="btn-item flex-wrap">
                    <el-checkbox size="small" v-model="element.display"> 可见 </el-checkbox>
                    <el-checkbox size="small" v-model="element.viewShow">
                      详情模式可见
                    </el-checkbox>
                    <el-checkbox size="small" v-model="element.btnLoading">
                      点击时开启loading
                    </el-checkbox>
                  </div>
                  <div class="btn-item">
                    <div class="item-label">事件配置</div>
                    <el-input
                      readonly
                      size="small"
                      v-model="element.configStr"
                      placeholder="事件配置"
                      @click="openBtnEditView(element, index)"
                    ></el-input>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
            <el-popconfirm title="是否确认删除?" @confirm="handleRemoveBtn(index)">
              <template #reference>
                <el-button
                  class="ml-10px h-18px! w-18px!"
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
    </div>

    <div class="pb-20px pl-20px">
      <el-button text link type="primary" @click="handleAddBtn"> 添加按钮 </el-button>
    </div>

    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #default>
        <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
      </template>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import useMEDialog from '@/hooks/design/useMEDialog'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigButtonList' })

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue', 'copy-text'])
const { example, parentData } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)
const isSimplify = ref(false)
const typeList = [
  { label: '默认', value: '' },
  { label: '主要', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' },
  { label: '信息', value: 'info' }
]
const locationList = [
  { label: '靠左', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '靠右', value: 'right' }
]
const shapeList = [
  { label: '朴素', value: 'plain' },
  { label: '文字', value: 'text' },
  { label: '链接', value: 'link' },
  { label: '圆角', value: 'round' },
  { label: '圆形', value: 'circle' }
]

const { MEDialog, MEData, openMEDialog } = useMEDialog()

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

const handleAddBtn = () => {
  const i = Math.ceil(Math.random() * 9999)
  option.value.params.buttonList.push({
    label: `按钮_${i}`,
    prop: `btn_${i}`,
    id: `btn_${i}`,
    icon: '',
    type: '',
    display: true,
    viewShow: false,
    btnLoading: true,
    configStr: ''
  })
}
const handleRemoveBtn = (index) => {
  option.value.params.buttonList.splice(index, 1)
}
const exampleObj = {
  configStr: example.buttonExample.replace(`type: 'primary',`, '')
}
const openBtnEditView = (btnItem, index) => {
  let providerType = 'defaultJsEnhance'
  const type = unref(parentData).type
  if (type == 'layoutTabs') providerType = 'formTabsEnhance'
  if (type == 'layoutTable') providerType = 'formTableEnhance'
  openMEDialog(
    {
      prop: 'configStr',
      label: `${btnItem.label} 事件配置`,
      params: {
        providerType,
        headerBtn: [
          {
            name: `复制配置示例`,
            icon: 'solar:copy-outline',
            clickFun: () => {
              emit('copy-text', exampleObj.configStr || '')
            },
            params: {
              size: 'small',
              type: 'primary'
            }
          }
        ]
      }
    },
    option.value.params.buttonList[index]
  )
}
onMounted(() => {
  if (!option.value.params.buttonList.length) handleAddBtn()
})
watch(
  () => option.value.params.buttonList.length,
  (val) => {
    if (val === 0) handleAddBtn()
  }
)
</script>

<style lang="scss" scoped>
.item-border {
  padding: 10px 5px;
  border: 1px solid #f1f1f1;

  .btn-item {
    display: flex;
    margin-bottom: 5px;
    align-items: center;

    .item-label {
      flex: 0 0 64px;
      font-size: 14px;
    }

    .shape-list {
      .el-checkbox {
        height: 20px;
        margin-right: 5px;

        :deep(.el-checkbox__label) {
          padding-left: 5px;
        }
      }
    }
  }
}
</style>
