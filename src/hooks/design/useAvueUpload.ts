import { downloadByUrl } from '@/utils/filt';
export default function () {
  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  //文件大小格式化
  const fileSizeFormatter = (fileSize) => {
    const unitArr = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    fileSize = parseFloat(fileSize)
    const index = Math.floor(Math.log(fileSize) / Math.log(1024))
    fileSize = fileSize / Math.pow(1024, index)
    //保留的小数位数
    if (`${fileSize}`.indexOf('.') != -1) fileSize = fileSize.toFixed(2)
    return fileSize + ' ' + unitArr[index]
  }

  //校验文件类型
  const verifyFileType = (fileName) => {
    const imgExp = /\.(gif|jpg|jpeg|png|webp|svg|GIF|JPG|JPEG|PNG|WEBP|SVG)/
    const videoExp = /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|ogg|mp4)/
    const audioExp = /\.(mp3|wav|MP3|WAV)/
    if (imgExp.test(fileName)) return 'image/*'
    if (videoExp.test(fileName)) return 'video/*'
    if (audioExp.test(fileName)) return 'audio/*'
    return false
  }

  const uploadBefore = async (file, done, loading, column) => {
    let bool = false
    if (column.controlType == 'image') {
      if (column.accept == 'image/*' && verifyFileType(file.name) == column.accept) bool = true
      else if (column.accept) {
        const accept = column.accept instanceof Array ? column.accept : column.accept.split(',')
        if (accept.includes(file.type)) bool = true
      } else bool = true
    }
    if (column.controlType == 'file') {
      if (column.accept) {
        const nameList = file.name.split('.')
        const suffix = `.${nameList[nameList.length - 1]}`
        const accept = column.accept instanceof Array ? column.accept : column.accept.split(',')

        accept.forEach(type => {
          if (['image/*', 'video/*', 'audio/*'].includes(type) && verifyFileType(file.name) == type) bool = true
        })
        if (accept.includes(suffix) || accept.includes(file.type)) bool = true
      } else bool = true
    }
    try {
      if (column.verify) {
        bool = await column.verify(file).then(() => true).catch(() => false)
      }
    } catch (error) { }
    if (!bool) {
      message.info(`请上传正确的${column.label}格式`)
      loading()
      return
    }
    done()
  }

  const uploadExceed = (limit, files, fileList, column) => {
    message.info(`${column.label} 最大可上传 ${limit}${column.controlType == 'image' ? '张' : '件'}`)
  }
  const uploadSized = (fileSize, files, fileList, column) => {
    fileSize = fileSizeFormatter(fileSize)
    message.info(`${column.label} 上传大小不可超过 ${fileSize}`)
  }
  const uploadPreview = (file, column, done) => {
    if (column.controlType == 'image') return done()
    const bool = verifyFileType(file.url)
    if (bool) done()
    else downloadByUrl({ url: file.url })
  }

  return { uploadBefore, uploadExceed, uploadSized, uploadPreview }
}