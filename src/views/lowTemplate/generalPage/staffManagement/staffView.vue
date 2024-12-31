<template>
  <div class="userManagement-box">
    <div class="b-#F0F2F5 b-2px b-solid rounded-xl">
      <FormView
        formType="view"
        handleType="returnData"
        showType="view"
        :defaultData="staffViewTopData.defaultData"
        :showButton="false"
        :formId="staffViewTopData.formId"
      ></FormView>
    </div>
    <div class="mt-20px pb-20px b-#F0F2F5 b-2px b-solid" style="border-radius: 5px">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <template v-for="item in tabsList" :key="item.labelKey">
          <el-tab-pane :label="item.label" :name="item.labelKey">
            <template v-if="item.formId">
              <div style="padding: 5px 18px">
                <FormView
                  :formType="item.formType ? item.formType : 'view'"
                  handleType="returnData"
                  showType="view"
                  :defaultData="item.defaultData"
                  :showButton="true"
                  :formId="item.formId"
                ></FormView>
              </div>
            </template>

            <template v-else-if="item.tableId">
              <div style="padding: 5px 18px">
                <LowTable :tableId="item.tableId" :enhanceData="item.defaultData"> </LowTable>
              </div>
            </template>

            <template v-else-if="!item.formId && !item.tableId">
              <div style="padding: 30px 48px">
                <div class="mb-26px text-14px">
                  <span
                    class="font-bold"
                    style="font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif"
                    >数据权限</span
                  >
                  <span>（设置该角色的用户可以操作的数据的范围）</span>
                </div>
                <div>
                  <el-radio-group v-model="radio" class="grid-cols-1" style="display: grid">
                    <el-radio :value="Ritem.value" v-for="Ritem in radioList" :key="Ritem.value">
                      <template #default>
                        <span class="inline-block w-170px text-14px">{{ Ritem.title }}</span>
                        <span class="text-13px c-#999999">{{ Ritem.introduce }} </span>
                      </template>
                    </el-radio>
                  </el-radio-group>
                </div>

                <div class="flex justify-center mt-80px">
                  <el-button type="primary" style="width: 140px; height: 40px" @click="sjxqCick">
                    保存
                  </el-button>
                </div>
              </div>
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormView, LowTable } from '@/components/LowDesign/index'
import type { TabsPaneContext } from 'element-plus'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'UserManagement' })

const props = defineProps({
  data: {
    // 自定义的翻译文件
    type: Object,
    default: () => {}
  },
  controlView: {
    type: Object
  }
})

const controlView = ref(props.controlView)

const staffViewTopDefaultData = ref(props.data)
staffViewTopDefaultData.value = {
  ...staffViewTopDefaultData.value,
  avatar_img:
    'http://oss.yckxt.com/chatgpt/upload/1/2024-10-14/1/f0ee8a3c7c9638a54940382568c9dpng.png'
}

const staffViewTopData = ref({
  formId: '1846457022071132161',
  defaultData: staffViewTopDefaultData.value
})

const radio = ref(1)

interface TableList {
  labelKey: string
  label: string
  formId?: string
  tableId?: string
  defaultData: object
  formType?: 'add' | 'edit' | 'view'
  showButton?: string
}

let tabsList = ref<TableList[]>([
  {
    labelKey: 'dlrz',
    label: '登录日志',
    tableId: '1846734665412726786',
    defaultData: {
      type: 'view'
    }
  },
  {
    labelKey: 'czjl',
    label: '操作记录',
    tableId: '1846747363458351106',
    defaultData: {
      type: 'view'
    }
  },
  {
    labelKey: 'czqx',
    label: '操作权限',
    formId: '1846489623477571585',
    defaultData: {
      ref: controlView.value
    },
    formType: 'edit',
    showButton: 'true'
  },
  {
    labelKey: 'sjqx',
    label: '数据权限',
    defaultData: {}
  },
  {
    labelKey: 'zdqx',
    label: '字段权限',
    formId: '1846758342212648962',
    defaultData: {
      ref: controlView.value
    },
    formType: 'edit',
    showButton: 'true'
  }
])

const activeName = ref('dlrz')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const radioList = ref([
  { title: '个人', introduce: '只能操作自己和下属的数据', value: 1 },
  { title: '所属部门', introduce: '能操作自己、下属、和自己所属部门的数据', value: 2 },
  {
    title: '所属部门及下属部门',
    introduce: '所属部门及下属部门 能操作自己、下属和自己所属部门及其子部门的数据',
    value: 3
  },
  { title: '全公司', introduce: '能操作全公司的数据', value: 4 }
])
const sjxqCick = () => {
  ElMessage({
    message: '保存成功',
    type: 'success'
  })
  controlView.value!.show = false
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

  .el-tabs__content {
    .el-radio-group {
      .el-radio {
        height: 40px;
      }
    }
  }
}

.left-bule-text {
  margin-bottom: 20px;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  border-left: 6px solid #409eff;
}

::v-deep(.el-tag) {
  width: 110px;
  height: 35px;
  margin-right: 10px;
  font-size: 13px;
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
        font-size: 13px;
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
              width: 13px;
              height: 13px;
            }

            .el-checkbox__label {
              font-size: 13px;
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 12px 20px;
      border-top: 1px solid #f0f0f0;

      .el-button {
        width: 70px;
        height: 28px;
        font-size: 10px;
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
