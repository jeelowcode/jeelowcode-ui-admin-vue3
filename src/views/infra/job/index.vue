<template>
  <ContentWrap>
    <avue-crud
      v-model="tableForm"
      ref="crudRef"
      v-model:page="tablePage"
      v-model:search="tableSearch"
      :table-loading="loading"
      :data="tableData"
      :option="tableOption"
      :permission="permission"
      :before-open="beforeOpen"
      @search-change="searchChange"
      @search-reset="resetChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu-left="{ size }">
        <el-button
          type="success"
          plain
          :size="size"
          icon="el-icon-download"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['infra:job:export']"
          >导出</el-button
        >
        <el-button type="info" plain @click="handleJobLog()" v-hasPermi="['infra:job:query']">
          <Icon icon="ep:zoom-in" class="mr-5px" /> 执行日志
        </el-button>
      </template>
      <template #menu="scope">
        <el-button
          type="primary"
          link
          class="is-text"
          :icon="
            scope.row.status === InfraJobStatusEnum.STOP
              ? 'el-icon-video-play'
              : 'el-icon-video-pause'
          "
          @click="handleChangeStatus(scope.row)"
          v-hasPermi="['infra:job:update']"
        >
          {{ scope.row.status === InfraJobStatusEnum.STOP ? '开启' : '暂停' }}
        </el-button>
        <el-dropdown
          @command="(command) => handleCommand(command, scope.row)"
          v-hasPermi="['infra:job:trigger', 'infra:job:query']"
        >
          <div class="pt-3px pr-4px pb-3px pl-4px cursor-pointer">
            <el-text type="primary">
              <span>更多</span>
              <Icon :size="16" icon="iconamoon:arrow-down-2-light" />
            </el-text>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="handleRun" v-if="checkPermi(['infra:job:trigger'])">
                执行一次
              </el-dropdown-item>
              <el-dropdown-item
                @click="crudRef.rowView(scope.row, scope.index)"
                v-if="checkPermi(['infra:job:query'])"
              >
                任务详细
              </el-dropdown-item>
              <el-dropdown-item command="handleJobLog" v-if="checkPermi(['infra:job:query'])">
                调度日志
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #accountCount="scope">
        <el-tag>{{ scope.row.accountCount }}</el-tag>
      </template>
      <template #status="scope">
        <dict-tag
          v-if="scope.row.status !== undefined"
          :type="DICT_TYPE.INFRA_JOB_STATUS"
          :value="scope.row.status"
        />
      </template>
      <template #cronExpression-form="{ type }">
        <div v-if="type == 'view'">{{ tableForm.cronExpression }}</div>
        <Crontab v-else v-model="tableForm.cronExpression" />
      </template>
      <template #stayus-form="{ value }">
        <dict-tag v-if="value" :type="DICT_TYPE.INFRA_JOB_STATUS" :value="value" />
      </template>
      <template #executionTime-form>
        <div class="pt-10px">
          <el-timeline>
            <el-timeline-item
              v-for="(nextTime, index) in nextTimes"
              :key="index"
              :timestamp="formatDate(nextTime)"
            >
              第 {{ index + 1 }} 次
            </el-timeline-item>
          </el-timeline>
        </div>
      </template>
    </avue-crud>
  </ContentWrap>
  <DesignPopup v-model="logPopup.show" :title="logPopup.title" width="80%" controlType="drawer">
    <div class="p-20px">
      <InfraJobLog ref="logRef" :jobId="logPopup.jobId"></InfraJobLog>
    </div>
  </DesignPopup>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { checkPermi } from '@/utils/permission'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import * as JobApi from '@/api/infra/job'
import { InfraJobStatusEnum } from '@/utils/constants'
import InfraJobLog from './logger/index.vue'

defineOptions({ name: 'SystemTenant' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()
const nextTimes = ref([]) // 下一轮执行时间的数组

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  searchLabelWidth: 120,
  menuWidth: 300,
  labelSuffix: ' ',
  labelWidth: 120,
  span: 24,
  dialogWidth: '50%',
  column: {
    id: {
      label: '任务编号',
      width: 90,
      display: false
    },
    name: {
      label: '任务名称',
      minWidth: 110,
      search: true,
      rules: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }]
    },
    status: {
      label: '任务状态',
      width: 90,
      search: true,
      type: 'select',
      display: false,
      dicData: getIntDictOptions(DICT_TYPE.INFRA_JOB_STATUS)
    },
    handlerName: {
      label: '处理器的名字',
      minWidth: 100,
      search: true,
      editDisabled: true,
      rules: [{ required: true, message: '处理器的名字不能为空', trigger: 'blur' }]
    },
    handlerParam: {
      label: '处理器的参数',
      minWidth: 110
    },
    cronExpression: {
      label: 'CRON 表达式',
      minWidth: 110,
      rules: [{ required: true, message: 'CRON 表达式不能为空', trigger: 'blur' }]
    },
    retryCount: {
      label: '重试次数',
      hide: true,
      rules: [{ required: true, message: '重试次数不能为空', trigger: 'blur' }],
      placeholder: '请输入重试次数。设置为 0 时，不进行重试'
    },
    retryInterval: {
      label: '重试间隔',
      hide: true,
      rules: [{ required: true, message: '重试间隔不能为空', trigger: 'blur' }],
      placeholder: '请输入重试间隔，单位：毫秒。设置为 0 时，无需间隔'
    },
    monitorTimeout: {
      label: '监控超时时间',
      placeholder: '请输入监控超时时间，单位：毫秒',
      hide: true
    },
    executionTime: {
      label: '后续执行时间',
      display: false,
      hide: true
    }
  }
}) //表格配置
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const logPopup = ref({ show: false, title: '', jobId: 0 })
const permission = getCurrPermi(['infra:job'])
const exportLoading = ref(false) // 导出的加载中

const crudRef = ref()
const logRef = ref()

useCrudHeight(crudRef)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await JobApi.getJobPage(searchObj)
    tableData.value = data.list
    tablePage.value.total = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const searchChange = (params, done) => {
  tablePage.value.currentPage = 1
  getTableData().finally(() => {
    done()
  })
}

/** 清空按钮操作 */
const resetChange = () => {
  searchChange({}, () => {})
}

const sizeChange = (pageSize) => {
  tablePage.value.pageSize = pageSize
  resetChange()
}

const currentChange = (currentPage) => {
  tablePage.value.currentPage = currentPage
  getTableData()
}

/** 表单打开前 */
const beforeOpen = async (done, type) => {
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    loading.value = true
    tableForm.value = await JobApi.getJob(tableForm.value.id)
    if (type == 'view') nextTimes.value = await JobApi.getJobNextTimes(tableForm.value.id!)
    loading.value = false
  }
  if (type === 'view') {
    tableOption.column.id.display = true
    tableOption.column.status.display = true
    tableOption.column.executionTime.display = true
  } else {
    tableOption.column.id.display = false
    tableOption.column.status.display = false
    tableOption.column.executionTime.display = false
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await JobApi.createJob(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await JobApi.updateJob(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (form, index) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await JobApi.deleteJob(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 修改状态操作 */
const handleChangeStatus = async (row: JobApi.JobVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === InfraJobStatusEnum.STOP ? '开启' : '关闭'
    await message.confirm(
      '确认要' + text + '定时任务编号为"' + row.id + '"的数据项?',
      t('common.reminder')
    )
    const status =
      row.status === InfraJobStatusEnum.STOP ? InfraJobStatusEnum.NORMAL : InfraJobStatusEnum.STOP
    await JobApi.updateJobStatus(row.id, status)
    message.success(text + '成功')
    // 刷新列表
    await getTableData()
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === InfraJobStatusEnum.NORMAL ? InfraJobStatusEnum.STOP : InfraJobStatusEnum.NORMAL
  }
}

/** '更多'操作按钮 */
const handleCommand = (command, row) => {
  switch (command) {
    case 'handleRun':
      handleRun(row)
      break
    case 'handleJobLog':
      handleJobLog(row)
      break
    default:
      break
  }
}

/** 执行一次 */
const handleRun = async (row: JobApi.JobVO) => {
  try {
    // 二次确认
    await message.confirm('确认要立即执行一次' + row.name + '?', t('common.reminder'))
    // 提交执行
    await JobApi.runJob(row.id)
    message.success('执行成功')
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 跳转执行日志 */
const handleJobLog = (row?) => {
  logPopup.value = {
    show: true,
    title: row ? `${row.name} 调度日志` : '所有的调度日志',
    jobId: row?.id || 0
  }
  setTimeout(() => {
    if (logRef.value) logRef.value.resetChange()
  }, 30)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    let searchObj = { ...tableSearch.value }
    for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
    const data = await JobApi.exportJob(searchObj)
    download.excel(data, '定时任务列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>

<style lang="scss" scoped>
.el-dropdown {
  padding: 4px 2px;
}
</style>
