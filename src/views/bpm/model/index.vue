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
      @row-del="rowDel"
      @row-update="rowUpdate"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu-left>
        <el-button type="success" plain @click="openImportForm" v-hasPermi="['bpm:model:import']">
          <Icon icon="ep:upload" class="mr-5px" /> 导入流程
        </el-button>
      </template>
      <template #menu="scope">
        <el-button
          link
          type="primary"
          @click="crudRef.rowEdit(scope.row, scope.index)"
          v-hasPermi="['bpm:model:update']"
        >
          修改流程
        </el-button>
        <el-button
          link
          type="primary"
          @click="handleDesign(scope.row)"
          v-hasPermi="['bpm:model:update']"
        >
          设计流程
        </el-button>
        <el-button
          link
          type="primary"
          @click="handleAssignRule(scope.row)"
          v-hasPermi="['bpm:task-assign-rule:query']"
        >
          分配规则
        </el-button>
        <el-button
          link
          type="primary"
          @click="handleDeploy(scope.row)"
          v-hasPermi="['bpm:model:deploy']"
        >
          发布流程
        </el-button>
        <el-button
          link
          type="primary"
          v-hasPermi="['bpm:process-definition:query']"
          @click="handleDefinitionList(scope.row)"
        >
          流程定义
        </el-button>
        <el-button
          link
          type="danger"
          @click="crudRef.rowDel(scope.row, scope.index)"
          v-hasPermi="['bpm:model:delete']"
        >
          删除
        </el-button>
      </template>
      <template #name="scope">
        <el-button type="primary" link @click="handleBpmnDetail(scope.row)">
          <span>{{ scope.row.name }}</span>
        </el-button>
      </template>
      <template #category="scope">
        <dict-tag
          v-if="scope.row.category"
          :type="DICT_TYPE.BPM_MODEL_CATEGORY"
          :value="scope.row.category"
        />
      </template>
      <template #formType="{ row }">
        <el-button v-if="row.formType === 10" type="primary" link @click="handleFormDetail(row)">
          <span>{{ row.formName }}</span>
        </el-button>
        <el-button
          v-else-if="row.formType === 20"
          type="primary"
          link
          @click="handleFormDetail(row)"
        >
          <span>{{ row.formCustomCreatePath }}</span>
        </el-button>
        <label v-else>暂无表单</label>
      </template>
      <template #processDefinitionVersion="scope">
        <el-tag v-if="scope.row.processDefinition">
          v{{ scope.row.processDefinition.version }}
        </el-tag>
        <el-tag v-else type="warning">未部署</el-tag>
      </template>
      <template #processDefinitionSuspensionState="scope">
        <el-switch
          v-if="scope.row.processDefinition"
          v-model="scope.row.processDefinition.suspensionState"
          :active-value="1"
          :inactive-value="2"
          @change="handleChangeState(scope.row)"
        />
      </template>
      <template #deploymentTime="scope">
        <span v-if="scope.row.processDefinition">
          {{ formatDate(scope.row.processDefinition.deploymentTime) }}
        </span>
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 弹窗：流程模型图的预览 -->
  <Dialog title="流程图" v-model="bpmnDetailVisible" width="800">
    <MyProcessViewer
      key="designer"
      v-model="bpmnXML"
      :value="bpmnXML || ''"
      v-bind="bpmnControlForm"
      :prefix="bpmnControlForm.prefix"
    />
  </Dialog>
  <!-- 表单弹窗：导入流程 -->
  <ModelImportForm ref="importFormRef" @success="getTableData" />
  <!-- 表单预览 -->
  <FormView
    v-model="showFormView"
    formType="add"
    showType="dialog"
    :showButton="false"
    v-bind="formOption"
  ></FormView>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { MyProcessViewer } from '@/components/bpmnProcessDesigner/package'
import * as ModelApi from '@/api/bpm/model'
import ModelImportForm from '@/views/bpm/model/ModelImportForm.vue'

defineOptions({ name: 'SystemTenant' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  addBtnText: '新增流程',
  editBtn: false,
  delBtn: false,
  menuWidth: 300,
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '50%',
  column: [
    {
      prop: 'key',
      label: '流程标识',
      search: true,
      rules: [{ required: true, message: '流程标识不能为空', trigger: 'blur' }],
      editDisabled: true
    },
    {
      prop: 'name',
      label: '流程名称',
      search: true,
      rules: [{ required: true, message: '流程名称不能为空', trigger: 'blur' }],
      editDisabled: true
    },
    {
      prop: 'category',
      label: '流程分类',
      width: 100,
      addDisplay: false,
      editDisplay: true,
      search: true,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY),
      rules: [{ required: true, message: '流程分类不能为空', trigger: 'blur' }]
    },
    {
      prop: 'description',
      label: '流程描述',
      type: 'textarea',
      hide: true,
      minRows: 2,
      maxRows: 4
    },
    {
      prop: 'formType',
      label: '表单类型',
      type: 'radio',
      dicData: getIntDictOptions(DICT_TYPE.BPM_MODEL_FORM_TYPE),
      hide: true,
      addDisplay: false,
      editDisplay: true,
      control: (val) => {
        return {
          formId: { display: val == 10 },
          formCustomCreatePath: { display: val == 20 },
          formCustomViewPath: { display: val == 20 }
        }
      }
    },
    {
      prop: 'formId',
      label: '流程表单',
      type: 'select',
      hide: true,
      filterable: true,
      display: false,
      dicUrl: '/jeelowcode/desform/page',
      dicMethod: 'post',
      props: { label: 'desformName', value: 'id' },
      dicFormatter: (data) => data.records
    },
    {
      prop: 'formCustomCreatePath',
      label: '表单提交路由',
      hide: true,
      display: false,
      labelTip: '自定义表单的提交路径，使用 Vue 的路由地址'
    },
    {
      prop: 'formCustomViewPath',
      label: '表单查看地址',
      hide: true,
      display: false,
      labelTip: '自定义表单的查看组件地址，使用 Vue 的组件地址'
    },
    {
      prop: 'formType',
      label: '表单信息',
      display: false
    },
    {
      prop: 'createTime',
      label: '创建时间',
      searchRange: true,
      display: false,
      type: 'datetime',
      width: 180,
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    {
      label: '最新部署的流程定义',
      children: [
        {
          prop: 'processDefinitionVersion',
          label: '流程版本',
          width: 100,
          display: false
        },
        {
          prop: 'processDefinitionSuspensionState',
          label: '激活状态',
          width: 100,
          display: false
        },
        {
          prop: 'deploymentTime',
          label: '部署时间',
          searchRange: true,
          display: false,
          type: 'datetime',
          width: 180,
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          formatter: (row, val, value, column) => {
            return dateFormatter(row, column, val)
          }
        }
      ]
    }
  ]
}) //表格配置
const tableForm = ref<{ id?: number }>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const showFormView = ref(false)
const formOption = ref({
  formId: '',
  popOption: {
    title: ''
  }
})

const permission = getCurrPermi(['bpm:model'])
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
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await ModelApi.getModelPage(searchObj)
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
    tableForm.value = await ModelApi.getModel(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let params = {
    name: form.name,
    key: form.key,
    description: form.description,
    formCustomViewPath: '',
    formCustomCreatePath: '',
    formId: '',
    formType: 10
  }

  let bool = await ModelApi.createModel(params).catch(() => false)
  if (bool) {
    // 提示，引导用户做后续的操作
    await ElMessageBox.alert(
      '<strong>新建模型成功！</strong>后续需要执行如下 4 个步骤：' +
        '<div>1. 点击【修改流程】按钮，配置流程的分类、表单信息</div>' +
        '<div>2. 点击【设计流程】按钮，绘制流程图</div>' +
        '<div>3. 点击【分配规则】按钮，设置每个用户任务的审批人</div>' +
        '<div>4. 点击【发布流程】按钮，完成流程的最终发布</div>' +
        '另外，每次流程修改后，都需要点击【发布流程】按钮，才能正式生效！！！',
      '重要提示',
      {
        dangerouslyUseHTMLString: true,
        type: 'success'
      }
    )
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await ModelApi.updateModel(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (form, index) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ModelApi.deleteModel(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 更新状态操作 */
const handleChangeState = async (row) => {
  const state = row.processDefinition.suspensionState
  try {
    // 修改状态的二次确认
    const id = row.id
    const statusState = state === 1 ? '激活' : '挂起'
    const content = '是否确认' + statusState + '流程名字为"' + row.name + '"的数据项?'
    await message.confirm(content)
    // 发起修改状态
    await ModelApi.updateModelState(id, state)
    // 刷新列表
    await getTableData()
  } catch {
    // 取消后，进行恢复按钮
    row.processDefinition.suspensionState = state === 1 ? 2 : 1
  }
}

/** 流程图的详情按钮操作 */
const bpmnDetailVisible = ref(false)
const bpmnXML = ref(null)
const bpmnControlForm = ref({
  prefix: 'flowable'
})
const handleBpmnDetail = async (row) => {
  const data = await ModelApi.getModel(row.id)
  bpmnXML.value = data.bpmnXml || ''
  bpmnDetailVisible.value = true
}

/** 流程表单的详情按钮操作 */
const handleFormDetail = async (row) => {
  if (row.formType == 10) {
    formOption.value.formId = row.formId
    formOption.value.popOption.title = row.formName
    showFormView.value = true
  } else {
    await push({
      path: row.formCustomCreatePath
    })
  }
}

/** 添加/修改操作 */
const importFormRef = ref()
const openImportForm = () => {
  importFormRef.value.open()
}

/** 设计流程 */
const handleDesign = (row) => {
  push({
    name: 'BpmModelEditor',
    query: {
      modelId: row.id
    }
  })
}

/** 点击任务分配按钮 */
const handleAssignRule = (row) => {
  push({
    name: 'BpmTaskAssignRuleList',
    query: {
      modelId: row.id
    }
  })
}

/** 发布流程 */
const handleDeploy = async (row) => {
  try {
    // 删除的二次确认
    await message.confirm('是否部署该流程！！')
    // 发起部署
    await ModelApi.deployModel(row.id)
    message.success(t('部署成功'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 跳转到指定流程定义列表 */
const handleDefinitionList = (row) => {
  push({
    name: 'BpmProcessDefinition',
    query: {
      key: row.key
    }
  })
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
