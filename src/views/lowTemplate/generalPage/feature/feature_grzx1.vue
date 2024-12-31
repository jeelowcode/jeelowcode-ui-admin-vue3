<template>
  <div class="grzx_box w-95% bg-white flex">
    <el-menu
      :default-active="mentDefaultActive"
      class="pt-25px el-menu-vertical-demo"
      @select="handleSelect"
    >
      <template v-for="item in menuList" :key="item.id">
        <el-menu-item class="flex justify-center" :index="item.index">
          <span> {{ item.menuItemTitle }}</span>
        </el-menu-item>
      </template>
    </el-menu>

    <div class="use-lowdesign">
      <template v-if="richFormView.defaultData.richText">
        <FormView
          formType="view"
          handleType="returnData"
          showType="view"
          :defaultData="richFormView.defaultData"
          :enhanceData="richFormView.enhanceData"
          :formId="richFormView.formId"
        ></FormView>
      </template>

      <template v-else>
        <template v-if="menuContent.type == 'exploit'">
          <div class="content p-40px">
            <div class="title text-18px pl-7px mb-20px fw600 c-#666666">
              {{ menuContent.title }}
            </div>
            <FormView
              formType="edit"
              handleType="returnData"
              showType="view"
              :defaultData="menuContent.defaultData"
              :formId="menuContent.formId"
            ></FormView>
          </div>
        </template>
        <template v-if="menuContent.type == 'design'">
          <div class="content p-40px">
            <div>
              <div class="title text-18px pl-7px mb-20px fw600 c-#666666">
                {{ menuContent.title }}
              </div>
              <div class="xttz-util flex" v-if="menuContent.tableId == '1840642756645044226'">
                <div v-for="item in xttzBtnList" :key="item.id">
                  <el-button
                    :class="xttzActiveClass == item.id ? 'is-active' : ''"
                    @click="xttzBtnClick(item.id)"
                    >{{ item.title }}</el-button
                  >
                </div>
                <div class="all-read">
                  <el-button>全部标记为已读</el-button>
                </div>
              </div>
            </div>
            <LowTable
              ref="xttzTable"
              :tableId="menuContent.tableId"
              :enhanceData="menuContent.defaultData"
              :fixed-search="xttzActiveClass != 1 ? { type: xttzActiveClass } : {}"
            >
            </LowTable>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormView, LowTable } from '@/components/LowDesign/index'

const menuList = ref([
  { id: 1, index: 'zlsz', menuItemTitle: '资料设置' },
  { id: 2, index: 'xgmm', menuItemTitle: '修改密码' },
  { id: 3, index: 'dljl', menuItemTitle: '登录记录' },
  { id: 4, index: 'xttz', menuItemTitle: '系统通知' },
  { id: 5, index: 'xxsz', menuItemTitle: '消息设置' }
])

const xttzBtnList = ref([
  { id: 1, title: '全部消息' },
  { id: 2, title: '服务消息' },
  { id: 3, title: '活动消息' },
  { id: 4, title: '产品消息' },
  { id: 5, title: '安全消息' },
  { id: 6, title: '故障消息' }
])
const xttzActiveClass = ref(1)

const mentDefaultActive = ref('zlsz')

const menuContentList = ref({
  zlsz: {
    title: '基本资料',
    formId: '1840295435986018306',
    type: 'exploit',
    defaultData: {
      dlzh: 'Windir',
      updateImg: 'http://oss.yckxt.com/chatgpt/upload/1/2024-09-30/1/user.png',
      updateBtn: 'http://oss.yckxt.com/chatgpt/upload/1/2024-09-30/1/user.png'
    }
  },
  xgmm: {
    title: '修改密码',
    formId: '1840567733712330753',
    type: 'exploit'
  },
  dljl: {
    title: '登录记录',
    tableId: '1840577516125323266',
    type: 'design',
    defaultData: {
      type: 'view'
    }
  },
  xttz: {
    title: '系统通知',
    tableId: '1840642756645044226',
    type: 'design',
    defaultData: {
      type: 'view',
      rowClick(row) {
        if (row.rich_text) {
          richFormView.value.defaultData = {
            richText: row.rich_text,
            type: row.$type,
            title: row.title,
            createTime: row.create_time
          }
        }
      }
    }
  },
  xxsz: {
    title: '消息设置',
    tableId: '1843476389638443010',
    type: 'design',
    defaultData: {
      type: 'view'
    }
  }
})

const xttzTable = ref()

interface RichFormViewDefault {
  createTime: string
  title?: string
  type?: string
  richText?: String
}

const richFormView = ref({
  formId: '1840671420115873794',
  enhanceData: {
    richDisplay: false
  },
  defaultData: {
    type: '',
    title: '',
    createTime: '',
    richText: ''
  } as RichFormViewDefault
})

watch(
  () => richFormView.value.enhanceData.richDisplay,
  (val) => {
    richFormView.value.defaultData.richText = ''
  }
)

const menuContent = ref(menuContentList.value[mentDefaultActive.value])

const handleSelect = (key: string, keyPath: string[]) => {
  if (menuContent.value !== menuContentList.value[key] && richFormView.value.defaultData.richText) {
    richFormView.value.defaultData.richText = ''
  }

  menuContent.value = menuContentList.value[key]
}

const xttzBtnClick = (id: number) => {
  xttzActiveClass.value = id
  xttzTable.value.resetChange()
}
</script>

<style lang="scss" scoped>
.grzx_box {
  min-height: 800px;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);

  .el-menu {
    width: 180px;
    min-height: 800px;
    flex-shrink: 0;
    background-color: #fcfcfc;
    border-radius: 5px 0 0 5px;

    .el-menu-item {
      height: 45px;

      span {
        display: flex;
        height: 100%;
        align-items: center;
        font-size: 14px;
      }

      &.is-active {
        font-weight: bold;
        background-color: rgb(64 158 255 / 9.8%);
        border-right: 3px solid rgb(64 158 255 / 100%);
      }
    }
  }

  .use-lowdesign {
    width: calc(100% - 180px);

    .content {
      width: calc(100% - 80px);
      height: calc(100% - 80px);

      .title {
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
        line-height: 16px;
        border-left: 6px solid #409eff;
      }

      .xttz-util {
        margin-bottom: 20px;

        .el-button {
          display: flex;
          width: 80px;
          height: 30px;
          margin-right: 10px;
          font-size: 12px;
          color: #999;

          &.is-active {
            color: #409eff;
            background-color: white;
            border-color: #409eff;
          }
        }

        .all-read {
          margin-left: auto;

          .el-button {
            border: none;

            &:hover {
              background-color: rgb(255 255 255 / 0%);
            }
          }
        }
      }
    }
  }
}
</style>
