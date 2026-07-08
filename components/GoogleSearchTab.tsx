import { SeoReport } from '@/types/seo'
import { CheckItem } from './CheckItem'
import { SerpPreview } from './SerpPreview'
import { useI18n } from './I18nProvider'

export function GoogleSearchTab({ report }: { report: SeoReport }) {
  const { t } = useI18n()

  if (!report.serpChecks || report.serpChecks.length === 0) {
    return <p className="text-gray-600">{t('noGoogleData')}</p>
  }

  return (
    <div className="space-y-6">
      {report.serpChecks.map((item) => (
        <CheckItem key={item.id} item={item} />
      ))}

      <div>
        <h3 className="mb-3 font-semibold">{t('serpPreview')}</h3>
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
