<template>
  <avue-crud
    ref="crudRef"
    :option="tableOption"
    :data="tableData"
    :page="tablePage"
    :table-loading="loading"
    :cell-style="historyCellStyle"
    @current-change="currentChange"
    @size-change="sizeChange"
  >
    <template #menu="{ size, row }">
      <template v-if="row.viewFlag">
        <el-button
          :size="size"
          link
          type="danger"
          v-if="row.createUser == userStore.user.id && row.importState != '-1'"
          @click="backoutImport(row)"
        >
          <Icon :size="14" icon="ep:close" class="mr-2px"></Icon>
          撤销导入
        </el-button>
        <el-button :size="size" type="primary" link @click="viewImportData(row)">
          <Icon :size="14" icon="ep:view" class="mr-2px"></Icon>
          查看导入数据
        </el-button>
      </template>
      <div v-else>-</div>
    </template>
  </avue-crud>
  <DesignPopup v-model:is-full="isFull" v-model="viewObj.show" :title="viewObj.title" width="80%">
    <div class="p-20px">
      <ImportView
        ref="viewRef"
        v-if="viewObj.show"
        :calcHeight="130"
        :dbformId="dbformId"
        :batchCode="viewObj.id"
        type="view"
      ></ImportView>
    </div>
  </DesignPopup>
</template>

<script setup lang="ts">
import * as DicApi from '@/api/design/dic'
import * as TableApi from '@/api/design/table'
import { useUserStoreWithOut } from '@/store/modules/user'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { encryptAES } from '@/components/LowDesign/src/utils/aes'

interface Props {
  dbformId: string
}
const props = defineProps<Props>()
const emit = defineEmits(['set-title'])

const userStore = useUserStoreWithOut()
const message = useMessage() // 消息弹窗
const tableOption = ref({
  header: false,
  editBtn: false,
  viewBtn: false,
  delBtn: false,
  menuWidth: 230,
  calcHeight: 20,
  column: {
    fileName: { label: '文件名称' },
    importState: {
      label: '导入状态',
      type: 'select',
      width: 90,
      dicData: [
        { label: '已导入', value: '1' },
        { label: '未导入', value: '0' },
        { label: '已取消', value: '-2' },
        { label: '已撤销', value: '-1' }
      ]
    },
    totalNum: { label: '导入总条数', width: 100 },
    successNum: { label: '成功条数', width: 90 },
    errorNum: { label: '失败条数', width: 90 },
    createUserName: { label: '操作人', width: 120 },
    createTime: {
      label: '操作时间',
      width: 160,
      formatter: (row, val, value, column) => {
        return dateFormatter(row, column, val)
      }
    }
  }
})
const tableData = ref([])
const tablePage = ref({ currentPage: 1, pageSize: 10, total: 0 })
const loading = ref(false)
const crudRef = ref()

const viewObj = ref({ show: false, title: '', id: '' })
const isFull = ref(false)
const viewRef = ref()

useCrudHeight(crudRef)

const getTableData = async () => {
  loading.value = true
  const data = await TableApi.getHistoryImportData(props.dbformId, {
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  })
  tablePage.value.total = data.pages.total
  emit('set-title', data.day)
  const userIds: string[] = []
  const userObj = {}
  data.pages.records.forEach((item) => {
    if (item.createUser) userIds.push(item.createUser)
  })
  if (userIds.length) {
    const dicRes = await DicApi.getDicTableText({
      jeeLowCode_dictLabel: encryptAES(JSON.stringify([{ userIdList: [...new Set(userIds)] }]))
    })
    if (dicRes?.userList) {
      dicRes.userList.forEach((item) => (userObj[item.id] = item.nickname))
    }
  }
  tableData.value = data.pages.records.map((item) => {
    if (userObj[item.createUser]) item.createUserName = userObj[item.createUser]
    return item
  })
  loading.value = false
}

const sizeChange = (pageSize) => {
  tablePage.value.pageSize = pageSize
  tablePage.value.currentPage = 1
  getTableData()
}
const currentChange = (currentPage) => {
  tablePage.value.currentPage = currentPage
  getTableData()
}

const backoutImport = async (row) => {
  await message.confirm('是否确定撤销导入？（注：会删除表数据！！！）')
  loading.value = true
  await TableApi.cancelImportData(props.dbformId, row.id)
  getTableData()
}
const viewImportData = (row) => {
  viewObj.value = {
    show: true,
    title: `${row.createUserName} 在 ${formatDate(row.createTime)} 导入的数据`,
    id: row.id
  }
}

const historyCellStyle = ({ row, columnIndex }) => {
  if (columnIndex == 1) {
    return { color: row.importState == '1' ? '#67C23A' : '#F56C6C' }
  }
}

watch(
  () => isFull.value,
  (val) => {
    viewRef.value?.setCalcHeight(val ? 20 : 130)
  }
)

onMounted(() => {
  getTableData()
})
</script>

<style lang="scss" scoped></style>
