<template>
  <DesignPopup
    v-model="popupShow"
    :title="`租户权限配置 【${tableDescribe}】（${tableName}）`"
    :fullscreen="true"
    controlType="drawer"
    width="900px"
  >
    <div class="p-20px pt-0">
      <div class="flex items-center mt-10px mb-10px">
        <span class="flex-basis-50px flex-shrink-0 text-14px">租户：</span>
        <avue-select
          class="flex-basis-300px w-300px"
          v-model="currTenant"
          :dic="tenantDic"
          :props="{ label: 'tenantName', value: 'tenantId' }"
          @change="(data) => initData(data.value)"
        ></avue-select>
      </div>
      <el-tabs v-model="tabValue" type="border-card" v-loading="loading">
        <el-tab-pane label="字段权限" name="field">
          <avue-crud ref="fieldCrudRef" :data="fieldData" :option="fieldOption">
            <template #enableState-header="{ column }">
              <div class="w-100% flex items-center justify-center gap-x-5px">
                <avue-switch
                  v-model="fieldAllObj.open"
                  @click="setAll('field', ['enableState'])"
                ></avue-switch>
                <span>{{ column.label }}</span>
              </div>
            </template>
            <template #listIsView-header="{ column }">
              <div class="w-100% flex items-center justify-center gap-x-5px" v-if="column">
                <el-checkbox
                  v-model="fieldAllObj.list"
                  :indeterminate="fieldAllObj.listHalf"
                  @click="setAll('field', ['listIsView'])"
                >
                </el-checkbox>
                <span>{{ column.label }}</span>
              </div>
            </template>
            <template #formConfig-header="{ column }">
              <div class="w-100% flex items-center justify-center gap-x-5px" v-if="column">
                <el-checkbox
                  v-model="fieldAllObj.form"
                  :indeterminate="fieldAllObj.formHalf"
                  @click="setAll('field', ['formIsView', 'formIsEdit'])"
                >
                </el-checkbox>
                <span>{{ column.label }}</span>
              </div>
            </template>
            <template #enableState-form="{ dic, column, row }">
              <avue-switch
                v-model="row[column.prop]"
                :dic="dic"
                :beforeChange="(done) => statusDeforeChange(row, 'field', done)"
              ></avue-switch>
            </template>
            <template #listIsView-form="{ column, row }">
              <el-checkbox
                true-value="Y"
                false-value="N"
                v-model="row[column.prop]"
                :disabled="row.enableState == 'N'"
                @change="(val) => fieldCheckBoxChange(val, row, 'listIsView')"
              >
                可见
              </el-checkbox>
            </template>
            <template #formConfig-form="{ row }">
              <el-checkbox
                true-value="Y"
                false-value="N"
                :disabled="row.enableState == 'N'"
                v-model="row.formIsView"
                @change="(val) => fieldCheckBoxChange(val, row, 'formIsView')"
              >
                可见
              </el-checkbox>
              <el-checkbox
                true-value="Y"
                false-value="N"
                :disabled="row.enableState == 'N'"
                v-model="row.formIsEdit"
                @change="(val) => fieldCheckBoxChange(val, row, 'formIsEdit')"
              >
                可编辑
              </el-checkbox>
            </template>
          </avue-crud>
        </el-tab-pane>
        <el-tab-pane label="按钮权限" name="btn">
          <avue-crud ref="btnCrudRef" :data="btnData" :option="btnOption">
            <template #enableState-header="{ column }">
              <div class="w-100% flex items-center justify-center gap-x-5px">
                <avue-switch v-model="btnAll" @click="setAll('btn')"></avue-switch>
                <span>{{ column.label }}</span>
              </div>
            </template>
            <template #enableState-form="{ dic, column, row }">
              <avue-switch
                v-model="row[column.prop]"
                :dic="dic"
                :beforeChange="(done) => statusDeforeChange(row, 'btn', done)"
              ></avue-switch>
            </template>
            <template #authText> 可见 </template>
          </avue-crud>
        </el-tab-pane>
        <el-tab-pane label="数据权限" name="data">
          <avue-crud
            ref="dataCrudRef"
            v-model="dataForm"
            :data="dataData"
            :option="dataOption"
            :before-open="dataBeforeOpen"
            :table-loading="dataLoading"
            @row-save="(form, done, loading) => saveRuleData(form, done, loading)"
            @row-update="(form, index, done, loading) => saveRuleData(form, done, loading)"
          >
            <template #menu="{ row }">
              <el-button text type="danger" @click="dataRowDel(row)">
                <Icon :size="14" icon="ep:delete"></Icon>
                <span>删除</span>
              </el-button>
            </template>
            <template #enableState-header="{ column }">
              <div class="w-100% flex items-center justify-center gap-x-5px">
                <avue-switch v-model="dataAll" @click="setAll('data')"></avue-switch>
                <span>{{ column.label }}</span>
              </div>
            </template>
            <template #enableState-form="{ dic, column, row }">
              <avue-switch
                v-model="row[column.prop]"
                :dic="dic"
                :beforeChange="(done) => statusDeforeChange(row, 'data', done)"
              ></avue-switch>
            </template>
            <template #sqlRuleValue-form="{ column, size }">
              <avue-input
                v-model="dataForm[column.prop]"
                :size="size"
                readonly
                :placeholder="`请输入 ${column.label}`"
                @click="openMEDialog(column, dataForm)"
              ></avue-input>
            </template>
          </avue-crud>
        </el-tab-pane>
      </el-tabs>
    </div>
  </DesignPopup>
  <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
    <template #title>{{ MEDialog.title }}</template>
    <template #default>
      <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
    </template>
  </DesignPopup>
</template>
<script lang="ts" setup>
import useMEDialog from '@/hooks/design/useMEDialog'
import * as Auth from '@/api/design/table/auth'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

defineOptions({ name: 'JavaEnhance' })

const { MEDialog, MEData, openMEDialog } = useMEDialog()

interface Props {
  dbformId?: string
  tableName?: string
  tableDescribe?: string
}
const popupShow = defineModel({ default: false, type: Boolean })
const props = defineProps<Props>()

const loading = ref(false)

const tabsOption = ref({
  type: 'border-card',
  column: [
    { label: '字段权限', prop: 'field' },
    { label: '按钮权限', prop: 'btn' },
    { label: '数据权限', prop: 'data' }
  ]
})
const tabValue = ref(tabsOption.value.column[0].prop)

const currTenant = ref('1')
const tenantDic = ref<any[]>([])
//字段权限
const fieldAllObj = ref({
  open: true,
  list: false,
  form: false,
  listHalf: false,
  formHalf: false
})
const fieldOption = reactive({
  border: true,
  header: false,
  menu: false,
  rowKey: 'fieldCode',
  calcHeight: 185,
  column: {
    enableState: {
      label: '启用',
      type: 'switch',
      cell: true,
      width: 100,
      dicData: [
        { label: '', value: 'N' },
        { label: '', value: 'Y' }
      ]
    },
    fieldCode: { label: '字段编码' },
    fieldName: { label: '字段名称' },
    listIsView: { label: '列表控制', cell: true },
    formConfig: { label: '表单控制', cell: true }
  }
})
const fieldData = ref<any>([])
const filedAll = computed(() => {
  const obj = {
    open: true,
    list: true,
    form: true,
    listHalf: false,
    formHalf: false
  }
  if (fieldData.value.length) {
    for (let key in fieldData.value) {
      const item = fieldData.value[key]
      if (item.enableState == 'Y') {
        if (obj.list && item.listIsView == 'N') obj.list = false
        if (obj.form && (item.formIsView == 'N' || item.formIsEdit == 'N')) obj.form = false
        //设置半选
        if (!obj.listHalf && item.listIsView == 'Y') obj.listHalf = true
        if (!obj.formHalf && (item.formIsView == 'Y' || item.formIsEdit == 'Y')) obj.formHalf = true
      } else if (obj.open) obj.open = false
    }
    if (obj.list) obj.listHalf = false
    if (obj.form) obj.formHalf = false
  } else for (const key in obj) obj[key] = false
  return obj
})
watch(
  () => filedAll.value,
  (obj) => {
    fieldAllObj.value = obj
  }
)
//按钮权限
const btnAll = ref(false)
const btnOption = reactive({
  border: true,
  header: false,
  menu: false,
  rowKey: 'buttonCode',
  calcHeight: 185,
  column: {
    enableState: {
      label: '启用',
      type: 'switch',
      cell: true,
      dicData: [
        { label: '', value: 'N' },
        { label: '', value: 'Y' }
      ]
    },
    buttonName: { label: '按钮名称' },
    buttonCode: { label: '按钮编码' },
    authText: { label: '权限控制' }
  }
})
const btnData = ref<any>([])
watch(
  () => btnData.value,
  (list) => {
    let bool = true
    if (list.length) {
      list.forEach((item) => {
        if (item.enableState != 'Y') bool = false
      })
    } else bool = false
    btnAll.value = bool
  },
  { deep: true }
)

//数据权限
const dataLoading = ref(false)
const dataForm = ref<any>({ ruleCondition: '' })
const isDataForm = ref(false)
const dataAll = ref(false)
const dataOption = reactive({
  border: true,
  menuWidth: 150,
  columnBtn: false,
  refreshBtn: false,
  calcHeight: 185,
  column: {
    enableState: {
      label: '启用',
      type: 'switch',
      cell: true,
      display: false,
      width: 100,
      dicData: [
        { label: '', value: 'N' },
        { label: '', value: 'Y' }
      ]
    },
    ruleName: {
      label: '规则名称',
      width: 200,
      rules: [{ required: true, message: `请输入 规则名称`, trigger: 'blur' }]
    },
    ruleType: {
      label: '规则类型',
      type: 'radio',
      value: 'field',
      hide: true,
      dicData: [
        { label: '字段选择', value: 'field' },
        { label: '自定义SQL', value: 'sql' }
      ],
      control: (val) => {
        const bool = val == 'field'
        return {
          ruleField: { display: bool },
          ruleCondition: { display: bool },
          ruleValue: { display: bool },
          sqlRuleValue: { display: !bool }
        }
      }
    },
    ruleField: {
      label: '规则字段',
      type: 'select',
      dicData: [],
      filterable: true,
      hide: true,
      rules: [{ required: true, message: `请选择 规则字段`, trigger: 'change' }]
    },
    ruleCondition: {
      label: '规则条件',
      type: 'select',
      rules: [{ required: true, message: `请选择 规则条件`, trigger: 'change' }],
      dicData: [
        { label: '等于（=）', value: 'eq' },
        { label: '不等于（!=）', value: 'ne' },
        { label: `模糊（LIKE "%xxx%"）`, value: 'like' },
        { label: `左模糊（LIKE "%xxx"）`, value: 'leftLike' },
        { label: `右模糊（LIKE "xxx%"）`, value: 'rightLike' },
        { label: `包含（IN("xxx","xxx"...)）`, value: 'in' },
        { label: `不包含（NOT IN("xxx","xxx"...)）`, value: 'notIn' },
        { label: '为空（IS NULL）', value: 'isNull' },
        { label: '不为空（IS NOT NULL）', value: 'isNotNull' }
      ],
      hide: true,
      control: (val, form) => {
        let bool = !['isNull', 'isNotNull'].includes(val)
        if (form.ruleType == 'sql') bool = false
        return { ruleValue: { display: bool } }
      }
    },
    ruleValue: {
      label: '规则值',
      hide: true,
      type: 'select',
      allowCreate: true,
      filterable: true,
      multiple: false,
      dataType: 'string',
      dicData: [
        { label: '其他值请直接输入（字符串请加"双引号"）', value: '-', disabled: true },
        { label: '获取当前人ID', value: '#{jeelowcode_user_id}' },
        { label: '获取当前人名称', value: '#{jeelowcode_user_nickname}' },
        { label: '获取当前人部门', value: '#{jeelowcode_user_dept}' },
        { label: '获取当前人所有部门', value: '#{jeelowcode_user_all_dept}' },
        { label: '获取当前人租户', value: '#{jeelowcode_tenant_id}' },
        { label: '获取当前日期', value: '#{jeelowcode_date}' },
        { label: '获取当前时间', value: '#{jeelowcode_time}' }
      ],
      rules: [{ required: true, message: `请选择 规则值`, trigger: 'change' }]
    },
    sqlRuleValue: {
      label: '规则SQL',
      display: false,
      hide: true,
      rules: [{ required: true, message: `请输入 规则SQL`, trigger: 'blur' }]
    },
    ruleSql: {
      label: '规则描述',
      display: false
    }
  }
})
const dataData = ref<any>()
watch(
  () => dataData.value,
  (list) => {
    let bool = true
    if (list.length) {
      list.forEach((item) => {
        if (item.enableState != 'Y') bool = false
      })
    } else bool = false
    dataAll.value = bool
  },
  { deep: true }
)

watch(
  () => dataForm.value.ruleCondition,
  (newVal, oldVal) => {
    const newBool = ['in', 'notIn'].includes(newVal)
    const oldBool = ['in', 'notIn'].includes(oldVal)
    if ((newBool && !oldBool) || (oldBool && !newBool)) {
      if (isDataForm.value) dataForm.value.ruleValue = newBool ? [] : ''
      dataOption.column.ruleValue.multiple = newBool
    }
  }
)

const dataCrudRef = ref()
const btnCrudRef = ref()
const fieldCrudRef = ref()

const { initTableLayout } = useCrudHeight([dataCrudRef, btnCrudRef, fieldCrudRef])

watch(
  () => popupShow.value,
  (val: boolean) => {
    tabValue.value = tabsOption.value.column[0].prop
    if (val) initData()
  }
)

watch(
  () => tabValue.value,
  () => {
    initTableLayout()
  }
)

//处理权限数据
const handleSaveAuthData = (data, row, type) => {
  if (type == 'field') {
    data = {
      formIsEdit: row.formIsEdit == 'Y' ? null : 'N',
      formIsView: row.formIsView == 'Y' ? null : 'N',
      listIsView: row.listIsView == 'Y' ? null : 'N',
      enableState: row.enableState == 'Y' ? null : 'N',
      ...data,
      fieldCode: row.fieldCode
    }
  } else if (type == 'btn') data.buttonCode = row.buttonCode
  else if (type == 'data') data.ruleId = row.id

  data.tenantId = currTenant.value
  data.dbformId = props.dbformId
  return data
}

//保存权限数据
const apiType = { field: 'saveFieldAuth', btn: 'saveButtonAuth', data: 'saveDataAuth' }
const saveAuthData = (data, row, type) => {
  data = handleSaveAuthData(data, row, type)
  return Auth[apiType[type]]([data]).catch(() => false)
}

//修改所有的启用状态
const statusDeforeChange = async (row, type, done) => {
  const value = row.enableState == 'Y' ? 'N' : 'Y'
  let data: any = { enableState: value == 'Y' ? null : value }
  const res = await saveAuthData(data, row, type)
  done(res ? true : false)
}

//修改字段列表、表单控制
const fieldCheckBoxChange = async (value, row, dataKey) => {
  let data: any = { [dataKey]: value == 'Y' ? null : value }
  const res = await saveAuthData(data, row, 'field')
  if (!res) {
    fieldData.value = fieldData.value.map((item) => {
      if (item.fieldCode == row.fieldCode) {
        item[dataKey] = item[dataKey] == 'Y' ? 'N' : 'Y'
      }
      return item
    })
  }
}

//全选控制
const setAll = async (type, keyList?) => {
  const editData: any[] = []
  if (type == 'field') {
    const obj = { enableState: 'open', listIsView: 'list', formIsView: 'form', formIsEdit: 'form' }
    fieldData.value = fieldData.value.map((item) => {
      const editItem: any = {}
      let bool = false

      keyList.forEach((prop) => {
        if (prop == 'enableState' || (prop != 'enableState' && item.enableState == 'Y')) {
          const value = fieldAllObj.value[obj[prop]] ? 'N' : 'Y'
          if (item[prop] !== value) {
            editItem[prop] = value == 'Y' ? null : 'N'
            bool = true
          }
          item[prop] = value
        }
      })
      if (bool) editData.push(handleSaveAuthData(editItem, item, type))
      return item
    })
    setTimeout(() => {
      fieldAllObj.value[obj[keyList[0]]] = !fieldAllObj.value[obj[keyList[0]]]
    }, 30)
  } else if (type == 'btn') {
    const value = btnAll.value ? 'N' : 'Y'
    btnData.value = btnData.value.map((item) => {
      if (item.enableState !== value) {
        editData.push(handleSaveAuthData({ enableState: value == 'Y' ? null : 'N' }, item, type))
      }
      item.enableState = value
      return item
    })
    setTimeout(() => {
      btnAll.value = !btnAll.value
    }, 30)
  } else if (type == 'data') {
    const value = dataAll.value ? 'N' : 'Y'
    dataData.value = dataData.value.map((item) => {
      if (item.enableState !== value) {
        editData.push(handleSaveAuthData({ enableState: value == 'Y' ? null : 'N' }, item, type))
      }
      item.enableState = value
      return item
    })
    setTimeout(() => {
      dataAll.value = !dataAll.value
    }, 30)
  }

  if (editData.length) {
    loading.value = true
    await Auth[apiType[type]](editData).catch(() => false)
    if (type == 'field') await getFieldAuthData()
    else if (type == 'btn') await getButtonAuthData()
    else if (type == 'data') await getDataAuthData()
    loading.value = false
  }
}

const initData = async (tenantId?) => {
  loading.value = true
  if (tenantId) currTenant.value = tenantId
  else {
    currTenant.value = '1'
    tabValue.value = 'field'
  }
  const promiseArr = [getTenantList(), getFieldAuthData(), getButtonAuthData(), getDataAuthData()]
  await Promise.all(promiseArr)
  loading.value = false
}

//获取所有租户
const getTenantList = () => {
  return Auth.getAllTenant()
    .then((data) => {
      tenantDic.value = data.map((item) => {
        if (item.tenantId == '1') item.tenantName = '所有租户默认权限'
        return item
      })
    })
    .catch(() => false)
}

//获取字段权限列表
const getFieldAuthData = () => {
  return Auth.getFieldAuth(currTenant.value, props.dbformId)
    .then((data) => {
      if (data) {
        fieldData.value = data.map((item) => {
          item.$cellEdit = true
          if (item.enableState == null) item.enableState = 'Y'
          if (item.formIsEdit == null) item.formIsEdit = 'Y'
          if (item.formIsView == null) item.formIsView = 'Y'
          if (item.listIsView == null) item.listIsView = 'Y'
          return item
        })
      }
    })
    .catch(() => false)
}

//获取按钮权限列表
const getButtonAuthData = () => {
  return Auth.getButtonAuth(currTenant.value, props.dbformId)
    .then((data) => {
      if (data) {
        btnData.value = data.map((item) => {
          item.$cellEdit = true
          if (item.enableState == null) item.enableState = 'Y'
          return item
        })
      }
    })
    .catch(() => false)
}

//获取数据权限列表
const getDataAuthData = () => {
  return Auth.getDataAuth(currTenant.value, props.dbformId)
    .then((data) => {
      dataData.value = (data || []).map((item) => {
        item.$cellEdit = true
        if (item.enableState == null) item.enableState = 'Y'
        if (item.ruleType == 'sql') {
          item.sqlRuleValue = item.ruleValue
          item.ruleValue = ''
        }
        return item
      })
    })
    .catch(() => false)
}

//保存、修改数据权限
const saveRuleData = async (form, done, loading) => {
  let conditionText = ''
  if (form.ruleCondition == 'eq') conditionText = `= ${form.ruleValue}`
  else if (form.ruleCondition == 'ne') conditionText = `!= ${form.ruleValue}`
  else if (form.ruleCondition == 'like') conditionText = `LIKE "%${form.ruleValue}%"`
  else if (form.ruleCondition == 'leftLike') conditionText = `LIKE "%${form.ruleValue}"`
  else if (form.ruleCondition == 'rightLike') conditionText = `LIKE "${form.ruleValue}%"`
  else if (form.ruleCondition == 'in') conditionText = `IN( ${form.ruleValue} )`
  else if (form.ruleCondition == 'notIn') conditionText = `NOT IN( ${form.ruleValue} )`
  else if (form.ruleCondition == 'isNull') conditionText = 'IS NULL'
  else if (form.ruleCondition == 'isNotNull') conditionText = 'IS NOT NULL'
  form.ruleSql = form.ruleType == 'sql' ? form.sqlRuleValue : `${form.ruleField} ${conditionText}`

  const data = await Auth.saveRuleData({
    ...form,
    dbformId: props.dbformId,
    ruleValue: form.ruleType == 'sql' ? form.sqlRuleValue : form.ruleValue
  }).catch(() => false)
  if (!data) return loading()
  done()
  dataLoading.value = true
  await getDataAuthData()
  dataLoading.value = false
}

//删除数据权限
const dataRowDel = async (row) => {
  await message.delConfirm()
  dataLoading.value = true
  await Auth.deleteRuleData(row.id).catch(() => false)
  await getDataAuthData()
  dataLoading.value = false
}

const dataBeforeOpen = (done) => {
  isDataForm.value = false
  //设置规则字段
  dataOption.column.ruleField.dicData = fieldData.value.map((item) => {
    return { label: `${item.fieldName}（${item.fieldCode}）`, value: item.fieldCode }
  })
  done()
  setTimeout(() => {
    isDataForm.value = true
  }, 300)
}
</script>

<style lang="scss"></style>
