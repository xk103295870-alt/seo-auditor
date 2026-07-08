'use client'

import { useI18n } from './I18nProvider'

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function UrlInput({ value, onChange, error }: UrlInputProps) {
  const { t } = useI18n()

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
