export interface exampleType {
  // 表单设计
  formJsEnhanceExample: string
  remoteExample: string
  buttonExample: string
  tabsEnhanceExample: string
  tableEnhanceExample: string
  tableConfigExample: string
  tableOptionExample: string
  uplaodExample: string
  wangEditorExample: string
  monacoEditorExample: string
  monacoButtonExample: string
  mapExample: string
  titleStyleExample: string
  MarkDownExample: string
  // 表单开发
  TableJsEnhanceExample: string
  customButtonExample: string
  scssEnhanceExample: Function

  //java增强
  JavaDataExample: string

  //控件使用示例
  controlInitExample: Function
}

//表单设计 js增强配置默认值
export const formJsEnhanceExample = `return {
  
}
`
/* 通用配置模板 */
// 远端数据配置模板
export const remoteExample = `return {
  dicUrl: '/jeelowcode/dbform-data/list/表单开发id', //请求接口
  dicMethod: 'post', //请求类型
  dicHeaders: {},
  props: { //字典text 字典value对应的字段名
    label: 'label',
    value: 'value',
  },
  dicQuery: { //请求参数
    state: '1'
  },
  dicFormatter: (res) => { //请求数据格式化
    console.log('===远端数据===', res)
    return res.records
  }
}
`
// 按钮其他配置模板
export const buttonExample = `return {
  //其他配置请参考element-plus button配置
  type:'primary',
  //当前按钮的点击事件
  handleClick: (obj) => {
    if (obj.loading) obj.loading() //关闭loading方法
  }
}
`
/* 组件配置模板 */
//选项卡布局 增强配置模板
export const tabsEnhanceExample = `return {
  //选项卡配置初始化
  initTabs() {

  },
  //切换标签前触发，调用reject会阻止切换
  beforeLeave(tabName, oldTabName) {
    return new Promise((resolve, reject) => {

      resolve()
    })
  },
  //切换标签触发
  tabChange(tabName) {
    
  }
}
`
//表格布局 增强配置模板
export const tableEnhanceExample = `return {
  //表格配置初始化
  initTable() {
   
  },
  //表格数据格式化
  setTableData(data, { type, index, id }) {

    return data
  }
}
`
//表格选择器 表格、字段配置模板
export const tableConfigExample = `return {
  align: 'center',
  headerAlign: 'center',
  searchMenuSpan: 6,
  searchMenuPosition: 'left',
  border: true,
  column: [
    {
      label: '表格字段1',
      prop: 'table_1',
    },
    {
      label: '表格字段2',
      prop: 'table_2',
      search: true
    }
  ]
}
`
//表格选择器 表格请求、回显、存储配置模板
export const tableOptionExample = `return {
  formatter: (row) => {
    if (!Object.keys(row).length) return ''
    if (Array.isArray(row)) {
      return row.map(ele => ele.table_1 + '格式化').join(',')
    } else {
      return row.table_1 + '格式化'
    }
  },
  props: {
    disabled: 'disabled',
    label: 'table_1',
    value: 'id'
  },
  onLoad: async ({ page, value, data }, callback) => {
    if (value) {
      //初始化返回选中字段字典
      if (typeof value == 'string') return //avue会触发两次取其中值为数组的一次
      //let dicData = await callData.callApiFun('get', '/system/dict-type/list-all-simple')
      callback([
        { id: '001', table_1: '值1' }
      ])
      return
    }
    let apiData = {}
    if (page) {
      //分页参数
      let { currentPage, pageSize } = page
      apiData.currentPage = currentPage
      apiData.pageSize = pageSize
    }
    if (data) {
      //搜索参数
      apiData = { ...apiData, ...data }
    }
    //表格数据返回
    callback({
      total: 2,
      data: [
        { id: '001', table_1: '值001', table_2: '值2' },
        { id: '002', table_1: '值002', table_2: '值2' },
      ]
    })
  }
}
`
//上传控件 上传回调配置模板
export const uplaodExample = `return {
  verify(file) {
    //自定义上传文件校验
    return new Promise((resolve, reject) => {
      let fileSize = file.size / 1024 //KB
      if (size > 1000) {
        reject() //校验不通过
      } else {
        resolve() //校验通过
      }
    })
  }
}
`
//代码编辑器 MonacoEditor配置模板
export const monacoEditorExample = `return {
  theme:'vs-dark',//主题 hc-black、vs-dark
}
`

//代码编辑器 自定义按钮配置模板
export const monacoButtonExample = `return {
  //其他配置请参考element-plus button配置
  params: {
    type: 'primary',
  },
  loading: true, //点击是否有loading
  //当前按钮的点击事件
  clickFun: (loading) => {
    if (loading) loading() //关闭loading方法
  }
}
`
//富文本 wangEditor配置模板
export const wangEditorExample = `return {
  excludeKeys: [
    //需要排除的顶部工具栏
    // 'headerSelect', //标题
    // 'blockquote', //引用
    // 'bold', //粗体
    // 'underline', //下划线
    // 'italic', //斜体
    // 'group-more-style', //更多字体样式  包含：'through' 删除线  'code' 行内代码  'sup'上标  'sub' 下标  'clearStyle' 清除格式
    // 'color', //文字颜色
    // 'bgColor', //背景色
    // 'fontSize', //字号
    // 'fontFamily', //字体
    // 'lineHeight', //行高
    // 'bulletedList', //无序列表
    // 'numberedList', //有序列表
    // 'todo', //待办
    // 'group-justify', //对齐方式 包含：'justifyLeft' 左对齐  'justifyRight' 右对齐  'justifyCenter'居中对齐  'justifyJustify' 两端对齐
    // 'group-indent', //对齐方式 包含：'indent' 增加缩进  'delIndent' 减少缩进
    // 'emotion', //表情
    // 'insertLink', //插入链接
    // 'group-image', //图片 包含：'insertImage' 网络图片  'uploadImage' 上传图片
    // 'group-video', //图片 包含：'insertVideo' 插入视频  'uploadVideo' 上传视频
    // 'insertTable', //插入表格
    // 'codeBlock', //代码块
    // 'divider', //分割线
    // 'undo', //撤销
    // 'redo', //重做
    // 'fullScreen', //全屏
    // '|',//工具栏所有的 | 分割
  ],
  MENU_CONF: {
    //自定义字号
    fontSize: {
      fontSizeList: [{ name: '12px', value: '12px' }]
    },
    //自定义字体
    fontFamily: {
      fontFamilyList: [{ name: '仿宋', value: '仿宋' }]
    },
    //自定义行搞
    lineHeight: {
      lineHeightList: ['1', '1.5']
    },
    //自定义表情
    emotion: {
      emotions: ['😀']
    }
  }
}
`
//坐标选择器 高德地图配置模板
export const mapExample = `return {
  mapChange: (params) => {
    //params 地理位置详细信息
  },
  //高德初始化配置参数
  params: {
    zoom: 10,
  }
}
`
//文本 文本样式配置模板
export const titleStyleExample = `return {
  fontSize:'16px',
  color:'#000',
}`

//MarkDown v-md-editor配置
export const MarkDownExample = `return {
  height: '300px',
}`

/* 表单开发 */
//表单开发 js增强配置默认值
export const TableJsEnhanceExample = `return {
  //表格显示前执行
  initOption() {

  },
  //表格赋值前执行
  beforeData(data) {
    return new Promise(resolve => {
      resolve(data)
    })
  },
}`
//自定义按钮-其他配置模板
export const customButtonExample = `return {
  color: '#626aef',
  plain: true,
  handleShow: (row) => { //按钮显隐增强  row：当前行数据（row 仅操作列按钮可用）
    return true //true 显示 false 隐藏
  }
}`

//java在线脚本模板
export const JavaDataExample = `import cn.hutool.json.JSONUtil;
import com.jeelowcode.core.framework.config.aspect.enhance.model.EnhanceContext;
import com.jeelowcode.core.framework.config.aspect.enhance.model.EnhanceResult;
import com.jeelowcode.core.framework.utils.Func;

import java.util.List;
import java.util.Map;


public class TestListEnhance {

    public void beforeExecute(EnhanceContext context){
        //todo 编写自己的前置代码
        System.out.println("map===="+ JSONUtil.toJsonStr(context));
    }

    public void afterExecute(EnhanceContext context){
        //todo 编写自己的后置置代码
        System.out.println("map===="+JSONUtil.toJsonStr(context));
        EnhanceResult result = context.getResult();
        List<Map<String, Object>> records = result.getRecords();
        for(Map<String,Object> dataMap:records){
            String name = Func.getMap2Str(dataMap, "name");
            dataMap.put("name","测试："+name);
        }
    }
}`


//scss增强默认值模板
export const scssEnhanceExample = (key) => `// 表格样式
.low-table__${key} {}

// 表单弹窗样式（仅默认表单可用）
.low-table__dialog__${key} {}
`

//初始化控件 配置模板
export const controlInitExample = (type?) => {
  const random = Math.ceil(Math.random() * 99999)
  const getUseStr = (key) => `
//控件调用
const { ${key} } = Vue.toRefs(rendControlData.value)
${key}.value.show = true //显示${type}
const controlData = ${key}.value.params //${type}的配置
// componentRef.value.${key} ${type}的Ref控件引用
`
  if (type == 'FormView') {
    return `
//初始化控件
useFun.controlInit('FormView', 'formView_${random}', {
  formId: '', //表单设计id
  formType: 'add', //表单类型 add | edit | view
  handleType: '', //处理类型 default | returnData
  showType: 'dialog', //弹窗类型 dialog | drawer
  showButton:true, //是否显示底部默认操作按钮
  dataOption: { //数据配置 
    tableId: '', //表单开发id
    dataId: '' //数据id
  },
  defaultData: {}, //默认表单数据
  enhanceData: {}, //传递给表单js增强内部调用配置
  popOption: { //弹窗配置
    title: '测试表单', //标题
    width: '', //弹窗宽度
    fullscreen: false, //是否全屏
    footerBtn: [ //底部按钮配置
      {
        params: {}, //el-button 其他参数
        name: '测试按钮', //按钮名称
        display: true, //是否显示
        loading: true, //点击时是否有loading
        icon: '', //图标
        clickFun: (loading) => {
          //点击事件
          if (loading) loading() //关闭loading
        }
      }
    ],
    headerBtn: [], //顶部按钮配置（配置同上）
    dialogParams: {} //弹窗其他配置
  },
  beforeClose: (type, done, formData, loading) => {
    // type:关闭类型  submit:提交后触发  close:直接关闭弹窗触发
    // done:关闭弹窗方法 formData:表单数据  loading:关闭loading方法
    if (type == 'submit') {
      console.log('表单数据', formData)
    }
    done()
  }
})
${getUseStr('formView_' + random)}
`
  } else if (type == 'ControlView') {
    return `
//初始化控件
useFun.controlInit('ControlView', 'controlView_${random}', {
  controlName: '', //控件名称（全局注册的控件使用，例：el-transfer ）
  controlPath: '', //控件相对路径（未全局注册的控件使用，例：components/IFrame/src/IFrame.vue）
  controlParams: {}, //控件配置
  showType: 'dialog', //弹窗类型 dialog | drawer
  popOption: { //弹窗配置
    title: '测试控件', //标题
    width: '', //弹窗宽度
    fullscreen: false, //是否全屏
    footerBtn: [ //底部按钮配置
      {
        params: {}, //el-button 其他参数
        name: '测试按钮', //按钮名称
        display: true, //是否显示
        loading: true, //点击时是否有loading
        icon: '', //图标
        clickFun: (loading) => {
          //点击事件
          if (loading) loading() //关闭loading
        }
      }
    ],
    headerBtn: [], //顶部按钮配置（配置同上）
    dialogParams: {}, //弹窗其他配置
    handleClose: (done) => { //关闭弹窗前的回调
      done()
    }
  }
})
${getUseStr('controlView_' + random)}
`
  } else if (type == 'TableView') {
    return `
//初始化控件
useFun.controlInit('TableView', 'tableView_${random}', {
  tableId: '', //表单开发id
  fixedSearch: {}, //固定表格搜索值（不会被覆盖）
  enhanceData: {}, //传递给表格js增强内部调用配置
  showType: 'dialog', //弹窗类型 dialog | drawer
  popOption: { //弹窗配置
    title: '测试控件', //标题
    width: '', //弹窗宽度
    fullscreen: false, //是否全屏
    footerBtn: [ //底部按钮配置
      {
        params: {}, //el-button 其他参数
        name: '测试按钮', //按钮名称
        display: true, //是否显示
        loading: true, //点击时是否有loading
        icon: '', //图标
        clickFun: (loading) => {
          //点击事件
          if (loading) loading() //关闭loading
        }
      }
    ],
    headerBtn: [], //顶部按钮配置（配置同上）
    dialogParams: {}, //弹窗其他配置
    handleClose: (done) => { //关闭弹窗前的回调
      done()
    }
  }
})
${getUseStr('tableView_' + random)}
`
  } else if (type == 'TabsView') {
    return `
//初始化控件
useFun.controlInit('TabsView', 'tabsView_${random}', {
  defaultTab: 'testForm', //默认显示的标签
  lazy: true, //是否开启懒加载
  tabsParams: {}, //el-tabs标签页配置
  tabsData: { //选项卡数据
    testForm: {
      tabText: '测试表单',//选项卡标题
      type: 'form', //选项卡内容 控件类型
      refresh: true, //切换到当前选项卡时是否重载表单
      params: { //控件配置
        formId: '', //表单设计id
        formType: '', //表单类型 add | edit | view
        handleType: '', //处理类型 default | returnData
        dataOption: { //数据配置 
          tableId: '', //表单开发id
          dataId: '' //数据id
        },
        defaultData: {}, //默认表单数据
        enhanceData: {}, //传递给表单js增强内部调用配置
      }
    },
    testTable: {
      tabText: '测试表格',
      type: 'table',
      refresh: true, //切换到当前选项卡时是否刷新表格数据
      params: {
        tableId: '', //表单开发id
        fixedSearch: {}, //固定表格搜索值
        enhanceData: {}, //传递给表格js增强内部调用配置
      }
    },
    testControl: {
      tabText: '测试自定义控件',
      type: 'control',
      refresh: true, //切换到当前选项卡时是否重载控件
      params: {
        controlName: 'el-transfer', //控件名称（全局注册的控件使用，例：el-transfer ）
        controlPath: '', //控件相对路径（未全局注册的控件使用，例：components/IFrame/src/IFrame.vue）
        controlParams: {}, //控件配置
      }
    },
    testTabs: {
      tabText: '测试标签页',
      type: 'tabs', //控件类型
      refresh: true, //切换到当前选项卡时是否重载标签页
      params: { //配置同上
        lazy: true,
        defaultTab: '',
        tabsParams: {},
        tabsData: {},
      }
    }
  },
  popOption: { //弹窗配置
    title: '测试Tabs', //标题
    width: '', //弹窗宽度
    fullscreen: false, //是否全屏
    footerBtn: [ //底部按钮配置
      {
        params: {}, //el-button 其他参数
        name: '测试按钮', //按钮名称
        display: true, //是否显示
        loading: true, //点击时是否有loading
        icon: '', //图标
        clickFun: (loading) => {
          //点击事件
          if (loading) loading() //关闭loading
        }
      }
    ],
    headerBtn: [], //顶部按钮配置（配置同上）
    dialogParams: {}, //弹窗其他配置
    handleClose: (done) => { //关闭弹窗前的回调
      done()
    }
  }
})
${getUseStr('tabsView_' + random)}
  `
  } else return ''
}