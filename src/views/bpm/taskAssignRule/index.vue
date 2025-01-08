<template>
  <ContentWrap>
    <avue-crud
      ref="crudRef"
      v-model="tableForm"
      :data="tableData"
      :permission="permission"
      :option="tableOption"
      :table-loading="loading"
      @row-update="rowUpdate"
      @refresh-change="getTableData"
    >
      <template #deptIds-form="{ column, disabled }">
        <DeptSelect
          v-model="tableForm.deptIds"
          :column="column"
          :disabled="disabled"
          type="edit"
          prop="deptIds"
        ></DeptSelect>
      </template>
      <template #userIds-form="{ column, disabled }">
        <UserSelect
          v-model="tableForm.userIds"
          :column="column"
          :disabled="disabled"
          type="edit"
          prop="userIds"
        ></UserSelect>
      </template>
    </avue-crud>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as TaskAssignRuleApi from '@/api/bpm/taskAssignRule'
import * as RoleApi from '@/api/system/role'
import * as PostApi from '@/api/system/post'
import * as UserGroupApi from '@/api/bpm/userGroup'
import { setUserAndDeptName } from '@/components/LowDesign/src/utils/getName'
import { useLowStoreWithOut } from '@/store/modules/low'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()
const lowStore = useLowStoreWithOut()

defineOptions({ name: 'BpmTaskAssignRule' })

const { query } = useRoute() // 查询参数

const loading = ref(true)
const getRules = (label) => {
  return [
    {
      required: true,
      message: '请选择' + label,
      trigger: 'change'
    }
  ]
}
const getUserKey = (val) => {
  let key = ''
  if (val == 10) key = 'roleIds'
  else if ([20, 21].includes(val)) key = 'deptIds'
  else if (val == 22) key = 'postIds'
  else if ([30, 31, 32].includes(val)) key = 'userIds'
  else if (val == 40) key = 'userGroupIds'
  else if (val == 50) key = 'scripts'
  return key
}
const tableOption = reactive({
  border: true,
  align: 'center',
  headerAlign: 'center',
  labelSuffix: ' ',
  span: 24,
  labelWidth: 120,
  dialogWidth: 500,
  addBtn: false,
  delBtn: false,
  calcHeight: 20,
  column: {
    taskDefinitionName: { label: '任务名', disabled: true },
    taskDefinitionKey: { label: '任务标识', disabled: true },
    type: {
      label: '规则类型',
      type: 'select',
      dicData: getIntDictOptions(DICT_TYPE.BPM_TASK_ASSIGN_RULE_TYPE),
      rules: getRules('规则类型'),
      control: (val) => {
        const columnObj = {
          roleIds: { display: false },
          deptIds: { display: false },
          postIds: { display: false },
          userIds: { display: false },
          userGroupIds: { display: false },
          scripts: { display: false }
        }
        const key = getUserKey(val)
        if (key) columnObj[key].display = true
        return columnObj
      }
    },
    options: {
      label: '规则范围',
      display: false,
      formatter: (row) => {
        if (row.ruleModel == 'startEvent') return '-'
        if (!row.type) return '未指定'
        const key = getUserKey(row.type)
        let arr = row.options.map((id) => {
          if (key == 'deptIds') return lowStore.dicObj.deptSelect?.[id] || id
          else if (key == 'userIds') return lowStore.dicObj.userSelect?.[id] || id
          else return dicObj.value[key][id]
        })

        return `${row.$type}：${arr.join('、')}`
      }
    },

    roleIds: {
      label: '指定角色',
      type: 'select',
      dicData: [],
      hide: true,
      display: false,
      rules: getRules('指定角色')
    },
    deptIds: {
      label: '指定部门',
      hide: true,
      display: false,
      findType: 'all',
      multiple: true,
      checkStrictly: true,
      rules: getRules('指定部门')
    },
    postIds: {
      label: '指定岗位',
      type: 'select',
      dicData: [],
      hide: true,
      display: false,
      rules: getRules('指定岗位')
    },
    userIds: {
      label: '指定用户',
      hide: true,
      display: false,
      findType: 'all',
      multiple: true,
      columnKey: ['sex', 'post', 'deptName'],
      rules: getRules('指定用户')
    },
    userGroupIds: {
      label: '指定用户组',
      type: 'select',
      dicData: [],
      hide: true,
      display: false,
      rules: getRules('指定用户组')
    },
    scripts: {
      label: '指定脚本',
      type: 'select',
      dicData: [],
      hide: true,
      display: false,
      rules: getRules('指定脚本')
    }
  }
}) //表格配置
const tableForm = ref<any>({})
const tableData = ref<any[]>([])
const dicObj = ref<any>({})

const permission = getCurrPermi(['bpm:task-assign-rule'])
const crudRef = ref()

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  try {
    const data = await TaskAssignRuleApi.getTaskAssignRuleList({
      modelId: query.modelId,
      processDefinitionId: query.processDefinitionId
    })
    tableData.value = await formattingTableData(data)
  } finally {
    loading.value = false
  }
}

/** 编辑操作 */
const rowUpdate = async (form, index, done, loading) => {
  const key = getUserKey(form.type)
  const delKey = ['roleIds', 'deptIds', 'postIds', 'userIds', 'userGroupIds', 'scripts']
  if (key) {
    if (typeof form[key] == 'number') form[key] = form[key] + ''
    const value = form[key]
    form.options = typeof value == 'string' ? value.split(',') : value
  }
  delKey.forEach((prop) => delete form[prop])
  if (!form.modelId) form.modelId = query.modelId
  const apiName = form.id ? 'updateTaskAssignRule' : 'createTaskAssignRule'
  let bool = await TaskAssignRuleApi[apiName](form).catch(() => false)
  if (bool) {
    message.success(t('common.updateSuccess'))
    getTableData()
    done()
  } else loading()
}

const getDicData = () => {
  return new Promise(async (resolve) => {
    const keyList = ['roleIds', 'postIds', 'userGroupIds']
    const promiseArr = [
      RoleApi.getSimpleRoleList(),
      PostApi.getSimplePostList(),
      UserGroupApi.getSimpleUserGroupList()
    ]
    const resData = await Promise.all(promiseArr)
    resData.forEach((data, index) => {
      const key = keyList[index]
      dicObj.value[key] = {}
      tableOption.column[key].dicData = data.map((item) => {
        const id = item.id + ''
        const name = item.name
        dicObj.value[key][id] = name
        return { label: name, value: id }
      })
    })
    dicObj.value.scripts = {}
    tableOption.column.scripts.dicData = getIntDictOptions(DICT_TYPE.BPM_TASK_ASSIGN_SCRIPT).map(
      (item) => {
        dicObj.value.scripts[item.value] = item.label
        return { value: item.value + '', label: item.label }
      }
    ) as never[]
    dicObj.value.type = {}
    tableOption.column.type.dicData.forEach((item) => {
      dicObj.value.type[item.value] = item.label
    })
    resolve(true)
  })
}
const formattingTableData = (data): Promise<any[]> => {
  return new Promise(async (resolve) => {
    const deptIdList: any[] = []
    const userIdList: any[] = []
    data = data.map((item) => {
      const key = getUserKey(item.type)
      item.$type = dicObj.value['type'][item.type]
      if (key) {
        if (!item.options) item.options = []
        item[key] = item.options.join(',')
        if (['deptIds', 'userIds'].includes(key)) {
          if (key == 'deptIds') deptIdList.push(...item.options)
          else userIdList.push(...item.options)
        }
      }
      return item
    })
    await setUserAndDeptName({ userIdList, deptIdList })
    resolve(data)
  })
}

/** 初始化 **/
onMounted(async () => {
  loading.value = true
  await getDicData()
  await getTableData()
})
</script>

<style lang="scss"></style>
