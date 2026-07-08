'use client'

import { ScanType } from '@/types/seo'
import { useI18n } from './I18nProvider'

interface ScanTypeSelectorProps {
  value: ScanType
  onChange: (value: ScanType) => void
}

export function ScanTypeSelector({ value, onChange }: ScanTypeSelectorProps) {
  const { t } = useI18n()

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange('basic')}
        className={`flex-1 rounded-lg border px-4 py-3 text-left ${
          value === 'basic'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="font-semibold">{t('basicScan')}</div>
        <div className="text-sm text-gray-600">{t('basicScanDesc')}</div>
      </button>
      <button
        type="button"
        onClick={() => onChange('deep')}
        className={`flex-1 rounded-lg border px-4 py-3 text-left ${
          value === 'deep'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="font-semibold">{t('deepScan')}</div>
        <div className="text-sm text-gray-600">{t('deepScanDesc')}</div>
      </button>
    </div>
  )
}
