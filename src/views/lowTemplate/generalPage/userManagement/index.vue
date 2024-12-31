<template>
  <div class="userManagement-box">
    <div class="b-#F0F2F5 b-2px b-solid rounded-xl">
      <FormView
        formType="view"
        handleType="returnData"
        showType="view"
        :defaultData="userViewTopData.defaultData"
        :showButton="false"
        :formId="userViewTopData.formId"
      ></FormView>
    </div>
    <div class="mt-20px pb-20px b-#F0F2F5 b-2px b-solid" style="border-radius: 5px">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <template v-for="item in tabsList" :key="item.labelKey">
          <el-tab-pane :label="item.label" :name="item.labelKey">
            <template v-if="item.lowDesign.type == 'design' && item.lowDesign.formId">
              <FormView
                formType="view"
                handleType="returnData"
                showType="view"
                :defaultData="item.lowDesign?.defaultData"
                :showButton="false"
                :formId="item.lowDesign.formId"
              ></FormView>
            </template>

            <template v-if="item.lowDesign.type == 'exploit' && item.lowDesign.tableId">
              <div style="padding: 5px 18px">
                <LowTable
                  :tableId="item.lowDesign.tableId"
                  :enhanceData="item.lowDesign?.defaultData"
                >
                </LowTable>
              </div>
            </template>

            <template v-if="item.lowDesign.type == 'designAndExploit' && item.lowDesign.formId">
              <FormView
                formType="view"
                handleType="returnData"
                showType="view"
                :defaultData="item.lowDesign?.defaultData"
                :showButton="false"
                :formId="item.lowDesign.formId"
              ></FormView>
              <div class="ml-28px mr-28px">
                <div class="mt-22px font-700 text-14px c-#666666 left-bule-text">
                  <span class="pl-8px">用户标签</span>
                </div>
                <div class="flex">
                  <el-tag
                    v-for="tag in dynamicTags"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="tagHandleClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-button
                    v-if="!inputVisible"
                    class="button-new-tag"
                    @click="inputVisible = true"
                  >
                    <Icon icon="ic:twotone-plus" class="text-#409EFF"></Icon>
                    <span class="text-#409EFF text-14px">添加标签</span>
                  </el-button>
                </div>
                <div class="mt-38px font-700 text-14px c-#666666 left-bule-text">
                  <span class="pl-8px">收货地址</span>
                </div>
                <div>
                  <LowTable tableId="1846073998846337026" :enhanceData="{ type: 'view' }">
                  </LowTable>
                </div>
              </div>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>

    <el-dialog
      v-model="inputVisible"
      title="标签设置"
      width="600"
      :before-close="dialogHandleClose"
      destroy-on-close
    >
      <FormView
        formType="add"
        :ref="(el) => (yhxqRef = el)"
        handleType="returnData"
        showType="view"
        :showButton="false"
        formId="1845041920745218050"
      ></FormView>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="inputVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogSuccess"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { FormView, LowTable } from '@/components/LowDesign/index'
import type { TabsPaneContext } from 'element-plus'

defineOptions({ name: 'UserManagement' })

const props = defineProps({
  data: {
    // 自定义的翻译文件
    type: Object,
    default: () => {}
  }
})

const userViewTopDefaultData = ref(props.data)
userViewTopDefaultData.value = {
  ...userViewTopDefaultData.value,
  avatar_img:
    'http://oss.yckxt.com/chatgpt/upload/1/2024-10-14/1/f0ee8a3c7c9638a54940382568c9dpng.png'
}

const userViewTopData = ref({
  formId: '1845673651634458625',
  defaultData: userViewTopDefaultData.value
})

let tabsList = ref([
  {
    labelKey: 'yhxq',
    label: '用户详情',
    lowDesign: {
      formId: '1845757477997731842',
      type: 'designAndExploit',
      defaultData: {
        ...props.data,
        cs: '220000,220100,220102',
        czz: '100',
        dlcs: '100',
        fields_8038839: '统计信息',
        fields_9105030: '用户资料',
        fs: '100',
        gxqm: '一个有个性的男子',
        gz: '100',
        id: 'id',
        scht: '100',
        scpj: '100',
        scsp: '100',
        sczt: '100',
        sjhm: '18088889999',
        sppj: '100',
        sr: '2016-10-18',
        sycjcs: '100',
        thjl: '100',
        xb: '1',
        xhdfl: '服装、餐厨',
        yhj: '100',
        yqhy: '100',
        zhdl: '2024-08-22 22:10:00',
        zy: '学生'
      }
    }
  },
  {
    labelKey: 'ddjl',
    label: '订单记录',
    lowDesign: {
      tableId: '1844275960258019330',
      type: 'exploit',
      defaultData: {
        type: 'view'
      }
    }
  },
  {
    labelKey: 'jfjl',
    label: '积分记录',
    lowDesign: {
      tableId: '1846095079682482177',
      type: 'exploit',
      defaultData: {}
    }
  },
  {
    labelKey: 'dlrz',
    label: '登录日志',
    lowDesign: {
      tableId: '1846100518918823938',
      type: 'exploit',
      defaultData: {}
    }
  },
  {
    labelKey: 'czjl',
    label: '操作记录',
    lowDesign: {
      tableId: '1846103236139950082',
      type: 'exploit',
      defaultData: {}
    }
  }
])

const activeName = ref('yhxq')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const dynamicTags = ref(['标签名称一', '标签名称二', '标签名称三', '标签名称四'])
const inputVisible = ref(false)
const yhxqRef = ref()

const tagHandleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const dialogHandleClose = (done: () => void) => {
  done()
}

const dialogSuccess = async () => {
  const formRef = yhxqRef.value.controlRef
  const data = await formRef.handleSubmit(true)
  let bq = data.$tjbq
  if (bq) {
    if (bq.indexOf('|') == -1) {
      dynamicTags.value.push(bq)
    } else {
      let bqList = bq.split('|')
      bqList.forEach((ele) => {
        dynamicTags.value.push(ele)
      })
    }
  }
  inputVisible.value = false
}
</script>

<style lang="scss" scoped>
::v-deep(.el-tabs) {
  .el-tabs__nav-wrap {
    height: 53px;
    background-color: #f9f9f9;

    .el-tabs__item {
      height: 53px;
      font-weight: bold;
      line-height: 53px;
      color: rgb(102 102 102);

      &.is-active {
        color: rgb(64 158 255);
      }
    }

    &::after {
      height: 1px;
    }
  }
}

.left-bule-text {
  margin-bottom: 20px;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  border-left: 6px solid #409eff;
}

::v-deep(.el-tag) {
  width: 120px;
  height: 40px;
  margin-right: 10px;
  font-size: 14px;
  color: #999;
  background-color: white;
  border-color: #ebeef5;

  &:hover {
    background-color: #f5f5f5;
  }

  .el-icon {
    font-size: 16px;
    color: #999;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.button-new-tag {
  height: 40px;
  background-color: white;
  border: none;
}

::v-deep(.el-overlay) {
  .el-dialog {
    border-radius: 5px;

    .el-dialog__header {
      padding: 13px 13px 13px 15px;
      background-color: #f5f5f5;
      border-radius: 5px 5px 0 0;

      .el-dialog__title {
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 14px;
        font-weight: bold;
        color: #666;
      }

      .el-dialog__headerbtn {
        height: 56.8px;
      }
    }

    .el-dialog__body {
      .el-form-item {
        margin-bottom: 0;

        .el-checkbox-group {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));

          .el-checkbox {
            .el-checkbox__inner {
              width: 14px;
              height: 14px;
            }

            .el-checkbox__label {
              font-size: 14px;
            }
          }
        }
      }
    }

    .el-dialog__footer {
      display: flex;
      height: 60px;
      padding: 10px 20px;
      border-top: 1px solid #f0f0f0;
      align-items: center;
      justify-content: right;

      .el-button {
        width: 80px;
        height: 30px;
        font-size: 12px;
        color: #999;
        background-color: #f9f9f9;
      }

      .el-button--primary {
        color: white;
        background-color: #409eff;
      }
    }
  }
}

::v-deep .el-tabs .el-tabs__nav-wrap {
  height: 60px;

  .el-tabs__nav {
    height: 60px;

    .el-tabs__item {
      height: 60px;
      // line-height: 60px;
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 32px;
      color: #666;

      &.is-active {
        color: #409eff;
      }
    }
  }
}
</style>
