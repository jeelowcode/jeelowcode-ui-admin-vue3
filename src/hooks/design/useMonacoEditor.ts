import * as monaco from 'monaco-editor'
import { ref, nextTick, onBeforeUnmount } from 'vue'
//语言
import 'monaco-editor/esm/vs/basic-languages/scss/scss.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import * as MySql from 'monaco-editor/esm/vs/basic-languages/mysql/mysql.js';
import * as JavaScript from 'monaco-editor/esm/vs/basic-languages/javascript/javascript.js';
import * as Java from 'monaco-editor/esm/vs/basic-languages/java/java.js';
// 查找控件
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController';
import enhanceTip from '@/components/LowDesign/src/utils/enhanceTip';

import * as sqlFormatter from 'sql-formatter'

interface completions {
  label: string
  insertText: string
  detail?: string
  kind?: any
  sortText?: string
}

const monacoProviderRef = ref<any>({})
const providerType = ref('')
let disposeArr: any[] = []
//清除提示
function clearProvider() {
  for (const key in monacoProviderRef.value) monacoProviderRef.value[key]?.dispose()
}
function initLanguageProvider() {
  clearProvider()
  const sqlProvider: any = {
    provideCompletionItems: (model, position) => {
      const suggestions: completions[] = []
      const { lineNumber, column } = position
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column,
      })
      const contents = textBeforePointer.trim().split(/\s+/)
      const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
      if (lastContents) {
        const sqlConfigKey = ['builtinFunctions', 'keywords', 'operators']
        sqlConfigKey.forEach(key => {
          MySql.language[key].forEach(sql => suggestions.push({ label: sql, insertText: sql, kind: monaco.languages.CompletionItemKind.Value }))
        })
      }
      return { suggestions }
    }
  }
  const javaProvider: any = {
    provideCompletionItems: (model, position) => {
      const suggestions: completions[] = []
      const { lineNumber, column } = position
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column,
      })
      const contents = textBeforePointer.trim().split(/\s+/)
      const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
      if (lastContents) {
        const javaConfigKey = ['keywords', 'operators']
        javaConfigKey.forEach(key => {
          Java.language[key].forEach(java => suggestions.push({ label: java, insertText: java, kind: monaco.languages.CompletionItemKind.Value }))
        })
      }
      return { suggestions }
    }
  }

  let javaScriptDesign: any = []
  const { tipList, triggerObj } = enhanceTip[providerType.value] || {}
  if (tipList) javaScriptDesign = tipList
  const javaScriptProvider: any = {
    provideCompletionItems: (model, position) => {
      if (!providerType.value) return { suggestions: [] }
      const suggestions: completions[] = []
      const { lineNumber, column } = position
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        startColumn: 0,
        endLineNumber: lineNumber,
        endColumn: column,
      })
      const contents = textBeforePointer.trim().split(/\s+/)
      const lastContents = contents[contents?.length - 1] // 获取最后一段非空字符串
      const setTipFun = (bool) => {
        javaScriptDesign.forEach((javaScript) => {
          const item = { ...javaScript, sortText: bool ? '100' : '' }
          suggestions.push(item)
        })
      }
      let triggerKey = ''
      if (triggerObj && lastContents) {
        const lastLeng = lastContents.length
        for (const key in triggerObj) {
          if (triggerKey) break
          const findIndex = lastContents.lastIndexOf(key)
          if (findIndex != -1) {
            const keyLeng = key.length
            if (lastLeng - keyLeng == findIndex) triggerKey = key
          }
        }
      }
      if (triggerKey) {
        javaScriptDesign = triggerObj[triggerKey]
        setTipFun(true)
        return { incomplete: false, suggestions }
      }
      javaScriptDesign = tipList || []
      if (lastContents) {
        const javaScriptConfigKey = ['operators']
        javaScriptConfigKey.forEach(key => {
          JavaScript.language[key].forEach(javaScript => suggestions.push({ label: javaScript, insertText: javaScript }))
        })
        setTipFun(false)
      }
      return { incomplete: false, suggestions }
    },
    triggerCharacters: ['.'],
  }

  monacoProviderRef.value.mysql = monaco.languages.registerCompletionItemProvider('mysql', sqlProvider);
  monacoProviderRef.value.java = monaco.languages.registerCompletionItemProvider('java', javaProvider);
  monacoProviderRef.value.javascript = monaco.languages.registerCompletionItemProvider('javascript', javaScriptProvider);
}

function addMySqlFormat() {
  const sqlFormatDisposable = monaco.editor.addEditorAction({
    id: 'format-sql',
    label: '格式化 SQL',
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1.5,
    run: (ed) => {
      const original = ed.getValue();
      const formatted = sqlFormatter.format(original, {
        language: 'mysql',
        params: ['#\\{[^}]+\\}']
      });
      ed.setValue(formatted)
    }
  })
  const list = [...(sqlFormatDisposable['_toDispose'] || [])]
  disposeArr.push(...list)
}

function emptyDispose() {
  if (disposeArr.length) {
    disposeArr.forEach(item => item.dispose && item.dispose())
    disposeArr = []
  }
}

export function useMonacoEditor(language: string = 'javascript') {
  // 编辑器示例
  let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null
  // 目标元素
  const monacoEditorRef = ref<HTMLElement | null>(null)
  // 创建实例
  function createEditor(editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {}, type = '') {
    providerType.value = type
    if (!monacoEditorRef.value) return
    initLanguageProvider()
    if (language)
      monacoEditor = monaco.editor.create(monacoEditorRef.value, {
        // 初始模型
        model: monaco.editor.createModel('', language),

        minimap: { enabled: true },
        // 圆角
        roundedSelection: true,
        // 主题
        theme: 'vs-dark',
        multiCursorModifier: 'ctrlCmd',
        // 滚动条
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8
        },
        // 行号
        lineNumbers: 'on',
        // tab大小
        tabSize: 2,
        //字体大小
        fontSize: 14,
        // 控制编辑器在用户键入、粘贴、移动或缩进行时是否应自动调整缩进
        autoIndent: 'advanced',
        autoClosingBrackets: 'always',//补全括号
        autoClosingQuotes: 'always', //补全冒号
        // 自动布局
        automaticLayout: true,
        fixedOverflowWidgets: true,
        ...editorOption,
      })
    return monacoEditor
  }
  emptyDispose()
  if (language == 'mysql') addMySqlFormat()
  // 格式化
  async function formatDoc() {
    await monacoEditor?.getAction('editor.action.formatDocument')?.run()
  }

  // 数据更新
  function updateVal(val: string) {
    nextTick(() => {
      monacoEditor?.setValue(val)
      setTimeout(async () => {
        await formatDoc()
      }, 10)
    })
  }

  // 配置更新
  function updateOptions(opt: monaco.editor.IStandaloneEditorConstructionOptions, type = '') {
    providerType.value = type
    initLanguageProvider()
    monacoEditor?.updateOptions(opt)
  }

  // 获取配置
  function getOption(name: monaco.editor.EditorOption) {
    return monacoEditor?.getOption(name)
  }

  // 获取实例
  function getEditor() {
    return monacoEditor
  }

  // 设置语言
  function setLanguage(language, type = '') {
    providerType.value = type
    const text = monacoEditor?.getModel()?.getValue() || ''
    const model = monaco.editor.createModel(text, language)
    monacoEditor?.setModel(model)
    emptyDispose()
    if (language == 'mysql') addMySqlFormat()
  }

  onBeforeUnmount(() => {
    if (monacoEditor) {
      clearProvider()
      emptyDispose()
      monacoEditor.dispose()
    }
  })

  return {
    monacoEditorRef,
    createEditor,
    getEditor,
    setLanguage,
    updateVal,
    updateOptions,
    getOption,
    formatDoc,
  }
}
export function useDiffEditor(language: string = 'javascript', newValue, oldValue) {
  // 编辑器示例
  let diffEditor: monaco.editor.IStandaloneDiffEditor | null = null
  let originalModel: any = null
  let modifiedModel: any = null
  // 目标元素
  const deffEditorRef = ref<HTMLElement | null>(null)
  // 创建实例
  function createDeffEditor(editorOption: monaco.editor.IStandaloneDiffEditorConstructionOptions = {}, type = '') {
    providerType.value = type
    if (!deffEditorRef.value) return
    initLanguageProvider()
    diffEditor = monaco.editor.createDiffEditor(deffEditorRef.value, {
      fontSize: 14, // 字体大小
      theme: 'vs-dark', //主题
      readOnly: false, // 是否只读
      overviewRulerBorder: false, // 滚动是否有边框
      cursorSmoothCaretAnimation: 'off', // 控制光标平滑动画的开启与关闭。当开启时，光标移动会有平滑的动画效果。
      mouseWheelZoom: true, //设置是否开启鼠标滚轮缩放功能
      folding: true, //控制是否开启代码折叠功能
      automaticLayout: true, // 控制编辑器是否自动调整布局以适应容器大小的变化
      // 是否启用预览图
      minimap: { enabled: true },
      // 滚动条
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      wordWrap: "off", // 关闭自动换行
      scrollBeyondLastLine: false,
      roundedSelection: true, // 右侧不显示编辑器预览框
      originalEditable: false, // 是否允许修改原始文本
      ...editorOption,
    })
    originalModel = monaco.editor.createModel(oldValue, language);
    modifiedModel = monaco.editor.createModel(newValue, language);
    diffEditor.setModel({ original: originalModel, modified: modifiedModel });
    return { diffEditor, originalModel, modifiedModel }
  }
  //获取实例
  function getEditor(type) {
    if (type == 'diff') return diffEditor
    if (type == 'original') return originalModel
    if (type == 'modified') return modifiedModel
  }
  // 格式化
  async function formatDoc() {
    await originalModel?.getAction('editor.action.formatDocument')?.run()
    await modifiedModel?.getAction('editor.action.formatDocument')?.run()
  }
  // 数据更新
  function updateVal(val: string, type) {
    nextTick(() => {
      if (type == 'original') return originalModel?.setValue(val)
      if (type == 'modified') return modifiedModel?.setValue(val)
      setTimeout(async () => {
        await formatDoc()
      }, 10)
    })
  }
  // 设置语言
  function setLanguage(language, type = '') {
    providerType.value = type
    const originalText = originalModel?.getValue() || ''
    const modifiedText = modifiedModel?.getValue() || ''
    originalModel = monaco.editor.createModel(originalText, language)
    modifiedModel = monaco.editor.createModel(modifiedText, language)
    diffEditor?.setModel({ original: originalModel, modified: modifiedModel })
  }

  return {
    deffEditorRef,
    createDeffEditor,
    getEditor,
    updateVal,
    setLanguage
  }
}