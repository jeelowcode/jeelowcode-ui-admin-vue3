<template>
  <div class="group_gjxqy_box">
    <!-- 顶部信息 -->
    <FormView
      formType="view"
      handleType="returnData"
      showType="view"
      :defaultData="topInformation.defaultData"
      :showButton="false"
      :formId="topInformation.formId"
    ></FormView>
    <!-- 分类页面X -->
    <el-tabs v-model="tabsOneActive" class="demo-tabs" @tab-click="handleClick">
      <template v-for="item in tabsOneList" :key="item.name">
        <el-tab-pane :label="item.label" :name="item.name"></el-tab-pane>
      </template>
    </el-tabs>
    <!-- 流程进度 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="text-16px">流程进度</span>
        </div>
      </template>
      <el-steps :active="stepsActive" align-center>
        <template v-for="item in stepsList" :key="item.id">
          <el-step
            :title="item.title"
            :description="item.description"
            :class="item.id == stepsActive ? 'stepsActive' : ''"
          />
        </template>
      </el-steps>
    </el-card>
    <!-- 操作记录 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="text-16px">操作记录</span>
        </div>
      </template>
      <FormView
        formType="view"
        handleType="returnData"
        showType="view"
        :defaultData="operationRecord.defaultData"
        :showButton="false"
        :formId="operationRecord.formId"
      ></FormView>
    </el-card>
    <!-- 操作记录流程 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="text-16px">操作记录</span>
        </div>
      </template>
      <el-steps
        direction="vertical"
        :active="stepsVertical.length"
        align-center
        class="steps-vertical-class"
      >
        <template v-for="item in stepsVertical" :key="item.id">
          <el-step :title="item.title">
            <template #description>
              <el-card>
                <div>
                  <el-avatar :size="34" :src="item.cardContent.avatarImg" />
                </div>
                <div class="ml-5px grid">
                  <div class="flex items-center">
                    <p class="c-#bcaeae m-0 font">{{ item.cardContent.username }}</p>
                    <p class="pl-5px m-0 c-#999 text-11px font-family">{{
                      item.cardContent.userjob
                    }}</p>
                  </div>
                  <div
                    class="flex items-center c-#bcaeae text-11px font-family"
                    style="color: #666"
                  >
                    <p class="m-0">{{ item.cardContent.examineApproveGrade }}</p>
                    <p class="pl-3px m-0">{{ item.cardContent.examineApproveName }}</p>
                    <p class="pl-3px m-0">{{ item.cardContent.examineApproveResult }}</p>
                  </div>
                  <div class="flex items-center c-#999">
                    <el-icon><Clock /></el-icon>
                    <p class="pl-3px m-0" style="font-family: '微软雅黑', sans-serif">{{
                      item.cardContent.examineApproveTime
                    }}</p>
                  </div>
                </div>
                <div class="ml-auto c-#bcaeae text-11px font" style="font-size: 12px">
                  {{ item.cardContent.type }}
                </div>
              </el-card>
            </template>
          </el-step>
        </template>
      </el-steps>
    </el-card>
    <!-- 日志记录 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="text-16px">日志记录</span>
        </div>
      </template>
      <el-empty description="未查询到相关数据" image="/img/img5.svg" />
    </el-card>
    <!-- 分类标签 -->
    <el-card class="card-and-tabs">
      <template #header>
        <div class="card-header">
          <el-tabs v-model="tabsOneActive" @tab-click="handleClick">
            <template v-for="item in tabsOneList" :key="item.name">
              <el-tab-pane :label="item.label" :name="item.name"></el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </template>
      <LowTable :tableId="tabsTableData.tabId" :enhanceData="tabsTableData.enhanceData"></LowTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { FormView, LowTable } from '@/components/LowDesign/index'
import type { TabsPaneContext } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'

defineOptions({ name: 'GroupGjxqy' })

const topInformationData = reactive({
  create_date: '2024-09-11 09:04:00',
  customer_rating: 4,
  customer_source: '7',
  customer_status: '3',
  fields_4858197: '',
  fields_5452530: '',
  head_contact: '1833323260582391810',
  system_number: '202010001',
  tabs_title: '广州某科技有限公司',
  type_of_industry: '3',
  vesting_officer: '1833323260582391810'
})

const topInformation = ref({
  title: '基本信息',
  formId: '1838820624684339201',
  defaultData: topInformationData
})

const tabsOneActive = ref('1')
const tabsOneList = ref([
  { label: '分类页面一', name: '1' },
  { label: '分类页面二', name: '2' },
  { label: '分类页面三', name: '3' },
  { label: '分类页面四', name: '4' }
])

const stepsActive = ref(4)
const stepsList = ref([
  { id: 1, title: '提交申请', description: '2024-09-24 15:03' },
  { id: 2, title: '部门审批', description: '2024-09-24 15:03' },
  { id: 3, title: '行政审批', description: '2024-09-24 15:03' },
  { id: 4, title: '申请成功', description: '2024-09-24 15:03' }
])

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const operationRecordData = ref({
  tabs_customer_name: '广州某科技有限公司',
  tabs_customer_rating: 4,
  tabs_customer_source: '7',
  tabs_customer_status: '3',
  tabs_now_city: '130000',
  tabs_system_number: '202010001',
  tabs_type_of_industry: '3',
  tabs_update_date: '2024-09-25 00:00:00',
  tabs_vesting_officer: '1833323260582391810',
  tabs_company_tax: '91440300MA5FQY****',
  tabs_company_tel: '3666-756614',
  tabs_company_web: 'http://www.xx.com',
  tabs_current_title: '5',
  tabs_deposit_bank: '交通银行深圳井南山支行',
  tabs_detailed_address: '广东省深圳市南山区',
  tabs_head_contact: '李小红',
  tabs_invoice_title: '广州某科技有限公司',
  tabs_phone_number: '15238683333'
})

const operationRecord = ref({
  title: '操作记录',
  formId: '1838842046060228609',
  defaultData: operationRecordData
})

const stepsVertical = ref([
  {
    id: 1,
    title: '09-24',
    cardContent: {
      avatarImg: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      username: '赵小刚',
      userjob: '销售经理',
      examineApproveGrade: '1级审批人',
      examineApproveName: '李小明',
      examineApproveResult: '审批通过，通过原因：无',
      examineApproveTime: '2019-08-23 22:31',
      type: '订单'
    }
  },
  {
    id: 2,
    title: '09-24',
    cardContent: {
      avatarImg: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      username: '赵小刚',
      userjob: '销售经理',
      examineApproveGrade: '1级审批人',
      examineApproveName: '李小明',
      examineApproveResult: '审批通过，通过原因：无',
      examineApproveTime: '2019-08-23 22:31',
      type: '订单'
    }
  },
  {
    id: 3,
    title: '09-24',
    cardContent: {
      avatarImg: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      username: '赵小刚',
      userjob: '销售经理',
      examineApproveGrade: '1级审批人',
      examineApproveName: '李小明',
      examineApproveResult: '审批通过，通过原因：无',
      examineApproveTime: '2019-08-23 22:31',
      type: '订单'
    }
  },
  {
    id: 4,
    title: '09-24',
    cardContent: {
      avatarImg: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      username: '赵小刚',
      userjob: '销售经理',
      examineApproveGrade: '1级审批人',
      examineApproveName: '李小明',
      examineApproveResult: '审批通过，通过原因：无',
      examineApproveTime: '2019-08-23 22:31',
      type: '订单'
    }
  }
])

const tabsTableData = ref({
  tabId: '1840268794366795777',
  enhanceData: {
    buttonType: 'hidden'
  }
})
</script>

<style lang="scss" scoped>
.group_gjxqy_box {
  .el-tabs {
    ::v-deep(.el-tabs__header) {
      margin-bottom: 0;
      background-color: white;

      .el-tabs__nav-wrap {
        border: 1px solid #e4e7ed;
        border-top: none;

        .el-tabs__active-bar {
          height: 1px;
        }

        .el-tabs__item {
          margin-bottom: 15px;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-weight: 700;
          color: #666;

          &:hover {
            color: rgb(64 158 255);
          }
        }

        .el-tabs__item.is-active {
          color: rgb(64 158 255);
        }

        &::after {
          height: auto;
        }
      }
    }
  }

  ::v-deep(.el-card) {
    width: 95%;
    margin: 20px auto 0;
    border-radius: 10px;

    .el-card__header {
      height: 60px;
      font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #666;
      background-color: rgb(249 249 249 / 100%);
      border-bottom: 1px solid rgb(233 233 233 / 100%);
    }

    .el-card__body {
      .el-steps {
        height: 90px;
        padding-top: 10px;

        .el-step {
          .el-step__head {
            .el-step__icon {
              width: 13px;
              height: 13px;
              border: 3px solid;

              .el-step__icon-inner {
                display: none;
              }
            }
          }

          .el-step__main {
            .el-step__title {
              font-size: 12px;
              font-weight: 400;
              line-height: 30px;
              color: #666;
            }

            .el-step__description {
              color: #ccc;
            }
          }

          &.stepsActive {
            .el-step__head {
              .el-step__icon {
                background-color: #409eff;
              }
            }
          }
        }
      }

      .steps-vertical-class {
        height: auto;

        .el-step__head {
          display: flex;
          justify-content: center;
          border-color: #f2f2f2;

          .el-step__line {
            bottom: -50%;
            left: 11.5px;
            background-color: #f2f2f200;
          }

          .el-step__icon {
            width: 9px !important;
            height: 9px !important;
            border-width: 2px !important;
          }
        }

        .el-step__main {
          display: flex;
          align-items: center;
          height: 125px;
          margin-top: 10px;

          .el-step__title {
            position: absolute;
            top: -9px;
            color: #999 !important;
          }

          .el-step__description {
            width: 100%;
            padding-right: 0;

            .el-card {
              width: 100%;
              height: 90px;
              margin: 0;
              border: none;
              box-shadow: 0 0 5px rgb(0 0 0 / 9.8%);

              .el-card__body {
                display: flex;
                height: calc(100% - 16px);
                padding: 8px 30px 8px 10px;
              }
            }
          }
        }
      }

      .el-empty {
        .el-empty__image {
          width: 120px;
          height: 120px;
        }

        .el-empty__description > p {
          font-size: 13px;
          color: #ccc;
        }
      }

      .avue-crud {
        .el-card {
          border-radius: 0;

          .el-form {
            .el-table__header-wrapper {
              .el-table__header {
                font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
                font-size: 14px;
                font-weight: 700;

                .el-table__cell {
                  color: #666;
                }
              }
            }

            .el-table__body {
              .el-table__row {
                background-color: #f5f5f5;

                .el-table__cell {
                  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
                  font-size: 14px;

                  .el-button {
                    .el-icon {
                      line-height: 0.9em;
                    }

                    span {
                      font-size: 14px !important;
                    }
                  }
                }
              }

              .el-table__row--striped .el-table__cell {
                background-color: #fff;
              }
            }
          }
        }
      }
    }

    &.card-and-tabs {
      .el-card__header {
        height: 60px;
        padding: 0 20px 0 0;

        .el-tabs {
          --el-tabs-header-height: 60px;

          .el-tabs__header {
            background-color: rgb(249 249 249);

            .el-tabs__nav-wrap {
              height: 60px;
              margin-bottom: 0;
              border: none;
            }
          }
        }
      }

      .el-card__body {
        padding-bottom: 40px;

        .el-card {
          width: calc(100% - 10px);
          padding: 0 5px;

          .el-card__body {
            padding-bottom: 0;
          }
        }
      }
    }
  }
}

::v-deep .el-form-item {
  .el-form-item__label {
    font-size: 14px !important;
  }

  .el-form-item__content {
    .el-input__inner {
      font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
      font-weight: 400;
      color: #666 !important;
    }
  }
}

::v-deep .avue-title p {
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #666 !important;
}

::v-deep .demo-tabs .el-tabs__nav {
  margin-left: 25px;

  .el-tabs__item {
    margin-bottom: 15px;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 16px;
    font-weight: 700;
  }

  .el-tabs__active-bar {
    left: -1px;
    height: 2px !important;
  }
}

::v-deep .card-header .el-tabs__nav {
  // margin-left: 25px;

  .el-tabs__item {
    margin-bottom: 0 !important;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
  }

  .el-tabs__active-bar {
    left: 2px;
    height: 2px !important;
  }
}

.font {
  font-family: '微软雅黑', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #666;
}

.font-family {
  font-family: MicrosoftYaHei, '微软雅黑', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #999;
}

// .fonts{
//   font-family: 'MicrosoftYaHei', '微软雅黑 Regular', '微软雅黑', sans-serif;
//   font-weight: 400;
//   font-style: normal;
//   font-size: 12px;
// }
</style>
