'use client'

import { useI18n } from './I18nProvider'

export function ReportTabs({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  const { t } = useI18n()

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'basic', label: t('basicSeo') },
    { id: 'tech', label: t('techSeo') },
    { id: 'google', label: t('googleSearch') },
  ]

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`border-b-2 px-1 py-4 text-sm font-medium ${
              active === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
