<template>
  <div>
    <div class="footer">
      <!-- <div style="display: flex; align-items: center; margin-bottom: 20px">
        <span class="span"></span><span>操作记录</span>
      </div> -->
      <div class="footer-list">
        <el-steps :space="150" :active="czjlData.length" direction="vertical">
          <template v-for="(item, index) in czjlData" :key="index">
            <el-step :title="item.title" :description="item.description" last>
              <template #title>
                <div class="content flex h-100px">
                  <div class="img mt-10px"
                    ><Icon icon="mingcute:user-3-fill" :size="25" style="color: #fff"
                  /></div>
                  <div class="w-[calc(100%-45px)] mt-6px mb-6px grid grid-rows-3">
                    <div class="content-top">
                      <div class="list-box-top-left">
                        <span style="font-size: 14px; color: #666">{{ item.name }}</span>
                        <p class="font" style="margin-left: 5px">{{ item.text }}</p>
                      </div>
                      <div class="list-box-top-right pr-20px mt-30px">
                        <!-- <div> -->
                        <span class="box"></span>
                        <span style="margin: 0 10px 0 5px">正常</span>
                        <span>完成进度：50%</span>
                        <!-- </div> -->
                      </div>
                    </div>
                    <!-- <div class="content-bottom"> -->
                    <div>
                      <p class="text">{{ item.content }}</p>
                    </div>
                    <div class="lzgd">
                      <Icon icon="mingcute:time-line" :size="14" style="color: #999" />
                      <span style="color: #999 !important">{{ item.time }}</span>
                    </div>
                    <!-- </div> -->
                  </div>
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
const czjlData = ref([
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content:
      '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content:
      '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content:
      '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content:
      '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  },
  {
    title: '',
    description: '08-23',
    text: '销售经理',
    name: '赵小刚',
    content:
      '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
    gd: '工单标题',
    time: '2020-12-23 22:31'
  }
])
</script>

<style lang="scss" scoped>
.footer {
  margin: 30px 50px;
  margin-bottom: 50px;

  .span {
    display: inline-block;
    width: 8.5px;
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
          .el-step__line {
            width: 1px;
            margin-top: 25px;
            background-color: #f2f2f2;
          }

          .el-step__icon {
            width: 10px !important;
            height: 10px;
            margin-top: -20px;
            margin-left: 7px;
            overflow: hidden;

            .el-step__icon-inner {
              color: #fff;
            }
          }
        }

        .el-step__main {
          margin-top: 2px;

          .el-step__description.is-finish {
            color: #999;
          }
        }
      }

      // .el-step:last-child {
      //   .el-step__head::after {
      //     position: absolute;
      //     top: 25px;
      //     right: 11px;
      //     z-index: 1;
      //     display: block;
      //     width: 1.6px;
      //     height: 110px;
      //     background-color: #f2f2f2;
      //     border-color: red;
      //     content: '';
      //   }
      // }
    }

    .content {
      position: absolute;
      top: 35px;
      left: 53px;
      width: 95.5%;
      padding:0 10px;
      border-radius: 10px;
      box-shadow: 0 0 5px rgb(0 0 0 / 9.8%);

      .img {
        display: flex;
        width: 35px;
        height: 35px;
        margin-right: 10px;
        background: #ccc;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
      }

      .content-top {
        display: flex;
        justify-content: space-between;

        .list-box-top-left {
          display: flex;
          font-family: '微软雅黑', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #999;
          align-items: center;
        }

        .list-box-top-right {
          display: flex;
          font-family: '微软雅黑', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #666;
          align-items: center;

          .box {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: #51d351;
            border-radius: 50%;
          }
        }
      }

      // .content-bottom {
      // margin-top: -10px;
      // margin-left: 38px;
      // font-size: 12px;

      p {
        padding: 0;
        margin: 0;
      }

      .text {
        margin: 5px 0;
        font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        color: #666;
        text-align: left;
      }

      .lzgd {
        display: flex;
        font-family: '微软雅黑', sans-serif;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        color: #666;
        text-align: left;
        align-items: center;
      }
    }
    // }
  }
}

::v-deep(.el-steps) {
  .el-step__head {
    .el-step__line {
      background-color: var(--el-color-info-light-7);
    }

    .el-step__icon {
      width: 30px !important;
    }

    &.is-finish {
      margin-top: 5px;
      color: #f2f2f2 !important;
      border-color: #f2f2f2 !important;

      .el-step__line {
        background-color: var(--el-color-primary);
      }
    }
  }

  .el-step:not(:last-child) {
    .el-step__head {
      &.is-process::before {
        position: absolute;
        top: calc(50% - 1px);
        right: 0;
        z-index: 1;
        display: block;
        width: 50%;
        height: 2px;
        background-color: var(--el-color-primary);
        content: '';
      }
    }
  }
}

::v-deep .el-step__icon.is-text {
  // margin-top: -20px;
  color: #666 !important;
  border-color: #409eff !important;
}

.font {
  font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
}
</style>
