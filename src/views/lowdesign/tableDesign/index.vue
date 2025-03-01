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
        :before-close="beforeClose"
        :cell-style="cellStyle"
        @search-change="searchChange"
        @search-reset="resetChange"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @refresh-change="getTableData"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #menu-left="{ size }">
          <el-button
            v-hasPermi="['jeelowcode:button']"
            type="primary"
            :size="size"
            @click="menuLeftHandle('btn')"
            class="mr-10px"
          >
            <Icon :size="14" icon="teenyicons:button-outline" />
            <span class="ml-3px!">自定义按钮</span>
          </el-button>
          <el-dropdown @command="menuLeftHandle" v-hasPermi="['jeelowcode:web']">
            <el-button type="primary" :size="size">
              <Icon :size="14" icon="teenyicons:webpack-outline" />
              <span class="ml-3px!">前端增强</span>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="js">JS增强</el-dropdown-item>
                <el-dropdown-item command="scss">SCSS增强</el-dropdown-item>
                <el-dropdown-item command="jsHistory">JS增强历史版本</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button
            type="primary"
            :size="size"
            @click="menuLeftHandle('sql')"
            v-hasPermi="['jeelowcode:sql']"
          >
            <Icon :size="14" icon="devicon-plain:sqldeveloper" />
            <span class="ml-3px!">SQL增强</span>
          </el-button>
          <el-button
            type="primary"
            :size="size"
            @click="menuLeftHandle('java')"
            v-hasPermi="['jeelowcode:java']"
          >
            <Icon :size="14" icon="hugeicons:java" />
            <span class="ml-3px!">JAVA增强</span>
          </el-button>
        </template>
        <template #menu="{ size, row }">
          <div class="flex justify-center flex-items-center">
            <el-button
              type="primary"
              text
              :size="size"
              v-hasPermi="['jeelowcode:dbform:update']"
              @click="menuHandle({ type: 'edit', row, index: row.$index })"
            >
              <Icon :size="14" icon="ep:edit-pen"></Icon>
              <span>编辑</span>
            </el-button>
            <span
              v-if="checkPermi(['jeelowcode:dbform:update'])"
              class="ml-8px mr-8px mt-2px inline-block h-16px w-1px bg-#e8e8e8 .dark:bg-[var(--el-border-color-dark)]"
            ></span>
            <el-dropdown @command="menuHandle">
              <div class="mt--2px cursor-pointer">
                <el-text :size="size" type="primary">
                  更多
                  <Icon :size="16" icon="iconamoon:arrow-down-2-light" />
                </el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <template v-for="item in menuMoreList" :key="item.type">
                    <el-dropdown-item
                      v-if="!item.isShow || item.isShow(row)"
                      :command="{ type: item.type, row }"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <template #menu-form-before="{ disabled, size, type }">
          <div class="w-320px pos-absolute z-99 left-20px top-10px flex items-center gap-x-5px">
            <avue-select
              placeholder="请选择数据库表"
              :dic="sqlFormDic"
              :filterable="true"
              v-model="sqlFormName"
            ></avue-select>
            <el-button
              type="primary"
              @click="getSqlFormConfig"
              :loading="sqlFormLoading"
              :disabled="!sqlFormName"
            >
              <Icon v-if="!sqlFormLoading" :size="14" icon="bxs:magic-wand"></Icon>
              <span class="ml-3px!">反向生成数据 </span>
            </el-button>
          </div>
          <el-button
            v-if="type == 'edit'"
            type="primary"
            :size="size"
            :disabled="disabled"
            :loading="saveLoading"
            @click="rowUpdate(tableForm)"
          >
            <Icon :size="14" icon="ep:circle-check"></Icon>
            <span>修改</span>
          </el-button>
        </template>
        <template #custom_form-form>
          <avue-form
            class="table-design-custom-form"
            ref="customFormRef"
            :option="customFormOption"
            v-model="tableForm"
          >
            <template #tableType="scope">
              <avue-select
                v-model="tableForm.tableType"
                placeholder="请选择 表类型"
                type="tree"
                :dic="scope.column.dicData"
                :clearable="false"
              ></avue-select>
              <div class="mt-2px flex" v-if="tableForm.tableType === 4">
                <avue-radio
                  class="flex-1"
                  v-model="tableForm.subTableMapping"
                  :dic="dicObj.subTableMapping"
                ></avue-radio>
                <div class="flex flex-1">
                  <div class="w-60px">序号</div>
                  <avue-input-number v-model="tableForm.subTableSort"></avue-input-number>
                </div>
              </div>
            </template>
            <template #originButton>
              <div>
                <el-button
                  type="primary"
                  class="ml-2px"
                  @click="openDataOrigin"
                  :disabled="!tableForm.dataOrigin"
                >
                  <Icon :size="14" icon="lucide:text-search"></Icon> <span>数据源SQL配置</span>
                </el-button>
                <el-button
                  type="primary"
                  class="ml-2px"
                  @click="analysisDataOrigin"
                  :loading="analysisLoading"
                  :disabled="!tableForm.originButton"
                >
                  <Icon v-if="!analysisLoading" :size="14" icon="streamline:code-analysis"></Icon>
                  <span>解析配置生成字段</span>
                </el-button>
              </div>
            </template>
            <template #basicConfig>
              <div class="flex justify-end">
                <el-button @click="basicPopup.show = true">
                  <Icon :size="14" icon="uil:setting"></Icon>
                  <span>表格扩展配置</span>
                </el-button>
                <el-button @click="sortPopup = true">
                  <Icon :size="14" icon="mdi:sort"></Icon> <span>默认排序</span>
                </el-button>
                <el-button @click="searchPopup = true">
                  <Icon :size="14" icon="lucide:text-search"></Icon> <span>默认搜索</span>
                </el-button>
              </div>
            </template>
            <template #dataConfig="scope">
              <div class="flex">
                <avue-checkbox
                  class="flex-basis-178px flex-shrink-0"
                  v-model="tableForm.dataConfig"
                  :dic="scope.column.dicData"
                ></avue-checkbox>
                <avue-select
                  class="flex-basis-160px flex-shrink-0"
                  v-model="authValue"
                  :dic="dicObj.dataConfigSelect"
                  :clearable="false"
                ></avue-select>
              </div>
            </template>
            <template #tableConfig="scope">
              <div>
                <avue-checkbox
                  v-model="tableForm.tableConfig"
                  :dic="scope.column.dicData"
                ></avue-checkbox>
                <div class="flex gap-10px flex-wrap">
                  <template v-for="item in tableConfigList" :key="item.prop">
                    <el-form-item
                      v-if="!item.showKey || tableForm[item.showKey] == item.showVal"
                      :label-width="item.labelWidth || '70px'"
                    >
                      <template #label>
                        <div class="pos-relative">
                          <span>{{ item.label }}</span>
                          <span v-if="item.tip" class="pos-absolute right--10px top--8px">
                            <el-tooltip :content="item.tip" placement="top-start">
                              <Icon :size="14" icon="ep:question-filled"></Icon>
                            </el-tooltip>
                          </span>
                        </div>
                      </template>
                      <template v-if="item.type == 'number'">
                        <avue-input-number
                          :class="item.valClass || 'w-100px!'"
                          v-model="tableForm[item.prop]"
                        ></avue-input-number>
                      </template>
                      <template v-else>
                        <avue-select
                          :class="item.valClass || 'w-100px!'"
                          v-model="tableForm[item.prop]"
                          :dic="dicObj[item.prop]"
                          :clearable="false"
                          @change="item.changeFun"
                        ></avue-select>
                      </template>
                    </el-form-item>
                  </template>
                </div>
              </div>
            </template>
          </avue-form>
        </template>
        <template #custom_info-form="scope">
          <TableInfo
            v-if="isTableInfo"
            ref="tableInfoRef"
            :formType="scope.type"
            :editInfoData="editInfoData"
            :showDef="tableForm.viewDefaultField"
            :size="scope.size"
            :tableName="tableForm.tableName"
            @set-tree-label="setTreeLabelDicData"
          ></TableInfo>
        </template>
        <template #lowSelectRadio="{ row }">
          <el-radio
            class="low-select-radio"
            v-model="radioValue"
            :label="row.id"
            @click="radioClick(row)"
          />
        </template>
        <template #optionCondition="{ row }">
          <template v-for="item in row.optionCondition" :key="item.key">
            <el-tag v-if="item.value !== 0" size="small"> {{ item.label }}{{ item.value }} </el-tag>
          </template>
        </template>
      </avue-crud>
    </div>

    <CustomButton v-bind="enhanceBind" v-model="btnPopup"></CustomButton>
    <SqlEnhance v-bind="enhanceBind" v-model="sqlPopup"></SqlEnhance>
    <JavaEnhance v-bind="enhanceBind" v-model="javaPopup"></JavaEnhance>
    <JsEnhanceHistory v-bind="enhanceBind" v-model="jsHistoryPopup"></JsEnhanceHistory>
    <AuthConfig v-bind="authPopup.vBind" v-model="authPopup.show"></AuthConfig>
    <DesignPopup v-model="MEDialog.value" v-bind="MEDialog.params" :isBodyFull="true">
      <template #default>
        <el-container class="h-100%">
          <el-main class="p-0!">
            <MonacoEditor
              class="flex-1"
              v-model="MEData.value"
              v-bind="MEData.params"
            ></MonacoEditor>
          </el-main>
          <el-aside width="300px" v-if="MEDialog.otherParams">
            <TipView v-bind="MEDialog.otherParams"></TipView>
          </el-aside>
        </el-container>
      </template>
    </DesignPopup>
    <DesignPopup v-model="syncData.dialog" v-bind="syncData.params">
      <template #default>
        <el-radio-group v-model="syncData.value" class="ml-4">
          <div class="flex flex-col pb-10px pt-10px">
            <el-radio value="default">普通同步（保留表内数据）</el-radio>
            <el-radio value="force">强制同步（删除并重新生成数据库表）</el-radio>
          </div>
        </el-radio-group>
      </template>
    </DesignPopup>
    <DesignPopup
      v-model="basicPopup.show"
      title="表格扩展配置"
      :isBodyFull="true"
      :handleClose="(done) => handlePopupClose(done, 'basicConfig')"
    >
      <template #default>
        <ConfigOption
          :ref="(el) => (optionRef.basicConfig = el)"
          v-model="tableForm.basicConfig"
          :configKey="basicPopup.configKey"
          :show="basicPopup.show"
        ></ConfigOption>
      </template>
    </DesignPopup>
    <DesignPopup
      v-model="sortPopup"
      title="默认排序配置"
      width="900px"
      :isBodyFull="true"
      :handleClose="(done) => handlePopupClose(done, 'orderbyConfig')"
    >
      <template #default>
        <SortOption
          :ref="(el) => (optionRef.orderbyConfig = el)"
          v-model="tableForm.orderbyConfig"
          :show="sortPopup"
          :filedList="tableInfoRef?.fieldList || []"
        ></SortOption>
      </template>
    </DesignPopup>
    <DesignPopup
      v-model="searchPopup"
      title="默认搜索配置"
      width="1200px"
      :isBodyFull="true"
      :handleClose="(done) => handlePopupClose(done, 'whereConfig')"
    >
      <template #default>
        <SearchOption
          :ref="(el) => (optionRef.whereConfig = el)"
          v-model="tableForm.whereConfig"
          :show="searchPopup"
          :filedList="tableInfoRef?.fieldList || []"
        ></SearchOption>
      </template>
    </DesignPopup>
    <DesignPopup
      v-model="dataOriginPopup.show"
      title="数据源SQL配置"
      width="90%"
      :isBodyFull="true"
      :dialogParams="{ top: '5vh' }"
      :handleClose="(done) => handlePopupClose(done, 'originButton')"
    >
      <template #default>
        <DataOriginOption
          :ref="(el) => (optionRef.originButton = el)"
          v-model="tableForm.originButton"
          :show="dataOriginPopup.show"
          :tableList="dataOriginPopup.tableList"
          :viewField="dataOriginPopup.viewField"
        ></DataOriginOption>
      </template>
    </DesignPopup>
    <DesignPopup v-model="samplePopup" title="控件使用示例" :width="280">
      <template #default>
        <div class="text-center p-20px">
          <div class="b b-b-0 b-solid b-#f1f1f1 .dark:b-[var(--el-border-color-dark)]">
            <div
              v-for="(item, key) in controlPath"
              :key="key"
              class="h-50px flex items-center b-b b-b-solid b-#f1f1f1 .dark:b-[var(--el-border-color-dark)] pr-10px"
            >
              <div class="text-14px flex-1">{{ item.name }}</div>
              <el-button
                class="flex-basis-80px flex-shrink-0"
                size="small"
                type="primary"
                @click="copySampleStr(key)"
                >点击复制</el-button
              >
            </div>
          </div>
        </div>
      </template>
    </DesignPopup>
  </ContentWrap>
</template>
<script lang="ts" setup>
import {
  TableInfo,
  CustomButton,
  SqlEnhance,
  JavaEnhance,
  JsEnhanceHistory,
  ConfigOption,
  SortOption,
  SearchOption,
  DataOriginOption,
  AuthConfig
} from './components'
import { TipView } from '../general/components/index'
import * as TableApi from '@/api/design/table'
import * as JsApi from '@/api/design/table/jsEnhance'
import { dicObj, pageOption, tableInfoOption } from './designData'
import { scssEnhanceExample, controlInitExample } from '@/components/LowDesign/src/utils/example'
import controlPath from '@/components/LowDesign/src/controlPath'
import useMEDialog from '@/hooks/design/useMEDialog'
import useCopyText from '@/hooks/design/useCopyText'
import { ElButton, ElLoading } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { useRenderVxeColumn } from '../general/components/useRenderVxeColumn'
import { useGroup } from '../useGroup'
import { checkPermi } from '@/utils/permission'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'TableDesign' })

const { MEDialog, MEData, openMEDialog } = useMEDialog()
const { copyText } = useCopyText()
useRenderVxeColumn()

const message = useMessage() // 消息弹窗
const router = useRouter() // 路由
const { t } = useI18n() // 国际化
const { getCurrPermi } = useCrudPermi()

const loading = ref(true) // 列表的加载中
const saveLoading = ref(false)
const isTableInfo = ref(false)
const analysisLoading = ref(false)

//表格配置
const tableOption = reactive({
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  searchIndex: 3,
  searchIcon: true,
  labelSuffix: ' ',
  span: 8,
  dialogWidth: '100%',
  dialogFullscreen: true,
  editBtn: false,
  delBtn: false,
  border: true,
  menuWidth: 150,
  updateBtnText: '修改并关闭',
  column: pageOption.tableOptionColumn
})

const tableForm = ref<any>({})
const tableData = ref([])
const authValue = ref('')
const tableSearch = ref({})
const tablePage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const tableSelect = ref<any>([])
const radioValue = ref('')
const customFormOption = ref({
  labelWidth: 120,
  span: 8,
  menuBtn: false,
  column: pageOption.customFormColumn
})
const editInfoData = ref({})
const apiDetailData = ref<any>({})
const jsEnhanceData = ref({})

const sqlFormDic = ref<any[]>([])
const sqlFormDicObj = ref({})
const sqlFormName = ref('')
const sqlFormLoading = ref(false)

const crudRef = ref()
const tableInfoRef = ref()
const customFormRef = ref()
const treeRef = ref()
const optionRef = ref<any>({})

const btnPopup = ref(false)
const sqlPopup = ref(false)
const javaPopup = ref(false)
const jsHistoryPopup = ref(false)
const authPopup = ref({
  show: false,
  vBind: {}
})

const basicPopup = ref({
  show: false,
  configKey: ['tableOption']
})
const sortPopup = ref(false)
const searchPopup = ref(false)
const dataOriginPopup = ref({
  show: false,
  tableList: [] as any[],
  viewField: [] as any[]
})

const isUnload = ref(false)

const syncData = ref({
  value: '',
  dialog: false,
  params: {}
})
const samplePopup = ref(false)
const permission = getCurrPermi(['jeelowcode:dbform'])

const tableConfigList = [
  { label: '表格选择', prop: 'tableSelect', valClass: 'w-75px!' },
  { label: '搜索样式', prop: 'searchStyle', valClass: 'w-100px!' },
  { label: '操作栏样式', prop: 'operateMenuStyle', labelWidth: '90px', valClass: 'w-100px!' },
  {
    label: '单表样式',
    prop: 'singleStyle',
    showKey: 'tableType',
    showVal: 1,
    valClass: 'w-114px!',
    changeFun: ({ value }) => {
      let dicData = cloneDeep(dicObj.tableConfig)
      if (value == 'card') {
        dicData = dicData.filter(
          (item) => !['index', 'border', 'stripe', 'rollBottom'].includes(item.value)
        )
      }
      customFormOption.value.column.tableConfig.dicData = dicData
    }
  },
  {
    label: '卡片栅格',
    prop: 'singleCardSpan',
    showKey: 'singleStyle',
    showVal: 'card',
    valClass: 'w-90px!'
  },
  {
    label: '列显示数量',
    prop: 'expandShowNum',
    showKey: 'singleStyle',
    showVal: 'expand',
    type: 'number',
    labelWidth: '90px',
    valClass: 'w-80px!',
    tip: '列最大显示数量，剩余列将在展开内容中显示'
  },
  {
    label: '展开模式',
    prop: 'expandMode',
    showKey: 'singleStyle',
    showVal: 'expand',
    valClass: 'w-90px!'
  },
  { label: '树表样式', prop: 'treeStyle', showKey: 'tableType', showVal: 2 },
  { label: '树表模式', prop: 'treeMode', showKey: 'tableType', showVal: 2 }
]

const menuMoreList = [
  {
    label: '同步数据库',
    type: 'sync',
    isShow: (row) => row.isDbSync == 'N' && checkPermi(['jeelowcode:dbform:sync'])
  },
  { label: '功能测试', type: 'test' },
  { label: '路由地址', type: 'address' },
  { label: '接口地址', type: 'apiUrl' },
  { label: '租户权限配置', type: 'auth' },
  { label: '复制表', type: 'copy', isShow: () => checkPermi(['jeelowcode:dbform:create']) },
  { label: 'js增强解锁', type: 'jsUnlock', isShow: () => checkPermi(['jeelowcode:web']) },
  { label: 'scss增强解锁', type: 'scssUnlock', isShow: () => checkPermi(['jeelowcode:web']) },
  { label: '删除', type: 'del', isShow: () => checkPermi(['jeelowcode:dbform:delete']) }
]

useCrudHeight(crudRef)
const {
  treeForm,
  treeOption,
  treeData,
  groupValue,
  treePermission,
  treeBeforeOpen,
  treeNodeClick,
  getTreeData,
  treeUpdate,
  treeSave,
  treeDel
} = useGroup(treeRef, TableApi, () => resetChange())

const enhanceBind = computed(() => {
  if (tableSelect.value.length) {
    return {
      dbformId: tableSelect.value[0].id,
      tableName: tableSelect.value[0].tableName,
      tableDescribe: tableSelect.value[0].tableDescribe
    }
  }
  return {}
})

watch(
  () => tableForm.value.tableType,
  (val: number) => {
    if (val == 2 && tableForm.value.dataConfig) {
      tableForm.value.dataConfig = tableForm.value.dataConfig.filter((type) => type != 'page')
    }
    if (val == 2 && tableForm.value.tableSelect == 'radio') {
      tableForm.value.tableSelect = 'multiple'
    }
    if (val == 2) {
      if (tableForm.value.basicFunction)
        tableForm.value.basicFunction = `${tableForm.value.basicFunction},addChild`
      else tableForm.value.basicFunction = 'addChild'
    }
    if (val != 2 && tableForm.value.basicFunction) {
      tableForm.value.basicFunction =
        tableForm.value.basicFunction
          .split(',')
          .filter((type) => type != 'addChild')
          .join(',') || ''
    }
    if (val == 4) tableForm.value.isDesForm = 'N'
    tableForm.value.subTableMapping = val == 4 ? 'many' : ''
    tableForm.value.subTableSort = val == 4 ? 1 : 0

    //格式化配置
    if (val !== 1) {
      tableForm.value.singleStyle = 'default'
    }

    if (tableInfoRef.value) tableInfoRef.value.setTableInfoTree(val)
  }
)
watch(
  () => tableForm.value.singleStyle,
  (val) => {
    if (val == 'card') {
      if (!tableForm.value.singleCardSpan) tableForm.value.singleCardSpan = 4
    } else tableForm.value.singleCardSpan = ''
    if (val == 'expand') {
      if (!tableForm.value.expandShowNum || !tableForm.value.expandMode) {
        tableForm.value.expandShowNum = 6
        tableForm.value.expandMode = 'default'
      }
    } else {
      tableForm.value.expandShowNum = null
      tableForm.value.expandMode = ''
    }
  }
)

watch(
  () => authValue.value,
  () => {
    if (tableForm.value.dataConfig) {
      tableForm.value.dataConfig = tableForm.value.dataConfig.filter(
        (key) => !['authFalse', 'authTrue', 'authOpen', ''].includes(key)
      )
    }
    if (authValue.value) tableForm.value.dataConfig.push(authValue.value)
  }
)

const tableFormVerify = (type) => {
  return new Promise((resolve, reject) => {
    customFormRef.value.validate((bool, done, msg) => {
      done()
      if (!bool) return reject(msg)
      const { tableName, tableType, tableClassify } = tableForm.value
      const subTable = { bool: true, len: 0 }
      if (tableClassify == 2 && tableName && tableName.indexOf('view_') != 0) {
        message.warning('视图表的表名请以 view_ 开头')
        return reject('message')
      }
      let infoData = {}
      let errText = ''
      let fieldCodeArr: any[string] = cloneDeep(tableInfoOption.disabledArr)
      const filedData = [...tableInfoRef.value.infoData.basics]
      tableInfoRef.value.tableInfoDefault.forEach((item) => {
        filedData.splice(item.sortNum || 999, 0, item)
      })

      for (const i in filedData) {
        const index = Number(i)
        const item = filedData[index]
        item.sortNum = index + 1

        let messageText = ''
        let tabKey = 'mysql'
        if (!item.fieldCode || !item.fieldName) {
          messageText = `<div style="line-height:24px">
              <div>${!item.fieldCode ? '字段编码' : '字段名称'}必须填写</div>
              <div>序号：${index + 1}</div>
            </div>`
        }
        if (tableType == 2 && ['hasChildren', 'leaf'].includes(item.fieldCode)) {
          messageText = `<div style="line-height:24px">
              <div>请修改字段编码，树表不允许使用【${item.fieldCode}】编码</div>
              <div>序号：${index + 1}</div>
            </div>`
        }
        if (!item.only && fieldCodeArr.includes(item.fieldCode)) {
          messageText = `<div style="line-height:24px">
            <div>
              <span>字段编码重复：</span>
              <span style="color:red">${item.fieldCode}</span>
            </div>
            <div>序号：${index + 1}</div>
          </div>`
        }
        if (!item.only) fieldCodeArr.push(item.fieldCode)
        if (!/(^[a-zA-Z]{2}(_?[a-zA-Z0-9])*_?$)/.test(item.fieldCode)) {
          messageText = `<div style="line-height:24px">
            <div>
              <span>字段编码不符合规范</span>
              <span style="color:red">${item.fieldCode}</span>
            </div>
            <div>命名规则：只能由字母、数字、下划线组成;必须以字母开头;不能以单个字母加下滑线开头</div>
            <div>序号：${index + 1}</div>
          </div>`
        }

        if (tableType == 4 && (item.mainTable || item.mainField)) {
          subTable.bool = true
          subTable.len++
          if (subTable.len > 1) {
            messageText = `只允许配置一个外键`
            tabKey = 'key'
          }
        }

        if (messageText) {
          handleVerifyError(tabKey, item._X_ROW_KEY, index)
          ElMessage({ dangerouslyUseHTMLString: true, message: messageText })
          errText = 'message'
          break
        }

        for (let key in pageOption.infoApiKey) {
          if (!infoData[key]) infoData[key] = []
          let itemObj: any = {}
          pageOption.infoApiKey[key].forEach((prop) => {
            itemObj[prop] = item[prop] !== undefined ? item[prop] : ''
          })
          if (
            [
              'webList',
              'queryList',
              'dictList',
              'exportList',
              'summaryList',
              'foreignkeyList'
            ].includes(key)
          ) {
            delete itemObj.fieldName
            if (['queryList', 'exportList'].includes(key)) delete itemObj.isShowList
          }
          if (key == 'dictList') {
            itemObj.dictTableColumn = itemObj.dictTableColumn
              ? itemObj.dictTableColumn.join(',')
              : ''
          }
          if (key == 'summaryList') {
            const { sqlType, sqlValue } = item.summaryJson
            itemObj.summaryType = 'bottom'
            itemObj.summarySql = sqlType == 'custom' ? sqlValue : sqlType
            itemObj.summaryJson = JSON.stringify(item.summaryJson)
          }
          if (key == 'webList') {
            itemObj.formatConfig = JSON.stringify({
              formatType: item.virtualType || '',
              formatJson: {
                sql: JSON.parse(item.virtual_sql_str || '{}'),
                java: JSON.parse(item.virtual_java_str || '{}'),
                fun: item.virtual_fun_str || ''
              }
            })
          }
          if (type == 'edit' && item[`${key}_id`]) itemObj['id'] = item[`${key}_id`]
          infoData[key].push(itemObj)
        }
      }

      tableInfoRef.value.infoData.index.forEach((item) => {
        if (!infoData['indexList']) infoData['indexList'] = []
        let itemObj = {}
        pageOption.indexApiKey.forEach((prop) => {
          if (prop == 'indexFieldCodeList') {
            itemObj['indexFieldCodeList'] = item['indexFieldCodeList']
              ? item['indexFieldCodeList'].join(',')
              : ''
          } else itemObj[prop] = item[prop] !== undefined ? item[prop] : ''
        })
        infoData['indexList'].push(itemObj)
      })
      tableInfoRef.value.infoData.summaryTop.forEach((item) => {
        const obj = {
          summaryType: 'top',
          summaryShow: item.summaryShow,
          summaryLabel: item.summaryLabel,
          summarySql: '',
          summaryJson: ''
        }
        const summaryData = {
          summarySql: '',
          summaryControl: '',
          summarySpan: item.summarySpan
        }
        if (item.summarySql) {
          const topObj = JSON.parse(item.summarySql || '{}')
          summaryData.summarySql = topObj
          summaryData.summaryControl = topObj.summaryControl || 'text'
          if (topObj[topObj.valueType]) obj.summarySql = topObj[topObj.valueType]
        }
        obj.summaryJson = JSON.stringify(summaryData)
        if (type == 'edit' && item.id) obj['id'] = item.id
        infoData['summaryList'].push(obj)
      })
      if (errText) return reject(errText)

      if (type == 'edit') {
        infoData['delIdVo'] = {}
        contrastEditData(infoData)
      }
      resolve(infoData)
    })
  })
}

const contrastEditData = (infoData) => {
  for (const key in infoData) {
    if (!apiDetailData.value[key] || key == 'delIdVo') break
    infoData.delIdVo[key] = cloneDeep(apiDetailData.value.delIdVo[key])
    infoData[key] = infoData[key].map((item) => {
      const contrastObj = apiDetailData.value[key][item.id]
      if (item.id) {
        const index = infoData.delIdVo[key].indexOf(item.id)
        if (index != -1) infoData.delIdVo[key].splice(index, 1)
        if (contrastObj) {
          for (const k in item) {
            if (item[k] != contrastObj[k]) {
              item.isModify = 'Y'
              break
            }
          }
        }
      }
      return item
    })
  }
}

const setApiDetailData = (data) => {
  apiDetailData.value = { delIdVo: {} }
  for (const key in data) {
    let listKey = key
    if (['summaryBottomList', 'summaryTopList'].includes(listKey)) listKey = 'summaryList'
    if (listKey != 'dbForm') {
      if (!apiDetailData.value[listKey]) apiDetailData.value[listKey] = {}
      if (!apiDetailData.value.delIdVo[listKey]) apiDetailData.value.delIdVo[listKey] = []
      data[key]?.forEach((item) => {
        if (item.id) {
          apiDetailData.value[listKey][item.id] = item
          apiDetailData.value.delIdVo[listKey].push(item.id)
        }
      })
    }
  }
  for (const key in apiDetailData.value) {
    if (key == 'delIdVo') break
    if (!Object.keys(apiDetailData.value[key]).length) delete apiDetailData.value[key]
  }
}

const handleVerifyError = (key, rowId, index) => {
  const tabKey = `tab_${key}`
  const vxeTableRef = tableInfoRef.value.tableRefObj[tabKey]?.vxeTableRef
  if (vxeTableRef) {
    tableInfoRef.value.setTabsValue(tabKey)
    setTimeout(() => {
      vxeTableRef.setEditRow(vxeTableRef.getRowById(rowId))
      tableInfoRef.value.tableScrollIndex(key, index, index)
    }, 300)
  }
}

const menuLeftHandle = (type) => {
  if (
    ['btn', 'js', 'scss', 'jsHistory', 'sql', 'java'].includes(type) &&
    tableSelect.value.length !== 1
  ) {
    return message.warning('请勾选一条表格数据')
  }
  if (type == 'btn') btnPopup.value = true
  else if (['js', 'scss'].includes(type)) openWebEnhance(type)
  else if (type == 'jsHistory') jsHistoryPopup.value = true
  else if (type == 'sql') sqlPopup.value = true
  else if (type == 'java') javaPopup.value = true
}
const menuHandle = async ({ type, row, index }) => {
  if (type == 'edit') crudRef.value.rowEdit(row, index)
  else if (type == 'test') router.push({ path: '/low/table/test/' + row.id })
  else if (type == 'sync') syncDbTable(row)
  else if (type == 'address') showAddress(row)
  else if (type == 'apiUrl') showApiUrl(row)
  else if (type == 'copy') copyDbTable(row)
  else if (type.indexOf('Unlock') != -1) unlockEnhance(type, row)
  else if (type == 'del') rowDel(row)
  else if (type == 'auth') {
    authPopup.value = {
      show: true,
      vBind: { dbformId: row.id, tableName: row.tableName, tableDescribe: row.tableDescribe }
    }
  }
}

const syncDbTable = (row) => {
  syncData.value.value = 'default'
  syncData.value.dialog = true
  syncData.value.params = {
    title: '同步数据库',
    width: '400px',
    isCenter: true,
    dialogParams: { alignCenter: true },
    footerBtn: [
      {
        name: '取 消',
        clickFun: () => (syncData.value.dialog = false)
      },
      {
        name: '确 定',
        loading: true,
        params: { type: 'primary' },
        clickFun: async (done) => {
          if (syncData.value.value == 'force') {
            await message.prompt(
              `<div>
                  <div style="font-size:16px;">请在下方手动输入<span style="color:#F56C6C">“确认同步”</span>,完成同步验证</div>
                  <div style="color:#E6A23C">注：确定同步后将会删除数据库物理表，重新生成一张空表，如有重要数据请再同步前备份</div>
                </div>`,
              '是否确认强制同步？',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                type: '',
                inputValidator: (value) => {
                  if (value != '确认同步') return '请输入对应的文字完成同步验证'
                }
              }
            )
          }
          await TableApi.asyncDbData(row.id, syncData.value.value).catch(() => false)
          getTableData()
          done()
          syncData.value.dialog = false
        }
      }
    ]
  }
}
const showAddress = (row) => {
  const url = `table/view/` + row.id
  message.alert(`路由地址：</br>${url}`, '菜单的路由地址', {
    confirmButtonText: '复制',
    dangerouslyUseHTMLString: true,
    callback: (action) => {
      if (action == 'confirm') copyText(url)
    }
  })
}
const showApiUrl = async (row) => {
  loading.value = true
  const detailData = await TableApi.getDbDetail(row.id, ['dbForm']).finally(
    () => (loading.value = false)
  )
  const isOpen = detailData.dbForm.dataConfig.indexOf('authOpen') != -1
  const apiList = [
    {
      label: '获取表数据[post]',
      value: `/jeelowcode/dbform-data/list/${row.id}`
    },
    {
      label: '详情数据[post]',
      value: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/detail/${row.id}/数据id`
    },
    {
      label: '新增数据[post]',
      value: `/jeelowcode/${isOpen ? 'open' : 'dbform-data'}/save/${row.id}`
    },
    { label: '编辑数据[put]', value: `/jeelowcode/dbform-data/edit/${row.id}` },
    { label: '删除数据[delete]', value: `/jeelowcode/dbform-data/delete/${row.id}` }
  ]
  if (isOpen) {
    apiList.push({
      label: '未登录时获取表数据[post]',
      value: `/jeelowcode/open/list/${row.id}`
    })
  }
  let list: VNode[] = []
  apiList.forEach((item) => {
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
  message.alert('', '接口地址', {
    message: () => {
      return h('div', { width: '360px' }, list)
    },
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true,
    customStyle: { width: '384px' }
  })
}
const copyDbTable = (row) => {
  message
    .prompt('新表名', '复制表', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: '',
      inputValidator: (value) => {
        if (!value) return '请输入表名'
        let RExp = /^[a-z][a-z0-9_]*$/
        if (!RExp.test(value)) return '表名只能使用小写字母、数字、下划线，并以字母开头'
      }
    })
    .then(async ({ value }) => {
      loading.value = true
      const bool = await TableApi.verifyDbName(value)
      if (bool) {
        loading.value = false
        return message.info('表名已存在')
      }
      await TableApi.copyDbData(row.id, value)
      message.success('复制成功')
      resetChange()
    })
}
const unlockEnhance = (type, row) => {
  const enhanceType = type.split('Unlock')[0]
  message.confirm(`是否强制解除${enhanceType}增强锁定？`, '提示').then(async () => {
    await JsApi.unlockJs(row.id, enhanceType)
    message.success('解除锁定成功')
    if (type.indexOf('Open') !== -1 && tableSelect.value.length) menuLeftHandle(enhanceType)
  })
}

const openWebEnhance = async (enhanceType) => {
  loading.value = true
  jsEnhanceData.value = { jsJson: '' }
  const dbformId = tableSelect.value[0].id
  const detailData = await JsApi.getJsDetail({
    dbformId,
    type: enhanceType,
    lock: true
  }).catch(() => false)
  loading.value = false
  if (detailData === false) return
  if (detailData) {
    if (detailData.timeStr) {
      message
        .confirm(
          `<div>
        <div style="font-size:16px"><span style="font-size:14px">锁定操作人：</span>${detailData.userName}</div>
        <div style="font-size:16px"><span style="font-size:14px">开始锁定时间：</span>${detailData.timeStr}</div>
        <div style="color:#E6A23C">注：如果确认没有人正在编辑，可点击下方强制解锁</div>
      </div>`,
          '当前增强已锁定',
          {
            dangerouslyUseHTMLString: true,
            cancelButtonText: '关闭',
            confirmButtonText: '强制解锁'
          }
        )
        .then(() => {
          menuHandle({
            type: `${enhanceType}UnlockOpen`,
            row: tableSelect.value[0],
            index: tableSelect.value[0].$index
          })
        })
      return
    }
    if (detailData.jsJson) {
      jsEnhanceData.value = detailData
    }
  }
  let params = {
    title: `${enhanceType}增强 【${enhanceBind.value.tableDescribe}】（${enhanceBind.value.tableName}）`,
    fullscreen: true,
    handleClose: async (done) => {
      await JsApi.unlockJs(dbformId, enhanceType)
      isUnload.value = false
      done()
    },
    footerBtn: [
      {
        params: { type: 'primary' },
        name: '保 存',
        icon: 'mingcute:save-line',
        loading: true,
        clickFun: async (loading) => {
          const id = await handleWebEnhance(dbformId, enhanceType)
          if (id) jsEnhanceData.value['id'] = id
          loading()
        }
      },
      {
        params: { type: 'success' },
        name: '保存并关闭',
        icon: 'mingcute:save-line',
        loading: true,
        clickFun: async (loading) => {
          const bool = await handleWebEnhance(dbformId, enhanceType)
          await JsApi.unlockJs(dbformId, enhanceType)
          loading()
          if (bool) {
            MEDialog.value.value = false
            isUnload.value = false
          }
        }
      },
      {
        params: {},
        name: '关 闭',
        icon: 'material-symbols:close',
        clickFun: async () => {
          await message.confirm('是否确认关闭？')
          await JsApi.unlockJs(dbformId, enhanceType)
          MEDialog.value.value = false
          isUnload.value = false
        }
      }
    ]
  }
  if (enhanceType == 'js') {
    params['providerType'] = 'tableJsEnhance'
    params['otherParams'] = { type: 'simple', width: '300px', tipKeyList: ['TableJsEnhance'] }
    params['language'] = 'javascript'
    params['headerBtn'] = [
      {
        params: { type: 'success' },
        name: '控件使用示例',
        icon: 'jam:code-sample',
        clickFun: async () => (samplePopup.value = true)
      }
    ]
    if (!jsEnhanceData.value['jsJson']) {
      jsEnhanceData.value['jsJson'] = `return {

}`
    }
  } else if (enhanceType == 'scss') {
    params['language'] = 'scss'
    if (!jsEnhanceData.value['jsJson']) {
      jsEnhanceData.value['jsJson'] = scssEnhanceExample(dbformId)
    }
  }

  openMEDialog({ params, prop: 'jsJson' }, jsEnhanceData.value)
  isUnload.value = true
}
const handleWebEnhance = (dbformId, enhanceType) => {
  return new Promise(async (resolve) => {
    let apiType = 'updateJsData'
    let apiData = {
      id: jsEnhanceData.value['id'],
      dbformId,
      jsType: enhanceType,
      jsJson: MEData.value.value
    }
    if (!apiData.id) {
      apiType = 'saveJsData'
      delete apiData.id
    }
    const data = await JsApi[apiType](apiData).catch(() => false)
    if (data) message.success('保存成功')
    resolve(data)
  })
}
const cellStyle = ({ row, columnIndex }) => {
  if (columnIndex == 6) {
    return { color: row.isDbSync == 'Y' ? '#67C23A' : '#F56C6C' }
  }
  if (columnIndex == 5) {
    let color = ''
    if (row.tableClassify == 1) color = '#409EFF'
    else if (row.tableClassify == 2) color = '#909399'
    else if (row.tableClassify == 3) color = '#E6A23C'
    return { color }
  }
}

const radioClick = (row) => {
  if (row.id == radioValue.value) {
    setTimeout(() => {
      radioValue.value = ''
      tableSelect.value = []
    }, 30)
  } else {
    tableSelect.value = [row]
  }
}

const setTreeLabelDicData = (dicData) => {
  if (dicData.length == 0) {
    dicData = [{ label: '请先添加字段', value: 'low', disabled: true }]
  }
  customFormRef.value.updateDic('treeLabelField', dicData)
}

const handlePopupClose = (done, prop) => {
  const str = optionRef.value[prop]?.getOptionStr() || ''
  done()
  setTimeout(() => {
    tableForm.value[prop] = str
  }, 30)
}

const copySampleStr = (type) => {
  copyText(controlInitExample(type))
  samplePopup.value = false
}

const openDataOrigin = () => {
  dataOriginPopup.value.tableList = []

  tableForm.value.dataOrigin.split(',').forEach((key) => {
    const tableItem = pageOption.dataOriginObj[key]
    if (tableItem) dataOriginPopup.value.tableList.push(tableItem)
  })
  const filedData = [...tableInfoRef.value.infoData.basics, ...tableInfoRef.value.tableInfoDefault]
  dataOriginPopup.value.viewField = filedData.map((item) => {
    return { label: item.fieldName, value: item.fieldCode }
  })
  dataOriginPopup.value.show = true
}

const setInfoBasics = (infoData) => {
  const basics_id: any[] = []
  const basics_defaule: any[] = []
  tableInfoRef.value.infoData.basics.forEach((item) => {
    if (item.only) {
      if (item.fieldCode == 'id') basics_id.push(item)
      else basics_defaule.push(item)
    }
  })
  tableInfoRef.value.infoData.basics = [...basics_id, ...infoData, ...basics_defaule]
}

const analysisDataOrigin = async () => {
  await message.confirm('解析后将会覆盖现有的字段配置，是否确定解析？')
  analysisLoading.value = true
  const dataOption = JSON.parse(tableForm.value.originButton)
  TableApi.viewDataOriginAnalysis(dataOption.optionObj.select)
    .then((analysisData) => {
      let { infoData } = tableInfoOption.formattingInitData(analysisData)
      infoData = infoData.map((item) => {
        for (const key in item) {
          if (item[key] === null || item[key] === undefined || key == 'fieldList_id') {
            delete item[key]
          }
        }
        return { ...cloneDeep(tableInfoOption.infoDefaultData.basics), ...item }
      })
      setInfoBasics(infoData)
      message.success('解析成功')
    })
    .finally(() => (analysisLoading.value = false))
}

const getSqlFormConfig = async () => {
  await message.confirm('生成后将会覆盖现有的配置，是否确定生成？')
  sqlFormLoading.value = true
  TableApi.getSqlFormConfig(sqlFormName.value)
    .then((fieldList) => {
      const filterFieldCode = [
        'id',
        'tenant_id',
        'create_user',
        'create_time',
        'create_dept',
        'update_user',
        'update_time',
        'is_deleted'
      ]
      tableForm.value = {
        ...tableForm.value,
        tableName: sqlFormName.value,
        tableDescribe: sqlFormDicObj.value[sqlFormName.value],
        tableType: 1,
        tableClassify: 1
      }
      fieldList = fieldList.filter((item) => !filterFieldCode.includes(item.fieldCode))
      fieldList = fieldList.map((item) => {
        return { ...cloneDeep(tableInfoOption.infoDefaultData.basics), ...item }
      })
      setInfoBasics(fieldList)
      message.success('生成成功')
      let { tableName } = customFormOption.value.column
      tableName['disabled'] = true
    })
    .finally(() => (sqlFormLoading.value = false))
}

const getSqlFormDicData = async () => {
  const dicData = await TableApi.getSqlFormDicData().catch(() => false)
  if (dicData) {
    const obj = {}
    sqlFormDic.value = dicData.map((item) => {
      obj[item.tableName] = item.tableDescribe
      return {
        label: `${item.tableName}（${item.tableDescribe}）`,
        value: item.tableName,
        tableDescribe: item.tableDescribe
      }
    })
    sqlFormDicObj.value = obj
  }
}

/** 查询列表 */
const getTableData = async () => {
  loading.value = true
  let searchObj = {
    ...tableSearch.value,
    pageNo: tablePage.value.currentPage,
    pageSize: tablePage.value.pageSize
  }
  if (groupValue.value) searchObj['groupDbformId'] = groupValue.value
  for (const key in searchObj) if (searchObj[key] === '') delete searchObj[key]
  try {
    const data = await TableApi.getDbList(searchObj)
    const couKey = {
      fieldCou: '字段：',
      sqlCou: 'SQL增强：',
      javaCou: 'JAVA增强：',
      jsCou: 'JS增强：',
      scssCou: 'SCSS增强：',
      buttonCou: '自定义按钮：'
    }
    tableData.value = data.records.map((item) => {
      item.optionCondition = []
      for (const key in couKey) {
        if (typeof item[key] == 'number') {
          let val: number | string = item[key]
          if (['jsCou', 'scssCou'].includes(key)) val = val > 0 ? '√' : val
          item.optionCondition.push({ label: couKey[key], value: val, key })
        }
      }
      return item
    })
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
  isTableInfo.value = false
  const groupData = cloneDeep(treeData.value)
  customFormOption.value.column.groupDbformId.dicData = groupData[0].children
  const { tableName, subTableListStr } = customFormOption.value.column
  if (['edit', 'view'].includes(type) && tableForm.value.id) {
    loading.value = true
    const data = await TableApi.getDbDetail(tableForm.value.id, ['all'])
    setApiDetailData(cloneDeep(data))
    data.dbForm.tableConfig = data.dbForm.tableConfig?.split(',') || []
    data.dbForm.dataConfig = data.dbForm.dataConfig?.split(',') || []
    editInfoData.value = data
    tableForm.value = { ...data.dbForm }
    tableName['disabled'] = true
    tableName['rules'] = []
    subTableListStr['display'] = tableForm.value.tableType == 3 && tableForm.value.subTableListStr
    if (tableForm.value.dataSourcesConfig) {
      const dataSourcesConfig = JSON.parse(tableForm.value.dataSourcesConfig)
      delete tableForm.value.dataSourcesConfig
      tableForm.value.dataOrigin = dataSourcesConfig.dataOrigin
      tableForm.value.originButton = JSON.stringify({
        ...dataSourcesConfig.optionData,
        executeSql: dataSourcesConfig.executeSql
      })
    }
    let tableStyle: any = JSON.parse(tableForm.value.tableStyle || '{}')
    tableForm.value.singleStyle = tableStyle.singleStyle || 'default'
    tableForm.value.singleCardSpan = tableStyle.singleCardSpan
    tableForm.value.expandShowNum = tableStyle.expandShowNum
    tableForm.value.expandMode = tableStyle.expandMode
    tableForm.value.searchStyle = tableStyle.searchStyle || 'default'

    const dataConfig = tableForm.value.dataConfig
    dicObj.dataConfigSelect.forEach((item) => {
      if (dataConfig.includes(item.value)) authValue.value = item.value
    })
    loading.value = false
  } else {
    tableForm.value = {
      ...tableForm.value,
      orderbyConfig: '[{"order":"desc","column":"id"}]',
      tableIdType: 'NATIVE',
      dataConfig: ['page', 'initDataReq', 'authFalse'],
      singleStyle: 'default',
      searchStyle: 'default'
    }
    tableName['disabled'] = false
    tableName['rules'] = [{ validator: pageOption.tableName_required, trigger: 'blur' }] as any
    subTableListStr['display'] = false
    if (groupValue.value) tableForm.value.groupDbformId = groupValue.value
    authValue.value = ''
    getSqlFormDicData()
  }

  if (!authValue.value) authValue.value = 'authFalse'
  sqlFormName.value = ''
  isUnload.value = ['edit', 'add'].includes(type)
  done()
  //延迟显示
  setTimeout(() => (isTableInfo.value = true), 300)
}

const beforeClose = async (done, type) => {
  isUnload.value = false
  done()
}

const handleApiFormData = (formData) => {
  const form = cloneDeep(formData)
  form.viewDefaultField = tableInfoRef.value.viewDefaultField
  form.tableConfig = form.tableConfig.join(',')
  form.dataConfig = form.dataConfig.join(',')
  form.groupDbformId = form.groupDbformId || ''
  if (form.tableClassify == 2 && (form.dataOrigin || form.originButton)) {
    const dataSourcesConfig = {
      dataOrigin: form.dataOrigin || '',
      executeSql: '',
      optionData: {}
    }
    if (form.originButton) {
      const originButton = JSON.parse(form.originButton)
      if (form.dataOrigin) dataSourcesConfig.executeSql = originButton.executeSql
      delete originButton.executeSql
      dataSourcesConfig.optionData = originButton
    }
    delete form.dataOrigin
    delete form.originButton
    form.dataSourcesConfig = JSON.stringify(dataSourcesConfig)
  } else form.dataSourcesConfig = ''
  const tableStyleKey = [
    'singleStyle',
    'singleCardSpan',
    'expandShowNum',
    'expandMode',
    'searchStyle'
  ]
  form.tableStyle = {}
  tableStyleKey.forEach((key) => {
    form.tableStyle[key] = form[key]
    delete form[key]
  })
  form.tableStyle = JSON.stringify(form.tableStyle)
  return form
}

/** 新增操作 */
const rowSave = async (formData, done, loading) => {
  const form = handleApiFormData(formData)
  tableFormVerify('add')
    .then(async (infoData: object) => {
      const elLoading = ElLoading.service({ fullscreen: true })
      let bool = await TableApi.saveDbData({ dbForm: { ...form }, ...infoData }).catch(() => false)
      if (bool) {
        message.success(t('common.createSuccess'))
        resetChange()
        done()
      } else loading()
      elLoading.close()
    })
    .catch((error) => {
      if (typeof error == 'object') {
        let key = Object.keys(error)[0]
        message.info(error[key][0].message)
      } else if (error !== 'message') {
        message.alert(error, '请修改', { dangerouslyUseHTMLString: true })
      }
      loading()
    })
}

/** 编辑操作 */
const rowUpdate = async (formData, index?, done?, loading?) => {
  let isGetDetail = false
  if (!loading || !done) {
    saveLoading.value = true
    loading = () => (saveLoading.value = false)
    done = () => (saveLoading.value = false)
    isGetDetail = true
  }
  const form = handleApiFormData(formData)
  tableFormVerify('edit')
    .then(async (infoData: object) => {
      let bool = await TableApi.updateDbData({ dbForm: { ...form }, ...infoData }).catch(
        () => false
      )
      if (bool) {
        if (isGetDetail) {
          const data = await TableApi.getDbDetail(form.id, ['all'])
          setApiDetailData(cloneDeep(data))
          editInfoData.value = data
          setTimeout(() => {
            tableInfoRef.value.initEditInfoData()
          }, 30)
        }
        message.success(t('common.updateSuccess'))
        getTableData()
        done()
      } else loading()
    })
    .catch((error) => {
      if (typeof error == 'object') {
        let key = Object.keys(error)[0]
        message.info(error[key][0].message)
      } else if (error !== 'message') {
        message.alert(error, '请修改', { dangerouslyUseHTMLString: true })
      }
      loading()
    })
}

/** 删除按钮操作 */
const rowDel = async (form) => {
  try {
    // 删除的二次确认
    if (form.tableClassify == '2') {
      await message.delConfirm()
    } else {
      await message.prompt(
        `<div>
          <div style="font-size:16px;">请在下方手动输入<span style="color:#F56C6C">“确认删除”</span>,完成删除验证</div>
          <div style="color:#E6A23C">注：删除包含配置表和数据库物理表</div>
        </div>`,
        '是否确认删除？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: '',
          inputValidator: (value) => {
            if (value != '确认删除') return '请输入对应的文字完成删除验证'
          }
        }
      )
    }
    loading.value = true
    // 发起删除
    await TableApi.deleteDbData([form.id])
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
  getSqlFormDicData()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload)
})
</script>
<style lang="scss" scoped>
.table-content {
  max-width: calc(100% - 190px);
}

::v-deep(.avue-crud) {
  .option-condition-td {
    padding: 4px 0;

    .cell {
      display: flex;
      flex-wrap: wrap;
      padding: 0 6px;
      gap: 0.25rem;
    }
  }
}
</style>
<style lang="scss">
.table-design-custom-form {
  .el-form-item {
    margin-bottom: 18px !important;

    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
}

.defUnFull {
  height: calc(90vh - 160px);
}

.dark {
  .table-design-option {
    .summary-item,
    .formatting-item,
    .sort-item {
      background-color: var(--el-bg-color) !important;
      border-color: var(--el-border-color-dark) !important;
    }

    .summary-title {
      color: var(--el-text-color-seconda) !important;
      background-color: var(--el-fill-color-light) !important;
      border-color: var(--el-border-color-dark) !important;
    }

    .view-field-content {
      .content-item {
        color: var(--el-text-color-seconda) !important;
        background-color: var(--el-fill-color-light) !important;
      }
    }

    .integrality-content,
    .formatting-result,
    .left-tree,
    .option-content,
    .view-field,
    .view-field .title,
    .alias-item {
      border-color: var(--el-border-color-dark) !important;
    }

    .integrality-content > div {
      background-color: var(--el-fill-color-light) !important;
    }
  }

  .config-option,
  .search-option,
  .sort-option {
    .el-aside.left-tree > div {
      color: var(--el-text-color-seconda) !important;
    }

    .el-main.main-option {
      border-color: var(--el-border-color-dark) !important;

      .option-title {
        background-color: var(--el-fill-color-light) !important;
      }

      .row-item {
        border-color: var(--el-border-color-dark) !important;
      }
    }

    .config-content,
    .search-content {
      background-color: transparent;

      .config-item,
      .search-item {
        background-color: transparent;
        border-color: var(--el-border-color-dark) !important;
      }
    }
  }

  .summary-top-option {
    .summary-title {
      background-color: transparent !important;
    }

    .summary-result {
      border-color: var(--el-border-color-dark) !important;
    }
  }
}
</style>
