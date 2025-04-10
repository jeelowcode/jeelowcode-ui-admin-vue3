<template>
  <div>
    <el-form-item>
      <div class="w-100% flex gap-x-5px">
        <div class="flex-1">
          <div>表头对齐方式</div>
          <avue-select v-model="option.params.headerAlign" :dic="alignList"></avue-select>
        </div>
        <div class="flex-1">
          <div>文本对齐方式</div>
          <avue-select v-model="option.params.align" :dic="alignList"></avue-select>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="表格操作类型">
      <avue-radio v-model="option.tableType" :dic="typeList"></avue-radio>
    </el-form-item>
    <el-form-item label="操作配置">
      <el-checkbox :key="option.prop" v-model="option.params.index"> 显示序号 </el-checkbox>
      <el-checkbox v-model="option.params.selection"> 可选择 </el-checkbox>
      <el-checkbox v-model="option.params.border"> 纵向边框 </el-checkbox>
      <el-checkbox :key="option.prop" v-model="option.params.stripe"> 斑马纹样式 </el-checkbox>
    </el-form-item>
    <el-form-item label="操作列宽度">
      <el-input-number v-model="option.params.menuWidth" placeholder="操作列宽度"></el-input-number>
    </el-form-item>
    <el-form-item label="表格增强配置">
      <el-input
        v-model="option.tableEnhanceStr"
        readonly
        placeholder="表格增强配置"
        @click="openEditView('tableEnhanceStr', '表格增强配置')"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <template #label>
        <div class="flex pb-10px text-14px">
          <span>
            <span class="pr-2px">自定义按钮</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="按钮编码不能以 addBtn/editBtn/delBtn/batchDelBtn 命名"
              placement="top"
            >
              <Icon :size="12" icon="ep:info-filled"></Icon>
            </el-tooltip>

            <span> ：</span>
          </span>
          <div class="mt--1px">
            <el-button v-if="isSimplify" type="primary" text link @click="isSimplify = false">
              展开配置
            </el-button>
            <el-button v-else type="primary" text link @click="isSimplify = true">
              收起配置
            </el-button>
          </div>
        </div>
      </template>
      <el-tabs class="w-100%" v-model="tabsValue" stretch>
        <el-tab-pane
          v-for="tabItem in tabsList"
          :key="tabItem.prop"
          :label="tabItem.label"
          :name="tabItem.prop"
        >
          <div class="ml-28px mt-2px flex items-center">
            <span>默认按钮：</span>
            <el-checkbox v-model="option.params.addBtn" v-if="tabItem.prop == 'header'">
              新增
            </el-checkbox>
            <el-checkbox v-model="option.params.delBtn" v-if="tabItem.prop == 'menu'">
              删除
            </el-checkbox>
            <el-checkbox
              v-model="option.params.editBtn"
              v-if="tabItem.prop == 'menu' && option.tableType == 'formEdit'"
            >
              编辑
            </el-checkbox>
          </div>
          <draggable
            tag="div"
            :list="option.btnData[tabItem.prop]"
            :group="{ name: tabItem.prop }"
            ghost-class="btn-tab-ghost"
            :animation="300"
            handle=".drag-item"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div class="item-border mb-10px flex items-center text-12px">
                <Icon class="drag-item cursor-move" :size="18" icon="fluent:drag-20-regular" />
                <div class="ml-10px">
                  <div class="btn-item">
                    <div class="item-label">按钮名称</div>
                    <el-input
                      size="small"
                      v-model="element.label"
                      placeholder="按钮名称"
                    ></el-input>
                  </div>
                  <el-collapse-transition>
                    <div v-show="!isSimplify">
                      <div class="btn-item">
                        <div class="item-label">按钮编码</div>
                        <el-input
                          size="small"
                          v-model="element.prop"
                          placeholder="按钮编码"
                        ></el-input>
                      </div>
                      <div class="btn-item">
                        <div class="item-label">按钮图标</div>
                        <IconSelectInput v-model="element.icon" size="small"></IconSelectInput>
                      </div>
                      <div class="btn-item">
                        <div class="item-label">按钮配置</div>
                        <el-input
                          readonly
                          size="small"
                          v-model="element.configStr"
                          placeholder="按钮配置"
                          @click="openBtnEditView(element, index, tabItem.prop)"
                        ></el-input>
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
                    </div>
                  </el-collapse-transition>
                </div>

                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="handleRemoveBtn(index, tabItem.prop)"
                >
                  <template #reference>
                    <el-button
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
            <el-button text link type="primary" @click="handleAddBtn(tabItem.prop)">
              添加按钮
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
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

defineOptions({ name: 'ConfigLayoutTable' })

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType
const option = ref<any>(props.modelValue)
const tabsValue = ref('header')
const isSimplify = ref(false)
const tabsList = [
  { label: '表格头部按钮', prop: 'header' },
  { label: '操作列按钮', prop: 'menu' }
]
const alignList = [
  { label: '左对齐', value: 'left' },
  { label: '居中对齐', value: 'center' },
  { label: '右对齐', value: 'right' }
]
const typeList = [
  { label: '行编辑', value: 'cellEdit' },
  { label: '表单编辑', value: 'formEdit' }
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

const handleAddBtn = (prop) => {
  const i = Math.ceil(Math.random() * 9999)
  option.value.btnData[prop].push({
    label: `按钮_${i}`,
    prop: `btn_${i}`,
    id: `btn_${i}`,
    icon: '',
    display: true,
    viewShow: false,
    configStr: ''
  })
}
const handleRemoveBtn = (index, prop) => {
  option.value.btnData[prop].splice(index, 1)
}
const exampleObj = {
  tableEnhanceStr: example.tableEnhanceExample,
  configStr: example.buttonExample,
  configMenuStr: example.formTableMenuButtonExample
}

const openEditView = (prop, label) => {
  let params = {
    providerType: 'formTableEnhance',
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
const openBtnEditView = (btnItem, index, tabProp?) => {
  openMEDialog(
    {
      prop: 'configStr',
      label: `${btnItem.label}  按钮配置`,
      params: {
        providerType: 'formTableEnhance',
        headerBtn: [
          {
            name: `复制配置示例`,
            icon: 'solar:copy-outline',
            clickFun: () => {
              emit(
                'copy-text',
                tabProp == 'menu' ? exampleObj.configMenuStr : exampleObj.configStr || ''
              )
            },
            params: {
              size: 'small',
              type: 'primary'
            }
          }
        ]
      }
    },
    option.value.btnData[tabsValue.value][index]
  )
}
</script>

<style lang="scss" scoped>
.item-border {
  padding: 10px 5px;
  border: 1px solid #f1f1f1;

  .btn-item {
    display: flex;
    margin-bottom: 5px;

    & > div {
      display: flex;
    }

    .item-label {
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      flex: 0 0 64px;
    }
  }
}

:deep(.el-tabs) {
  margin-top: -12px;

  .el-tabs__header {
    margin-bottom: 0;
  }
}
</style>
