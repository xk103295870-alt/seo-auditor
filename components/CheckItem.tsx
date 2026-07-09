import { CheckItem as CheckItemType } from '@/types/seo'
import { useI18n } from './I18nProvider'

export function CheckItem({ item }: { item: CheckItemType }) {
  const { t, checkName, checkRecommendation, checkValue } = useI18n()

  const statusMap = {
    pass: { label: t('pass'), className: 'bg-green-100 text-green-800' },
    warn: { label: t('warn'), className: 'bg-yellow-100 text-yellow-800' },
    fail: { label: t('fail'), className: 'bg-red-100 text-red-800' },
  }

  const status = statusMap[item.status]
  const name = checkName(item.id)
  const recommendation = checkRecommendation(item.id)
  const value = checkValue(item.id, item.value)

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold">{name}</h4>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <span className="font-medium">{t('currentValue')}</span>
        {value}
      </div>
      {recommendation && (
        <div className="text-sm text-gray-600">💡 {recommendation}</div>
      )}
      {item.snippet && (
        <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">{item.snippet}</pre>
      )}
    </div>
  )
}
