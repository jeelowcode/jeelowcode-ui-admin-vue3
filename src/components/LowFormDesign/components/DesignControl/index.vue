<template>
  <div class="design-control h-100%">
    <el-tabs v-model="tabsVal" type="border-card" class="demo-tabs">
      <el-tab-pane label="表单控件" name="control">
        <div v-for="control in controlTreeData" :key="control.type">
          <div class="pb-12px pl-8px pt-12px text-13px">{{ control.typeName }}</div>
          <draggable
            class="control-content flex flex-wrap"
            tag="div"
            :list="control.control"
            :group="{ name: 'layout', pull: 'clone', put: false }"
            ghost-class="ghost"
            :sort="false"
            item-key="label"
            :move="onMove"
          >
            <template #item="{ element }">
              <div class="content-item" @click="$emit('add-control', element)">
                <Icon class="mr-2px" :size="14" :icon="element.icon" />
                <span>{{ element.label || element.title }}</span>
                <div v-if="element.controlTip" class="control-tip">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="element.controlTip"
                    placement="top"
                  >
                    <Icon :size="12" icon="ep:info-filled"></Icon>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="表单模板" name="template">
        <div class="100%">
          <el-input
            class="my-5px px-5px"
            v-model="treeQuery"
            placeholder="输入模板名称，查询模板"
            @input="onQueryChanged"
          />
          <el-tree-v2
            ref="treeRef"
            :data="formTemplateData"
            :props="{ value: 'id', label: 'desformName' }"
            :height="treeHeight"
            :item-size="225"
          >
            <template #default="{ node }">
              <el-popover
                placement="right"
                width="60vw"
                trigger="hover"
                :title="node.data.desformName"
              >
                <template #reference>
                  <div class="flex flex-col">
                    <div class="w-250px h-160px pos-relative">
                      <div
                        class="pos-absolute w-750px h-480px left--250px top--155px scale-33.3 bg-#fff b-rd-10px"
                      >
                        <DesignLayout
                          v-model="node.data.option"
                          v-model:select="select"
                        ></DesignLayout>
                      </div>
                      <div
                        class="view-mask pos-absolute left-0 top-5px w-100% h-100%"
                        @click="useTemplate(node.data.option, node.data.id)"
                      >
                        <div class="mask-icon">
                          <Icon :size="35" icon="ep:pointer"></Icon>
                        </div>
                      </div>
                    </div>
                    <div
                      class="text-center text-12px h-32px flex justify-center items-center mt-10px"
                    >
                      <div class="text-wrap">{{ node.data.desformName }}</div>
                    </div>
                  </div>
                </template>
                <template #default>
                  <div class="pos-relative max-h-80vh overflow-y-auto pr-20px pt-20px">
                    <DesignLayout v-model="node.data.option" v-model:select="select"></DesignLayout>
                    <div class="pos-absolute left-0 top-0px w-100% h-100%"></div>
                  </div>
                </template>
              </el-popover>
            </template>
            <template #empty>
              <Icon :size="50" icon="mynaui:credit-card-minus"></Icon>
              <span>暂无模板数据</span>
            </template>
          </el-tree-v2>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import controlConfig from './controlConfig.js'
import useDrageed from '@/hooks/design/useDrageed'
import { getTemplateFormList } from '@/api/design/form'
import { convertFormViewOption } from '../../utils/convert.js'
import DesignLayout from '../DesignLayout/index.vue'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'Dragcontrol' })

const props = defineProps({
  isShow: Boolean,
  dataId: String
})

const emit = defineEmits(['add-control', 'set-option'])

const controlTreeData = ref<any>([])
const formTemplateData = ref<any>([])
const treeQuery = ref('')
const observer = ref<any>(null)
const treeHeight = ref(200)
const timer = ref<any>(null)
const select = ref({})
const tabsVal = ref('control')

const treeRef = ref()

const { onMove } = useDrageed()
const message = useMessage()

const getTemplateData = () => {
  getTemplateFormList().then((data) => {
    formTemplateData.value = data
      .filter((item) => item.id != props.dataId)
      .map((item) => {
        item.option = convertFormViewOption(JSON.parse(item.desformJson || `{}`), 'formDesign')
        delete item.desformJson
        return item
      })
    nextTick(() => {
      initObserver()
    })
  })
}
const initObserver = () => {
  observer.value = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target) {
        if (timer.value) clearTimeout(timer.value)
        setTimeout(() => {
          treeHeight.value = entry.contentRect.height - 42
        }, 200)
      }
    }
  })
  const dom = document.querySelector('.design-control .el-tabs .el-tabs__content')
  observer.value.observe(dom)
}

const onQueryChanged = () => {
  treeRef.value!.filter(treeQuery.value)
}

const useTemplate = async (data, oldId) => {
  await message.confirm('是否确定使用当前模板？(注：确定使用模板将会替换当前配置)')
  const option = cloneDeep(data)
  const rexp = new RegExp(oldId, 'g')
  option.scssEnhance = option.scssEnhance.replace(rexp, props.dataId)
  emit('set-option', option)
  message.success('配置已替换')
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      tabsVal.value = 'control'
      getTemplateData()
    }
  },
  { immediate: true }
)

onMounted(() => {
  const span24 = [
    'layoutGroup',
    'layoutTabs',
    'layoutTable',
    'textarea',
    'array',
    'image',
    'file',
    'buttonList',
    'ueditor',
    'title',
    'markDown'
  ]
  controlTreeData.value = controlConfig.map((item) => {
    if (item.control) {
      item.control = item.control.map((sub) => {
        sub.display = true
        sub.span = span24.includes(sub.type) ? 24 : 12
        if (!['layout', 'title'].includes(sub.controlType)) {
          sub.disabled = false
        }
        if (
          !['layout', 'title'].includes(sub.controlType) &&
          !['switch', 'buttonList'].includes(sub.type)
        ) {
          sub.required = false
        }
        if (['layoutTabs', 'layoutTable', 'buttonList', 'title'].includes(sub.type)) {
          sub.hideLabel = true
        } else sub.hideLabel = false
        return sub
      })
    }
    return item
  })
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style lang="scss" scoped>
.design-control {
  & > :deep(.el-tabs) {
    height: calc(100% - 2px);
    border: 0;

    .el-tabs__nav {
      width: 100%;

      .el-tabs__item {
        flex: 1;

        &:nth-child(2) {
          border-right: 0;
        }
      }
    }

    .el-tabs__content {
      height: calc(100% - 40px);
      padding: 0;
      overflow-y: auto;

      .el-tree-node__content {
        display: flex;
        padding: 5px 10px !important;
        background-color: #f5f7fa;
        border-bottom: 8px solid #fff;
        box-sizing: border-box;

        .mask-icon {
          display: none;
        }

        &:hover {
          background-color: rgb(235.9 245.3 255);

          .view-mask {
            display: flex;
            color: #f1f1f1;
            background-color: rgba($color: #000, $alpha: 30%);
            border-radius: 5px;
            justify-content: center;
            align-items: center;
          }

          .mask-icon {
            display: block;
          }
        }

        .design-layout {
          padding: 30px 20px !important;
          overflow: hidden;
          box-sizing: border-box;
        }

        .el-tree-node__expand-icon {
          display: none;
        }
      }
    }
  }

  .control-content {
    padding: 0 8px;

    .content-item {
      display: flex;
      align-items: center;
      width: calc(50% - 7px);
      padding: 5px 10px;
      margin-bottom: 5px;
      font-size: 12px;
      cursor: move;
      background-color: #f4f6fc;
      border: 1px solid #f4f6fc;
      box-sizing: border-box;

      &:hover {
        color: var(--el-color-primary);
        border: 1px dashed var(--el-color-primary);
      }
    }

    .content-item:nth-child(2n-1) {
      margin-right: 10px;
    }

    .control-tip {
      margin-top: -6px;
      margin-left: 2px;
    }
  }
}
</style>
