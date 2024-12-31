<template>
  <div class="TeamDetails-box rounded-xl">
    <div class="flex border-box p-20px h-110px items-center">
      <div class="mr-15px">
        <el-avatar class="avatar" :size="60" :src="PropsData.tx" />
      </div>
      <div class="flex">
        <div>
          <div class="text-18px font-700 c-#666666 font-wryh h-28px flex items-center">
            {{ PropsData.name }}
          </div>
          <div class="text-14px c-#999999 flex items-center w-90%" style="line-height: 28px">
            {{ PropsData.tdjs }}
          </div>
        </div>
        <div class="flex items-center">
          <el-button type="primary" @click="dialogBjtd = true">
            <Icon icon="fa-solid:pen" class="mr-3px"></Icon>
            编辑团队
          </el-button>
          <el-button @click="dialogDel = true">
            <Icon icon="ic:sharp-delete" class="mr-3px"></Icon>
            删除团队
          </el-button>
        </div>
      </div>
    </div>
    <div class="flex w-100% mt-20px items-start">
      <!-- -->
      <div class="flex-shrink-0 w-70% mr-10px border-box p-20px">
        <div class="h-60px flex items-center">
          <div
            class="font-wryh font-700 c-#666666 text-14px pl-10px"
            style="border-left: 6px solid #409eff"
          >
            数据统计
          </div>
        </div>

        <LowTable tableId="1852234473116233730" :enhanceData="{ type: 'view' }"> </LowTable>
        <div class="h-60px flex items-center">
          <div
            class="font-wryh font-700 c-#666666 text-14px pl-10px"
            style="border-left: 6px solid #409eff"
          >
            团队动态
          </div>
        </div>
        <div
          v-for="(item, index) in tddtList"
          :key="index"
          class="flex pl-20px h-70px items-center"
          style="border-bottom: 1px solid rgb(233 233 233 / 100%)"
        >
          <div class="mr-20px">
            <el-avatar v-if="item.avatar" class="avatar" :size="35" :src="item.avatar" />
            <el-avatar
              v-else
              class="avatar"
              :size="35"
              src="https://oss.yckxt.com/chatgpt/upload/1/2024-10-30/1/f0ee8a3c7c9638a54940382568c9dpng_3.png"
            />
          </div>
          <div style="font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif">
            <div claas="h-24px flex items-center">
              <span class="mr-5px"> {{ item.xm }} </span>
              <template v-if="item.sjType == 0">
                <span class="mr-5px c-#409EFF"> {{ item.blueText }} </span>
                <span class="c-#666666"> {{ item.text }} </span>
              </template>
              <template v-else-if="item.sjType == 1">
                <span class="mr-5px c-#666666"> {{ item.text }}</span>
                <span class="c-#409EFF"> {{ item.blueText }} </span>
              </template>
            </div>
            <div class="text-12px h-24px flex items-center c-#999999">几秒前</div>
          </div>
        </div>
        <div class="h-100px pb-10px flex items-center justify-center  ">
          <el-button round  class="w-120px" style="height: 35px;">查看更多</el-button>
        </div>
      </div>
      <div class="w-25% ml-10px cylb border-box">
        <el-card>
          <template #header>
            <div class="flex h-60px items-center justify-between pl-20px pr-20px bg-#F9F9F9">
              <div class="text-16px c-#666666 font-wryh font-700"> 成员列表 </div>
              <div>
                <el-button-group @click="dialogDel = true">
                  <el-button style="width: 50px; height: 35px">
                    <Icon icon="formkit:left" class="c-#999999"></Icon>
                  </el-button>
                  <el-button style="width: 50px; height: 35px">
                    <Icon icon="formkit:right" class="c-#999999"></Icon>
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div
            v-for="(item, index) in cylbList"
            :key="index"
            class="h-70px flex items-center pl-20px pr-20px"
            style="border-bottom: 1px solid rgb(242 242 242 / 100%)"
          >
            <el-avatar class="avatar" :size="35" :src="item" />

            <span class="ml-10px c-#666666 font-700 font-wryh">小明</span>
            <span class="ml-10px c-#999999 font-wryh">销售总监</span>
            <Icon
              class="ml-auto c-#999999 cursor-pointer"
              icon="mingcute:delete-line"
              @click="iconClick"
            ></Icon>
          </div>
        </el-card>
      </div>
    </div>
  </div>

  <div class="dialog-bjtd">
    <el-dialog v-model="dialogBjtd" title="创建团队" width="720px" :before-close="handleClose">
      <FormView
        formType="add"
        handleType="returnData"
        showType="view"
        :showButton="false"
        :defaultData="PropsData"
        formId="1852168337334951938"
      ></FormView>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogBjtd = false">取消</el-button>
          <el-button type="primary" @click="dialogBjtdClick"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

  <div class="dialog-czqr">
    <el-dialog v-model="dialogDel" title="操作确认" width="450" :before-close="handleClose">
      <div class="flex p-20px h-100px">
        <div class="w-50px h-50px flex justify-center items-center">
          <el-avatar
            class="bg-white"
            :size="27"
            src="http://oss.yckxt.com/chatgpt/upload/1/2024-10-14/1/mdi--question-mark-circle-outline (1).png"
          />
        </div>
        <div class="mt-15px">
          <div class="text-16px c-#666666 font-700 h-28px">是否确定删除数据？</div>
          <div class="c-#999999 h-28px">是否确定删除数据？</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogDel = false">取消</el-button>
          <el-button type="primary" @click="dialogDelClick"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { FormView, LowTable } from '@/components/LowDesign/index'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'TeamDetails' })

const props = defineProps({
  data: {
    // 自定义的翻译文件
    type: Object,
    default: () => {}
  }
})
const PropsData = props.data
const cylbList = ref([])
cylbList.value = PropsData.cytx.split(',')

const dialogBjtd = ref(false)
const dialogBjtdClick = () => {
  dialogBjtd.value = false
  ElMessage({
    message: '保存成功',
    type: 'success'
  })
}
const handleClose = (done: () => void) => {
  done()
}

const dialogDel = ref(false)

const iconClick = () => {
  dialogDel.value = true
}

const dialogDelClick = () => {
  dialogDel.value = false
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

const tddtList = ref([
  {
    avatar:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-10-30/1/f0ee8a3c7c9638a54940382568c9dpng_3.png',
    xm: '赵小刚',
    blueText: '将 5 月日常迭代',
    text: '更新至已发布状态',
    fbTime: '几秒前',
    sjType: 0
  },
  {
    avatar:
      'https://oss.yckxt.com/chatgpt/upload/1/2024-10-30/1/f0ee8a3c7c9638a54940382568c9dpng_3.png',
    xm: '赵小刚',
    blueText: '将 5 月日常迭代',
    text: '更新至已发布状态',
    fbTime: '几秒前',
    sjType: 1
  },
  {
    avatar: 'http://oss.yckxt.com/chatgpt/upload/1/2024-10-30/1/formkit--people.png',
    xm: '赵小刚',
    blueText: '将 5 月日常迭代',
    text: '更新至已发布状态',
    fbTime: '几秒前',
    sjType: 0
  },
  {
    avatar: '',
    xm: '赵小刚',
    blueText: '将 5 月日常迭代',
    text: '更新至已发布状态',
    fbTime: '几秒前',
    sjType: 1
  }
])
</script>

<style lang="scss" scoped>
.TeamDetails-box {
  min-height: 500px;

  .font-wryh {
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
  }

  .border-box {
    border: 1px solid rgb(233 233 233 / 100%);
    border-radius: 10px;
    box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);

    .avatar {
      background-color: white;
    }
  }

  .cylb {
    ::v-deep(.el-card) {
      border: none;
      border-radius: 10px;
      box-shadow: none;

      .el-card__header {
        padding: 0;
      }

      .el-card__body {
        padding: 0;
        padding-bottom: 10px;
      }
    }
  }
}

.dialog-bjtd,
.dialog-czqr {
  ::v-deep(.el-overlay) {
    .el-dialog {
      border-radius: 5px;

      .el-dialog__header {
        display: flex;
        height: 50px;
        padding-top: 0;
        padding-bottom: 0;
        background-color: rgb(245 245 245 / 100%);
        border-radius: 5px 5px 0 0;
        box-shadow: 0 1px 1px rgb(233 233 233 / 100%);
        align-items: center;

        .el-dialog__title {
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #666;
        }

        .el-dialog__headerbtn {
          display: flex;
          height: 50px;
          align-items: center;
          justify-content: center;

          .el-icon {
            color: #999;
          }
        }
      }

      .el-dialog__footer {
        height: 60px;
        padding: 15px 20px;
        box-shadow: 0 1px 1px 0 rgb(233 233 233 / 100%) inset;

        .el-button {
          width: 80px;
          height: 30px;
          padding: 5px 15px;
          font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 12px;
        }
      }
    }
  }
}

.dialog-czqr {
  ::v-deep(.el-overlay) {
    .el-dialog__body {
      .el-avatar {
        background-color: white;
      }
    }
  }
}
</style>
