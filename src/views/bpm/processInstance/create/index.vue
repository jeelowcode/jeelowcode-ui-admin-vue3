<template>
  <!-- 第一步，通过流程定义的列表，选择对应的流程 -->
  <ContentWrap v-if="!selectProcessInstance">
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      :table-loading="loading"
      :data="tableData"
      :option="tableOption"
      :permission="permission"
      @refresh-change="getTableData"
    >
      <template #menu="{ row }">
        <el-button link type="primary" @click="handleSelect(row)" v-hasPermi="['bpm:model:update']">
          选择
        </el-button>
      </template>
      <template #category="{ row }">
        <el-tag>{{ row['$category'] }}</el-tag>
      </template>
      <template #version="{ row }">
        <el-tag>v{{ row.version }}</el-tag>
      </template>
    </avue-crud>
  </ContentWrap>
  <!-- 第二步，填写表单，进行流程的提交 -->
  <ContentWrap v-else>
    <el-card class="box-card">
      <div class="clearfix">
        <span class="el-icon-document">申请信息【{{ selectProcessInstance.name }}】</span>
        <el-button style="float: right" type="primary" @click="selectProcessInstance = undefined">
          <Icon icon="ep:delete" /> 选择其它流程
        </el-button>
      </div>
      <el-col :span="24" style="margin-top: 20px">
        <FormView
          :form-id="formId"
          formType="add"
          showType="view"
          :beforeClose="submitForm"
        ></FormView>
      </el-col>
    </el-card>
    <!-- 流程图预览 -->
    <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML || ''" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DefinitionApi from '@/api/bpm/definition'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import ProcessInstanceBpmnViewer from '../detail/ProcessInstanceBpmnViewer.vue'

defineOptions({ name: 'BpmProcessInstanceCreate' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const router = useRouter() // 路由
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  header: false,
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
      prop: 'name',
      label: '流程名称',
      minWidth: 120
    },
    {
      prop: 'category',
      label: '流程分类',
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY),
      minWidth: 90
    },
    {
      prop: 'version',
      label: '流程版本',
      minWidth: 90
    },
    {
      prop: 'description',
      label: '流程描述',
      type: 'textarea',
      minWidth: 120
    }
  ]
}) //表格配置
const tableForm = ref<{ id?: number }>({})
const tableData = ref([])
const selectProcessInstance = ref() // 选择的流程实例
const bpmnXML = ref(null)
const formId = ref('')

const permission = getCurrPermi(['bpm:model'])
const crudRef = ref()

useCrudHeight(crudRef)

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  try {
    tableData.value = await DefinitionApi.getProcessDefinitionList({ suspensionState: 1 })
  } finally {
    loading.value = false
  }
}

/** 处理选择流程的按钮操作 **/
const handleSelect = async (row) => {
  // 设置选择的流程
  selectProcessInstance.value = row
  // 情况一：流程表单
  if (row.formType == 10) {
    // 设置表单
    formId.value = row.formId
    // 加载流程图
    bpmnXML.value = await DefinitionApi.getProcessDefinitionBpmnXML(row.id)
    // 情况二：业务表单
  } else if (row.formCustomCreatePath) {
    await router.push({
      path: row.formCustomCreatePath
    })
    // 这里暂时无需加载流程图，因为跳出到另外个 Tab；
  }
}

/** 提交按钮 */
const submitForm = async (type, done, formData, loading) => {
  if (type == 'submit') {
    try {
      await ProcessInstanceApi.createProcessInstance({
        processDefinitionId: selectProcessInstance.value.id,
        variables: formData
      })
      // 提示
      message.success('发起流程成功')
      router.go(-1)
    } finally {
      done()
    }
  } else {
    if (loading) loading()
    else done()
  }
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
