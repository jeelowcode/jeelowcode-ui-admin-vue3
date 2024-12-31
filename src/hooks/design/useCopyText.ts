
import { useClipboard } from '@vueuse/core'
export default function () {
  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗
  const copy = async (text: string) => {
    if (navigator.clipboard) {
      const { copy, copied, isSupported } = useClipboard({ source: text })
      if (!isSupported) {
        message.error(t('common.copyError'))
        return
      }
      await copy()
      if (unref(copied)) {
        message.success(t('common.copySuccess'))
      }
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      message.success(t('common.copySuccess'));
    }
  }
  return { copyText: copy }
}