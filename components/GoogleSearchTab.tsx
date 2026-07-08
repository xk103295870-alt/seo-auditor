import { SeoReport } from '@/types/seo'
import { CheckItem } from './CheckItem'
import { SerpPreview } from './SerpPreview'

export function GoogleSearchTab({ report }: { report: SeoReport }) {
  if (!report.serpChecks || report.serpChecks.length === 0) {
    return <p className="text-gray-600">深度扫描未包含 Google 搜索数据。</p>
  }

  return (
    <div className="space-y-6">
      {report.serpChecks.map((item) => (
        <CheckItem key={item.id} item={item} />
      ))}

      <div>
        <h3 className="mb-3 font-semibold">SERP 预览</h3>
        <div className="space-y-3">
          <SerpPreview
            title="示例标题"
            url="https://example.com"
            snippet="示例摘要内容，展示搜索结果样式。"
          />
        </div>
      </div>
    </div>
  )
}
