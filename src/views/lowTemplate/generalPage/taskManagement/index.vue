<template>
  <div class="taskManagement-box flex rounded-xl">
    <div class="flex-shrink-0 flex-basis-180px bg-#F9F9F9 taskManagement-left">
      <div class="h-50px flex items-center ml-55px mt-20px text-14px c-#999999">
        <Icon icon="ion:flag-outline" :size="15" class="mr-1px"></Icon>
        任务分类
      </div>
      <el-menu
        :default-active="menuDefaultActive"
        class="el-menu-vertical-demo bg-#F9F9F9"
        @open="menuHandleOpen"
        @close="menuHandleClose"
      >
        <template v-for="item in meunList" :key="item.value">
          <el-menu-item :index="item.value">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="flex-1 bg-white p-31px taskManagement-right" style="max-width: calc(100% - 180px)">
      <div class="mt-10px flex items-center util">
        <el-radio-group v-model="viewOrListRadio">
          <el-radio-button label="看板视图" value="view" />
          <el-radio-button label="列表显示" value="list" />
        </el-radio-group>

        <el-select v-model="selectValue" :fit-input-width="true">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button class="ml-auto w-100px" type="primary" @click="dialogDisplay = true">
          <Icon icon="oi:plus" :size="11"></Icon>
          <span>创建任务</span>
        </el-button>
      </div>
      <div v-if="viewOrListRadio == 'view'" class="w-100% grid grid-cols-4 gap-x-15px mt-30px">
        <div v-for="(LItem, LIndex) in viewList" :key="LIndex">
          <div class="c-#666666 text-14px mb-15px">
            <span
              class="font-700"
              style="font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif"
            >
              {{ LItem.title }}
            </span>
            <span class="ml-5px" style="font-family: '微软雅黑', sans-serif">
              <span v-if="LItem.title == '今日任务'">0/</span>{{ LItem.len }}
            </span>
          </div>

          <div v-for="item in LItem.list" :key="item.id" class="flex card-item">
            <div class="h-29px flex items-center">
              <div
                v-if="ViewVhecked.indexOf(LItem.title + item.id) !== -1"
                class="check flex items-center justify-center"
              >
                <Icon
                  icon="fa-solid:check"
                  :size="11"
                  @click="checkedClick(LItem.title + item.id)"
                ></Icon>
              </div>
              <div v-else @click="checkedClick(LItem.title + item.id)" class="nocheck"> </div>
            </div>
            <div class="grid grid-rows-3 h-100% ml-10px">
              <div
                class="text-14px flex items-center c-#666666 cursor-pointer title-hover"
                :class="ViewVhecked.indexOf(LItem.title + item.id) !== -1 ? 'line-through' : ''"
                @click="titleClick(item)"
              >
                {{ item.title }}，点击查看详情
              </div>
              <div class="flex text-12px items-center">
                <span>
                  {{ item.xmmc }}
                </span>
                <div class="c-#CCCCCC flex items-center ml-15px">
                  <Icon icon="mage:message" :size="14"></Icon>
                  <span class="ml-3px">{{ item.lys }}</span>
                </div>
                <div class="c-#CCCCCC flex items-center ml-5px">
                  <Icon icon="line-md:link" :size="14"></Icon>
                  <span class="ml-3px">{{ item.ljs }}</span>
                </div>
              </div>
              <div class="flex items-center" :class="LItem.title == '未完成' ? 'c-#F56C6C' : ''">
                <Icon icon="icon-park-outline:alarm-clock" :size="14"></Icon>
                <span class="text-12px ml-3px"> {{ item.jzsjTit }}</span>
              </div>
            </div>
            <div class="flex items-center justify-center flex-1">
              <el-avatar :size="24" :src="item.tx" />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="viewOrListRadio == 'list'" class="mt-20px">
        <LowTable
          :ref="(el) => (tableListRef = el)"
          tableId="1847103675560071169"
          :enhanceData="{ type: 'view' }"
        >
        </LowTable>
      </div>
    </div>
  </div>
  <div>
    <div class="add-dialog">
      <el-dialog
        v-model="dialogDisplay"
        title="新建任务"
        width="550"
        :before-close="dialogHandleClose"
      >
        <FormView
          formType="add"
          :ref="(el) => (dialogRef = el)"
          handleType="returnData"
          showType="view"
          :showButton="false"
          formId="1846825131881762817"
        ></FormView>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogDisplay = false">取消</el-button>
            <el-button type="primary" @click="dialogSuccess"> 保存 </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div class="row-dialog">
      <el-dialog
        v-model="rowDialog"
        title="任务详情"
        width="900px"
        :before-close="dialogHandleClose"
      >
        <FormView
          formType="edit"
          handleType="returnData"
          showType="view"
          :showButton="false"
          :defaultData="rowDefaultData"
          formId="1850013430948507650"
        ></FormView>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormView, LowTable } from '@/components/LowDesign/index'
import * as TableApi from '@/api/design/table'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'TaskManagement' })

const viewOrListRadio = ref('view')
const selectValue = ref('default')
watch(
  () => selectValue.value,
  (val) => {
    console.log(val, '111')
  }
)
watch(
  () => viewOrListRadio.value,
  (val) => {
    console.log(val, '111')
  }
)
interface Record {
  fj?: string
  jzsj?: Date
  kssj?: Date
  status?: string
  xmmc?: string
  tx?: string
  title?: string
  id?: string
  lys?: string
  ljs?: string
  jzsjTit?: string
}
interface ViewList {
  title: string
  list?: Record[]
  len?: number
}

const viewList = ref<ViewList[]>([])
let ViewVhecked = ref<any>([])
const checkedClick = (id) => {
  let index = ViewVhecked.value.indexOf(id)
  if (index === -1) {
    ViewVhecked.value.push(id)
  } else {
    ViewVhecked.value.splice(index, 1)
  }
}

const meunList = ref([
  { value: '1', title: '全部任务' },
  { value: '2', title: '我创建的任务' },
  { value: '3', title: '我参与的任务' },
  { value: '4', title: '下属的任务' },
  { value: '5', title: '关注的任务' }
])
const menuDefaultActive = ref('1')

const menuHandleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const menuHandleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const selectOptions = [
  {
    value: 'default',
    label: '按默认视图',
    subItem: [
      { title: '今日任务', total: 0, completed: 0 },
      { title: '进行中', total: 0, completed: 0 },
      { title: '未完成', total: 0, completed: 0 },
      { title: '已完成', total: 0, completed: 0 }
    ]
  },
  {
    value: 'degree',
    label: '按紧要程度',
    subItem: [
      { title: '重要', total: 0, completed: 0 },
      { title: '紧急', total: 0, completed: 0 },
      { title: '普通', total: 0, completed: 0 },
      { title: '较低', total: 0, completed: 0 }
    ]
  },
  {
    value: 'endTime',
    label: '按截止时间',
    subItem: [
      { title: '已逾期', total: 0, completed: 0 },
      { title: '今天', total: 0, completed: 0 },
      { title: '三天内', total: 0, completed: 0 },
      { title: '七天内', total: 0, completed: 0 }
    ]
  },
  {
    value: 'updateTime',
    label: '按更新时间',
    subItem: [
      { title: '今天', total: 0, completed: 0 },
      { title: '七天内', total: 0, completed: 0 },
      { title: '十五天', total: 0, completed: 0 },
      { title: '更远', total: 0, completed: 0 }
    ]
  }
]

const dialogHandleClose = (done: () => void) => {
  done()
}

const dialogDisplay = ref(false)
const rowDialog = ref(false)
const dialogRef = ref()

const tableListRef = ref()

const dialogSuccess = async () => {
  const formRef = dialogRef.value.controlRef
  const listRef = tableListRef.value.crudRef
  const data = await formRef.handleSubmit(true)
  if (data) {
    listRef.refreshChange()
    dialogDisplay.value = false
  }
}
const rowDefaultData = ref({})
const titleClick = (row) => {
  row.jzsj ? (row.jzsj = formatDate(row.jzsj)) : (row.jzsj = '')
  row.kssj ? (row.kssj = formatDate(row.kssj)) : (row.kssj = '')
  rowDefaultData.value = row
  rowDialog.value = true
}
onMounted(async () => {
  let { records } = await TableApi.getTableList(
    '1847103675560071169',
    { pageNo: 1, pageSize: 40 },
    false
  )

  const categorizedRecords: { [key: string]: Record[] } = {
    今日任务: [],
    进行中: [],
    未完成: [],
    已完成: []
  }
  records.forEach((ele) => {
    const ljs = ele.fj ? (ele.fj.includes(',') ? ele.fj.split(',').length : 1) : 0
    ele.ljs = ljs
    ele.jzsjTit = ele.jzsj ? `${formatDate(ele.jzsj)} 截止` : ''

    let keys: string[] = []
    if (ele.kssj && formatDate(ele.kssj).startsWith('2024-10-03')) {
      keys.push('今日任务')
    }

    let statusDictionary = [
      { id: 1, label: '进行中' },
      { id: 2, label: '已完成' },
      { id: 3, label: '未完成' }
    ]
    statusDictionary.forEach((item) => {
      if (ele.status == item.id) {
        keys.push(item.label)
      }
    })

    keys.forEach((item) => {
      if (categorizedRecords[item]) {
        categorizedRecords[item].push(ele)
        if (item == '已完成') {
          ViewVhecked.value.push('已完成' + ele.id)
        }
      }
    })
  })

  for (const [title, list] of Object.entries(categorizedRecords)) {
    viewList.value.push({
      title,
      list,
      len: list.length
    })
  }
})
</script>

<style lang="scss" scoped>
.taskManagement-box {
  min-height: 500px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgb(0 0 0 / 4.71%);

  .taskManagement-left {
    border: 1px solid rgb(233 233 233 / 100%);
    border-right: none;
    border-radius: 10px 0 0 10px;

    .el-menu {
      background-color: rgb(255 255 255 / 0%);
      border-right: none;

      .is-active {
        font-weight: bold;
        background-color: #e7f0fa;
        border-right: 3px solid #409eff;
      }

      .el-menu-item {
        height: 50px;
        padding-left: 55px;
        font-size: 14px;
      }
    }
  }

  .taskManagement-right {
    border: 1px solid rgb(233 233 233 / 100%);
    border-radius: 0 10px 10px 0;

    .util {
      ::v-deep(.el-radio-group) {
        .el-radio-button {
          .el-radio-button__inner {
            display: flex;
            width: 101px;
            height: 35px;
            font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
            font-size: 14px;
            color: #999;
            align-items: center;
            justify-content: center;
          }

          &.is-active {
            .el-radio-button__inner {
              color: white;
            }
          }
        }
      }

      ::v-deep(.el-select) {
        width: 239px;
        margin-left: 20px;

        .el-select__wrapper {
          min-height: 35px;
          font-size: 14px;
          line-height: 30px;
        }
      }

      .el-button {
        height: 35px;
        font-size: 14px;
      }
    }

    .card-item {
      height: 87px;
      padding: 10px;
      margin-bottom: 15px;
      color: #999;
      border-radius: 5px;
      box-shadow: 0 0 5px rgb(153 153 153 / 34.9%);

      .title-hover:hover {
        color: rgb(51 51 51);
      }

      .check,
      .nocheck {
        width: 14px;
        height: 14px;
        cursor: pointer;
        border-radius: 2px;
      }

      .check {
        color: white;
        background-color: #409eff;
        border: 1px solid #409eff;
        border-radius: 2px;
      }

      .nocheck {
        border: 1px solid #ccc;

        &:hover {
          border-color: #409eff;
        }
      }
    }
  }
}

.add-dialog {
  ::v-deep(.el-overlay) {
    .el-dialog {
      border-radius: 5px;

      .el-dialog__header {
        padding: 13px 13px 13px 15px;
        background-color: #f5f5f5;
        border-radius: 5px 5px 0 0;

        .el-dialog__title {
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑', sans-serif;
          font-size: 14px;
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
                width: 14px;
                height: 14px;
              }

              .el-checkbox__label {
                font-size: 14px;
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
}

.row-dialog {
  ::v-deep(.el-overlay) {
    .el-dialog__header {
      height: 24.8px;
      padding: 16px 10px 16px 16px;
      font-size: 18px;
      border-bottom: 1px solid rgb(240 240 240);

      .el-dialog__headerbtn {
        height: 58.6px;
      }
    }
  }
}

::v-deep .el-select__placeholder {
  font-family: '微软雅黑', sans-serif;
  font-style: normal;
  font-weight: 400;
  color: #666;
  text-align: left;
}
</style>
<style>
.el-select__popper {
  .el-select-dropdown__item {
    font-family: MicrosoftYaHei, '微软雅黑 Regular', '微软雅黑', sans-serif;
    font-size: 14px;

    &.is-selected {
      font-weight: 100;
    }
  }
}
</style>
