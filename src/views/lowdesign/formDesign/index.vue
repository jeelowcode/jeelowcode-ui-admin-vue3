<template>
  <ContentWrap>
    <div class="flex gap-x-10px">
      <div class="flex-basis-180px flex-shrink-0">
        <avue-tree
          ref="treeRef"
          v-model="treeForm"
          :option="treeOption"
          :data="treeData"
          :permission="treePermission"
          :before-open="treeBeforeOpen"
          @node-contextmenu="treeNodeContextmenu"
          @node-click="treeNodeClick"
          @update="treeUpdate"
          @save="treeSave"
          @del="treeDel"
        >
        </avue-tree>
      </div>
      <avue-crud
        class="table-content flex-1"
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
        @selection-change="selectionChange"
      >
        <template #menu-left="{ size }">
          <el-button
            :size="size"
            type="danger"
            :disabled="!tableSelect.length"
            v-hasPermi="['jeelowcode:desform:delete']"
            @click="rowDel(selectIds)"
          >
            <Icon :size="16" icon="mi:delete" class="mr-3px" />批量删除
          </el-button>
        </template>
        <template #menu="{ size, row }">
          <div class="flex justify-center flex-items-center">
            <el-button
              type="primary"
              text
              :size="size"
              @click="menuHandle({ type: 'form', row })"
              v-hasPermi="['jeelowcode:desform:update']"
            >
              <Icon :size="14" icon="ep:edit-pen"></Icon>
              <span>设计表单</span>
            </el-button>
            <span
              v-if="
                checkPermi(['jeelowcode:desform:update']) &&
                checkPermi([
                  'jeelowcode:desform:create',
                  'jeelowcode:desform:update',
                  'jeelowcode:desform:delete'
                ])
              "
              class="ml-8px mr-8px mt-2px inline-block h-16px w-1px bg-#e8e8e8 .dark:bg-[var(--el-border-color-dark)]"
            ></span>
            <el-dropdown
              @command="menuHandle"
              v-if="
                checkPermi([
                  'jeelowcode:desform:create',
                  'jeelowcode:desform:update',
                  'jeelowcode:desform:delete'
                ])
              "
            >
              <div class="mt--2px cursor-pointer">
                <el-text :size="size" type="primary">
                  更多
                  <Icon :size="16" icon="iconamoon:arrow-down-2-light" />
                </el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="checkPermi(['jeelowcode:desform:update'])"
                    :command="{ type: 'edit', row }"
                  >
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{ type: 'copy', row }"
                    v-if="checkPermi(['jeelowcode:desform:create'])"
                  >
                    复制表
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'routeAddress', row }">
                    路由地址
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.isOpen == 'Y'"
                    :command="{ type: 'externalAddress', row }"
                  >
                    外部访问链接
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkPermi(['jeelowcode:desform:update'])"
                    :command="{ type: 'formUnlock', row }"
                  >
                    解除锁定
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkPermi(['jeelowcode:desform:delete'])"
                    :command="{ type: 'del', row }"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </avue-crud>
    </div>
    <DesignPopup v-model="designPop.dialog" v-bind="designPop.params" :isBodyFull="true">
      <template #default>
        <LowFormDesign :formDesignData="designPop.value" :isShow="designPop.dialog"></LowFormDesign>
      </template>
    </DesignPopup>
  </ContentWrap>
</template>
<script lang="ts" setup>
import * as FormApi from '@/api/design/form'
import { ElLoading } from 'element-plus'
import { LowFormDesign } from '@/components/LowFormDesign/index'
import { cloneDeep } from 'lodash-es'
import { useGroup } from '@/hooks/design/useGroup'
import { checkPermi } from '@/utils/permission'
import { ElButton } from 'element-plus'
import useCopyText from '@/hooks/design/useCopyText'

defineOptions({ name: 'FormDesign' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()
const { copyText } = useCopyText()

const loading = ref(true) // 列表的加载中
//表格配置
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  selection: true,
  dialogWidth: 800,
  dialogFullscreen: false,
  editBtn: false,
  delBtn: false,
  border: true,
  menuWidth: 180,
  span: 12,
  column: {
    id: {
      label: '表单id',
      display: false,
      search: true
    },
    desformName: {
      label: '表单名称',
      search: true,
      rules: [{ required: true, message: '请输入表单名称', trigger: 'blur' }]
    },
    groupDesformId: {
      label: '分组类型',
      type: 'tree',
      value: '',
      dicData: [],
      filterable: true,
      defaultExpandAll: true,
      props: { label: 'name', value: 'id' },
      hide: true
    },
    updateTime: {
      label: '修改时间',
      type: 'datetime',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
      display: false
    },
    isOpen: {
      label: '外部链接访问',
      type: 'select',
      width: 110,
      search: true,
      searchLabelWidth: 110,
      value: 'N',
      dicData: [
        { label: '禁用', value: 'N' },
        { label: '启用', value: 'Y' }
      ]
    },
    isTemplate: {
      label: '是否作为模板',
      type: 'select',
      width: 110,
      search: true,
      searchLabelWidth: 110,
      value: 'N',
      dicData: [
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' }
      ]
    }
  }
})
const tableForm = ref<any>({})
const tableData = ref([])
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const tableSelect = ref([])
const designPop = ref({
  value: {},
  dialog: false,
  params: {}
})

const crudRef = ref()
const treeRef = ref()

const isUnload = ref(false)

const selectIds = computed(() => {
  return tableSelect.value.map((item) => item['id'])
})
const permission = getCurrPermi(['jeelowcode:desform'])
useCrudHeight(crudRef)
const {
  treeForm,
  treeOption,
  treeData,
  groupValue,
  treePermission,
  treeBeforeOpen,
  treeNodeContextmenu,
  treeNodeClick,
  getTreeData,
  treeUpdate,
  treeSave,
  treeDel
} = useGroup(treeRef, FormApi, () => resetChange())

const menuHandle = async ({ type, row }) => {
  if (type == 'edit') crudRef.value.rowEdit(row)
  else if (type == 'form') openFormDesing(row)
  else if (type == 'copy') copyForm(row)
  else if (type.indexOf('Address') != -1) showAddress(type, row)
  else if (type.indexOf('Unlock') !== -1) unlockForm(type, row)
  else if (type == 'del') rowDel(row)
}

const showAddress = (type, row) => {
  let title = '菜单路由地址'
  let urlType = 'view'
  if (type == 'externalAddress') urlType = 'external'
  let htmlArr = [
    { label: `表单填写（默认值启用）`, value: `form/${urlType}/fillout/${row.id}` },
    { label: `表单填写（默认值禁用）`, value: `form/${urlType}/filloutNo/${row.id}` },
    { label: `表单详情查看`, value: `form/${urlType}/detail/${row.id}` }
  ]
  if (type == 'externalAddress') {
    htmlArr = htmlArr.map((item) => {
      item.value = `${window.location.origin}/${item.value}`
      return item
    })
    title = '外部链接访问地址'
  }
  let list: VNode[] = []
  htmlArr.forEach((item) => {
    list.push(
      h('div', { style: { marginBottom: '10px', border: ' 1px solid #eee', padding: '10px' } }, [
        h('div', [
          h('span', { style: { fontWeight: 600, fontSize: '14px' } }, item.label + '：'),
          h(
            ElButton,
            { size: 'small', type: 'primary', onClick: () => copyText(item.value) },
            () => '复制'
          )
        ]),
        h('div', { style: { fontSize: '12px' } }, item.value)
      ])
    )
  })
  message.alert('', title, {
    message: () => {
      return h('div', { width: '100%' }, list)
    },
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true,
    customStyle: { width: '100%' },
    customClass: 'form-design-address-box'
  })
}

const openFormDesing = async (row) => {
  loading.value = true
  const data = await FormApi.getFormDetail({ desFormId: row.id, lock: true })
  loading.value = false
  if (data.timeStr) {
    message
      .confirm(
        `<div>
        <div style="font-size:16px"><span style="font-size:14px">当前操作人：</span>${data.userName}</div>
        <div style="font-size:16px"><span style="font-size:14px">开始操作时间：</span>${data.timeStr}</div>
        <div style="color:#E6A23C">注：如果确认没有人正在编辑，可在操作列更多里面解除锁定</div>
      </div>`,
        '当前表单已锁定',
        {
          dangerouslyUseHTMLString: true,
          cancelButtonText: '关闭',
          confirmButtonText: '强制解锁'
        }
      )
      .then(async () => menuHandle({ type: `formUnlockOpen`, row }))
    return
  }
  isUnload.value = true
  designPop.value = {
    value: data,
    dialog: true,
    params: {
      title: `表单设计 【${row.desformName}】（${row.id}）`,
      fullscreen: true,
      width: '90%',
      handleClose: async (done) => {
        await FormApi.unlockForm(row.id)
        isUnload.value = false
        done()
      }
    }
  }
}
const copyForm = (row) => {
  message
    .prompt('新表单名称', '复制表单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: '',
      inputValidator: (value) => {
        if (!value) return '请输入表单名称'
      }
    })
    .then(async ({ value }) => {
      loading.value = true
      const data = await FormApi.getFormDetail({ desFormId: row.id })
      data.desformName = value
      const oldId = data.id
      const loadingFun = async (id?) => {
        const hideLoading = () => {
          loading.value = false
        }
        if (id) {
          const desform = JSON.parse(data.desformJson)
          if (desform.scssEnhance) {
            const rexp = new RegExp(oldId, 'g')
            desform.scssEnhance = desform.scssEnhance.replace(rexp, id)
            rowUpdate(
              { id, desformJson: JSON.stringify(desform) },
              row.$index,
              hideLoading,
              hideLoading,
              true
            )
          }
        } else hideLoading()
      }
      delete data.id
      rowSave(data, loadingFun, loadingFun, true)
    })
}
const unlockForm = (type, row) => {
  message.confirm('是否确认当前表单没有其他人在编辑', '提示').then(async () => {
    loading.value = true
    await FormApi.unlockForm(row.id)
    loading.value = false
    message.success('解锁成功')
    if (type.indexOf('Open') !== -1) menuHandle({ type: `form`, row })
  })
}

const selectionChange = (data) => {
  tableSelect.value = data
}

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  if (groupValue.value) searchObj['groupDesformId'] = groupValue.value
  for (let key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await FormApi.getFormList(searchObj)
    tableData.value = data.records
    tablePage.value.total = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const searchChange = (params, done) => {
  if (Object.keys(params).length && groupValue.value) {
    treeRef.value.setCurrentKey(0)
    groupValue.value = 0
  }
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
  const groupData = cloneDeep(treeData.value)
  tableOption.column.groupDesformId.dicData = groupData[0].children
  if (['edit', 'view'].includes(type) && tableForm.value['id']) {
    loading.value = true
    const data = await FormApi.getFormDetail({ desFormId: tableForm.value['id'] })
    tableForm.value = data
    loading.value = false
  }
  if (type == 'add' && groupValue.value) {
    tableForm.value.groupDesformId = groupValue.value
  }
  done()
}

/** 新增操作 */
const rowSave = async (form: object, done, loading, isId?) => {
  const elLoading = ElLoading.service({ fullscreen: true })
  let bool = await FormApi.saveFormData(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    if (isId) done(bool)
    else done()
  } else loading()
  elLoading.close()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading, onData?) => {
  let bool = await FormApi.updateFormData(form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    if (!onData) getTableData()
    done()
  } else loading()
}

/** 删除按钮操作 */
const rowDel = async (data) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FormApi.deleteFormData(data instanceof Array ? data : [data.id])
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

const beforeUnload = (event) => {
  if (isUnload.value) return (event.returnValue = '您确定要关闭页面吗？')
}

/** 初始化 **/
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnload)
  getTableData()
  getTreeData()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload)
})
</script>

<style lang="scss" scoped>
.table-content {
  max-width: calc(100% - 190px);
}
</style>
<style lang="scss">
.form-design-address-box {
  .el-message-box__container {
    display: block;
  }
}
</style>
