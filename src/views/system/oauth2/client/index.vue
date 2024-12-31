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
      <template #authorizedGrantTypes="scope">
        <el-tag
          :disable-transitions="true"
          :key="index"
          v-for="(authorizedGrantType, index) in scope.row.authorizedGrantTypes"
          :index="index"
          class="mr-5px"
        >
          {{ authorizedGrantType }}
        </el-tag>
      </template>
      <!-- 表单 -->
      <template #scopes-form="scope">
        <el-select
          v-model="tableForm.scopes"
          filterable
          multiple
          allow-create
          placeholder="请输入授权范围"
          style="width: 100%"
        >
          <el-option v-for="item in scope.value" :key="item" :label="item" :value="item" />
        </el-select>
      </template>
      <template #redirectUris-form="scope">
        <el-select
          v-model="tableForm.redirectUris"
          filterable
          multiple
          allow-create
          placeholder="请输入可重定向的 URI 地址"
          style="width: 100%"
        >
          <el-option v-for="item in scope.value" :key="item" :label="item" :value="item" />
        </el-select>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions, getDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import { dateFormatter } from '@/utils/formatTime'
import * as ClientApi from '@/api/system/oauth2/client'

defineOptions({ name: 'SystemOAuth2Client' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  labelWidth: 160,
  searchMenuPosition: 'left',
  labelSuffix: ' ',
  span: 24,
  dialogWidth: '80%',
  menuWidth: 160,
  column: {
    clientId: {
      label: '客户端编号',
      minWidth: 120,
      span: 12,
      rules: [{ required: true, message: '客户端编号不能为空', trigger: 'blur' }]
    },
    secret: {
      label: '客户端密钥',
      minWidth: 100,
      span: 12,
      rules: [{ required: true, message: '客户端密钥不能为空', trigger: 'blur' }]
    },
    name: {
      label: '应用名',
      search: true,
      minWidth: 100,
      rules: [{ required: true, message: '应用名不能为空', trigger: 'blur' }]
    },
    logo: {
      label: '应用图标',
      span: 24,
      minWidth: 90,
      fileType: 'img',
      listType: 'picture-img',
      type: 'upload',
      action: '/infra/file/jeelowcode/upload',
      data: { updateSupport: 0 },
      propsHttp: { url: 'fileUrl' }
    },
    description: {
      label: '应用描述',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      hide: true
    },
    status: {
      label: '状态',
      search: true,
      type: 'radio',
      span: 24,
      width: 80,
      dicData: getIntDictOptions(DICT_TYPE.COMMON_STATUS),
      value: CommonStatusEnum.ENABLE,
      rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
    },
    accessTokenValiditySeconds: {
      label: '访问令牌的有效期',
      controlsPosition: '',
      type: 'number',
      span: 12,
      width: 90,
      value: 30 * 60,
      tip: '单位：秒',
      rules: [{ required: true, message: '访问令牌的有效期不能为空', trigger: 'blur' }]
    },
    refreshTokenValiditySeconds: {
      label: '刷新令牌的有效期',
      controlsPosition: '',
      type: 'number',
      span: 12,
      value: 30 * 24 * 60,
      tip: '单位：秒',
      width: 90,
      rules: [{ required: true, message: '刷新令牌的有效期不能为空', trigger: 'blur' }]
    },
    authorizedGrantTypes: {
      label: '授权类型',
      clearable: false,
      type: 'select',
      multiple: true,
      minWidth: 130,
      span: 12,
      dicData: getDictOptions(DICT_TYPE.SYSTEM_OAUTH2_GRANT_TYPE),
      rules: [{ required: true, message: '授权类型不能为空', trigger: 'blur' }]
    },
    scopes: {
      label: '授权范围',
      type: 'select',
      multiple: true,
      span: 12,
      hide: true,
      control: (val) => {
        let dicData = []
        if (val?.length) {
          dicData = val.map((item) => {
            return { label: item, value: item }
          })
        }
        console.log(dicData)
        return {
          autoApproveScopes: { dicData }
        }
      }
    },
    autoApproveScopes: {
      label: '自动授权范围',
      type: 'select',
      span: 12,
      multiple: true,
      hide: true,
      dicData: []
    },
    redirectUris: {
      label: '可重定向的 URI 地址',
      type: 'select',
      multiple: true,
      span: 12,
      hide: true,
      rules: [{ required: true, message: '可重定向的 URI 地址不能为空', trigger: 'blur' }]
    },
    authorities: {
      label: '权限',
      span: 12,
      hide: true
    },
    resourceIds: {
      label: '资源',
      span: 12,
      hide: true
    },
    additionalInformation: {
      label: '附加信息',
      type: 'textarea',
      minRows: 2,
      maxRows: 4,
      hide: true
    },
    createTime: {
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
const permission = getCurrPermi(['system:oauth2-client'])
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
    const data = await ClientApi.getOAuth2ClientPage(searchObj)
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
    tableForm.value = await ClientApi.getOAuth2Client(tableForm.value.id)
  }
  done()
}

/** 新增操作 */
const rowSave = async (form, done, loading) => {
  let bool = await ClientApi.createOAuth2Client(form).catch(() => false)
  if (bool) {
    message.success(t('common.createSuccess'))
    resetChange()
    done()
  } else loading()
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  let bool = await ClientApi.updateOAuth2Client(form).catch(() => false)
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
    await ClientApi.deleteOAuth2Client(form.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getTableData()
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  await getTableData()
})
</script>
