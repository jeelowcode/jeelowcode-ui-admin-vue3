import type { App } from 'vue'
import Sortable from 'sortablejs';
import AvueUeditor from 'avue-plugin-ueditor'

window['Sortable'] = Sortable

export const setupLowDesagn = async (app: App<Element>) => {
  app.use(AvueUeditor)
}
