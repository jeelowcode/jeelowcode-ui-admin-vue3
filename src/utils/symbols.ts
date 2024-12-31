
import { DictTypeVO } from '@/api/system/dict/dict.type'
import { exampleType } from '@/components/LowDesign/src/utils/example'

interface ParentData {
  type: string
  prop: string
}

export interface lowFormDesignType {
  formOption: any
  parentData: ParentData
  dictOptions: DictTypeVO[]
  tableDbOptions: object
  tableSubDb: object,
  tableSubDbOptions: object
  example: exampleType
  setParentData: (type: string, prop: string) => void
  historyCommit: () => void
}
export interface LowFormType {
  controlObj: object
  rulesObj: object
  useFun: object
  getComponent: () => object
  enhanceErrorTip: (tip: string, error) => any
  handleMonacoEditorClick: (params: object, fun: Function) => any
}
export const lowFormDesignKey = Symbol('lowFormDesign')
export const lowFormKey = Symbol('lowFormKey')