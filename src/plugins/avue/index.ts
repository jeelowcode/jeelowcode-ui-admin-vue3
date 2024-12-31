import type { App } from 'vue'
import Avue from '@smallwei/avue';
import { service } from '@/config/axios/service'

import '@smallwei/avue/lib/index.css';
import '@/styles/avueTable.scss'
import '@/styles/avueForm.scss'

export const setupAvue = async (app: App<Element>) => {
  app.use(Avue, {
    axios: service,
    crudOption: {
      align: 'center',
      headerAlign: 'center',
      border: true,
      gridBtn: false,
      height: 'auto',
      calcHeight: 130,
      searchSpan: 6,
      searchMenuSpan: 6,
      searchMenuPosition: 'left',
      searchIndex: 3,
      searchIcon: true,
      labelSuffix: ' ',
      dialogEscape: false,
      dialogWidth: '80%',
    },
    formOption: {
      labelSuffix: ' ',
      labelWidth: 120,
    },
  })
}