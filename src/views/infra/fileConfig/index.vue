<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
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
      <!-- 表格 -->
      <template #storage="scope">
        <dict-tag
          :type="DICT_TYPE.INFRA_FILE_STORAGE"
          :value="scope.row.storage ? scope.row.storage : ''"
        />
      </template>
      <template #master="scope">
        <dict-tag
          v-if="scope.row.master !== undefined"
          :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
          :value="scope.row.master"
        />
      </template>
      <!-- 表单 -->
      <!-- 自定义操作栏 -->
      <template #menu="{ row }">
        <el-button
          link
          type="primary"
          class="is-text"
          icon="el-icon-operation"
          :disabled="row.master"
          @click="handleMaster(row.id)"
          v-hasPermi="['infra:file-config:update']"
        >
          主配置
        </el-button>
        <el-button
          link
          class="is-text"
          icon="el-icon-tickets"
          type="primary"
          @click="handleTest(row.id)"
        >
          测试
        </el-button>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, getSearchDate } from '@/utils/formatTime'
import * as FileConfigApi from '@/api/infra/fileConfig'

defineOptions({ name: 'InfraFileConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  menuWidth: 300,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  labelWidth: 100,
  span: 24,
  dialogWidth: '50%',
  column: {
    id: {
      label: '编号',
      width: 80,
      display: false
    },
    name: {
      label: '配置名',
      search: true,
      minWidth: 90,
      rules: [{ required: true, message: '配置名不能为空', trigger: 'blur' }]
    },
    remark: {
      label: '备注'
    },
    storage: {
      label: '存储器',
      type: 'select',
      disabled: false,
      search: true,
      span: 8,
      minWidth: 90,
      dicData: getIntDictOptions(DICT_TYPE.INFRA_FILE_STORAGE),
      rules: [{ required: true, message: '存储器不能为空', trigger: 'blur' }],
      change: ({ value, column }) => {
        let {
          basePath,
          host,
          port,
          username,
          password,
          mode,
          endpoint,
          bucket,
          accessKey,
          accessSecret,
          domain
        } = tableOption.column
        if (value) {
          domain.display = true
          if (value === 20) {
            domain.rules = []
          } else {
            domain.rules = [{ required: true, message: '自定义域名不能为空', trigger: 'blur' }]
          }
        } else {
          domain.display = false
        }
        if (value >= 10 && value <= 12) {
          basePath.display = true
        } else {
          basePath.display = false
        }
        if (value >= 11 && value <= 12) {
          host.display = true
          port.display = true
          username.display = true
          password.display = true
        } else {
          host.display = false
          port.display = false
          username.display = false
          password.display = false
        }
        if (value === 11) {
          mode.display = true
        } else {
          mode.display = false
        }
        if (value === 20) {
          endpoint.display = true
          bucket.display = true
          accessKey.display = true
          accessSecret.display = true
        } else {
          endpoint.display = false
          bucket.display = false
          accessKey.display = false
          accessSecret.display = false
        }
      }
    },
    master: {
      label: '主配置',
      type: 'select',
      display: false,
      span: 8,
      minWidth: 90,
      dicData: getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)
    },
    basePath: {
      label: '基础路径',
      hide: true,
      display: false,
      rules: [{ required: true, message: '基础路径不能为空', trigger: 'blur' }]
    },
    host: {
      label: '主机地址',
      hide: true,
      display: false,
      rules: [{ required: true, message: '主机地址不能为空', trigger: 'blur' }]
    },
    port: {
      label: '主机端口',
      type: 'number',
      span: 8,
      hide: true,
      display: false,
      rules: [{ required: true, message: '主机端口不能为空', trigger: 'blur' }]
    },
    username: {
      label: '用户名',
      hide: true,
      display: false,
      rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
    },
    password: {
      label: '密码',
      hide: true,
      display: false,
      rules: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
    },
    mode: {
      label: '连接模式',
      type: 'radio',
      hide: true,
      display: false,
      dicData: [
        { label: '主动模式', value: 'Active' },
        { label: '被动模式', value: 'Passive' }
      ],
      rules: [{ required: true, message: '连接模式不能为空', trigger: 'blur' }]
    },
    endpoint: {
      label: '节点地址',
      hide: true,
      display: false,
      rules: [{ required: true, message: '节点地址不能为空', trigger: 'blur' }]
    },
    bucket: {
      label: '存储 bucket',
      hide: true,
      display: false,
      rules: [{ required: true, message: '存储 bucket不能为空', trigger: 'blur' }]
    },
    accessKey: {
      label: 'accessKey',
      hide: true,
      display: false,
      rules: [{ required: true, message: 'accessKey不能为空', trigger: 'blur' }]
    },
    accessSecret: {
      label: 'accessSecret',
      hide: true,
      display: false,
      rules: [{ required: true, message: 'accessSecret不能为空', trigger: 'blur' }]
    },
    domain: {
      label: '自定义域名',
      hide: true,
      display: false,
      rules: [{ required: true, message: '自定义域名不能为空', trigger: 'blur' }]
    },
    createTime: {
      label: '创建时间',
      searchRange: true,
      search: true,
      display: false,
      type: 'date',
      searchType: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      width: 180,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    }
  }
}) //表格配置
const tableForm = ref<{ id?: number }>({})
let tableChildForm: string[] = reactive([]) // 保存参数,方便提交
const tableData = ref([])
const tableSearch = ref<any>({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const permission = getCurrPermi(['infra:file-config'])
const crudRef = ref()

useCrudHeight(crudRef)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true

  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }

  if (searchObj.createTime?.length) {
    searchObj.createTime = getSearchDate(searchObj.createTime)
  } else delete searchObj.createTime

  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await FileConfigApi.getFileConfigPage(searchObj)
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
    tableOption.column.storage.disabled = true
    let data = await FileConfigApi.getFileConfig(tableForm.value.id)
    tableChildForm = Object.keys(data.config)
    // 数据处理
    data = {
      storage: data.storage,
      remark: data.remark,
      name: data.name,
      master: data.master,
      id: data.id,
      createTime: data.createTime,
      ...data.config
    }
    tableForm.value = data
  } else {
    tableOption.column.storage.disabled = false
  }

  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  // 删除多余表单
  Object.keys(tableOption.column).forEach((item) => {
    if (tableOption.column[item].display != undefined && !tableOption.column[item].display)
      delete form[item]
  })

  // 添加config参数
  let config = {}
  Object.keys(form).forEach((item) => {
    if (item !== 'storage' && item !== 'remark' && item !== 'name') {
      config[item] = form[item]
      delete form[item]
    }
  })
  form.config = config
  // 发送请求
  let bool = await FileConfigApi.createFileConfig(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  // 添加config参数
  let config = {}
  tableChildForm.forEach((item) => {
    if (form[item]) {
      config[item] = form[item]
    }
  })
  Object.keys(form).forEach((item) => {
    if (
      item !== 'storage' &&
      item !== 'remark' &&
      item !== 'name' &&
      item !== 'master' &&
      item !== 'id' &&
      item !== 'createTime'
    )
      delete form[item] //清除多余参数(已经放在config中)
  })
  form.config = config

  let bool = await FileConfigApi.updateFileConfig(form).catch(() => false)
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
    await FileConfigApi.deleteFileConfig(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 主配置按钮操作 */
const handleMaster = async (id) => {
  try {
    await message.confirm('是否确认修改配置编号为"' + id + '"的数据项为主配置?')
    await FileConfigApi.updateFileConfigMaster(id)
    message.success(t('common.updateSuccess'))
    await getTableData()
  } catch {}
}

/** 测试按钮操作 */
const handleTest = async (id) => {
  loading.value = true
  try {
    const response = await FileConfigApi.testFileConfig(id)
    message.alert(
      `<div>测试通过，上传文件成功！访问地址：</div>
    <div style="word-break: break-word;">${response}</div>
    `,
      '',
      {
        dangerouslyUseHTMLString: true
      }
    )
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
