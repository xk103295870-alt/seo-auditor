import { CheckItem as CheckItemType } from '@/types/seo'
import { useI18n } from './I18nProvider'

export function CheckItem({ item }: { item: CheckItemType }) {
  const { t } = useI18n()

  const statusMap = {
    pass: { label: t('pass'), className: 'bg-green-100 text-green-800' },
    warn: { label: t('warn'), className: 'bg-yellow-100 text-yellow-800' },
    fail: { label: t('fail'), className: 'bg-red-100 text-red-800' },
  }

  const status = statusMap[item.status]
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold">{item.name}</h4>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <span className="font-medium">{t('currentValue')}</span>
        {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : String(item.value)}
      </div>
      {item.recommendation && (
        <div className="text-sm text-gray-600">💡 {item.recommendation}</div>
      )}
      {item.snippet && (
        <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">{item.snippet}</pre>
      )}
    </div>
  )
}
