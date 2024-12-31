export interface BtnList {
  name: string
  params?: Record<string, any>
  prop?: string
  display?: boolean
  loading?: boolean
  icon?: string
  clickFun: (loading: Function) => void
}
export interface designPopup {
  title?: string
  width?: string | number
  controlType?: 'dialog' | 'drawer'
  fullscreen?: boolean
  showFull?: boolean
  isBodyFull?: boolean
  isFooter?: boolean
  isHeader?: boolean
  headerBtn?: BtnList[]
  footerBtn?: BtnList[]
  handleClose?: (done: () => void) => void
  dialogParams?: object
}