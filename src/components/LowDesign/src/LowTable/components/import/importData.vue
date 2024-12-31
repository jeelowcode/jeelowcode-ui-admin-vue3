<template>
  <div class="import-data-box pb-50px!">
    <div class="top-steps">
      <el-steps :active="stepValue" align-center finish-status="finish" process-status="finish">
        <el-step
          v-for="(title, index) in stepList"
          :key="title"
          :class="{ success: stepValue > index, active: stepValue == index }"
        >
          <template #title>
            <div class="text-14px"> {{ title }} </div>
          </template>
          <template #icon>
            <div class="step-icon"></div>
          </template>
        </el-step>
      </el-steps>
    </div>
    <div class="import-content">
      <div v-if="stepValue == 0">
        <div class="file-item flex" v-for="(item, key) in uploadList" :key="key">
          <div class="item-icon flex-basis-100px flex-shrink-0 bg-[var(--el-fill-color-light)]">
            <Icon color="#999" :icon="item.icon" :size="60"></Icon>
          </div>
          <div class="flex-1 pl-20px pt-10px pb-10px">
            <div class="text-16px">{{ item.title }}</div>
            <div class="text-14px pt-10px pb-10px">{{ item.tip }}</div>
            <div v-if="key != 'upload' || (key == 'upload' && !files?.length)">
              <el-button type="primary" :loading="item.loading" link @click="fileOption(key)">
                {{ item.btnText }}
              </el-button>
            </div>
            <div v-if="key == 'upload' && files?.length" class="flex items-center">
              <Icon :size="14" icon="ep:link"></Icon>
              <div class="c-#409EFF pl-2px">{{ files[0].name }}</div>
              <div class="c-#999">（{{ fileSizeFormatter(files[0], 'size', files[0].size) }}）</div>
              <Icon :size="14" icon="ep:close" @click="reset" class="cursor-pointer"></Icon>
            </div>
          </div>
        </div>
      </div>
      <div v-if="stepValue == 1">
        <ImportView
          ref="viewRef"
          :dbformId="importId"
          :batchCode="importInfo.batchCode"
          :calc-height="isFull ? 80 : 215"
          @set-import-info="setImportInfo"
        ></ImportView>
      </div>
      <div v-else-if="stepValue == 2" class="w-80% m-auto mt-40px mb-80px">
        <el-progress
          :text-inside="true"
          :stroke-width="18"
          :percentage="progress"
          :format="() => progress + '%'"
        />
        <div class="text-center text-16px mt-10px">
          <span v-if="importType == 'play'">
            正在导入数据（{{ importInfo.handleCou }}/{{ importInfo.totalCou }}）...
          </span>
          <div v-else-if="importType == 'stop'">
            <div class="text-16px mb-10px">导入已暂停</div>
            <div class="text-14px">
              <span>
                剩余未导入条数：
                {{ importInfo.totalCou - importInfo.successCou - importInfo.errorCou }}
              </span>
              <span class="ml-10px mr-10px">
                成功导入条数：
                <span class="c-#409EFF">{{ importInfo.successCou }}</span>
              </span>
              <span>
                导入失败条数：
                <span class="c-#F56C6C">{{ importInfo.errorCou }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="stepValue == 3" class="mt-20px pb-40px">
        <div class="flex flex-col items-center">
          <Icon color="#67C23A" icon="mdi:success-circle-outline" :size="60"></Icon>
          <div class="text-20px pt-10px pb-10px">数据导入完成</div>
          <div class="text-14px" v-if="importInfo.errorCou">
            <span>总数据条数：{{ importInfo.totalCou }}</span>
            <span class="ml-10px mr-10px">
              成功导入条数：
              <span class="c-#409EFF">{{ importInfo.successCou }}</span>
            </span>
            <span>
              导入失败条数：
              <span class="c-#F56C6C">{{ importInfo.errorCou }}</span>
            </span>
          </div>
          <div v-else class="text-14px">您已成功导入{{ importInfo.successCou }}条数据</div>
        </div>
      </div>
    </div>

    <div
      class="pos-absolute left-0 bottom-0 w-100% box-border px-20px py-10px flex justify-end bg-[var(--el-bg-color)] b-solid b-0px b-t-1px b-#f1f1f1 dark:b-[var(--el-border-color-dark)]"
    >
      <template v-if="stepValue == 0">
        <el-button type="info" @click="showHistory = true">
          <Icon icon="icon-park-outline:history-query" :size="14" class="mr-3px"> </Icon>
          历史导入记录
        </el-button>
        <el-button
          type="primary"
          :disabled="!files || !files?.length"
          :loading="loading.dataView"
          @click="importData('dataView')"
        >
          <Icon v-if="!loading.dataView" icon="ep:view" :size="16"> </Icon>
          <span>预览数据</span>
          <span v-if="importInfo.totalCou > 10000">
            （数据解析中，预计需要{{ Math.ceil((importInfo.totalCou || 1) / 3000) }}秒）
          </span>
        </el-button>
      </template>

      <template v-if="stepValue == 1">
        <el-button type="info" :disabled="loading.importData" @click="importData('resetUpload')">
          <Icon icon="ep:refresh-left" :size="16" class="mr-3px"> </Icon>
          重新上传
        </el-button>
        <el-button type="primary" :loading="loading.importData" @click="importData('importData')">
          <Icon v-if="!loading.importData" icon="clarity:import-line" :size="14" class="mr-3px">
          </Icon>
          开始导入数据
        </el-button>
      </template>

      <template v-if="stepValue == 2">
        <el-button
          v-if="isStop === false"
          type="danger"
          :disabled="loading.stop || loading.play"
          :loading="loading.cancel"
          @click="importData('cancel')"
        >
          <Icon v-if="!loading.cancel" icon="typcn:cancel" :size="16" class="mr-3px"> </Icon>
          取消导入
        </el-button>
        <el-button
          type="danger"
          v-if="importType == 'play'"
          :disabled="loading.cancel || loading.play"
          :loading="loading.stop"
          @click="importData('stop')"
        >
          <Icon v-if="!loading.stop" icon="lets-icons:stop-duotone" :size="16" class="mr-3px">
          </Icon>
          暂停导入
        </el-button>
        <el-button
          v-if="importType == 'stop'"
          type="primary"
          :disabled="loading.cancel || loading.stop"
          :loading="loading.play"
          @click="importData('play')"
        >
          <Icon v-if="!loading.play" icon="lets-icons:play-duotone" :size="24"> </Icon>
          继续导入
        </el-button>
      </template>

      <template v-if="stepValue == 3">
        <el-button
          v-if="importInfo.errorCou"
          type="primary"
          :loading="loading.errorDownload"
          @click="importData('errorDownload')"
        >
          <Icon icon="ep:download" :size="14" class="mr-3px"> </Icon>
          下载导入失败数据
        </el-button>
        <el-button type="default" @click="closeImport" :disabled="loading.errorDownload">
          <Icon icon="ep:close" :size="14" class="mr-3px"> </Icon>
          关 闭
        </el-button>
      </template>
    </div>

    <DesignPopup
      v-model="showHistory"
      controlType="drawer"
      :title="historyTitle ? historyTitle : '历史导入记录'"
      width="80%"
    >
      <div class="p-20px">
        <ImportHistory
          v-if="showHistory"
          :dbformId="importId"
          @set-title="
            (day) => (historyTitle = `历史导入记录（最多可撤销/查看${day}天内的导入数据）`)
          "
        ></ImportHistory>
      </div>
    </DesignPopup>
  </div>
</template>

<script setup lang="ts">
import * as TableApi from '@/api/design/table'
import download from '@/utils/download'
import { fileSizeFormatter } from '@/utils/index'
import { useFileDialog } from '@vueuse/core'
defineOptions({ name: 'ImportData' })

interface Props {
  tableDescribe: string
  importId: string
  columns: any
  show: boolean
  isFull?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits(['close-popup', 'reset-change'])

const stepList = ['上传文件', '数据预览', '导入数据', '导入完成']
const uploadList = ref({
  download: {
    icon: 'uiw:cloud-download',
    title: '填写导入数据信息',
    tip: '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除',
    btnText: '下载模板',
    loading: false
  },
  upload: {
    icon: 'uiw:cloud-upload',
    title: '上传填好的信息表',
    tip: '文件后缀名必须为xls 或xlsx （即Excel格式）',
    btnText: '上传文件',
    loading: false
  }
})
const stepValue = ref(0)
const loading = ref({
  dataView: false,
  importData: false,
  cancel: false,
  stop: false,
  play: false,
  errorDownload: false
})
const importType = ref('play')
const importInfo = ref({ batchCode: 0, handleCou: 0, totalCou: 0, errorCou: 0, successCou: 0 })
const timer = ref<any>(null)
const isStop = ref(false)
const showHistory = ref(false)
const historyTitle = ref('')
const viewRef = ref()

const message = useMessage() // 消息弹窗
const { files, open, reset } = useFileDialog({
  multiple: false, //可选：是否可以多选文件
  accept: '.xls,.xlsx', //可选：自定义上传文件类型
  reset: true //可选：再次选择时是否把之前选的文件清除
})

const progress = computed(() => {
  return Number(((importInfo.value.handleCou / importInfo.value.totalCou) * 100).toFixed(2))
})

const isPlay = computed(() => {
  return stepValue.value == 2 && importType.value == 'play'
})

const init = () => {
  stepValue.value = 0
  importType.value = 'play'
  isStop.value = false
  for (let key in importInfo.value) importInfo.value[key] = 0
  reset()
}

const rollPoling = async () => {
  if (timer.value) clearTimeout(timer.value)
  const data = await TableApi.getImportProgress(props.importId, {
    batchCode: importInfo.value.batchCode
  }).catch(() => false)
  if (['stop'].includes(importType.value) || !files.value?.length) return
  if (data !== false) {
    importInfo.value.handleCou = data
  }
  if (data < importInfo.value.totalCou) {
    timer.value = setTimeout(() => {
      rollPoling()
    }, 2000)
  } else {
    const successCou = (await getResult('SUCCESS')) as number
    if (successCou === -1) rollPoling()
    else {
      importInfo.value.successCou = successCou
      importInfo.value.errorCou = importInfo.value.totalCou - successCou
      stepValue.value = 3
    }
  }
}

const getResult = (type) => {
  return new Promise((resolve) => {
    TableApi.getImportProgress(props.importId, {
      batchCode: importInfo.value.batchCode,
      handleResult: type
    })
      .then((data) => resolve(data))
      .catch(() => resolve(-1))
  })
}

const viewRollPoling = async (done) => {
  if (timer.value) clearTimeout(timer.value)
  const data = await TableApi.getViewImportProgress(
    props.importId,
    importInfo.value.batchCode
  ).catch(() => false)
  if (data !== false) {
    done()
    stepValue.value = 1
  } else {
    timer.value = setTimeout(() => {
      viewRollPoling(done)
    }, 2000)
  }
}

const handleImport = {
  dataView: async (done) => {
    const res = await TableApi.uploadViewExcelData(props.importId, {
      file: files.value ? files.value[0] : ''
    }).catch(() => false)
    if (res) {
      importInfo.value.batchCode = res.data.batchCode
      importInfo.value.totalCou = res.data.totalCou
      viewRollPoling(done)
    } else done()
  },
  resetUpload: (done) => {
    init()
  },
  importData: async (done) => {
    await TableApi.importUploadData(props.importId, importInfo.value.batchCode)
    stepValue.value = 2
    importType.value = 'play'
    rollPoling()
    done()
  },
  cancel: async (done) => {
    const data = await setImportState('CANCLE_TASK')
    done()
    if (data !== -1) {
      if (timer.value) clearTimeout(timer.value)
      message.success('取消导入成功')
      init()
    }
  },
  stop: (done) => {
    return new Promise(async (resolve) => {
      const data = await setImportState('STOP_TASK')
      done()
      if (data !== -1) {
        const resList = (await Promise.all([getResult('SUCCESS'), getResult('FAIL')])) as number[]
        importInfo.value.successCou = resList[0] === -1 ? 0 : resList[0]
        importInfo.value.handleCou = importInfo.value.successCou
        importInfo.value.errorCou = resList[1] === -1 ? 0 : resList[1]
        importType.value = 'stop'
        isStop.value = true
        if (timer.value) clearTimeout(timer.value)
      }
      resolve(true)
    })
  },
  play: async (done) => {
    const data = await setImportState('START_TASK')
    done()
    if (data !== -1) {
      importType.value = 'play'
      rollPoling()
    }
  },
  errorDownload: async (done) => {
    const data = await TableApi.downloadImportError(props.importId, importInfo.value.batchCode)
    download.excel(data, `${props.tableDescribe}-导入失败数据`, 'xlsx')
    done()
  }
}

const setImportState = (type) => {
  return TableApi.setImportState(props.importId, {
    batchCode: importInfo.value.batchCode,
    taskState: type
  }).catch(() => -1)
}

const importData = async (type) => {
  let tip = ''
  if (type == 'importData') tip = '是否确定开始导入数据？'
  else if (type == 'resetUpload') tip = '是否重新上传数据？'
  else if (type == 'cancel') tip = '取消导入将会删除已经导入的数据，是否确定取消？'
  else if (type == 'stop') tip = '是否暂停当前数据导入？'
  else if (type == 'play') tip = '是否继续导入数据？'
  if (tip) await message.confirm(tip)
  loading.value[type] = true
  const done = () => {
    loading.value[type] = false
  }
  handleImport[type](done)
}

const fileOption = async (key) => {
  if (key == 'download') {
    uploadList.value[key].loading = true
    const data = await TableApi.downloadImportTemplate(props.importId)
    download.excel(data, props.tableDescribe, 'xlsx')
    uploadList.value[key].loading = false
  } else {
    open()
  }
}

const handleClose = async (done) => {
  if (isPlay.value) {
    await message.confirm(`关闭弹窗后将会停止导入，是否确定关闭导入弹窗？`)
    await stopImport()
    emit('reset-change')
  }
  if (timer.value) clearTimeout(timer.value)
  done()
}

const closeImport = () => {
  emit('reset-change')
  emit('close-popup')
}

const stopImport = () => {
  return new Promise(async (resolve) => {
    loading.value.stop = true
    await handleImport.stop(() => (loading.value.stop = false))
    resolve(true)
  })
}

const setImportInfo = (data) => {
  importInfo.value = {
    ...importInfo.value,
    ...data
  }
}

watch(
  () => props.show,
  (val) => {
    if (val && stepValue.value !== 1) {
      init()
    }
  }
)

watch(
  () => props?.isFull,
  (val) => {
    viewRef.value?.setCalcHeight(val ? 80 : 215)
  }
)

defineExpose({ handleClose, stopImport, isPlay })
</script>

<style lang="scss" scoped>
.import-data-box {
  padding: 20px;

  ::v-deep(.el-steps) {
    .el-step__icon {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .el-step__line {
      top: 7px;
    }

    .step-icon {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-sizing: border-box;
    }

    .el-step__head {
      &.is-success {
        .step-icon {
          background-color: var(--el-color-success);
        }
      }

      &.is-finish {
        .step-icon {
          background-color: var(--el-color-primary);
        }
      }

      &.is-wait {
        .step-icon {
          background-color: var(--el-text-color-placeholder);
        }
      }
    }

    .el-step {
      &.active {
        .step-icon {
          background-color: var(--el-bg-color);
          border: 2px solid var(--el-color-primary);
        }

        .el-step__line::before {
          position: absolute;
          left: 0;
          width: 50%;
          height: 2px;
          background-color: var(--el-color-primary);
          content: '';
        }
      }

      &.success {
        .el-step__line {
          background-color: var(--el-color-primary);
        }
      }
    }
  }

  .import-content {
    padding: 20px 40px;

    .file-item {
      margin-bottom: 20px;
      border: var(--el-border);

      .item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100px;
        border-right: var(--el-border);
      }
    }

    .error-list {
      padding: 15px 20px;
      border: 1px solid #ece9e9;
    }
  }
}
</style>
