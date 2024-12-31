<template>
  <div class="step-orde-form-box">
    <div class="order-top">
      <div style="display: flex">
        <div class="tb-box">
          <img src="/img/zwgl.jpg" style="height: 30px" />
        </div>
        <div class="title-box">
          <p class="title">销售总监</p>
          <div class="text-box">
            <span>暂无相关描述</span>
          </div>
        </div>
      </div>
      <FormView
        :ref="(el) => (formViewRef[orderTopData.refKey] = el)"
        formType="add"
        handleType="returnData"
        showType="view"
        :defaultData="orderTopData.defaultData"
        :showButton="false"
        :formId="orderTopData.formId"
      ></FormView>
    </div>
    <footer class="footer">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <template v-for="(item, index) in data" :key="index">
          <el-tab-pane :label="item.label" :name="item.name">
            <div class="tabs-box">
              <FormView
                v-if="item.formId"
                formType="add"
                handleType="returnData"
                showType="view"
                :defaultData="item.defaultData"
                :showButton="true"
                :formId="item.formId"
              ></FormView>
              <template v-if="item.tableId">
                <LowTable :tableId="item.tableId" :enhanceData="item.enhanceData"> </LowTable>
              </template>
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'

interface Props {
  type?: string //控件名称
}
const props = defineProps<Props>()

const orderTopData = ref({
  refKey: 'gdgl',
  formId: '1846114280447025153',
  defaultData: {
    gdbh: '202062976600',
    gdbt: '处理客户反馈问题',
    gdzt: 1,
    lx: props.type
  }
})
const formViewRef = ref({})

const activeName = ref('first')

const data = reactive([
  {
    label: '操作权限',
    name: 'first',
    defaultData: {},
    formId: '1846364734045270018'
  },
  {
    label: '数据权限',
    name: 'second',
    defaultData: {},
    formId: '1846383339671629825'
  },
  {
    label: '字段权限',
    name: 'third',
    defaultData: {},
    formId: '1846399447287967745'
  },
  {
    label: '成员列表',
    name: 'fourth',
    defaultData: {},
    tableId: '1846429439782793217',
    enhanceData: { hideHeader: 'disabled' }
  },
  {
    label: '操作记录',
    name: 'czjl',
    defaultData: {},
    tableId: '1846103236139950082',
    enhanceData: { hideHeader: 'disabled' }
  }
])

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style lang="scss" scoped>
.step-orde-form-box {
  .order-top {
    display: flex;
    height: 110px;
    padding: 20px 25px;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid rgb(233 233 233 / 100%);
    border-radius: 10px;
    box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);
    align-items: center;
    justify-content: space-between;

    .tb-box {
      display: flex;
      width: 65px;
      height: 65px;
      line-height: 65px;
      justify-content: center;
      text-align: center;
      background: #fb6260;
      border-radius: 50%;
      align-items: center;
    }

    .title-box {
      display: flex;
      height: 60px;
      margin-left: 15px;
      flex-direction: column;
      justify-content: center;

      .title {
        padding: 0;
        margin: 0;
        // margin-bottom: 5px;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px;
        text-align: left;
      }

      .text-box {
        display: flex;
        font-family: '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
        color: #999;
        text-align: left;
        align-items: center;

        .text-box-left {
          display: flex;
          align-items: center;

          .dian {
            display: inline-block;
            width: 7px;
            height: 7px;
            margin-right: 5px;
            margin-left: 10px;
            background: #f90;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .steps {
    width: calc(90% + 40px);
    padding: 60px 0 30px;
    margin: 0 auto 20px;
    background-color: #fff;
    border: 1px solid rgb(233 233 233 / 100%);
    border-radius: 10px;

    ::v-deep(.el-steps) {
      .el-step {
        .el-step__head.is-process {
          color: #409eff;

          .el-step__icon.is-text {
            color: white;
            background-color: #409eff;
            border-color: #409eff;
          }
        }

        .el-step__head {
          .el-step__line {
            top: 13px;
          }

          .el-step__icon.is-text {
            width: 25px;
            height: 30px;

            .el-step__icon-inner {
              font-size: 20px;
              line-height: 30px;
            }
          }
        }

        .el-step__main {
          .el-step__title {
            font-size: 13px;
            font-weight: 400;
            line-height: 25px;
            color: #666;
          }

          .el-step__description {
            font-size: 13px;
            color: #ccc;
          }
        }
      }
    }
  }

  ::v-deep .card > .el-card {
    width: calc(90% + 40px);
    border-radius: 10px;
  }

  .card {
    width: 100%;

    // &>::v-deep(.crud){
    //   width: calc(90% + 40px);
    // }

    ::v-deep(.el-card) {
      // width: calc(90% + 40px);

      .el-card__header {
        background-color: #f9f9f9;

        .card-header {
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-weight: 700;
          color: #666;
        }
      }

      .el-card__body {
        .avue-crud {
          .el-card {
            margin: 0 auto;
            border-radius: 0;

            .el-table__header {
              height: 55px;

              th {
                height: 55px;
                font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
                font-size: 13px;
                font-weight: 700;
                color: #666;
                background-color: #f2f2f2;
              }
            }

            .el-table__body {
              .el-table__row {
                .el-table__cell {
                  font-size: 13px;
                  border-right: none;
                }
              }
            }
          }
        }
      }
    }
  }
}

.footer {
  // padding: 0px 10p;
  margin-top: 20px;
  margin-bottom: 60px;
  border: 1px solid rgb(233 233 233 / 100%);
  border-radius: 10px;
  box-shadow: 0 0 5px rgb(11 11 11 / 5.7%);

  ::v-deep .el-tabs__nav-wrap::after {
    // background: none !important;
  }

  .tabs-box {
    padding: 0 20px;
  }

  ::v-deep .el-tabs__nav-scroll {
    display: flex;
    height: 60px;
    line-height: 60px;
    background: #f9f9f9;
    align-items: center;
    border-radius: 10px 10px 0 0;

    .el-tabs__nav {
      height: 60px;
      align-items: center;

      .el-tabs__item {
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        color: #666;
      }

      .is-active {
        color: #409eff;
      }
    }
  }
}
</style>
