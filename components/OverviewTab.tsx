import { SeoReport } from '@/types/seo'
import { ScoreRing } from './ScoreRing'

export function OverviewTab({ report }: { report: SeoReport }) {
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
          <div className="text-gray-600">综合 SEO 健康分</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{pass}</div>
          <div className="text-sm text-green-800">已达标</div>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{warn}</div>
          <div className="text-sm text-yellow-800">警告</div>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{fail}</div>
          <div className="text-sm text-red-800">错误</div>
        </div>
      </div>
    </div>
  )
}
