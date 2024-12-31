
const defaultDicData = [
  { label: '字典1', value: 'dic_1' }, { label: '字典2', value: 'dic_2' }
]

export default [
  {
    typeName: '布局控件',
    control: [
      {
        type: 'layoutGroup', controlType: 'layout', label: '分组布局', icon: 'material-symbols:ad-group-outline', controlTip: '该布局只能放置在最底部',
        arrow: true, collapse: true,
        column: []
      },
      {
        type: 'layoutTabs', controlType: 'layout', title: '选项卡布局', label: '', icon: 'gravity-ui:layout-tabs',

        params: { type: '', tabPosition: 'top' }, tabsEnhanceStr: '',
        column: [
          { type: 'tab', label: '选项卡1', prop: 'tab_1', display: true, column: [], id: new Date().getTime() + Math.ceil(Math.random() * 999999) },
          { type: 'tab', label: '选项卡2', prop: 'tab_2', display: true, column: [], id: new Date().getTime() + Math.ceil(Math.random() * 999999) },
          { type: 'tab', label: '选项卡3', prop: 'tab_3', display: true, column: [], id: new Date().getTime() + Math.ceil(Math.random() * 999999) },
        ],
      },
      {
        type: 'layoutTable', controlType: 'layout', label: '表格布局', icon: 'fluent:table-32-regular',
        dataType: 'array', tableType: 'cellEdit',
        btnData: { menu: [], header: [] }, tableEnhanceStr: '',
        params: { headerAlign: 'center', align: 'center', addBtn: true, delBtn: true, editBtn: true, selection: true, border: true, menuWidth: 120 },
        column: []
      }
    ],
  },
  {
    typeName: '输入控件',
    control: [
      {
        type: 'input', controlType: 'input', label: '文本输入框', icon: 'iconoir:input-field',
        readonly: false, clearable: true,
      },
      {
        type: 'textarea', controlType: 'input', label: '多行文本框', icon: 'bi:textarea-resize',
        readonly: false, minRows: 3, maxRows: 5,
      },
      {
        type: 'number', controlType: 'input', label: '数字输入框', icon: 'octicon:number-16',
        readonly: false, controls: true, controlsPosition: '', textPosition: 'left',
      },
      {
        type: 'password', controlType: 'input', label: '密码输入框', icon: 'fluent:password-16-regular',
        readonly: false, clearable: true, showPassword: true,
      },
      {
        type: 'array', controlType: 'array', label: '数组输入框', icon: 'ic:round-data-array',
      }
    ]
  },
  {
    typeName: '选择控件',
    control: [
      {
        type: 'select', controlType: 'select', label: '下拉选择框', icon: 'material-symbols-light:arrow-selector-tool-rounded',
        clearable: true, collapseTags: true, maxCollapseTags: 1,
        dicType: 'static', staticDicData: defaultDicData
      },
      {
        type: 'tree', controlType: 'select', label: '树形选择框', icon: 'fluent-mdl2:bulleted-tree-list',
        clearable: true, parent: true, maxCollapseTags: 1,
        dicType: 'static', staticDicData: defaultDicData
      },
      {
        type: 'cascader', controlType: 'select', label: '级联选择框', icon: 'tdesign:tree-round-dot-vertical',
        clearable: true, showAllLevels: true, emitPath: true, maxCollapseTags: 1,
        dicType: 'static', staticDicData: defaultDicData
      },
      {
        type: 'radio', controlType: 'select', label: '单选框', icon: 'formkit:radio',
        dicType: 'static', staticDicData: defaultDicData
      },
      {
        type: 'checkbox', controlType: 'select', label: '多选框', icon: 'mingcute:checkbox-line',
        dicType: 'static', staticDicData: defaultDicData
      },
      {
        type: 'switch', controlType: 'select', label: '开关', icon: 'ion:switch-outline', value: '0',
        dicData: [{ lable: '', value: '0' }, { lable: '', value: '1' }],
      },

      {
        type: 'userSelect', controlType: 'select', label: '用户选择框', icon: 'basil:user-plus-outline',
        findType: 'all', columnKey: ['mobile', 'sex', 'deptName'],
      },
      {
        type: 'deptSelect', controlType: 'select', label: '部门选择框', icon: 'mingcute:department-line',
        findType: 'all',
      },
      {
        type: 'regionSelect', controlType: 'select', label: '地区选择框', icon: 'hugeicons:global-editing',
        regionType: 'ssq',
      },
      // {
      //   type: 'table', controlType: 'select', label: '表格选择器', icon: 'pajamas:marquee-selection',
      //   clearable: true,
      // },
      {
        type: 'dicTableSelect', controlType: 'select', label: '表格选择框', icon: 'ci:table-add',
        separator: ' | '
      },
      {
        type: 'map', controlType: 'select', label: '坐标选择器', icon: 'mdi:select-marker',
        clearable: true,
      },
      {
        type: 'color', controlType: 'select', label: '颜色选择器', icon: 'mdi:select-color',
        clearable: true, showAlpha: false, colorFormat: 'hex', predefine: []
      }
    ]
  },
  {
    typeName: '日期、时间控件',
    control: [
      {
        type: 'date', controlType: 'date', label: '日期', icon: 'uiw:date',
        clearable: true, format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD'
      },
      {
        type: 'time', controlType: 'time', label: '时间', icon: 'mingcute:time-line',
        clearable: true, format: 'HH:mm:ss', valueFormat: 'HH:mm:ss'
      },
    ]
  },
  {
    typeName: '上传控件',
    control: [
      {
        type: 'image', controlType: 'upload', label: '图片', icon: 'ph:image-bold',
        listType: 'picture-card', accept: 'image/*'
      },
      {
        type: 'file', controlType: 'upload', label: '文件', icon: 'bx:file',
        showFileList: true,
      },
    ]
  },
  {
    typeName: '高级控件',
    control: [
      {
        type: 'comboBox', controlType: '', label: '组合框', icon: 'ant-design:merge-cells-outlined',
        column: []
      },
      {
        type: 'buttonList', controlType: '', label: '按钮组', icon: 'mdi:button-cursor',
        params: { buttonList: [], location: 'left' }
      },
      {
        type: 'monacoEditor', controlType: 'noDefaule', label: '代码编辑器', icon: 'mingcute:code-line',
        params: { headerBtn: [], footerBtn: [], language: 'javascript' },
      },
      {
        type: 'ueditor', controlType: 'noDefaule', label: '富文本', icon: 'f7:doc-richtext',
      },
      {
        type: 'markDown', controlType: 'noDefaule', label: 'MarkDown', icon: 'tabler:markdown'
      },
      {
        type: 'customControl', controlType: 'noDefaule', label: '自定义控件', icon: 'ic:twotone-dashboard-customize',
        isGlobal: false,
      },
    ]
  },
  {
    typeName: '其他控件',
    control: [
      {
        type: 'title', controlType: 'title', label: '文本', icon: 'icon-park-outline:text',
        value: '文本'
      },
      {
        type: 'rate', controlType: 'rate', label: '评价', icon: 'ic:outline-star-rate',
        texts: [], colors: []
      },
      {
        type: 'slider', controlType: 'slider', label: '滑块', icon: 'radix-icons:slider',
        max: 10, min: 0
      }
    ]
  }
]