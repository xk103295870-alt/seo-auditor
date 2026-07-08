import { SeoReport } from '@/types/seo'
import { CheckItem } from './CheckItem'

export function TechSeoTab({ report }: { report: SeoReport }) {
  if (!report.techChecks || report.techChecks.length === 0) {
    return <p className="text-gray-600">深度扫描未包含技术 SEO 数据。</p>
  }
  return (
    <div className="space-y-4">
      {report.techChecks.map((item) => (
        <CheckItem key={item.id} item={item} />
      ))}
    </div>
  )
}
