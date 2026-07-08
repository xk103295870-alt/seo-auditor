import { SeoReport } from '@/types/seo'
import { CheckItem } from './CheckItem'

export function BasicSeoTab({ report }: { report: SeoReport }) {
  return (
    <div className="space-y-4">
      {report.basicChecks.map((item) => (
        <CheckItem key={item.id} item={item} />
      ))}
    </div>
  )
}
