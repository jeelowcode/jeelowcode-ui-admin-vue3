<template>
  <!-- 订单详情类型表单与表单设计 -->
  <div class="step-orde-form-box">
    <div class="order-top">
      <div style="display: flex">
        <div class="tb-box">
          <img src="/public/img/11.jpg" style="height: 30px" />
        </div>
        <div class="title-box">
          <p class="title">{{ obj.gdbt }}</p>
          <div class="text-box">
            <span>20208447578</span>
            <div class="text-box-left">
              <span
                class="dian"
                :class="{ bj2: obj.gdzt == '2', color1: obj.gdzt == '3', bj4: obj.gdzt == '4' }"
              ></span>
              <span>{{obj.gdzt == '1'? '待处理': obj.gdzt == '2'? '已完结': obj.gdzt =='3'? '已退回': '已撤销'}}</span>
            </div>
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
        :formId="orderTopData.id"
      ></FormView>
    </div>
    <div class="steps" v-if="type != 'ycx'">
      <el-steps :active="type == 'ywj' ? 1 : active" align-center>
        <template v-for="(item, index) in stepList" :key="index">
          <el-step :title="item.title" :description="item.description" :icon="Avatar">
            <template #title>
              <div
                class="bzts"
                :class="{
                  acitive: index == 1,
                  color1: index == 1 && type == 'yth',
                  color2: index == 1 && type == 'ywj'
                }"
              >
                <span>{{ item.tooltip }}</span>
                <div
                  class="box"
                  :class="{
                    border: index == 1,
                    border1: index == 1 && type == 'yth',
                    border2: index == 1 && type == 'ywj'
                  }"
                ></div>
              </div>
              <div style="line-height: 32px">{{ item.title }}</div>
              <div v-if="index != 1" class="bubble">{{ item.text }}</div>
            </template>
          </el-step>
        </template>
      </el-steps>
    </div>
    <template v-for="item in cardList" :key="item.id">
      <div class="card flex justify-center mt-20px">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{ item.title }}</span>
            </div>
          </template>
          <template v-if="item.type == 'exploit'">
            <FormView
              formType="view"
              handleType="returnData"
              showType="view"
              :defaultData="ddxxData"
              :showButton="false"
              :formId="item.id"
            ></FormView>
          </template>
          <template v-if="item.type == 'design'">
            <LowTable :tableId="item.id" :enhanceData="item.enhanceData"> </LowTable>
          </template>
        </el-card>
      </div>
    </template>

    <div class="pljl">
      <div class="pt-10px" style="display: flex; align-items: center; margin-bottom: 20px">
        <span class="span"></span><span>评论记录</span>
      </div>
      <alert :data="listData"></alert>
      <!-- <div class="list-box" v-for="(item, index) in listData" :key="index">
        <div class="list-box-top">
          <div class="list-box-top-left">
            <div class="img"
              ><Icon icon="mingcute:user-3-fill" width="1024" height="1024" style="color: #fff"
            /></div>
            <p>
              <span style="font-size: 14px; color: #666">{{ item.name }}</span> {{ item.sj }}</p
            >
          </div>
          <div class="list-box-top-right">X</div>
        </div>
        <div class="list-box-bottom">{{ item.content }}</div>
      </div>
      <div>
        <el-input v-model="input" style="width: 92.5%; height: 60px" placeholder="请输入评论内容" />
        <el-button type="primary" class="el-buttons">发布</el-button>
      </div> -->
    </div>
    <div class="footer">
      <div class="pt-5px" style="display: flex; align-items: center; margin-bottom: 20px">
        <span class="span"></span><span>操作记录</span>
      </div>
      <div class="footer-list pt-20px">
        <el-steps :space="150" :active="czjlData.length" direction="vertical">
          <template v-for="(item, index) in czjlData" :key="index">
            <el-step :title="item.title" :description="item.description" last>
              <template #title>
                <div class="content flex h-100px">
                  <div
                    class="w-35px h-35px bg-#CCCCCC flex items-center justify-center mr-7px mt-10px ml-10px"
                    style="border-radius: 50%"
                  >
                    <Icon icon="mingcute:user-3-fill" :size="28" class="c-white" />
                  </div>
                  <div class="text-12px mt-10px grid grid-rows-3">
                    <div>
                      <span class="c-#999">
                        <span style="font-size: 14px; color: #666">{{ item.name }}</span>
                        {{ item.text }}
                      </span>
                    </div>
                    <div>
                      <span class="text c-#666">{{ item.content }}</span>
                    </div>
                    <div class="lzgd">
                      <span class="c-#666">来自工单：</span
                      ><span style="color: #999 !important">{{ item.gd }}</span>
                    </div>
                  </div>
                  <div class="text-12px ml-auto pr-40px mt-20px">
                    <div class="flex items-center">
                      <Icon icon="mingcute:time-line" :size="14" style="color: #999" />
                      <span class="c-#999" style="margin-left: 5px">{{ item.time }}</span>
                    </div>
                  </div>
                  <!-- <div class="content-top">
                    <div class="list-box-top-left">
                      <div class="img"
                        ><Icon icon="mingcute:user-3-fill" :size="28" style="color: #fff"
                      /></div>
                      <p>
                        <span style="font-size: 14px; color: #666">{{ item.name }}</span>
                        {{ item.text }}</p
                      >
                    </div>
                    <div class="list-box-top-right">
                      <Icon
                        icon="mingcute:time-line"
                        width="1024"
                        height="1024"
                        style="color: #999"
                      />
                      <span style="margin-left: 5px">{{ item.time }}</span>
                    </div>
                  </div>
                  <div class="content-bottom">
                    <div>
                      <p class="text">{{ item.content }}</p>
                    </div>
                    <div class="lzgd">
                      <span>来自工单：</span
                      ><span style="color: #999 !important">{{ item.gd }}</span>
                    </div>
                  </div> -->
                </div>
              </template>
            </el-step>
          </template>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar } from '@element-plus/icons-vue'
import { FormView, LowTable } from '@/components/LowDesign/index'
import alert from '@/views/lowTemplate/generalPage/workReport/components/alert.vue'

defineOptions({ name: 'OrderForm' })
interface Props {
  type?: string //控件名称
  obj: {
    gdbt: string
    gdzt: string
  }
}

const popupShow = defineModel({ default: false, type: Boolean })
const props = defineProps<Props>()


const listData = reactive([
  {
    id: 1,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: '2019-03-23 22:31',
    content: '这个客户是我们的重点客户，请相关同事尽快帮忙落实解决。'
  },
  {
    id: 2,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: '2019-03-23 22:31',
    content: '这个客户是我们的重点客户，请相关同事尽快帮忙落实解决。'
  },
  {
    id: 3,
    imgUrl:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-11-06/1/f0ee8a3c7c9638a54940382568c9dpng_5.png',
    name: '赵小刚',
    time: '2019-03-23 22:31',
    content: '这个客户是我们的重点客户，请相关同事尽快帮忙落实解决。'
  }
])

const orderTopData = ref({
  type: 'exploit',
  refKey: 'gdgl',
  id: '1844943768151142401',
  defaultData: {
    gdbh: '202062976600',
    gdbt: '处理客户反馈问题',
    gdzt: 1,
    lx: props.type
  }
})

const active = ref(0)

const stepList = ref([
  {
    title: '小明',
    tooltip: '提交',
    description: '2020-11-25 23:26:08',
    text: '已等待12小时30分钟'
  },
  {
    title: '赵小刚',
    tooltip: `${props.type == 'yth' ? '退回' : '完结'}`,
    description: '待处理'
  }
])

const czjlData = ref([
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content: '完结工单，共耗时：1小时16分钟 原因备注：无',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content: '完结工单，共耗时：1小时16分钟 原因备注：无',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content: '完结工单，共耗时：1小时16分钟 原因备注：无',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content: '完结工单，共耗时：1小时16分钟 原因备注：无',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content: '完结工单，共耗时：1小时16分钟 原因备注：无',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  }
])

const ddxxData = ref({
  gdbh: '20208447578',
  glkh: 1,
  gldd: 1,
  gdzz: 1,
  jycd: 1,
  tjry: '李小明',
  tjbm: '销售部',
  clry: '赵小刚',
  clbm: '技术部',
  tjsj: '2020-11-25 23:26:08',
  csry: '无',
  gdms: '客户反馈产品使用中遇到问题，希望技术协助。'
})

const cardList = ref([
  {
    title: '工单详情',
    type: 'exploit',
    id: '1845002998170267649',
    defaultData: ddxxData.value
  },
  {
    title: '附件记录',
    type: 'design',
    id: '1845012516400803842',
    enhanceData: {
      hideHeader: 'disabled'
    }
  }
])

const formViewRef = ref({})
const formData = ref({})

const setNextForm = () => {
  const currStep = orderTopData.value
  if (currStep.id) {
    setTimeout(async () => {
      // const formRef = formViewRef.value[currStep.refKey].controlRef
      // const data = await formRef.handleSubmit(true)
    }, 600)

    // formData.value[currStep.refKey] = data
  }
}
setNextForm()
</script>

<style lang="scss" scoped>
.step-orde-form-box {
  .order-top {
    display: flex;
    height: 80px;
    padding: 20px 25px;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid rgb(233 233 233 / 100%);
    align-items: center;
    justify-content: space-between;

    .tb-box {
      display: flex;
      width: 50px;
      height: 50px;
      line-height: 50px;
      justify-content: center;
      text-align: center;
      background: #52c1f5;
      border-radius: 50%;
      align-items: center;
    }

    .title-box {
      margin-left: 20px;

      .title {
        padding: 0;
        margin: 0;
        margin-bottom: 5px;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #666;
      }

      .text-box {
        display: flex;
        font-family: '微软雅黑', sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #666;
        align-items: center;

        .text-box-left {
          display: flex;
          align-items: center;

          .dian {
            display: inline-block;
            width: 6px;
            height: 6px;
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
    height: 90px;
    padding: 60px 0 30px;
    margin: 0 auto 20px;
    background-color: #fff;
    border: 1px solid rgb(233 233 233 / 100%);
    border-radius: 10px;

    ::v-deep(.el-steps) {
      margin-top: 9px;

      .el-step {
        .el-step__head.is-process {
          color: #409eff;

          .el-step__icon.is-text {
            color: white;
            background-color: #409eff;
            border-color: #409eff;
          }
        }

        .el-step__icon {
          width: 36px;
          height: 36px;
          color: #fff;
          background: #ccc;
          border-radius: 50%;
        }

        .el-step__head {
          .el-step__line {
            top: 30px;
            height: 5px;
            margin-right: 40px;
            margin-left: 40px;
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
            // position: relative;
            display: flex;
            justify-content: center;
            font-size: 12px;
            font-weight: 400;
            line-height: 25px;
            color: #666;
          }

          .el-step__description {
            height: 28px;
            font-size: 12px;
            line-height: 28px;
            color: #999;
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
        height: 60px;
        background-color: #f9f9f9;

        .card-header {
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 16px;
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
                font-size: 14px;
                font-weight: 700;
                color: #666;
                background-color: #f2f2f2;
              }
            }

            .el-table__body {
              .el-table__row {
                .el-table__cell {
                  font-size: 14px;
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

::v-deep .avue--detail .el-col,
::v-deep .avue--detail .el-row {
  border: 0 !important;
}

// ::v-deep .avue--detail .el-row {
//   border-top: 1px solid #fff !important;
//   border-left: 1px solid #fff !important;
// }

.bzts {
  position: absolute;
  top: 25px;
  width: 64px;
  height: 26px;
  margin-top: -70px;
  margin-left: -3px;
  line-height: 26px;
  color: #fff;
  text-align: center;
  background: #409eff;
  inherits: 0;

  .box {
    position: absolute;
    top: 26px;
    left: 25px;
    z-index: 999999999999999999;
    width: 0;
    height: 0;
    border-top: 8px solid #409eff;
    border-right: 10px solid transparent;
    border-left: 8px solid transparent;
  }
}

.bubble {
  position: absolute;
  top: -20px;
  right: -80px;
  padding: 2px 8px;
  font-family: '微软雅黑', sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  color: #999;
  background-color: #fff;
  border-radius: 10px;
}

.acitive {
  background: #ccc !important;
}

.border {
  border-top: 8px solid #ccc !important;
}

.pljl {
  // display: flex;
  margin: 30px 50px;

  .span {
    display: inline-block;
    width: 7px;
    height: 19px;
    margin-right: 10px;
    background: #409eff;
  }

  ::v-deep(.el-alert) {
    .el-alert__description {
      margin-top: 10px;
    }
  }

  // .list-box {
  //   width: 100%;
  //   padding: 20px;
  //   margin-bottom: 20px;
  //   background: #fcfcfc;
  //   border: 1px solid #e9e9e9;

  //   .list-box-top {
  //     display: flex;
  //     justify-content: space-between;

  //     .list-box-top-left {
  //       display: flex;
  //       font-family: '微软雅黑', sans-serif;
  //       font-size: 12px;
  //       font-weight: 400;
  //       color: #999;
  //       justify-content: center;
  //       align-items: center;

  //       .img {
  //         display: flex;
  //         width: 28px;
  //         height: 28px;
  //         margin-right: 10px;
  //         background: #ccc;
  //         border-radius: 50%;
  //         justify-content: center;
  //         align-items: center;
  //       }
  //     }
  //   }

  //   .list-box-bottom {
  //     font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
  //     font-style: normal;
  //     font-weight: 400;
  //     line-height: 22px;
  //     color: #999;
  //     text-align: left;
  //   }
  // }
}

.footer {
  margin: 30px 50px;
  margin-bottom: 0;

  .span {
    display: inline-block;
    width: 7px;
    height: 19px;
    margin-right: 10px;
    background: #409eff;
  }

  .footer-list {
    width: 100%;
    // height: 200px;
    // padding: 20px;

    ::v-deep(.el-steps) {
      .el-step.is-vertical {
        .el-step__head {
          &::after {
            top: 20px !important;
            width: 1px !important;
          }

          .el-step__line {
            top: -10px;
            bottom: -10px;
            width: 1px;
            margin-top: 25px;
            background-color: #f2f2f2;

            .el-step__line-inner {
              border-color: #f2f2f2;
              border-width: 0 !important;
            }
          }

          .el-step__icon {
            width: 10px !important;
            height: 10px;
            margin-top: 9px;
            margin-left: 7px;
            overflow: hidden;

            .el-step__icon-inner {
              color: #fff;
            }
          }
        }

        .el-step__main {
          .el-step__description.is-finish {
            color: #999;
          }
        }
      }

      .el-step:last-child {
        .el-step__head::after {
          position: absolute;
          top: 25px;
          right: 11px;
          z-index: 1;
          display: block;
          width: 10%;
          height: 110px;
          background-color: #f2f2f2;
          border-color: red;
          content: '';
        }
      }
    }

    .content {
      position: absolute;
      top: 30px;
      left: 53px;
      width: 95.5%;
      // padding: 10px;
      border-radius: 10px;
      box-shadow: 0 0 5px rgb(0 0 0 / 9.8%);

      // .content-top {
      //   display: flex;
      //   justify-content: space-between;
      //   width: 100%;

      //   .list-box-top-left {
      //     display: flex;
      //     font-family: '微软雅黑', sans-serif;
      //     font-size: 12px;
      //     font-weight: 400;
      //     color: #999;
      //     justify-content: center;
      //     align-items: center;

      //     .img {
      //       display: flex;
      //       width: 35px;
      //       height: 35px;
      //       margin-right: 10px;
      //       background: #ccc;
      //       border-radius: 50%;
      //       justify-content: center;
      //       align-items: center;
      //     }
      //   }

      //   .list-box-top-right {
      //     display: flex;
      //     font-family: '微软雅黑', sans-serif;
      //     font-size: 12px;
      //     font-weight: 400;
      //     line-height: 20px;
      //     color: #999;
      //     align-items: center;
      //   }
      // }

      // .content-bottom {
      //   margin-top: -10px;
      //   margin-left: 40px;
      //   font-size: 12px;

      //   p {
      //     padding: 0;
      //     margin: 0;
      //   }

      //   .text {
      //     font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
      //     font-size: 12px;
      //     font-style: normal;
      //     font-weight: 400;
      //     line-height: 20px;
      //     color: #666;
      //     text-align: left;
      //   }

      //   .lzgd {
      //     font-family: '微软雅黑', sans-serif;
      //     font-size: 12px;
      //     font-style: normal;
      //     font-weight: 400;
      //     color: #666;
      //     text-align: left;
      //   }
      // }
    }
  }
}

::v-deep(.el-steps) {
  .el-step__head {
    .el-step__line {
      background-color: var(--el-color-info-light-7);
    }

    .el-step__icon {
      width: 30px;
    }

    &.is-finish {
      .el-step__line {
        background-color: var(--el-color-primary);
      }
    }
  }

  .el-step:not(:last-child) {
    .el-step__head {
      &.is-process::before {
        position: absolute;
        top: calc(50% + 11px);
        right: -40px;
        z-index: 1;
        display: block;
        width: 50%;
        height: 5px;
        background-color: var(--el-color-primary);
        content: '';
      }
    }
  }
}

::v-deep .el-textarea__inner {
  padding: 10px !important;
  color: #7e667e !important;
  background: #fcfcfc !important;
}

::v-deep .el-input__wrapper {
  border-radius: 0;
}

::v-deep .el-buttons {
  height: 60px;
  padding: 20px 30px;
  border-radius: 0;
}

.color1 {
  background: #f56c6c !important;
}

.border1 {
  border-top: 8px solid #f56c6c !important;
}

.color2 {
  background: #19be6b !important;
}

.border2 {
  border-top: 8px solid #19be6b !important;
}

.bj2 {
  background: #19be6b !important;
}

.bj4 {
  background: #ccc !important;
}
</style>
