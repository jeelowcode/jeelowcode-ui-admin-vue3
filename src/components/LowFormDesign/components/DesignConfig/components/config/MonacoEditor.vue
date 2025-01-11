<template>
  <el-form-item label="编辑器语言">
    <avue-select
      v-model="option.params.language"
      placeholder="请选择 编辑器语言"
      :dic="languageList"
    ></avue-select>
  </el-form-item>
  <el-form-item label="默认值">
    <el-input
      v-model="option.value"
      readonly
      placeholder="默认值"
      @click="openEditView('value', '默认值')"
    ></el-input>
  </el-form-item>
  <el-form-item label="编辑器弹窗宽度">
    <avue-input
      class="w-100%"
      v-model="option.params.width"
      placeholder="80%"
      :dic="languageList"
    ></avue-input>
  </el-form-item>
  <el-form-item label="操作配置">
    <el-checkbox v-model="option.params.fullscreen"> 编辑器弹窗全屏显示 </el-checkbox>
  </el-form-item>
  <div class="el-form-item el-form-item--small el-form--label-top flex flex-col">
    <div class="flex pb-10px text-14px">
      <span>编辑器弹窗自定义按钮：</span>
      <div class="mt--1px">
        <el-button v-if="isSimplify" type="primary" text link @click="isSimplify = false">
          展开配置
        </el-button>
        <el-button v-else type="primary" text link @click="isSimplify = true"> 收起配置 </el-button>
      </div>
    </div>
    <div class="el-form-item__content w-100%">
      <el-tabs class="w-100%" v-model="tabsValue" stretch>
        <el-tab-pane
          v-for="tabItem in tabsList"
          :key="tabItem.prop"
          :label="tabItem.label"
          :name="tabItem.prop"
        >
          <draggable
            tag="div"
            :list="option.params[tabItem.prop]"
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
                    <el-input size="small" v-model="element.name" placeholder="按钮名称"></el-input>
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
                          @click="openBtnEditView(element, index)"
                        ></el-input>
                      </div>
                      <div class="btn-item">
                        <el-checkbox size="small" v-model="element.display"> 可见 </el-checkbox>
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
            <el-button text link type="primary" @click="handleAddBtn(tabItem.prop)"
              >添加按钮</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-form-item label="MonacoEditor配置">
    <div class="mb-4px flex items-center text-12px">
      <div>配置请参考：</div>
      <a
        class="el-link el-link--primary is-underline"
        href="https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html"
        target="_blank"
      >
        <span class="el-link__inner h-18px text-12px">Monaco Editor文档</span>
      </a>
    </div>
    <el-input
      v-model="option.editorOptionStr"
      readonly
      placeholder="MonacoEditor配置"
      @click="openEditView('editorOptionStr', 'MonacoEditor配置')"
    ></el-input>
  </el-form-item>
  <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
    <template #default>
      <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
    </template>
  </DesignPopup>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import useMEDialog from '@/hooks/design/useMEDialog'
import { MonacoEditor } from '@/components/MonacoEditor/index'
import { lowFormDesignKey, lowFormDesignType } from '@/utils/symbols'

defineOptions({ name: 'ConfigMonacoEditor' })

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['update:modelValue', 'open-med', 'copy-text'])
const { example, parentData } = inject<lowFormDesignType>(lowFormDesignKey) as lowFormDesignType

const option = ref<any>(props.modelValue)
const languageList = ref([
  { label: 'JavaScript', value: 'javascript' },
  { label: 'SCSS', value: 'scss' },
  { label: 'JSON', value: 'json' },
  { label: 'MySQL', value: 'mysql' }
])
const tabsValue = ref('headerBtn')
const isSimplify = ref(false)
const tabsList = [
  { label: '弹窗顶部按钮', prop: 'headerBtn' },
  { label: '弹窗底部按钮', prop: 'footerBtn' }
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

const handleRemoveBtn = (index, prop) => {
  option.value.params[prop].splice(index, 1)
}
const handleAddBtn = (prop) => {
  const i = Math.ceil(Math.random() * 9999)
  option.value.params[prop].push({
    name: `按钮_${i}`,
    prop: `btn_${i}`,
    id: `btn_${i}`,
    icon: '',
    display: true,
    configStr: ''
  })
}
const exampleObj = {
  editorOptionStr: example.monacoEditorExample,
  configStr: example.monacoButtonExample
}
const openEditView = (prop, label) => {
  let params = {}
  if (prop == 'value') {
    params['language'] = option.value.params.language
  } else {
    params['headerBtn'] = [
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
const openBtnEditView = (btnItem, index) => {
  let providerType = 'defaultJsEnhance'
  const type = unref(parentData).type
  if (type == 'layoutTabs') providerType = 'formTabsEnhance'
  if (type == 'layoutTable') providerType = 'formTableEnhance'
  openMEDialog(
    {
      prop: 'configStr',
      label: `${btnItem.label}  按钮配置`,
      params: {
        providerType,
        headerBtn: [
          {
            name: `复制配置示例`,
            icon: 'solar:copy-outline',
            clickFun: () => {
              emit('copy-text', exampleObj.configStr || '')
            },
            params: { size: 'small', type: 'primary' }
          }
        ]
      }
    },
    option.value.params[tabsValue.value][index]
  )
}
</script>

<style lang="scss" scoped>
.item-border {
  border-bottom: 1px solid #f1f1f1;

  &:nth-last-child(1) {
    border: 0;
  }

  .btn-item {
    display: flex;
    margin-bottom: 5px;

    .item-label {
      flex: 0 0 60px;
    }
  }
}
</style>
