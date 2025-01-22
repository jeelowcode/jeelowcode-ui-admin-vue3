const dicObj = {
  boolean: [{ label: '', value: false }, { label: '', value: true }],
  dialogType: [{ label: '弹窗', value: 'dialog' }, { label: '抽屉', value: 'drawer' }],
  controlType: [
    { label: '输入框', value: 'input' }, { label: '数字输入框', value: 'number' },
    { label: '选择框', value: 'select' }, { label: '多选框', value: 'checkbox' }, { label: '单选框', value: 'radio' },
    { label: '日期', value: 'date' }, { label: '时间', value: 'time' }, { label: '日期时间', value: 'datetime' }
    // { label: '其他类型可手动输入', value: 'other', disabled: true }
  ],
  positionType: [{ label: '左边', value: 'left' }, { label: '右边', value: 'right' }, { label: '上边', value: 'top' }],
  alignType: [{ label: '左对齐', value: 'left' }, { label: '居中对齐', value: 'center' }, { label: '右对齐', value: 'right' }],
  inputType: [{ label: '输入框', value: 'input' }, { label: '密码框', value: 'password' }, { label: '多行文本', value: 'textarea' }],


  numberPosition: [{ label: '右边', value: 'right' }, { label: '左右两边', value: 'top' }],
  dateType: [
    { label: '日期', value: 'date' }, { label: '日期范围', value: 'daterange' }, { label: '多个日期', value: 'dates' },
    { label: '日期时间', value: 'datetime' }, { label: '日期时间范围', value: 'datetimerange' },
    { label: '年份', value: 'year' }, { label: '年份范围', value: 'yearrange' }, { label: '多个年份', value: 'years' },
    { label: '月', value: 'month' }, { label: '月范围', value: 'monthrange' }, { label: '多个月份', value: 'months' },
    { label: '周', value: 'week' }
  ],
  timeType: [{ label: '时间', value: 'time' }, { label: '时间范围', value: 'timerange' }],
  fileType: [{ label: '图片', value: 'img' }, { label: '视频', value: 'video' }, { label: '音频', value: 'audio' }],
  fileAccept: [
    { label: '图片', value: 'image/*' }, { label: '音频', value: 'audio/*' }, { label: '视频', value: 'video/*' },
    { label: 'pdf', value: '.pdf' }, { label: 'word.doc', value: '.doc' }, { label: 'word.docx', value: '.docx' },
    { label: '其他类型请自行输入例如：image/png', value: 'other', disabled: true }
  ],
  imageType: [{ label: '照片墙', value: 'picture-card' }, { label: '缩略图', value: 'picture' }, { label: '单张图片', value: 'picture-img' }],
  monacoEditorLanguage: [{ label: 'JavaScript', value: 'javascript' }, { label: 'SCSS样式', value: 'scss' }, { label: 'JSON', value: 'json' }],
  userColumn: [
    { label: '用户名称（固定显示不需要选择）', value: 'nickName', disabled: true }, { label: '手机号码', value: 'mobile' },
    { label: '邮箱', value: 'email' }, { label: '性别', value: 'sex' }, { label: '岗位', value: 'post' }, { label: '部门', value: 'deptName' }
  ],
  userFindType: [{ label: '全部用户', value: 'all' }, { label: '本级用户', value: 'now' }, { label: '本级及下级用户', value: 'sub' }],
  deptFindType: [{ label: '全部部门', value: 'all' }, { label: '本级部门', value: 'now' }, { label: '本级及下级部门', value: 'sub' }],
  customControlType: [{ label: '未全局注册', value: false }, { label: '已全局注册', value: true }],
  regionType: [{ label: '全球-国家', value: 'gj' }, { label: '中国-省市区', value: 'ssq' }, { label: '中国-省市', value: 'ss' }, { label: '中国-省', value: 's' }],
  dictTextFormatter: [
    { label: '字典Code-字典Text', value: '{dicCode}-{dicText}' },
    { label: '字典Text-字典Code', value: '{dicText}-{dicCode}' },
    { label: '字典Text(字典Code)', value: '{dicText}({dicCode})' },
    { label: '字典Text[字典Code]', value: '{dicText}[{dicCode}]' },
    { label: '其他格式请自行输入', value: 'custom-tip-1', disabled: true },
    { label: '例如：code：{dicCode}，text：{dicText}', value: 'custom-tip-2', disabled: true },
    { label: '效果：code：1001，text：小明', value: 'custom-tip-3', disabled: true }
  ]
}
const tableOption = [
  {
    title: '基础配置',
    list: [
      { label: '表格标题', value: 'title' },
      { label: '操作列标题', value: 'menuTitle', val: '操作' },
      { label: '空数据时显示的文本内容', value: 'emptyText', val: '暂无数据' },
      { label: '是否显示表头', value: 'showHeader', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '是否要高亮当前行', value: 'highlightCurrentRow', val: false, type: 'switch', dic: dicObj.boolean },
    ]
  },
  {
    title: '表格弹窗配置',
    list: [
      { label: '表格弹窗方式', value: 'dialogType', val: 'dialog', type: 'radio', dic: dicObj.dialogType },
      { label: '表格弹窗宽度	', value: 'dialogWidth', val: '60%' },
      { label: '弹窗是否拖拽', value: 'dialogDrag', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '弹窗是否为全屏', value: 'dialogFullscreen', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '弹窗是否通过按下ESC关闭', value: 'dialogEscape', val: true, type: 'switch', dic: dicObj.boolean },
      { label: '弹窗是否通过点击modal关闭', value: 'dialogClickModal', val: false, type: 'switch', dic: dicObj.boolean },
    ]
  }
]

const queryConfig = [
  {
    title: '查询配置',
    list: [
      { label: '标题宽度', value: 'searchLabelWidth', type: 'number', val: 80 },
      { label: '是否可清空', value: 'searchClearable', type: 'switch', dic: dicObj.boolean },
      { label: '栅格', value: 'searchSpan', type: 'number', val: 6, params: { min: 1, max: 24 } },
      { label: '排序（越大越靠前）', value: 'searchOrder', type: 'number' },
      { label: '辅助文字', value: 'searchPlaceholder' },
      { label: '控件类型', value: 'searchType', type: 'select', dic: dicObj.controlType },
      { label: '范围搜索（仅日期、时间、数字可用）', value: 'searchRange', type: 'switch', dic: dicObj.boolean },
      { label: '多选', value: 'searchMultiple', type: 'switch', dic: dicObj.boolean },
      { label: '标题位置', value: 'searchLabelPosition', val: 'left', type: 'radio', dic: dicObj.positionType }
    ]
  }
]

const cellConfig = [
  {
    title: '表格列配置',
    list: [
      { label: '字段名称', value: 'label' },
      { label: '默认值', value: 'value' },
      { label: '一行显示，过长以 tooltip 的形式显示内容', value: 'overHidden', val: true, type: 'switch', dic: dicObj.boolean },
      { label: '冻结列', value: 'fixed', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '支持转义html', value: 'html', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '对齐方式', value: 'align', val: 'center', type: 'radio', dic: dicObj.alignType },
      { label: '表头对齐方式', value: 'headerAlign', val: 'center', type: 'radio', dic: dicObj.alignType }
    ]
  }
]

const formConfig = [
  {
    title: '表单配置',
    list: [
      { label: '禁用', value: 'disabled', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '只读', value: 'readonly', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '可清空', value: 'clearable', val: true, type: 'switch', dic: dicObj.boolean },
      { label: '占位文本', value: 'placeholder' },
      { label: '栅格', value: 'span', type: 'number', val: 12, params: { min: 1, max: 24 } },
      { label: '排序（越大越靠前）', value: 'order', type: 'number' },
      { label: '内容提示', value: 'tip' },
      { label: '标题提示', value: 'labelTip' },
    ]
  }
]

const inputConfig = [
  {
    title: '控件配置',
    list: [
      { label: '输入框类型', value: 'type', val: 'input', type: 'select', dic: dicObj.inputType },
      { label: '限制最大输入长度', value: 'maxlength', type: 'number' },
      { label: '展示字数统计', value: 'showWordLimit', type: 'switch', dic: dicObj.boolean },
      { label: '前置内容', value: 'prepend' },
      { label: '后置内容', value: 'append' },
      { label: '前缀图标', value: 'prefixIcon' },
      { label: '后缀图标', value: 'suffixIcon' },
      { label: '最小行数（多行文本）', value: 'minRows', type: 'number' },
      { label: '最大行数（多行文本）', value: 'maxRows', type: 'number' },
      { label: '行数（多行文本）', value: 'rows', type: 'number' },
      { label: '密码可切换显隐（密码框）', value: 'showPassword', type: 'switch', dic: dicObj.boolean },
    ]
  }
]


const numberConfig = [
  {
    title: '控件配置',
    list: [
      { label: '精度', value: 'precision', val: 2, type: 'number' },
      { label: '最小值', value: 'min', type: 'number' },
      { label: '最大值', value: 'max', type: 'number' },
      { label: '步长', value: 'step', val: 1, type: 'number' },
      { label: '严格步数', value: 'stepStrictly', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '显示控制按钮', value: 'controls', val: true, type: 'switch', dic: dicObj.boolean },
      { label: '控制按钮位置', value: 'controlsPosition', val: 'top', type: 'select', dic: dicObj.numberPosition },
    ]
  }
]

const selectConfig = [
  {
    title: '控件配置',
    list: [
      { label: '可搜索', value: 'filterable', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '可创建', value: 'allowCreate', val: false, type: 'switch', dic: dicObj.boolean },
      // { label: '级联子节点', value: 'cascader' },
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '最大选择数', value: 'limit', type: 'number', params: { min: 1 } },
      // { label: '分组模式', value: 'group', val: false, type: 'switch', dic: dicObj.boolean },
      // { label: '值可拖拽', value: 'drag', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '多选值折叠', value: 'collapseTags', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '鼠标悬停展示全部折叠值', value: 'collapseTagsTooltip', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '从第几个值开始折叠', value: 'maxCollapseTags', val: 3, type: 'number' },
      { label: '虚拟渲染（如果数据量大请开启）', value: 'virtualize', val: false, type: 'switch', dic: dicObj.boolean },
    ]
  }
]

const radioConfig = [
  {
    title: '控件配置',
    list: [
      { label: '显示边框', value: 'border', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '按钮样式', value: 'button', val: false, type: 'switch', dic: dicObj.boolean },
    ]
  }
]

const checkboxConfig = [
  {
    title: '控件配置',
    list: [
      { label: '显示边框', value: 'border', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '按钮样式', value: 'button', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '全选', value: 'all', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '最小勾选数', value: 'min', type: 'number' },
      { label: '最大勾选数', value: 'max', type: 'number' },
      { label: '活跃状态的字体颜色', value: 'textColor', val: '#ffffff', type: 'color' },
      { label: '活跃状态的边框和背景颜色', value: 'fill', val: '#409eff', type: 'color' },
    ]
  }
]

const switchConfig = [
  {
    title: '控件配置',
    list: [
      { label: '滑块宽度', value: 'len', val: 40, type: 'number' },
      { label: '文本/图标是否显示在控件内部', value: 'inlinePrompt', val: true, type: 'switch', dic: dicObj.boolean },
      // { label: '打开时的背景色', value: 'activeColor', val: '#409EFF', type: 'color' }, 弃用
      // { label: '关闭时的背景色', value: 'inactiveColor', val: '#C0CCDA', type: 'color' }, 弃用
      { label: '打开时的图标', value: 'activeIcon', val: 'el-icon-check' },
      { label: '关闭时的图标', value: 'inactiveIcon', val: 'el-icon-close' },
      { label: '打开时的图标组件', value: 'activeActionIcon' },
      { label: '关闭时的图标组件', value: 'inactiveActionIcon' },
    ]
  }
]

const treeConfig = [
  {
    title: '控件配置',
    list: [
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '父子不关联', value: 'checkStrictly', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '可筛选', value: 'filterable', val: false, type: 'switch', dic: dicObj.boolean },
      // { label: '筛选提示语', value: 'filterText', val: '请输入搜索关键字' },
      { label: '可选父级', value: 'parent', val: true, type: 'switch', dic: dicObj.boolean },
      { label: '子类全选是否包含父类值', value: 'leafOnly', val: true, type: 'switch', dic: dicObj.boolean },
      { label: '懒加载', value: 'lazy', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '手风琴模式', value: 'accordion', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '默认展开所有节点', value: 'defaultExpandAll', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '点击文本是否可以展开', value: 'expandOnClickNode', val: false, type: 'switch', dic: dicObj.boolean },
      // { label: '默认展开节点', value: 'defaultExpandedKeys' },
      // { label: '默认勾选节点', value: 'defaultCheckedKeys' },
      { label: '多选值折叠', value: 'collapseTags', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '鼠标悬停展示全部折叠值', value: 'collapseTagsTooltip', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '从第几个值开始折叠', value: 'maxCollapseTags', val: 3, type: 'number' },
      // { label: '懒加载节点的缓存数据', value: 'cacheData ' },
    ]
  }
]

const cascaderConfig = [
  {
    title: '控件配置',
    list: [
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '父子不关联', value: 'checkStrictly', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '显示完整路径', value: 'showAllLevels', val: true, type: 'switch', dic: dicObj.boolean, valTipShow: false, valTip: '开启懒加载时请开启当前配置，否则会出现异常情况' },
      { label: '存储完整路径', value: 'emitPath', val: true, type: 'switch', dic: dicObj.boolean, valTipShow: false, valTip: '开启懒加载时请开启当前配置，否则会出现异常情况' },
      { label: '可筛选', value: 'filterable', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '懒加载', value: 'lazy', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '多选值折叠', value: 'collapseTags', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '鼠标悬停展示全部折叠值', value: 'collapseTagsTooltip', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '从第几个值开始折叠', value: 'maxCollapseTags', val: 3, type: 'number' },
      { label: '分隔符', value: 'separator' },
    ]
  }
]

const dateConfig = [
  {
    title: '控件配置',
    list: [
      { label: '日期控件类型', value: 'type', val: 'date', type: 'select', dic: dicObj.dateType },
      { label: '显示日期格式化', value: 'format', val: 'YYYY-MM-DD HH:mm:ss' },
      { label: '存储日期格式化', value: 'valueFormat', val: 'YYYY-MM-DD HH:mm:ss' },
      { label: '范围分隔符', value: 'rangeSeparator' },
      { label: '选择器打开时默认显示的时间', value: 'defaultValue', params: { placeholder: '例如：2025-01-01' } },
    ]
  }
]

const timeConfig = [
  {
    title: '控件配置',
    list: [
      { label: '时间控件类型', value: 'type', val: 'time', type: 'select', dic: dicObj.timeType },
      { label: '显示时间格式化', value: 'format', val: 'HH:mm:ss', },
      { label: '存储时间格式化', value: 'valueFormat', val: 'HH:mm:ss' },
      { label: '范围分隔符', value: 'rangeSeparator' },
      { label: '选择器打开时默认显示的时间', value: 'defaultValue', params: { placeholder: '例如：2025-01-01 16:00:00' } },
    ]
  }

]
const fileConfig = [
  {
    title: '控件配置',
    list: [
      { label: '上传文件类型', value: 'accept', type: 'select', dic: dicObj.fileAccept, params: { multiple: true, allowCreate: true, filterable: true } },
      { label: '指定上传文件类型（图片/音频/审批）', value: 'fileType', type: 'radio', dic: dicObj.fileType },
      { label: '可拖拽', value: 'dragFile', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '限制上传大小（KB）', value: 'fileSize', type: 'number' },
      { label: '多选上传', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '最大上传数', value: 'limit', type: 'number', params: { min: 1 } },
      { label: '列表最大显示文件数量', value: 'showNum', type: 'number' },
      { label: '上传按钮文案', value: 'fileText', val: '点击上传' },
      { label: '提示文案', value: 'tip' },
      // { label: '上传等待文案', value: 'loadText' },
    ]
  }
]

const imageConfig = [
  {
    title: '控件配置',
    list: [
      { label: '上传控件类型', value: 'listType', val: 'picture-card', type: 'select', dic: dicObj.imageType },
      { label: '限制上传大小（KB）', value: 'fileSize', type: 'number' },
      { label: '多选上传', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '最大上传数', value: 'limit', type: 'number', params: { min: 1 } },
      { label: '列表最大显示图片数量', value: 'showNum', type: 'number' },
      { label: '提示文案', value: 'tip' },
      // { label: '上传等待文案', value: 'loadText' },
    ]
  }
]

const monacoEditorConfig = [
  {
    title: '控件配置',
    list: [
      { label: '语言', value: 'params.language', val: 'javascript', type: 'select', dic: dicObj.monacoEditorLanguage },
      { label: '宽度', value: 'params.width', val: '100%', },
      { label: '标题', value: 'params.title' },
      { label: '全屏', value: 'params.fullscreen', val: false, type: 'switch', dic: dicObj.boolean },
      // { label: '其他配置', value: 'params.editorOption' },
      // { label: '顶部操作按钮', value: 'params.headerBtn' },
      // { label: '底部操作按钮', value: 'params.footerBtn' },
      // { label: '关闭前执行', value: 'params.handleClose' },
    ]
  }
]

const markDownConfig = [
  {
    title: '控件配置',
    list: [
      { label: '编辑器高度', value: 'editorOption.height', val: '400px' },
      { label: '目录导航', value: 'editorOption.defaultShowToc', val: false, type: 'switch', dic: dicObj.boolean },
    ]
  }
]

const dicTableSelectConfig = [
  {
    title: '控件配置',
    list: [
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '最大选择数量', value: 'limit', type: 'number', params: { min: 1 } },
      { label: '分隔符', value: 'separator', val: ' | ' }
    ]
  }
]
const userSelectConfig = [
  {
    title: '控件配置',
    list: [
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '回显名称格式化', value: 'textFormatter', val: '', type: 'select', dic: dicObj.dictTextFormatter, params: { filterable: true, allowCreate: true } },
      { label: '最大选择数量', value: 'limit', type: 'number', params: { min: 1 } },
      { label: '查询类型', value: 'findType', val: 'all', type: 'select', dic: dicObj.userFindType },
      { label: '列显示字段', value: 'columnKey', val: ['mobile', 'sex', 'deptName'], type: 'select', dic: dicObj.userColumn, params: { multiple: true } },
      { label: '显示头像', value: 'avatar', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '分隔符', value: 'separator', val: ' | ' }
    ]
  }
]

const deptSelectConfig = [
  {
    title: '控件配置',
    list: [
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '回显名称格式化', value: 'textFormatter', val: '', type: 'select', dic: dicObj.dictTextFormatter, params: { filterable: true, allowCreate: true } },
      { label: '父子不互相关联', value: 'checkStrictly', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '查询类型', value: 'findType', val: 'all', type: 'select', dic: dicObj.deptFindType },
      { label: '每次只展开一个同级树节点', value: 'accordion', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '分隔符', value: 'separator', val: ' | ' },
    ]
  }
]

const regionSelectConfig = [
  {
    title: '控件配置',
    list: [
      { label: '区域类型', value: 'regionType', val: 'ssq', type: 'select', dic: dicObj.regionType },
      { label: '多选', value: 'multiple', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '多选值折叠', value: 'collapseTags', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '鼠标悬停展示全部折叠值', value: 'collapseTagsTooltip', val: false, type: 'switch', dic: dicObj.boolean },
      { label: '从第几个值开始折叠', value: 'maxCollapseTags', val: 3, type: 'number' },
      { label: '分隔符', value: 'separator' },
    ]
  }
]

// const ueditorConfig=[]

const customControlConfig = [
  {
    title: '控件配置',
    list: [
      { label: '控件状态', value: 'isGlobal', type: 'radio', val: false, dic: dicObj.customControlType },
      { label: '控件名称', value: 'controlName', params: { placeholder: '例：ElInput' } },
      { label: '控件所在文件相对的路径', value: 'controlUrl', params: { prepend: 'src/', placeholder: "例：components/....,如控件已全局注册则不需要填写" } },
    ]
  }
]

export default {
  dicObj,
  tableOption, queryConfig, cellConfig, formConfig,
  inputConfig, numberConfig,
  selectConfig, radioConfig, checkboxConfig, switchConfig, treeConfig, cascaderConfig,
  dateConfig, timeConfig,
  fileConfig, imageConfig,
  monacoEditorConfig, markDownConfig, dicTableSelectConfig, userSelectConfig, deptSelectConfig, regionSelectConfig, customControlConfig
}