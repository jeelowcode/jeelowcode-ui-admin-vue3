<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button style="margin-bottom: 20px" type="primary" @click="testPopup = true">
      <Icon icon="ep:plus" class="mr-5px" /> IP 查询
    </el-button>
    <div style="width: 100%; height: 700px">
      <!-- AutoResizer 自动调节大小 -->
      <el-auto-resizer>
        <template #default="{ height, width }">
          <!-- Virtualized Table 虚拟化表格：高性能，解决表格在大数据量下的卡顿问题 -->
          <el-table-v2
            :columns="columns"
            :data="list"
            :width="width"
            :height="height"
            expand-column-key="id"
          />
        </template>
      </el-auto-resizer>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：查询 -->
  <DesignPopup
    v-model="testPopup"
    title="IP 查询"
    :is-footer="true"
    width="40%"
  >
    <div class="p-20px">
      <avue-form
        ref="textFormRef"
        v-if="testPopup"
        v-model="testFormData"
        :option="testFormOption"
      ></avue-form>
    </div>
    <template #footer>
      <el-button :loading="textLoading" type="primary" @click="testSubmitFun">检 测</el-button>
      <el-button @click="testPopup = false">取 消</el-button>
    </template>
  </DesignPopup>
</template>
<script setup lang="tsx">
import type { Column } from 'element-plus'
import * as AreaApi from '@/api/system/area'

defineOptions({ name: 'SystemArea' })

const message = useMessage()

// 表格的 column 字段
const columns: Column[] = [
  {
    dataKey: 'id', // 需要渲染当前列的数据字段。例如说：{id:9527, name:'Mike'}，则填 id
    title: '编号', // 显示在单元格表头的文本
    width: 400, // 当前列的宽度，必须设置
    fixed: true, // 是否固定列
    key: 'id' // 树形展开对应的 key
  },
  {
    dataKey: 'name',
    title: '地名',
    width: 200
  }
]
// 表格的数据
const list = ref([])

/**
 * 获得数据列表
 */
const getList = async () => {
  list.value = await AreaApi.getAreaTree()
}

/** 查询操作 */
const testPopup = ref(false)
const testFormData = ref<any>({})
const testFormOption = ref({
  submitBtn: false,
  emptyBtn: false,
  span: 24,
  labelWidth: 80,
  column: {
    ip: { label: 'IP', rules: [{ required: true, message: 'IP不能为空', trigger: 'blur' }] },
    result: { label: '地址', placeholder: '展示查询 IP 结果', readonly: true }
  }
})
const textLoading = ref(false)
const textFormRef = ref()

// 提交表单
const testSubmitFun = () => {
  textFormRef.value.validate(async (valid, hide) => {
    if (!valid) return hide()
    try {
      textLoading.value = true
      testFormData.value.result = await AreaApi.getAreaByIp(testFormData.value.ip)
      message.success('查询成功')
    } finally {
      hide()
      textLoading.value = false
    }
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
