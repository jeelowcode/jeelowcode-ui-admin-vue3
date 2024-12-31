<template>
  <div class="w-80% m-auto search">
    <div class="bg-white h-60px p-20px mt-10px flex items-center top b-1px b-solid b-#e9e9e9">
      <div class="mr-15px">
        <Icon icon="flowbite:messages-solid" :size="52" class="c-#999999"></Icon>
      </div>
      <div class="">
        <div class="h-24px c-#666666"> 欢迎来到内部交流论坛 </div>
        <div class="h-24px c-#999999 text-12px font-wryh flex items-center">
          你可以自由选择你感兴趣的话题
        </div>
      </div>
      <div class="ml-auto flex top-right">
        <el-input v-model="inputValue" placeholder="输入搜索关键字" class="mr-20px h-35px" />
        <Icon icon="ic:outline-search" :size="22" class="cursor-pointer search"></Icon>
        <el-button type="primary" style="width: 100px; height: 35px" @click="inputVisible = true">
          <Icon icon="vaadin:plus" :size="18"></Icon>
          创建话题
        </el-button>
      </div>
    </div>
    <div class="bg-white b-1px b-solid b-#E9E9E9 w-100%">
      <div
        class="h-70px flex items-center pl-20px pr-20px"
        style="border-bottom: 1px solid #e9e9e9"
      >
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="最新话题" name="first"></el-tab-pane>
          <el-tab-pane label="热门话题" name="second"></el-tab-pane>
        </el-tabs>

        <div class="ml-auto text-14px c-#999999" style="font-family: '微软雅黑', sans-serif">
          总贴数量：1000
        </div>
      </div>
      <div class="w-[calc(100%-60px)] pl-30px pr-30px mt-20px">
        <LowTable
          :ref="(el) => (tabRef = el)"
          tableId="1854716968965484545"
          :enhanceData="tabEnhanceData"
        >
        </LowTable>
      </div>
    </div>
    <el-dialog
      v-model="inputVisible"
      title="创建话题"
      width="800"
      :before-close="dialogHandleClose"
      destroy-on-close
    >
      <FormView
        formType="add"
        handleType="returnData"
        showType="view"
        :showButton="true"
        :enhanceData="{ updateDialog, type: 'add' }"
        formId="1854442042421391362"
      ></FormView>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { FormView, LowTable } from '@/components/LowDesign/index'
import type { TabsPaneContext } from 'element-plus'

const inputValue = ref('')
const inputVisible = ref(false)

const updateDialog = () => {
  inputVisible.value = false
  tabRef.value.crudRef.refreshChange()
}
const dialogHandleClose = (done: () => void) => {
  done()
}
const tabEnhanceData = ref({
  type: 'view'
})
const tabRef = ref()
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style lang="scss" scoped>
.search {
  .border-style {
    border: 1px solid rgb(233 233 233 / 100%);
  }

  .font-wryh {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  }

  .top {
    margin-bottom: 20px;

    ::v-deep(.el-input) {
      width: 250px;

      .el-input__wrapper {
        // color: rgb(204, 204, 204);
        border-radius: 200px;

        &:hover {
          box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
        }
      }
    }

    .top-right {
      position: relative;

      .search {
        position: absolute;
        top: 50%;
        left: 220px;
        color: #999;
        transform: translateY(-50%);

        &:hover {
          color: #409eff !important;
        }
      }
    }
  }

  ::v-deep(.el-tabs) {
    .el-tabs__header {
      margin: 0;

      .el-tabs__nav-wrap {
        &::after {
          height: 0;
        }

        .el-tabs__nav-scroll {
          .el-tabs__item {
            width: 100px;
            height: 70px;
            padding: 0;
            font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: #666;

            &.is-active {
              color: rgb(64 158 255);
            }
          }

          .el-tabs__active-bar {
            height: 1px;
          }
        }
      }
    }
  }

  .c-group {
    ::v-deep(.el-radio-button) {
      .el-radio-button__inner {
        width: 100px;
        height: 30px;
        border-width: 0;
      }

      &.is-active {
        .el-radio-button__inner {
          border-radius: 50px;
        }
      }
    }
  }
}
</style>
