<template>
  <div
    class="low-table relative"
    :class="[
      `low-table__${tableId}`,
      {
        summary: tableOption.showSummary,
        'low-table-grid': tableOption.grid,
        'no-menu': !tableOption.menu
      }
    ]"
  >
    <!-- 顶部统计 -->
    <div
      v-if="summaryTop.show"
      class="low-table-summary absolute left-0 top-0 w-100% h-auto z-999"
      v-hasResize="onSummaryTopResize"
    >
      <SummaryTop
        ref="summaryTopRef"
        v-if="tableSummary.topList?.length"
        :summaryList="tableSummary.topList"
      ></SummaryTop>
    </div>
    <div
      class="low-table-content gap-x-10px w-100%"
      :class="{
        show_fixed_bar: isShowFixedBar,
        [`low-table-grid__${tableInfo.singleCardSpan}`]: tableOption.grid
      }"
      :style="{ paddingTop: summaryTop.height + 'px' }"
    >
      <!-- 左树右表（树表） -->
      <div
        class="left-tree-box flex-basis-200px flex-shrink-0"
        v-if="tableInfo.tableType == 'treeAround'"
      >
        <avue-tree
          ref="treeRef"
          :option="treeAroundOption"
          :data="treeAroundData"
          @node-click="treeAroundNodeClick"
        >
          <template #default="{ data }">
            <span
              class="el-tree-node__label"
              :class="{
                active:
                  data[treeAroundOption.props.value] == treeAroundRow[treeAroundOption.props.value]
              }"
            >
              {{ data[treeAroundOption.props.label] }}
            </span>
          </template>
        </avue-tree>
      </div>
      <div
        class="flex-1 w-100%"
        :class="{ 'table-content': tableInfo.tableType == 'treeAround' }"
        v-if="isInit"
      >
        <!-- 主体表格 -->
        <avue-crud
          ref="crudRef"
          v-model="tableForm"
          v-model:search="tableSearch"
          v-bind="crudBind"
          :table-loading="loading"
          :data="tableData"
          :option="tableOption"
          :before-open="beforeOpen"
          :row-style="tableDefaultFun.rowStyle"
          :cell-style="tableDefaultFun.cellStyle"
          :summary-method="tableDefaultFun.summaryMethod"
          @search-change="searchChange"
          @search-reset="resetChange"
          @row-save="rowSave"
          @row-update="rowUpdate"
          @row-del="rowDel"
          @refresh-change="refreshChange"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="selectionChange"
          @sort-change="sortChange"
          @select-all="selectAll"
          @row-click="tableDefaultFun.rowClick"
          @row-dblclick="tableDefaultFun.rowDblclick"
          @cell-click="tableDefaultFun.cellClick"
          @cell-dblclick="tableDefaultFun.cellDblclick"
          @tree-load="treeLoad"
          @expand-change="expandChanges"
          :upload-before="uploadBefore"
          :upload-exceed="uploadExceed"
          :upload-sized="uploadSized"
          :upload-preview="uploadPreview"
        >
          <!-- 自定义表格头部操作 -->
          <template #menu-left="{ size }">
            <TableButton
              v-show="menuLeftShow"
              type="header"
              :size="size"
              :buttonObj="buttonObj"
              :selectLength="tableSelect.length"
              @menu-left-handle="menuLeftHandle"
            ></TableButton>
          </template>
          <!-- 自定义操作列 -->
          <template #menu="{ size, row, index }">
            <TableButton
              :type="tableInfo.menuStyle == 'more' ? 'more' : 'menu'"
              :size="size"
              :buttonObj="buttonObj"
              :row="row"
              :index="index"
              @menu-handle="menuHandle"
            ></TableButton>
          </template>
          <!-- 自定义多选提示 -->
          <template #tip>
            <span
              class="inline-block pl-10px c-#999"
              v-if="model == 'dicTable' && dicMaxLimit"
              type="danger"
            >
              最多可选择 {{ dicMaxLimit }} 条数据
            </span>
          </template>
          <!-- 单选 -->
          <template #lowSelectRadio="{ row, index }">
            <el-radio
              class="low-select-radio"
              v-model="radioValue"
              :label="row[tableOption.rowKey || 'id']"
              :disabled="!tableOption.selectable(row, index)"
              @click="radioClick(row, index)"
            />
          </template>
          <!-- 自定义表头 -->
          <template v-for="prop in inlineSearch" :key="prop" #[`${prop}-header`]="{ column }">
            <InlineSearch
              v-model="tableSearch[prop]"
              :prop="prop"
              :column="column"
              :crudRef="crudRef"
              @execute-search="searchChange"
            ></InlineSearch>
          </template>
          <!-- 自定义表单 -->
          <template v-for="c in slotData.form" :key="c.prop" #[`${c.prop}-form`]="scope">
            <AvueSlot
              slotType="form"
              :scope="scope"
              :control="c"
              v-model="tableForm[c.prop]"
            ></AvueSlot>
          </template>
          <!-- 自定义搜索 -->
          <template v-for="c in slotData.search" :key="c.prop" #[`${c.prop}-search`]="scope">
            <AvueSlot
              slotType="search"
              :scope="scope"
              :control="c"
              v-model="tableSearch[c.prop]"
            ></AvueSlot>
          </template>
          <!-- 自定义列 -->
          <template v-for="c in slotData.list" :key="c.prop" #[c.prop]="scope">
            <AvueSlot slotType="list" :scope="scope" :control="c"></AvueSlot>
          </template>
          <!-- 自定义附表表单 -->
          <template #lowCustomSubTable-form="{ type, disabled, column }">
            <avue-tabs
              ref="subTabsRef"
              :option="column.tabsOption"
              @change="(tab) => (subTabsValue = tab)"
            ></avue-tabs>
            <template v-for="sub in column.tabsOption.column" :key="sub.prop">
              <template v-if="sub.subType == 'many'">
                <SubTable
                  :ref="(el) => (subTableRef[sub.prop] = el)"
                  v-model="tableForm[sub.prop]"
                  v-show="sub.prop == subTabsValue.prop"
                  :prop="sub.prop"
                  :tableId="sub.tableId"
                  :optionData="subTableObj[sub.tableId]"
                  :type="type"
                  :disabled="disabled"
                  @execute-custom-btn-enhance="executeCustomBtnEnhance"
                ></SubTable>
              </template>
              <template v-if="sub.subType == 'one'">
                <SubForm
                  :ref="(el) => (subFormRef[sub.prop] = el)"
                  v-model="tableForm[sub.prop]"
                  v-show="sub.prop == subTabsValue.prop"
                  :prop="sub.prop"
                  :tableId="sub.tableId"
                  :optionData="subTableObj[sub.tableId]"
                  :type="type"
                  :disabled="disabled"
                ></SubForm>
              </template>
            </template>
          </template>
          <template #expand="{ row }">
            <!-- 主附表内嵌 -->
            <template v-if="tableInfo.subTemplate == 'innerTable'">
              <div class="p-20px pt-0 pb-10px" v-if="tableOption.expandRowKeys.includes(row.id)">
                <avue-tabs
                  :option="innerTabsOption"
                  @change="(tab) => (innerTabsValue = tab)"
                ></avue-tabs>
                <template v-for="sub in innerTabsOption.column" :key="sub.prop">
                  <div class="w-100%" v-show="sub.prop == innerTabsValue.prop">
                    <LowTable
                      :ref="(el) => (innerTableRef[sub.prop] = el)"
                      :tableId="sub.tableId"
                      v-bind="sub.vBind"
                      :fixedSearch="{ [sub.mainProp]: row.id }"
                    ></LowTable>
                  </div>
                </template>
              </div>
            </template>
            <!-- 可展开表格 -->
            <template v-if="tableInfo.singleStyle == 'expand'">
              <div class="expand-table-box px-20px py-10px">
                <el-row>
                  <el-form-item
                    v-for="prop in expandProp"
                    :key="prop"
                    :label="tableOption.column[prop].label + '：'"
                  >
                    {{ row[`$${prop}`] || row[prop] }}
                  </el-form-item>
                </el-row>
              </div>
            </template>
          </template>
        </avue-crud>
        <!-- 主附表ERP -->
        <div v-if="erpTabsOption.column?.length">
          <avue-tabs :option="erpTabsOption" @change="(tab) => (subTabsValue = tab)"></avue-tabs>
          <template v-for="sub in erpTabsOption.column" :key="sub.prop">
            <div class="w-100%" v-show="sub.prop == subTabsValue.prop">
              <LowTable
                :ref="(el) => (erpTableRef[sub.prop] = el)"
                :tableId="sub.tableId"
                v-bind="sub.vBind"
              ></LowTable>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="h-200px" v-loading="!isInit"></div>
    </div>
  </div>
  <!-- 代码编辑器 -->
  <DesignPopup
    v-if="popShowObj.mEditor"
    v-model="MEDialog.value"
    v-bind="MEDialog.params"
    :isBodyFull="true"
  >
    <template #default>
      <MonacoEditor v-model="MEData.value" v-bind="MEData.params"></MonacoEditor>
    </template>
  </DesignPopup>
  <!-- 导入 -->
  <DesignPopup
    v-if="popShowObj.import"
    v-model="importDialog"
    title="数据导入"
    width="80%"
    :dialog-params="{ alignCenter: true }"
    :handleClose="importRef?.handleClose"
  >
    <template #default="{ isFull }">
      <ImportData
        ref="importRef"
        :importId="tableId"
        :columns="tableOption.column"
        :tableDescribe="tableInfo.tableDescribe"
        :show="importDialog"
        :isFull="isFull"
        @close-popup="importDialog = false"
        @reset-change="resetData"
      ></ImportData>
    </template>
  </DesignPopup>
  <!-- 自定义表单 -->
  <DesignPopup
    v-if="popShowObj.form"
    v-model="customForm.open"
    :controlType="tableOption.dialogType || 'dialog'"
    :title="tableOption[`${customForm.formType}Title`] || customForm.title"
    :width="tableOption.dialogWidth || '60%'"
    :footer-btn="customForm.footerBtn"
  >
    <LowForm
      v-if="customForm.open"
      ref="customFormRef"
      :formType="customForm.formType"
      :formOption="customForm.formOption"
      :defaultData="customForm.defaultData"
      :formId="tableInfo.formId"
      handleType="returnData"
      :beforeClose="customFormClose"
    ></LowForm>
  </DesignPopup>
  <!-- 增强注册的控件 -->
  <template v-for="item in rendControlData" :key="item.key">
    <component
      :ref="(el) => (componentRef[item.key] = el)"
      :is="componentObj[item.random]"
      v-bind="item.params || {}"
      v-model="item.show"
    ></component>
  </template>
</template>
<script lang="ts" setup>
import * as TableApi from '@/api/design/table'
import { getDicTableConfig } from '@/api/design/dic'
import { getFormDetail } from '@/api/design/form'
import useMEDialog from '@/hooks/design/useMEDialog'
import useCopyText from '@/hooks/design/useCopyText'
import { useWindowSize } from '@vueuse/core'
import {
  initTableOption,
  tableFormatting,
  saveFormFormatting,
  setFormLazyCacheData,
  findOptionField,
  JsEnhanceObj,
  getMultipleProp,
  summaryTopFormatting
} from '../utils/tableUtil'
import { addScssStyle, delScssStyle, setDeepObject, getDicValue, validatenull } from '../utils/util'
import defaultUseObj from '../utils/defaultUseUtil'
import { registerComp } from '../utils/registerComponent'
import download from '@/utils/download'
import { formattingStrFunction } from '@/utils/lowDesign'
import { cloneDeep } from 'lodash-es'
import { listToTree, treeMap, findNode } from '@/utils/tree'
import useAvueUpload from '@/hooks/design/useAvueUpload'
import Avue from '@smallwei/avue'
import controlPath from '../controlPath'
import * as Vue from 'vue'
import { useAppStore } from '@/store/modules/app'
defineOptions({ name: 'LowTable' })

interface Props {
  tableId: string
  isPermi?: boolean
  model?: 'default' | 'erpTable' | 'innerTable' | 'dicTable' //default 默认模式 erpTable主附表ERP innerTable主附表内嵌  dicTable字典模式
  calcHeight?: number
  fixedSearch?: object //固定表格搜索值（每次查询都会带上）
  enhanceData?: object //传递给表格js增强内部调用配置
  webConfig?: object //表格配置 erpTable使用
  dicConfigStr?: string //dicTable模式 特定值
  dicShowList?: string[] //dicTable模式 显示列
  dicSelectType?: 'multiple' | 'radio' //dicTable模式 选择类型
  dicMaxLimit?: number //dicTable模式 最大选择个数
  dicRowKey?: string //dicTable模式 行数据的 Key
}

const props = withDefaults(defineProps<Props>(), {
  model: 'default',
  fixedSearch: () => {
    return {}
  }
})

const { MEDialog, MEData, openMEDialog } = useMEDialog()
const { uploadBefore, uploadExceed, uploadSized, uploadPreview } = useAvueUpload()
const { copyText } = useCopyText()
const windowSize = useWindowSize()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute()
const routes = useRouter()
const appStore = useAppStore()

const loading = ref(false) // 列表的加载中
const isInit = ref(false)
const timerObj = ref<any>({})

const tableOption = ref<any>({})
const tableForm = ref({})
const tableData = ref<any>([])
const tableSearch = ref({})
const tablePage = ref<any>({ currentPage: 1, pageSize: 10, total: 0 })
const tableSelect = ref<any>([])
const tableSort = ref({ column: '', order: '' })
const tableSummary = ref({ bottomMap: {}, topList: [] })
const summaryTop = ref({ show: false, height: 0 })
const radioValue = ref('')
const controlObj = ref<any>({})
const componentObj = ref({})
const buttonObj = ref<any>({})
const tableInfo = ref<any>({})
const tableCurrRow = ref<any>({})
const tableCurrType = ref('')

const tableTreeLoad = ref({})
const treeAroundOption = ref<any>({})
const treeAroundData = ref([])
const treeAroundRow = ref<any>({})
const treeRef = ref()

const jsEnhanceObj = ref<JsEnhanceObj>({})
let useImport = reactive({})

const subTableObj = ref({})
const subTabsValue = ref<any>({})
const subFormRef = ref({})
const subTableRef = ref({})
const subTabsRef = ref()

const erpTabsOption = ref<any>({})
const menuLeftShow = ref(true)
const erpTableRef = ref({})

const innerTabsOption = ref<any>({})
const innerTabsValue = ref<any>({})
const innerTableRef = ref({})

const importDialog = ref(false)
const importRef = ref()

const customForm = ref<any>({})
const customFormRef = ref()

const rendControlData = ref<any>({})

const inlineSearch = ref<string[]>([])
const expandProp = ref<string[]>([])

const crudRef = ref()
const componentRef = ref({})
const summaryTopRef = ref()

const isShowFixedBar = computed(() => {
  if (
    isInit.value &&
    props.model == 'default' &&
    tableInfo.value.rollBottom &&
    (route.path.indexOf('/table/view') != -1 || route.path.indexOf('low/table/test') != -1)
  ) {
    return true
  }
  return false
})
const selectIds = computed(() => {
  return tableSelect.value.map((item) => item['id'])
})
const crudBind = computed(() => {
  const obj = {}
  if (tableInfo.value.isPage) obj['page'] = tablePage.value
  return obj
})
const isDicTable = computed(() => {
  return props.model == 'dicTable'
})
const isLazyTree = computed(() => {
  let bool = false
  if (tableInfo.value.tableType == 'treeTable' && tableOption.value.lazy) bool = true
  if (tableInfo.value.tableType == 'treeAround' && treeAroundOption.value.lazy) bool = true
  return bool
})
const isSearchData = computed(() => {
  let bool = false
  for (let key in tableSearch.value) {
    if (tableSearch.value[key] !== '') {
      bool = true
      break
    }
  }
  return bool
})

const tabsColumn = computed(() => {
  if (Object.keys(subTableObj.value).length === 0 || tableInfo.value.subTemplate == 'erp')
    return false
  return tableOption.value.column.lowCustomSubTable.tabsOption.column
})

const slotData = computed(() => {
  const slotObj = { search: [] as any[], list: [] as any[], form: [] as any[] }
  for (let key in controlObj.value) {
    controlObj.value[key].forEach((item) => {
      const { slotList } = item
      if (!slotList.length) return
      const obj: any = { controlType: key }
      if (key == 'monacoEditor') {
        obj.click = (scope) =>
          openMEDialog(Object.assign(scope.column, { disabled: scope.disabled }), tableForm.value)
      }
      if (key == 'customControl') obj.getComponent = (key) => componentObj.value[key]
      slotList.forEach((type) => {
        if (slotObj[type]) slotObj[type].push({ ...item, ...obj })
      })
    })
  }
  return slotObj
})

const popShowObj = computed(() => {
  const obj = { mEditor: false, import: false, form: false }
  if (controlObj.value.monacoEditor?.length) obj.mEditor = true
  if (buttonObj.value.header?.importBtn && tableOption.value.column) obj.import = true
  if (tableInfo.value.formId) obj.form = true

  return obj
})

const fixed_bar_left = computed(() => {
  const layout = appStore.getLayout
  const collapse = appStore.getCollapse
  if (layout == 'classic' || layout == 'topLeft') {
    return collapse ? '84px' : '220px'
  }
  if (layout == 'top') return '20px'
  if (layout == 'cutMenu') return '100px'
  return '220px'
})

const initTable = async () => {
  isInit.value = false
  loading.value = true
  let data = {}
  if (props.model == 'default') {
    data = await TableApi.getWebConfig(props.tableId)
  } else if (props.model == 'erpTable' || props.model == 'innerTable') {
    data = cloneDeep(props.webConfig) || {}
  } else if (isDicTable.value) {
    data = await getDicTableConfig(props.tableId, props.dicConfigStr)
  }
  const optionData = initTableOption(data, {
    tableId: props.tableId,
    calcHeight: props.calcHeight,
    model: props.model,
    dicSelectType: props.dicSelectType,
    dicShowList: props.dicShowList || [],
    isPermi: props.isPermi,
    useFun
  })
  if (isDicTable.value && props.dicRowKey) optionData.tableOption.rowKey = props.dicRowKey
  if (
    ['treeTable', 'treeAround'].includes(optionData.tableInfo.tableType) &&
    optionData.tableOption.column.pid
  ) {
    optionData.tableOption.column.pid = {
      ...optionData.tableOption.column.pid,
      dicFormatter: (data) => {
        const treeAroundData = listToTree(data.records)
        if (tableCurrType.value == 'edit') {
          const disabledArr = [tableCurrRow.value.id]
          treeMap(treeAroundData, {
            children: 'children',
            conversion: (item) => {
              if (item.id == disabledArr[0]) item.disabled = true
              if (disabledArr.includes(item.pid)) {
                item.disabled = true
                disabledArr.push(item.id)
              }
              return item
            }
          })
        }
        return treeAroundData
      }
    }
  }
  if (optionData.tableInfo.tableType == 'treeAround') {
    treeAroundOption.value = optionData.treeAroundOption
    if (treeAroundOption.value.lazy) {
      optionData.tableInfo.isGetData = false
      treeAroundOption.value.treeLoad = treeAroundLoad
    }
  }
  tableOption.value = {
    ...optionData.tableOption,
    selectable: (row, index) => {
      if (props.model == 'dicTable') {
        //字典表格选择器 最大选择个数禁用配置
        const { dicSelectType, dicMaxLimit } = props
        if (dicSelectType == 'multiple' && dicMaxLimit) {
          const leng = tableSelect.value.length
          if (leng >= dicMaxLimit && !selectIds.value.includes(row.id)) return false
        }
      }
      try {
        if (jsEnhanceObj.value.selectable) return jsEnhanceObj.value.selectable(row, index)
      } catch (error) {
        enhanceErrorTip('js增强【selectable】方法执行异常，请检查', error)
      }
      return true
    }
  }
  if (tableOption.value.gridSpan) {
    const pageSizes = [10, 20, 30, 40, 50, 100]
    const linkMin = [4, 8, 12, 16, 20, 40]
    const linkNum = 24 / tableOption.value.gridSpan
    tablePage.value.pageSizes = pageSizes.map((size, index) => {
      const surplus = size % linkNum
      size = size - surplus
      const link = size / linkNum
      if (link < linkMin[index]) {
        size = size + (linkMin[index] - link) * linkNum
      }
      return size
    })
    tablePage.value.pageSize = tablePage.value.pageSizes[0]
  }
  componentObj.value = optionData.componentData
  controlObj.value = optionData.control
  buttonObj.value = optionData.buttonObj
  if (!optionData.tableInfo.isPage && isDicTable.value) optionData.tableInfo.isPage = true
  tableInfo.value = optionData.tableInfo
  if (optionData.tableInfo.formId) initCustomForm()
  initRule(optionData.ruleObj, tableOption.value.column)
  jsEnhanceObj.value =
    executeJsEnhance(
      optionData.jsEnhanceStr,
      '表单开发：js增强初始化异常，请检查增强内容' + props.tableId
    ) || {}
  //初始化其他模块导入
  try {
    if (jsEnhanceObj.value.initImport) useImport = await jsEnhanceObj.value.initImport()
  } catch (error) {
    enhanceErrorTip('js增强【initImport】方法执行异常，请检查', error)
  }
  try {
    if (jsEnhanceObj.value.initOption) jsEnhanceObj.value.initOption()
  } catch (error) {
    enhanceErrorTip('js增强【initOption】方法执行异常，请检查', error)
  }
  if (optionData.scssEnhanceStr) addScssStyle(optionData.scssEnhanceStr, props.tableId, 'table')
  const headerShowObj = buttonObj.value.handleShowObj.header
  if (Object.keys(headerShowObj).length) {
    for (const key in headerShowObj) {
      buttonObj.value.header[key].display = executeStrFunction(
        headerShowObj[key].funStr,
        undefined,
        `自定义按钮（表格头部） ${headerShowObj[key].label} 显隐增强执行异常`
      )
    }
  }
  initInlineSearch()
  initExpandTable()
  isInit.value = true
  if (optionData.tableInfo.isGetData || isDicTable.value) {
    getTableData(true, { type: 'init', isGetSummary: true })
  }
  initTableLayout()
  if (optionData.tableInfo.subTable?.length) {
    optionData.tableInfo.subTable.forEach(
      (id, index) => (subTableObj.value[id] = { tableId: id, index })
    )
    subTableInit()
  }
}
const initRule = (ruleObj, column, isSub?) => {
  for (const prop in ruleObj) {
    ruleObj[prop].forEach(({ index, rule, ruleStr, type }) => {
      const ruleData = cloneDeep(rule)
      if (type == 'only') {
        if (isSub) return //附表-表格校验唯一由附表处理
        ruleData['validator'] = async (rule, value, callback) => {
          if (value !== undefined && value !== null && value !== '') {
            const data = await TableApi.verifyDataOnly(props.tableId, {
              fieldCode: prop,
              fieldVal: value,
              dataId: tableForm.value['id'] || ''
            })
            if (data) return callback(new Error('当前值已存在，请修改'))
          }
          callback()
        }
      } else if (type == 'customRule') {
        const obj = executeStrFunction(`()=>{${ruleStr}}`)
        if (obj instanceof Object) for (const k in obj) ruleData[k] = obj[k]
      }
      column[prop].rules.splice(index, 0, ruleData)
    })
  }
}
const subTableInit = () => {
  const subTemplate = tableInfo.value.subTemplate
  const promiseArr: Promise<any>[] = []
  for (const tableId in subTableObj.value) {
    promiseArr.push(
      (async () => {
        const data = await TableApi.getWebConfig(tableId)
        return { ...data, tableId, index: subTableObj.value[tableId].index }
      })()
    )
  }
  Promise.all(promiseArr).then((resList) => {
    resList = resList.sort((a, b) => a.index - b.index)

    let templateType = 'normal'
    if (subTemplate == 'erp') templateType = 'erp'

    if (templateType == 'normal') {
      tableOption.value.column.lowCustomSubTable.tabsOption.column = []
      innerTabsOption.value.column = []
    } else if (templateType == 'erp') erpTabsOption.value.column = []

    const setColumn = (data, type) => {
      const { tableDescribe, subTableTitle, tableName, subTableMapping } = data.dbForm
      let mainProp = ''
      for (const index in data.fieldList) {
        const item = data.fieldList[index]
        if (item.foreignkeyEntity?.mainTable == tableInfo.value.tableName) {
          mainProp = item.fieldCode
          break
        }
      }
      const columnItem: any = {
        label: subTableTitle || tableDescribe,
        prop: tableName,
        subType: subTableMapping,
        tableId: data.tableId,
        vBind: {
          isPermi: props.isPermi,
          model: type,
          webConfig: { ...data }
        }
      }
      if (type == 'erpTable') {
        columnItem.vBind.fixedSearch = { [mainProp]: '-1' }
        columnItem.vBind.webConfig.mainProp = mainProp
      } else if (type == 'innerTable') {
        columnItem.mainProp = mainProp
      }
      return columnItem
    }
    resList.forEach((data, index) => {
      if (templateType == 'normal') {
        if (subTemplate == 'innerTable') {
          const copyData = cloneDeep(data)
          innerTabsOption.value.column.push(setColumn(copyData, 'innerTable'))
        }
        const optionData = initTableOption(data, {
          tableId: data.tableId,
          calcHeight: false,
          isSub: true
        })
        const type = optionData.tableInfo.subType
        const column = tableOption.value.column.lowCustomSubTable.tabsOption.column
        column.push({
          label: optionData.tableInfo.subTitle,
          prop: optionData.tableInfo.tableName,
          subType: type,
          tableId: data.tableId
        })
        initRule(optionData.ruleObj, optionData.tableOption.column, true)
        subTableObj.value[data.tableId] = { ...subTableObj.value[data.tableId], ...optionData }
        if (index == 0) subTabsValue.value = column[0]
      } else if (templateType == 'erp') {
        erpTabsOption.value.column.push(setColumn(data, 'erpTable'))
        if (index == 0) subTabsValue.value = erpTabsOption.value.column[0]
      }
    })
  })
}

const verifySubTable = (loading) => {
  return new Promise(async (resolve) => {
    if (!tableInfo.value.subTable?.length) return resolve(true)
    const tabsColumn = tableOption.value.column.lowCustomSubTable?.tabsOption.column
    const promiseArr: any[] = []
    tabsColumn?.forEach((tab) => {
      if (tab.subType === 'many' && subTableRef.value[tab.prop]) {
        promiseArr.push(subTableRef.value[tab.prop].verifyForm())
      } else if (tab.subType === 'one') {
        promiseArr.push(subFormRef.value[tab.prop].verifyForm())
      }
    })
    let isVerify = true
    if (promiseArr.length) {
      const ruleList = await Promise.all(promiseArr)
      for (const ruleItem of ruleList) {
        if (!ruleItem.valid) {
          subTabsRef.value.active = tabsColumn.findIndex((tab) => tab.prop == ruleItem.tabProp) + ''
          isVerify = false
          break
        }
      }
    }
    if (!isVerify) loading()
    resolve(isVerify)
  })
}

const initTableLayout = () => {
  if (tableOption.value.height != 'auto' && tableOption.value.height !== undefined) return

  if (tableInfo.value.isHeight || props.calcHeight) {
    const winH = windowSize.height.value
    const calcH = props.calcHeight
    const sumTopH = summaryTop.value.height
    const { subTemplate, mainProp } = tableInfo.value
    let calcHeight = calcH || 160
    if (calcH) tableOption.value.height = 'auto'
    if (subTemplate == 'erp' || mainProp) {
      //窗口 - 顶部 - 导航 - padding
      const h = (winH - 50 - 35 - 40) / 2
      calcHeight = calcHeight + h - 120
      if (mainProp) calcHeight = calcHeight - 60
    }
    if (sumTopH) calcHeight = calcHeight - sumTopH
    tableOption.value.calcHeight = calcHeight
  }

  if (timerObj.value.layout) clearTimeout(timerObj.value.layout)
  timerObj.value.layout = setTimeout(() => {
    if (crudRef.value) crudRef.value.getTableHeight()
  }, 100)
}

const initInlineSearch = () => {
  if (tableInfo.value.searchStyle != 'inline') return false
  const headerColumn: string[] = []
  for (const prop in tableOption.value.column) {
    const column = tableOption.value.column[prop]
    if (column.search === false) column.inlineSearch = false
    else if (column.search === true) column.inlineSearch = true
    delete column.search
    if (column.inlineSearch) headerColumn.push(prop)
  }
  inlineSearch.value = headerColumn
}
const initExpandTable = () => {
  if (tableInfo.value.singleStyle != 'expand') return false
  const expandColumn: string[] = []
  let showNum = 0
  for (const prop in tableOption.value.column) {
    const column = tableOption.value.column[prop]
    if (!column.hide && prop != 'lowSelectRadio' && column.expandShow === undefined) {
      showNum++
      if (showNum > tableInfo.value.expandShowNum) column.expandShow = true
    }
    if (column.expandShow) {
      column.hide = true
      expandColumn.push(prop)
    }
  }
  expandProp.value = expandColumn
}

const initCustomForm = () => {
  customForm.value.open = false
  getFormDetail({ desFormId: tableInfo.value.formId }).then((data) => {
    const formOption = JSON.parse(data.desformJson)
    formOption.submitBtn = false
    formOption.emptyBtn = false
    formOption.isSubmitTable = false
    customForm.value.formOption = formOption
  })
}
const openCustomForm = (type, row?) => {
  const titleObj = { add: '新 增', edit: '编 辑', view: '查 看' }
  let footerBtn: any = []
  tableForm.value = row ? cloneDeep(row) : {}
  if (type != 'view') {
    footerBtn = [
      {
        params: { type: 'primary' },
        name: type == 'add' ? '保 存' : '编 辑',
        loading: true,
        icon: 'gala:add',
        clickFun: (loading) => {
          customFormRef.value.handleSubmit(true, loading)
        }
      },
      {
        params: {},
        name: '取 消',
        icon: 'simple-line-icons:close',
        clickFun: () => {
          customForm.value.open = false
        }
      }
    ]
  }

  beforeOpen(() => {
    customForm.value = {
      formOption: customForm.value.formOption,
      open: true,
      title: titleObj[type],
      formType: type,
      defaultData: cloneDeep(tableForm.value),
      footerBtn
    }
  }, type)
}
const customFormClose = (handleType, form, loading) => {
  if (handleType == 'submit') {
    const type = customForm.value.formType
    const done = () => {
      loading()
      customForm.value.open = false
    }
    if (type == 'add') rowSave(form, done, loading)
    else if (type == 'edit') rowUpdate(form, tableCurrRow.value.$index, done, loading)
  } else {
    customForm.value.open = false
  }
}

const executeCustomBtnEnhance = (type, row?) => {
  try {
    if (jsEnhanceObj.value[type]) {
      if (row) jsEnhanceObj.value[type](row)
      else jsEnhanceObj.value[type]()
    }
  } catch (error) {
    enhanceErrorTip(`js增强【${type}】方法执行异常，请检查`, error)
  }
}

const menuLeftHandle = (type) => {
  if (type == 'addBtn') {
    if (tableInfo.value.formId) openCustomForm('add')
    else crudRef.value.rowAdd()
  } else if (type == 'batchDelBtn') rowDel(selectIds.value)
  else if (type == 'exportBtn') exportTableData()
  else if (type == 'importBtn') importDialog.value = true
  else executeCustomBtnEnhance(type)
}
const menuHandle = ({ type, row, index }) => {
  if (type == 'viewBtn') {
    if (tableInfo.value.formId) openCustomForm('view', row)
    else crudRef.value.rowView(row, index)
  } else if (type == 'editBtn') {
    if (tableInfo.value.formId) openCustomForm('edit', row)
    else crudRef.value.rowEdit(row, index)
  } else if (type == 'delBtn') rowDel(row)
  else if (type == 'addChild') {
    tableForm.value['pid'] = row.id
    if (tableInfo.value.formId) openCustomForm('add')
    else crudRef.value.rowAdd()
  } else executeCustomBtnEnhance(type, row)
}

const radioClick = (row, index) => {
  const bool = tableOption.value.selectable(row, index)
  if (!bool) return
  if (row[tableOption.value.rowKey || 'id'] == radioValue.value) {
    setTimeout(() => {
      radioValue.value = ''
      tableSelect.value = []
    }, 30)
  } else {
    tableSelect.value = [row]
  }

  //主附表ERP
  const { subTable, subTemplate } = tableInfo.value
  if (subTemplate == 'erp' && subTable?.length) {
    timerObj.value.erpSearch = setInterval(() => {
      if (erpTabsOption.value.column?.length) {
        clearInterval(timerObj.value.erpSearch)
        erpTabsOption.value.column = erpTabsOption.value.column.map((item) => {
          const prop = item.vBind.webConfig.mainProp
          item.vBind.fixedSearch = { [prop]: radioValue.value || '-1' }
          return item
        })
        setTimeout(() => {
          for (const key in erpTableRef.value) erpTableRef.value[key]?.resetChange()
        }, 30)
      }
    }, 50)
  }
}
const selectionChange = (data) => {
  tableSelect.value = data
}
const selectAll = () => {
  const { model, dicMaxLimit } = props
  if (model == 'dicTable' && dicMaxLimit && tableSelect.value.length > dicMaxLimit) {
    const clearSelect = tableSelect.value.filter((item, index) => dicMaxLimit <= index)
    crudRef.value.toggleSelection(clearSelect)
  }
}
const initSelectChange = () => {
  const dataObj = {}
  const rows: Array<{ id: string }> = []
  const rowKey = tableOption.value.rowKey || 'id'
  tableData.value.forEach((item: any) => (dataObj[item[rowKey]] = item))
  tableSelect.value.forEach((item) => {
    if (item.initSelect && dataObj[item[rowKey]]) rows.push(dataObj[item[rowKey]])
    else rows.push(item)
  })
  if (!tableOption.value.column['lowSelectRadio']) {
    crudRef.value.clearSelection()
    crudRef.value.toggleSelection(rows, true)
  } else {
    tableSelect.value = rows
    radioValue.value = rows[0]?.[rowKey] || ''
  }
}
const clearSelection = () => {
  crudRef.value.clearSelection()
  tableSelect.value = []
  radioValue.value = ''
}

const sortChange = ({ order, prop }) => {
  const sortKey = { ascending: 'asc', descending: 'desc' }
  tableSort.value = { order: sortKey[order], column: prop }
  if (tablePage.value) tablePage.value['currentPage'] = 1
  getTableData()
}
const getSearchData = (type, currRow?) => {
  return new Promise(async (resolve) => {
    let searchObj = {}
    for (let key in tableSearch.value) {
      if (tableSearch.value[key] instanceof Array) searchObj[key] = tableSearch.value[key].join(',')
      else searchObj[key] = tableSearch.value[key]
    }
    //分页
    if (tableInfo.value.isPage) {
      searchObj['pageNo'] = tablePage.value['currentPage']
      searchObj['pageSize'] = tablePage.value['pageSize']
    }
    //排序
    if (tableSort.value.order) searchObj = { ...searchObj, ...tableSort.value }
    //表格字典
    if (isDicTable.value && props.dicConfigStr) {
      searchObj['jeeLowCode_dictTableField'] = props.dicConfigStr
    }
    searchObj = {
      ...searchObj,
      ...props.fixedSearch,
      ...getMultipleProp(tableOption.value.column)
    }
    if (type == 'init') {
      //初始化时获取控件默认搜索值
      for (const key in tableOption.value.column) {
        const item = tableOption.value.column[key]
        if (item.searchValue) searchObj[item.prop] = item.searchValue
      }
    }
    for (let key in searchObj)
      if (searchObj[key] === '' || searchObj[key] == null) delete searchObj[key]
    if (type != 'search') {
      //树表懒加载
      if (tableInfo.value.tableType == 'treeTable' && tableOption.value.lazy) {
        searchObj['pid'] = currRow ? currRow.id : 0
      }
      //左树右表
      if (tableInfo.value.tableType == 'treeAround') {
        if (type != 'init') searchObj['pid'] = treeAroundRow.value.id || 0
        if (type == 'init' && treeAroundOption.value.lazy) searchObj['pid'] = 0
      }
    }
    try {
      if (jsEnhanceObj.value.beforeSearch)
        searchObj = await jsEnhanceObj.value.beforeSearch(searchObj)
    } catch (error) {
      enhanceErrorTip('js增强【beforeSearch】方法执行异常，请检查', error)
    }
    resolve(searchObj)
  })
}
const tableDataFormatting = (data) => {
  return new Promise(async (resolve) => {
    const isMenuBtnShow = Object.keys(buttonObj.value.handleShowObj.menu).length ? true : false
    data = tableFormatting(data, tableOption.value.column, {
      menuShowObj: isMenuBtnShow ? buttonObj.value.handleShowObj.menu : false,
      executeStrFunction
    })
    try {
      if (jsEnhanceObj.value.beforeData) data = await jsEnhanceObj.value.beforeData(data)
    } catch (error) {
      enhanceErrorTip('js增强【beforeData】方法执行异常，请检查', error)
    }
    resolve(data)
  })
}
const getTableData = async (isLoading = true, config: any = {}) => {
  if (timerObj.value.getTableData) clearTimeout(timerObj.value.getTableData)
  await new Promise((resolve) => {
    timerObj.value.getTableData = setTimeout(() => resolve(true), 100)
  })
  const { currRow, type, isGetSummary } = config
  return new Promise(async (resolve) => {
    if (isLoading) loading.value = true
    const searchObj = await getSearchData(type, currRow)
    try {
      if (isGetSummary) {
        setTimeout(() => getSummaryData(searchObj), 0)
      }
      const data = await TableApi.getTableList(props.tableId, searchObj, tableInfo.value.isOpen)
      if (tablePage.value) tablePage.value['total'] = data.total
      data.records = await tableDataFormatting(data.records)

      if (
        type == 'init' &&
        tableInfo.value.singleStyle == 'expand' &&
        tableOption.value.defaultExpandAll
      ) {
        const rowKey = tableOption.value.rowKey || 'id'
        if (tableInfo.value.expandMode == 'accordion') {
          const id = data.records[0]?.[rowKey]
          if (id) tableOption.value.expandRowKeys = [id]
        } else {
          tableOption.value.expandRowKeys = data.records?.map((item) => item[rowKey])
        }
      }
      let isSetData = true
      //树表
      if (tableInfo.value.tableType == 'treeTable') {
        if (tableOption.value.lazy) {
          if (currRow) isSetData = false
        } else data.records = listToTree(data.records)
      }
      //左树右表
      if (tableInfo.value.tableType == 'treeAround' && type == 'init') {
        if (!treeAroundOption.value.lazy) {
          treeAroundData.value = listToTree(data.records)
          tableData.value = cloneDeep(treeAroundData.value).map((item) => {
            delete item['children']
            return item
          })
          isSetData = false
        }
      }
      if (isSetData) tableData.value = data.records
      resolve(data.records)
    } finally {
      if (isLoading) loading.value = false
      resolve([])
    }
  })
}
const getSummaryData = async (searchObj) => {
  let bool = false
  if (Object.keys(tableInfo.value.summaryBottom).length) bool = true
  if (tableInfo.value.isSummaryTop) bool = true
  if (!bool) return
  const data = await TableApi.getTableDataSummary(props.tableId, searchObj)
  if (!data.topList) data.topList = []
  data.topList = summaryTopFormatting(data.topList)
  if (data.topList.length) summaryTop.value.show = true
  try {
    if (jsEnhanceObj.value.summaryTopFormatting)
      data.topList = jsEnhanceObj.value.summaryTopFormatting(data.topList)
  } catch (error) {
    enhanceErrorTip('js增强【summaryTopFormatting】方法执行异常，请检查', error)
  }
  tableSummary.value = data
}
const onSummaryTopResize = (data) => {
  summaryTop.value.height = data.height + 20
}

const treeLoad = (row, treeNode, resolve) => {
  return new Promise(async (treeResolve) => {
    tableTreeLoad.value[row.id] = { row, treeNode, resolve }

    const data = await getTableData(false, { currRow: row })
    const { lazyTreeNodeMap } = crudRef.value.$refs.table.store.states

    if (lazyTreeNodeMap.value[row.id]) {
      if (lazyTreeNodeMap.value[row.id].length <= 1 && data instanceof Array && data.length === 0) {
        lazyTreeNodeMap.value[row.id] = []
        setTimeout(() => {
          delete tableTreeLoad.value[row.id]
        }, 300)
      }
    }
    resolve(data)
    treeResolve(data)
  })
}
const partUpdateLazyData = (currRow, type?) => {
  return new Promise(async (resolve) => {
    if (currRow.pid) {
      if (tableTreeLoad.value[currRow.pid]) {
        const { row, treeNode, resolve } = tableTreeLoad.value[currRow.pid]
        let data: any = {}
        if (tableOption.value.lazy) data = await treeLoad(row, treeNode, resolve)
        else if (treeAroundOption.value.lazy) data = await treeAroundLoad(treeNode, resolve)
        if (data instanceof Array && data.length == 0) await partUpdateLazyData(row)
      } else {
        if (
          ['add', 'update'].includes(type) ||
          (type == 'edit' && currRow.pid != tableCurrRow.value.pid)
        ) {
          let parentRow: any = {}
          if (tableOption.value.lazy) {
            parentRow = findNode(tableData.value, (node) => node.id == currRow.pid)
          } else if (treeAroundOption.value.lazy) {
            parentRow = findNode(treeAroundData.value, (node) => node.id == currRow.pid)
          }
          if (parentRow?.id) await partUpdateLazyData(parentRow)
        }
      }
    } else {
      if (tableOption.value.lazy) await getTableData(false)
      else if (treeAroundOption.value.lazy)
        await treeAroundLoad(tableTreeLoad.value[0].treeNode, tableTreeLoad.value[0].resolve)
    }
    if (type == 'edit') {
      if (currRow.pid != tableCurrRow.value.pid) {
        await partUpdateLazyData(tableCurrRow.value, 'update')
      }
    }
    if (['view', 'add', 'edit'].includes(type) && treeAroundOption.value.lazy) {
      treeAroundNodeClick(treeAroundRow.value)
    }
    resolve(true)
  })
}
const treeAroundNodeClick = (data) => {
  treeAroundRow.value = data
  for (let prop in tableSearch.value) tableSearch.value[prop] = ''
  if (tablePage.value) tablePage.value['currentPage'] = 1
  getTableData(true, { type: 'reset' })
}
const treeAroundLoad = async (node, resolve) => {
  const paramsData = { pid: 0 }
  tableTreeLoad.value[`${node.data.id ? node.data.id : 0}`] = {
    row: node.data,
    treeNode: node,
    resolve
  }
  if (node.level !== 0) paramsData.pid = node.data.id
  const resData = await TableApi.getTableList(props.tableId, paramsData, tableInfo.value.isOpen)
  let data = resData.records
  if (data instanceof Array) {
    data = data.map((item) => {
      item.leaf = !item.hasChildren
      delete item.hasChildren
      return item
    })
  }
  if (node.level === 0) {
    getTableData(true, { type: 'init' })
  }
  resolve(data)
}

const resetData = () => {
  try {
    crudRef.value?.searchReset()
  } catch (error) {
    resetChange()
  }
}

const searchChange = (params, done) => {
  if (tablePage.value) tablePage.value['currentPage'] = 1
  if (tableInfo.value.tableType == 'treeAround') {
    treeRef.value.setCurrentKey(null)
    treeAroundRow.value = {}
  }
  getTableData(true, { type: 'search', isGetSummary: true }).finally(() => {
    done()
  })
}
const resetChange = () => {
  return new Promise(async (resolve) => {
    tableSearch.value = {}
    if (tableInfo.value.tableType == 'treeAround') {
      treeRef.value.setCurrentKey(null)
      treeAroundRow.value = {}
    }
    if (tablePage.value) tablePage.value['currentPage'] = 1
    await getTableData(true, { type: 'reset', isGetSummary: true })
    resolve(true)
  })
}
const sizeChange = (pageSize) => {
  if (tablePage.value) tablePage.value['pageSize'] = pageSize
  resetData()
}
const currentChange = (currentPage) => {
  if (tablePage.value) tablePage.value['currentPage'] = currentPage
  getTableData()
}
const refreshChange = () => {
  getTableData(true, { isGetSummary: true })
}

const subDataFormatting = (data, type) => {
  if (tabsColumn.value) {
    tabsColumn.value.forEach((item) => {
      if (!data[item.prop]) data[item.prop] = []
      if (item.subType == 'one') {
        if (data[item.prop].length) data[item.prop] = data[item.prop][0]
        else data[item.prop] = {}
      }
      data[item.prop] = tableFormatting(
        data[item.prop],
        subTableObj.value[item.tableId].tableOption.column,
        { isCell: item.subType == 'many' && ['add', 'edit'].includes(type) }
      )
    })
  }
  return data
}

const beforeOpen = async (done, type) => {
  let formData = { ...tableForm.value }
  loading.value = true
  if (tabsColumn.value) subTabsValue.value = tabsColumn.value[0]
  if (type == 'add') {
    //默认值处理
    for (const key in tableOption.value.column) {
      const { addValue, display } = tableOption.value.column[key]
      if (addValue !== undefined && display === false) formData[key] = addValue
    }
    // 附表处理
    if (tabsColumn.value) {
      tabsColumn.value.forEach((item) => {
        if (!formData[item.prop]) {
          formData[item.prop] = item.subType == 'many' ? [] : {}
        } else {
          const isArray = formData[item.prop] instanceof Array
          const isObject = formData[item.prop] instanceof Object
          const isMany = item.subType == 'many'
          if (isMany && !isArray) formData[item.prop] = []
          if (!isMany && (isArray || !isObject)) formData[item.prop] = {}
        }
      })
    }
    // 左树右表处理
    if (tableInfo.value.tableType == 'treeAround' && !formData['pid'] && treeAroundRow.value.id) {
      formData['pid'] = treeAroundRow.value.id
    }
    // 主附表ERP 一对一
    if (props.model == 'erpTable' && tableInfo.value.subType == 'one') {
      if (tableData.value.length > 0) {
        loading.value = false
        return message.info('只允许新增一条数据')
      }
    }
    //设置附表默认值
    subDataFormatting(formData, type)
  }

  if (['edit', 'view'].includes(type) && tableForm.value['id']) {
    let detailData = await TableApi.getTableDetail(
      props.tableId,
      tableForm.value['id'],
      tableInfo.value.isOpen
    )
    if (detailData.jeelowcode_subtable_data) {
      detailData = { ...detailData, ...detailData.jeelowcode_subtable_data }
      delete detailData.jeelowcode_subtable_data
    }
    // 附表处理
    subDataFormatting(detailData, type)
    // 左树右表处理
    if (['treeTable', 'treeAround'].includes(tableInfo.value.tableType) && detailData.pid === 0) {
      detailData.pid = ''
    }
    formData = tableFormatting(detailData, tableOption.value.column)
  }
  try {
    if (jsEnhanceObj.value.beforeFormData)
      formData = await jsEnhanceObj.value.beforeFormData(formData, type)
  } catch (error) {
    enhanceErrorTip('js增强【beforeFormData】方法执行异常，请检查', error)
  }
  //懒加载处理
  setFormLazyCacheData(tableOption.value.column, controlObj.value, formData).then((lazyData) => {
    for (const key in lazyData) {
      lazyData[key].props.forEach(
        (prop) => (tableOption.value.column[prop].cacheData = lazyData[key].data)
      )
    }
  })

  tableCurrRow.value = cloneDeep(formData)
  tableCurrType.value = type
  if (tableInfo.value.tableType == 'treeTable') crudRef.value.updateDic('pid')
  tableForm.value = formData
  loading.value = false
  done()

  //回显新增字典默认值文本
  if (type == 'add') {
    setTimeout(() => {
      tableFormatting(cloneDeep(tableForm.value), tableOption.value.column)
    }, 30)
  }
}

const saveFormatting = (form) => {
  let formData = cloneDeep(form)
  if (['treeTable', 'treeAround'].includes(tableInfo.value.tableType) && !formData.pid) {
    formData.pid = 0
  }
  if (tableInfo.value.formId) return formData
  formData = saveFormFormatting(formData, tableOption.value.column)
  if (tabsColumn.value) {
    const refObj = { ...(subTableRef.value || {}), ...(subFormRef.value || {}) }
    for (let prop in refObj) {
      const { tableId } = refObj[prop]
      if (formData[prop]) {
        const { subType } = subTableObj.value[tableId].tableInfo
        formData[prop] = saveFormFormatting(
          formData[prop],
          refObj[prop][subType == 'one' ? 'formOption' : 'tableOption'].column
        )
        if (subType == 'one') formData[prop] = [formData[prop]]
      } else formData[prop] = []
    }
  }
  return formData
}
const executeBeforeRequest = (type, apiData) => {
  let data = cloneDeep(apiData)
  return new Promise(async (resolve) => {
    try {
      if (jsEnhanceObj.value.beforeRequest) {
        data = await jsEnhanceObj.value.beforeRequest(type, data).catch(() => false)
        resolve(data)
      } else resolve(apiData)
    } catch (error) {
      resolve(apiData)
      enhanceErrorTip('js增强【beforeRequest】方法执行异常，请检查', error)
    }
  })
}
const executeAfterRequest = (type, formData) => {
  let data = cloneDeep(formData)
  return new Promise(async (resolve) => {
    try {
      if (jsEnhanceObj.value.afterRequest) {
        await jsEnhanceObj.value.afterRequest(type, data).catch(() => false)
      }
      resolve(true)
    } catch (error) {
      resolve(true)
      enhanceErrorTip('js增强【afterRequest】方法执行异常，请检查', error)
    }
  })
}
const rowSave = async (form, done, loading) => {
  const subVerify = await verifySubTable(loading)
  if (!subVerify) return
  const formData = saveFormatting(form)
  const { mainProp } = tableInfo.value
  if (mainProp) {
    const mainId = props.fixedSearch[mainProp]
    formData[mainProp] = mainId != '-1' ? mainId : ''
  }
  const apiData = await executeBeforeRequest('add', formData)
  if (!apiData) return loading()
  let bool = await TableApi.saveTableData(props.tableId, apiData, tableInfo.value.isOpen).catch(
    () => false
  )
  if (bool !== false) {
    await executeAfterRequest('add', { ...apiData, id: bool })
    if (isLazyTree.value && !isSearchData.value) {
      await partUpdateLazyData(formData, 'add')
    } else resetData()
    message.success(t('common.createSuccess'))
    done()
  } else loading()
}
const rowUpdate = async (form, index, done, loading) => {
  const subVerify = await verifySubTable(loading)
  if (!subVerify) return
  const formData = saveFormatting(form)
  if (isLazyTree.value && formData.pid === '') formData.pid = 0
  const apiData = await executeBeforeRequest('edit', formData)
  if (!apiData) return loading()
  const bool = await TableApi.updateTableData(props.tableId, apiData).catch(() => false)
  if (bool !== false) {
    await executeAfterRequest('edit', apiData)
    if (isLazyTree.value) {
      if (isSearchData.value) resetData()
      else await partUpdateLazyData(formData, 'edit')
    } else await getTableData(true, { isGetSummary: true })
    message.success(t('common.updateSuccess'))
    done()
    // 主附表内嵌
    if (
      tableInfo.value.subTemplate == 'innerTable' &&
      tableOption.value.expandRowKeys.includes(formData.id)
    ) {
      for (let key in innerTableRef.value) innerTableRef.value[key]?.resetChange()
    }
  } else loading()
}
const rowDel = async (data) => {
  try {
    await message.delConfirm()
    loading.value = true
    const isArr = data instanceof Array
    const ids = isArr ? data : [data.id]
    const apiData = await executeBeforeRequest('del', ids)
    if (!apiData) return (loading.value = false)
    const bool = await TableApi.deleteTableData(props.tableId, apiData).catch(() => false)
    if (bool) {
      await executeAfterRequest('del', isArr ? tableSelect.value : [data])
      if (isLazyTree.value) {
        if (isSearchData.value) resetData()
        else {
          if (data instanceof Array) {
            const selectObj = {}
            tableSelect.value.forEach((item) => (selectObj[item.pid] = item))
            for (const key in selectObj) await partUpdateLazyData(selectObj[key], 'del')
          } else await partUpdateLazyData(data, 'del')
        }
      } else await getTableData(true, { isGetSummary: true })
      clearSelection()
      message.success(t('common.delSuccess'))
    }
    loading.value = false
  } catch {}
}
const expandChanges = (row, expendList) => {
  //内嵌表格处理
  if (tableInfo.value.tableType == 'default' && tableInfo.value.subTemplate == 'innerTable') {
    innerTabsValue.value = innerTabsOption.value.column[0]
    tableOption.value.expandRowKeys = []
    if (expendList.length && row) tableOption.value.expandRowKeys.push(row.id)
  }
  //可展开表格
  if (tableInfo.value.singleStyle == 'expand') {
    //字典/文本格式化处理
    crudRef.value.columnOption.forEach((column) => {
      let result: any = null
      const isDic = !validatenull(column.dicData)
      if (column.expandShow && isDic) {
        try {
          result = getDicValue(column.dicData, row[column.prop])
        } catch (error) {}
      }
      if (typeof column.formatter === 'function') {
        result = column.formatter(row, row[column.prop], result, column)
      } else if (Array.isArray(result) && isDic) {
        result = result.join(column.separator || ' | ')
      }
      if (result !== null) row[`$${column.prop}`] = result
    })
    //手风琴控制
    if (tableInfo.value.expandMode == 'accordion') {
      tableOption.value.expandRowKeys = []
      if (expendList.length && row) tableOption.value.expandRowKeys.push(row.id)
    }
  }
}

const exportTableData = async () => {
  const exportBtn = buttonObj.value.header.exportBtn
  const isSelect = tableSelect.value.length
  await message.confirm(`是否确定导出${isSelect ? '当前勾选的' : '所有'}数据？`)
  exportBtn.params.loading = true
  if (isSelect) {
    const columnObj = cloneDeep(tableOption.value.column)
    const column: object[] = []
    for (let key in columnObj) {
      const { hide, isExport } = columnObj[key]
      if (!hide && isExport) column.push(columnObj[key])
    }
    let exportData = cloneDeep(tableSelect.value)
    exportData = exportData.map((item) => {
      for (let key in item) {
        if (key != '$index' && key.indexOf('$') === 0 && item[key]) {
          const prop = key.split('$')[1]
          item[prop] = item[key]
        }
      }
      return item
    })
    Avue.$Export.excel({ title: tableInfo.value.tableDescribe, columns: column, data: exportData })
    exportBtn.params.loading = false
  } else {
    const searchObj = await getSearchData('search')
    TableApi.exportExcelData(props.tableId, searchObj)
      .then((data) => download.excel(data, tableInfo.value.tableDescribe))
      .finally(() => (exportBtn.params.loading = false))
  }
}

const getComponentRandom = (path) => {
  let random = componentObj.value['pathOnly'][path]
  if (!random) {
    random = `key_${Math.ceil(Math.random() * 9999999)}`
    componentObj.value['pathOnly'][path] = random
    componentObj.value[random] = registerComp(path)
  }
  return random
}
const initEnhanceUseFun = () => {
  return {
    /**
     * 获取控件配置
     * @param prop 数据绑定key
     * @param isDeep 是否深拷贝
     * @param configKey 配置key
     */
    getPropConfig: (prop: string, configKey?: string, isDeep?: boolean) => {
      let config: any = findOptionField(tableOption.value, prop)
      if (configKey) return config ? config[configKey] : config
      return isDeep ? cloneDeep(config) : config
    },
    /**
     * 设置控件配置
     * @param prop 数据绑定key
     * @param config 需修改的配置，非覆盖，格式Object,支持深结构修改 例：'params.deep.deep'
     */
    setPropConfig: (prop, config) => {
      const curConfig = useFun.getPropConfig(prop)
      if (!curConfig) enhanceErrorTip(`调用useFun.setPropConfig方法，未找到字段：${prop}`, '')
      else setDeepObject(curConfig, config)
    },
    /**
     * 初始化控件
     * @param type 控件类型
     * @param refKey 控件ref名称
     * @param params 控件配置参数
     */
    controlInit: (type, refKey, params) => {
      const path = controlPath[type]?.path || ''
      if (path) {
        const random = getComponentRandom(path)
        rendControlData.value[refKey] = { show: false, key: refKey, random, params }
      }
    },
    //格式化当前表单数据并查询回显文本
    initDicText: () => {
      tableForm.value = tableFormatting(tableForm.value, tableOption.value.column)
    },
    refreshChange, //刷新当前页表格数据
    resetChange: resetData, //清空搜索重新获取数据
    getSearchData: () => getSearchData('search'), //获取搜索参数
    clearSelection, //清空表格选择
    getVue: () => Vue,
    copyText, //复制到剪切板
    ...defaultUseObj
  }
}
const executeJsEnhance = (enhance: string, errTip?: string) => {
  if (!enhance) return
  enhance = formattingStrFunction(enhance)
  try {
    const fun = eval(`(function getEnhance(){
      ${enhance}
    })`)
    return fun()
  } catch (error) {
    enhanceErrorTip(errTip, error)
  }
}
const executeStrFunction = (str: string, params?: Array<any>, errTip?: string) => {
  try {
    const fun = eval(`(function getFun(){return ${str}})()`)
    if (params) return fun.apply(null, params)
    else return fun()
  } catch (error) {
    enhanceErrorTip(errTip, error)
  }
}
const enhanceErrorTip = (tip, error) => {
  console.warn(`${tip}
    ${error}`)
}

const tableDefaultFun = {
  cellStyle: (data) => {
    try {
      if (jsEnhanceObj.value.cellStyle) return jsEnhanceObj.value.cellStyle(data)
    } catch (error) {
      enhanceErrorTip('js增强【cellStyle】方法执行异常，请检查', error)
    }
  },
  rowStyle: (data) => {
    try {
      if (jsEnhanceObj.value.rowStyle) return jsEnhanceObj.value.rowStyle(data)
    } catch (error) {
      enhanceErrorTip('js增强【rowStyle】方法执行异常，请检查', error)
    }
  },
  rowClick: (row, column, event) => {
    try {
      if (jsEnhanceObj.value.rowClick) jsEnhanceObj.value.rowClick(row, column, event)
    } catch (error) {
      enhanceErrorTip('js增强【rowClick】方法执行异常，请检查', error)
    }
  },
  rowDblclick: (row, column) => {
    try {
      if (jsEnhanceObj.value.rowDblclick) jsEnhanceObj.value.rowDblclick(row, column)
    } catch (error) {
      enhanceErrorTip('js增强【rowDblclick】方法执行异常，请检查', error)
    }
  },
  cellClick: (row, column, cell, event) => {
    try {
      if (jsEnhanceObj.value.cellClick) jsEnhanceObj.value.cellClick(row, column, cell, event)
    } catch (error) {
      enhanceErrorTip('js增强【cellClick】方法执行异常，请检查', error)
    }
  },
  cellDblclick: (row, column, cell, event) => {
    try {
      if (jsEnhanceObj.value.cellDblclick) jsEnhanceObj.value.cellDblclick(row, column, cell, event)
    } catch (error) {
      enhanceErrorTip('js增强【cellDblclick】方法执行异常，请检查', error)
    }
  },
  summaryMethod: ({ columns, data }) => {
    let sums: (string | VNode)[] = []
    if (Object.keys(tableInfo.value.summaryBottom).length) {
      columns.forEach((column, index) => {
        let prop = column.property
        const isSummary = tableInfo.value.summaryBottom[prop]
        const summaryData = tableSummary.value.bottomMap?.[prop]
        if (isSummary && summaryData) {
          const label = Object.keys(summaryData)[0] || ''
          sums[index] = h('div', { class: 'flex flex-wrap gap-x-10px' }, [
            h('div', [
              h('span', label + '：'),
              h(
                'span',
                isNaN(Number(summaryData[label])) ? summaryData[label] : Number(summaryData[label])
              )
            ])
          ])
        } else sums[index] = '-'
      })
    }
    try {
      if (jsEnhanceObj.value.summaryBottomFormatting)
        sums = jsEnhanceObj.value.summaryBottomFormatting(
          sums,
          columns,
          data,
          cloneDeep(tableSummary.value?.bottomMap || {})
        )
    } catch (error) {
      enhanceErrorTip('js增强【summaryBottomFormatting】方法执行异常，请检查', error)
    }
    return sums
  }
}

const useFun = reactive(initEnhanceUseFun())

watch(
  () => props.tableId,
  (value: string) => {
    if (value) initTable()
  },
  { immediate: true }
)

watch(
  () => props.fixedSearch,
  (obj) => {
    if (tableInfo.value.mainProp) {
      menuLeftShow.value = obj[tableInfo.value.mainProp] == '-1' ? false : true
    }
  },
  { immediate: true, deep: true }
)

watch(
  [() => windowSize.height.value, () => props.calcHeight, () => summaryTop.value.height],
  () => {
    initTableLayout()
  },
  { immediate: true }
)
watch(
  () => subTabsValue.value.prop,
  () => {
    erpTableRef.value[subTabsValue.value.prop]?.initTableLayout()
  }
)
watch(
  () => windowSize.width.value,
  () => {
    if (summaryTop.value.show && tableSummary.value.topList.length) {
      if (summaryTopRef.value?.echartObj) {
        for (let key in summaryTopRef.value.echartObj) {
          summaryTopRef.value.echartObj[key].resize()
        }
      }
    }
  }
)

const beforeUnload = (event) => {
  if (importRef.value && importRef.value.isPlay) {
    importRef.value.stopImport()
    return (event.returnValue = '已暂停导入，是否继续刷新页面？')
  }
}

onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload)
})

onUnmounted(() => {
  delScssStyle(props.tableId, 'table')
  for (let key in timerObj.value) {
    clearInterval(timerObj.value[key])
    clearTimeout(timerObj.value[key])
  }
})

defineExpose({
  crudRef,
  tableInfo,
  tableOption,
  tableData,
  tablePage,
  tableSelect,
  selectIds,
  tableSummary,
  loading,
  useFun,
  initTableLayout,
  clearSelection,
  resetChange: resetData,
  initSelectChange
})
</script>

<style lang="scss" scoped>
.low-table {
  .low-table-content {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: center;

    .table-content {
      max-width: calc(100% - 210px);
    }

    &.show_fixed_bar
      > div
      > ::v-deep(.avue-crud)
      > .avue-crud__body
      > .el-card__body
      > .el-form
      > div
      > .el-table__inner-wrapper
      > .el-table__body-wrapper {
      .el-scrollbar__bar.is-horizontal {
        position: fixed;
        bottom: 0;
        left: v-bind(fixed_bar_left);
        display: block !important;
        height: 15px;
      }
    }
  }

  .left-tree-box {
    height: auto;
    overflow: auto;

    ::v-deep(.avue-tree) {
      width: 200px;
      padding-right: 10px;
      border-right: 1px solid #f1f1f1;
      box-sizing: border-box;

      .avue-tree__content {
        height: calc(100% - 48px);
      }

      .el-tree-node__label {
        &.active {
          color: var(--el-color-primary);
        }
      }
    }
  }

  ::v-deep(.expand-table-box) {
    .el-form-item {
      display: flex;
      font-size: 12px;

      .el-form-item__label {
        position: initial;
        padding-right: 0;
        font-size: 12px;
      }

      .el-form-item__content {
        line-height: 32px;
      }
    }
  }

  &.summary {
    ::v-deep(.avue-crud) {
      .avue-crud__body {
        .el-table__body-wrapper {
          .el-table__body {
            position: relative;

            tbody::before {
              position: absolute;
              bottom: 0;
              left: 0;
              z-index: 99;
              width: 100%;
              height: 1px;
              background-color: var(--el-table-border-color);
              content: '';
            }
          }
        }

        .el-table__footer-wrapper {
          &::after {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 1px;
            background-color: var(--el-table-border-color);
            content: '';
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.low-table__dialog {
  .avue-form {
    &.avue--detail {
      .low-sub-tabs__row {
        & > .el-form-item > .el-form-item__content {
          padding: 0;
          border: 0;
        }

        .avue-tabs {
          .el-tabs__header {
            margin-bottom: 0;
            background-color: #fafafa;
          }

          .el-tabs__nav-wrap::after {
            height: 0;
          }
        }

        .sub-table {
          & > .avue-crud {
            margin-top: 1px;
            margin-bottom: 0;

            .el-form--default {
              .el-table--border {
                &::before,
                &::after {
                  width: 0;
                }
              }

              .el-table__inner-wrapper::before {
                height: 0;
              }

              .el-table__border-left-patch {
                width: 0;
              }

              .el-table__header {
                tr {
                  .el-table__cell:nth-last-of-type(1) {
                    border-right: 0;
                  }
                }
              }

              .el-table__row {
                &:nth-last-of-type(1) {
                  td {
                    border-bottom: 0;
                  }
                }

                .el-table__cell:nth-last-of-type(1) {
                  border-right: 0;
                }
              }
            }
          }
        }

        .sub-form {
          & > .avue--detail > .el-form > .el-row {
            border-left: 0;

            & > .avue-group > .el-collapse {
              border-top: 0;

              .el-collapse-item__wrap {
                border-bottom: 0;

                .avue-form__group {
                  .avue-form__row:nth-last-of-type(2) {
                    // border-bottom: 0;
                  }
                }
              }

              .avue-form__menu {
                display: none;
              }
            }
          }

          .el-form-item.el-form-item--default {
            margin-bottom: 0 !important;
          }

          .avue-ueditor {
            border: 0;

            .avue-ueditor__toolbar {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
