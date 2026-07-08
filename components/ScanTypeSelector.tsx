'use client'

import { ScanType } from '@/types/seo'

interface ScanTypeSelectorProps {
  value: ScanType
  onChange: (value: ScanType) => void
}

export function ScanTypeSelector({ value, onChange }: ScanTypeSelectorProps) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange('basic')}
        className={`flex-1 rounded-lg border px-4 py-3 text-left ${
          value === 'basic'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="font-semibold">基础扫描</div>
        <div className="text-sm text-gray-600">实时 · Title、Description、H1 等</div>
      </button>
      <button
        type="button"
        onClick={() => onChange('deep')}
        className={`flex-1 rounded-lg border px-4 py-3 text-left ${
          value === 'deep'
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="font-semibold">深度扫描</div>
        <div className="text-sm text-gray-600">异步 · Lighthouse、死链、SERP</div>
      </button>
    </div>
  )
}
