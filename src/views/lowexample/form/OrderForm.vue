<template>
  <!-- 订单详情类型表单与表单设计 -->
  <div class="step-orde-form-box">
    <div class="order-top">
      <FormView
        formType="view"
        handleType="returnData"
        showType="view"
        :defaultData="orderTopData.defaultData"
        :showButton="false"
        :formId="orderTopData.formId"
      ></FormView>
    </div>
    <div class="steps">
      <el-steps :active="active" align-center>
        <template v-for="(item, index) in stepList" :key="index">
          <el-step :title="item.title" :description="item.description" />
        </template>
      </el-steps>
    </div>
    <template v-for="item in cardList" :key="item.formId">
      <div class="card flex justify-center mt-20px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>订单详情</span>
            </div>
          </template>
          <template v-if="item.type == 'exploit'">
            <FormView
              formType="view"
              handleType="returnData"
              showType="view"
              :defaultData="ddxxData"
              :showButton="false"
              :formId="item.formId"
            ></FormView>
          </template>

          <template v-if="item.type == 'design'">
            <LowTable :tableId="item.formId" :enhanceData="item.enhanceData"> </LowTable>
          </template>
        </el-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { FormView, LowTable } from '@/components/LowDesign/index'

defineOptions({ name: 'OrderForm' })

const orderTopData = ref({
  type: 'exploit',
  refKey: 'orderTop',
  formId: '1834469087501627393',
  defaultData: {
    btn_group: '',
    mode_distribution: '2',
    mode_payment: '1',
    order_bh: '2024091335',
    order_money: '2503',
    order_source: '1',
    order_status: '2',
    order_type: '2',
    payment_date: '2024-09-12 19:04:00',
    update_date: '2024-09-12 04:42:00'
  }
})

const active = ref(2)
const stepList = ref([
  {
    title: '提交订单',
    description: '2024-9-18 10:00'
  },
  {
    title: '支付订单',
    description: '2024-9-18 10:00'
  },
  {
    title: '平台发货',
    description: '2024-9-18 10:00'
  },
  {
    title: '确认收货'
  },
  {
    title: '完成评价'
  }
])

const ddxxData = ref({
  ddly: orderTopData.value.defaultData.order_source,
  ddlx: orderTopData.value.defaultData.order_type,
  tjsj: orderTopData.value.defaultData.update_date,
  zffs: orderTopData.value.defaultData.mode_payment,
  psfs: orderTopData.value.defaultData.mode_distribution,
  zfsj: '2024-09-12 02:42:00',
  wldh: '未发货',
  zdqrshsj: '2024-09-16 04:42:00',
  jfhk: '2000',
  czhk: '2000',
  yhzh: '1833323260582391810',
  hdxx: '无',
  sphjje: orderTopData.value.defaultData.order_money,
  yf: '',
  yhj: '',
  jfzk: '',
  hdyh: '',
  zkje: '',
  ddje: orderTopData.value.defaultData.order_money,
  yfkje: orderTopData.value.defaultData.order_money,
  shr: '1833323260582391810',
  sjhm: '188888888888',
  yzbm: '18300',
  shdz: '广东省深圳市南山区科兴科学园',
  fplx: '1',
  fptt: '1',
  qymc: '广东科技有限公司',
  qysh: '91440300MA5FQY***',
  qydz: '广东省深圳市南山区科兴科学园',
  fpnr: '商品名细',
  sprsj: '13566624',
  spryx: '33625@qq.com'
})

const cardList = ref([
  {
    title: '订单详情',
    type: 'exploit',
    formId: '1836249142368169986',
    defaultData: ddxxData.value
  },
  {
    title: '商品信息',
    type: 'design',
    formId: '1836298963389067265',
    enhanceData: {
      hideHeader: 'disabled'
    }
  },
  {
    title: '操作记录',
    type: 'design',
    formId: '1836318516001189890',
    enhanceData: {
      hideHeader: 'disabled'
    }
  }
])
</script>

<style lang="scss" scoped>
.step-orde-form-box {
  .order-top {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid rgb(233 233 233 / 100%);
  }

  .steps {
    width: calc(90% + 40px);
    padding: 30px 0;
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
            top: 15px;
          }

          .el-step__icon.is-text {
            width: 30px;
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
</style>
