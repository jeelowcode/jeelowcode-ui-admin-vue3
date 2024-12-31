<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model:page="tablePage"
      :table-loading="loading"
      :data="tableData"
      :option="tableOption"
      :permission="permission"
      @refresh-change="getTableData"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #menu="{ row }">
        <el-button
          type="primary"
          text
          @click="handleAssignRule(row)"
          v-hasPermi="['bpm:task-assign-rule:query']"
        >
          分配规则
        </el-button>
      </template>
      <template #name="{ row }">
        <el-button type="primary" link @click="handleBpmnDetail(row)">
          <span>{{ row.name }}</span>
        </el-button>
      </template>
      <template #category="{ row }">
        <dict-tag :type="DICT_TYPE.BPM_MODEL_CATEGORY" :value="row.category || ''" />
      </template>
      <template #version="{ row }">
        <el-tag>v{{ row.version }}</el-tag>
      </template>
      <template #suspensionState="{ row }">
        <el-tag type="success" v-if="row.suspensionState === 1">激活</el-tag>
        <el-tag type="warning" v-if="row.suspensionState === 2">挂起</el-tag>
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
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { MyProcessViewer } from '@/components/bpmnProcessDesigner/package'
import * as DefinitionApi from '@/api/bpm/definition'

defineOptions({ name: 'ModelVersions' })

const { getCurrPermi } = useCrudPermi()
const { query } = useRoute() // 查询参数
const { push } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menuWidth: 140,
  align: 'center',
  headerAlign: 'center',
  calcHeight: 20,
  column: [
    { prop: 'id', label: '定义编号', width: 370 },
    { prop: 'name', label: '流程名称' },
    {
      prop: 'category',
      label: '定义分类',
      width: 100,
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY)
    },
    { prop: 'version', label: '流程版本', width: 100, bind: 'processDefinition.version' },
    { prop: 'suspensionState', label: '状态', width: 80 },
    {
      prop: 'deploymentTime',
      label: '部署时间',
      display: false,
      type: 'datetime',
      width: 180,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    },
    {
      prop: 'description',
      label: '定义描述',
      type: 'textarea'
    }
  ]
}) //表格配置
const tableData = ref([])
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const permission = getCurrPermi(['bpm:model'])
const crudRef = ref()

/** 流程图的详情按钮操作 */
const bpmnDetailVisible = ref(false)
const bpmnXML = ref(null)
const bpmnControlForm = ref({
  prefix: 'flowable'
})

/** 点击任务分配按钮 */
const handleAssignRule = (row) => {
  push({
    name: 'BpmTaskAssignRuleList',
    query: {
      modelId: row.id
    }
  })
}

const handleBpmnDetail = async (row) => {
  bpmnXML.value = await DefinitionApi.getProcessDefinitionBpmnXML(row.id)
  bpmnDetailVisible.value = true
}

const getTableData = async () => {
  loading.value = true
  const searchObj = {
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize,
    key: query.key
  }
  const data = await DefinitionApi.getProcessDefinitionPage(searchObj)
  tableData.value = data.list
  tablePage.value.total = data.total
  loading.value = false
}

const sizeChange = (pageSize) => {
  tablePage.value.pageSize = pageSize
  getTableData()
}

const currentChange = (currentPage) => {
  tablePage.value.currentPage = currentPage
  getTableData()
}

useCrudHeight(crudRef)

onMounted(() => {
  tablePage.value.currentPage = 1
  getTableData()
})
</script>
