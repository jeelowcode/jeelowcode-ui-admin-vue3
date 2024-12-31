<template>
  <div class="riendshipForum-box">
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
        <Icon
          icon="ic:outline-search"
          :size="22"
          class="cursor-pointer search"
        ></Icon>
        <el-button type="primary" style="width: 100px; height: 35px" @click="inputVisible = true">
          <Icon icon="vaadin:plus" :size="18"></Icon>
          创建话题
        </el-button>
      </div>
    </div>
    <div class="bg-white mt-20px b-1px b-solid b-#e9e9e9">
      <div
        class="h-70px flex items-center pl-20px pr-20px"
        style="border-bottom: 1px solid #e9e9e9"
      >
        <div
          class="text-18px font-700 h-19px flex items-center c-#666666 b-l-6px b-r-0 b-t-0 b-b-0 b-#409EFF b-solid pl-10px font-wryh"
        >
          讨论板块
        </div>

        <div class="ml-auto text-14px c-#999999" style="font-family: '微软雅黑', sans-serif">
          总贴数量：1000
        </div>
      </div>

      <div>
        <LowTable tableId="1854408557228961794" :enhanceData="tabEnhanceData"> </LowTable>
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
        :enhanceData="{ updateDialog }"
        formId="1854442042421391362"
      ></FormView>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { LowTable } from '@/components/LowDesign/index'

defineOptions({ name: 'RiendshipForum' })
const inputValue = ref('')

const tabEnhanceData = ref({
  type: 'view'
})

const inputVisible = ref(false)

const updateDialog = () => {
  inputVisible.value = false
}
const dialogHandleClose = (done: () => void) => {
  done()
}
</script>

<style lang="scss" scoped>
.riendshipForum-box {
  width: 1200px;
  min-height: 500px;
  margin: 0 auto;
  // border: 1px solid rgb(233 233 233 / 100%);
  // box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);

  .font-wryh {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  }

  .top {
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
}

::v-deep(.el-overlay) {
  .el-dialog {
    border-radius: 5px;

    .el-dialog__header {
      padding: 18px 13px 18px 15px;
      background-color: #f5f5f5;
      border-radius: 5px 5px 0 0;

      .el-dialog__title {
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }

      .el-dialog__headerbtn {
        height: 60px;
      }
    }
  }

  .el-drawer {
    background-color: rgb(240 242 245 / 100%);
  }
}
</style>
