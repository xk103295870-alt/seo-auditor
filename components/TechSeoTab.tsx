import { SeoReport } from '@/types/seo'
import { CheckItem } from './CheckItem'
import { useI18n } from './I18nProvider'

export function TechSeoTab({ report }: { report: SeoReport }) {
  const { t } = useI18n()

  if (!report.techChecks || report.techChecks.length === 0) {
    return <p className="text-gray-600">{t('noTechData')}</p>
  }
  return (
    <div className="space-y-4">
      {report.techChecks.map((item) => (
        <CheckItem key={item.id} item={item} />
      ))}
    </div>
  )
}
