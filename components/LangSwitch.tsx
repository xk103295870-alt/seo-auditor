'use client'

import { useI18n } from './I18nProvider'

export function LangSwitch() {
  const { lang, setLang } = useI18n()

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 text-sm">
      <button
        type="button"
        onClick={() => setLang('zh')}
        className={`rounded-md px-3 py-1 ${
          lang === 'zh' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`rounded-md px-3 py-1 ${
          lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
    </div>
  )
}
