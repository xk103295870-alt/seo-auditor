interface SerpPreviewProps {
  title: string
  url: string
  snippet: string
}

export function SerpPreview({ title, url, snippet }: SerpPreviewProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="text-sm text-gray-800">{url}</div>
      <div className="cursor-pointer text-xl text-blue-700 hover:underline">{title}</div>
      <div className="text-sm text-gray-600">{snippet}</div>
    </div>
  )
}
