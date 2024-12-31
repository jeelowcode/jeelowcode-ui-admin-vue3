export default function () {
  interface MEDialog {
    value: boolean
    title?: string
    params?: object
    otherParams?: object
    handleClose?: any
  }
  interface MEData {
    value: string
    language?: string
    editorOption?: object
    params?: object
    setFormValue?: (value: string) => void
  }

  const MEDialog = ref<MEDialog>({ value: false })
  const MEData = ref<MEData>({ value: '' })
  const openMEDialog = (column, tableForm) => {
    const { prop, label, params } = column
    const dialogParams = {}
    const meParams = {}
    let otherParams = {}
    if (typeof params == 'object') {
      for (const key in params) {
        if (['title', 'width', 'fullscreen', 'headerBtn', 'footerBtn', 'dialogParams'].includes(key)) dialogParams[key] = params[key]
        else if (['language', 'editorOption', 'providerType', 'oldValue'].includes(key)) meParams[key] = params[key]
        if (key == 'otherParams') otherParams = params[key]
      }
    }
    dialogParams['handleClose'] = (done) => {
      if (MEData.value.setFormValue) MEData.value.setFormValue(MEData.value.value)
      if (params && params.handleClose) params.handleClose(done)
      else done()
    }
    MEDialog.value = {
      value: true,
      params: {
        destroyOnClose:true,
        title: label,
        ...dialogParams,
      },
      otherParams: Object.keys(otherParams).length ? otherParams : false
    }
    MEData.value = {
      value: prop ? tableForm[prop] : tableForm || '',
      params: meParams,
      setFormValue: (value: string) => {
        if (tableForm && prop) tableForm[prop] = value
      },
    }
  }

  return {
    MEDialog, MEData, openMEDialog
  }
}
