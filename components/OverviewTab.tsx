import { SeoReport } from '@/types/seo'
import { ScoreRing } from './ScoreRing'
import { useI18n } from './I18nProvider'

export function OverviewTab({ report }: { report: SeoReport }) {
  const { t } = useI18n()
  const allChecks = [
    ...report.basicChecks,
    ...(report.techChecks || []),
    ...(report.serpChecks || []),
  ]
  const pass = allChecks.filter((c) => c.status === 'pass').length
  const warn = allChecks.filter((c) => c.status === 'warn').length
  const fail = allChecks.filter((c) => c.status === 'fail').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <ScoreRing score={report.score} />
        <div>
          <div className="text-2xl font-bold">{report.score}/100</div>
          <div className="text-gray-600">{t('scoreLabel')}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{pass}</div>
          <div className="text-sm text-green-800">{t('passCount')}</div>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{warn}</div>
          <div className="text-sm text-yellow-800">{t('warnCount')}</div>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{fail}</div>
          <div className="text-sm text-red-800">{t('failCount')}</div>
        </div>
      </div>
    </div>
  )
}
