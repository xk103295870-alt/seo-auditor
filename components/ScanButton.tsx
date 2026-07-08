'use client'

import { useI18n } from './I18nProvider'

interface ScanButtonProps {
  loading: boolean
  disabled?: boolean
}

export function ScanButton({ loading, disabled }: ScanButtonProps) {
  const { t } = useI18n()

  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {loading ? t('scanning') : t('startScan')}
    </button>
  )
}
