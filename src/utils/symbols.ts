
import { DictTypeVO } from '@/api/system/dict/dict.type'
import { exampleType } from '@/components/LowDesign/src/utils/example'

interface ParentData {
  type: string
  prop: string
  tabsIndex: number | null
}

export interface lowFormDesignType {
  formOption: Ref<any>
  parentData: Ref<ParentData>
  dictOptions: Ref<DictTypeVO[]>
  tableDbOptions: Ref<object>
  tableSubDb: Ref<object>,
  tableSubDbOptions: Ref<object>
  example: exampleType
  setParentData: (type: string, prop: string, tabsIndex?: number | null) => void
  historyCommit: () => void
}
export interface LowFormType {
  controlObj: Ref<object>
  rulesObj: Ref<object>
  useFun: object
  getComponent: () => object
  enhanceErrorTip: (tip: string, error) => any
  handleMonacoEditorClick: (params: object, fun: Function) => any
}
export const lowFormDesignKey = Symbol('lowFormDesign')
export const lowFormKey = Symbol('lowFormKey')