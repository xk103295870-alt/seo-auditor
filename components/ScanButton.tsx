'use client'

interface ScanButtonProps {
  loading: boolean
  disabled?: boolean
}

export function ScanButton({ loading, disabled }: ScanButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
    >
      {loading ? '正在扫描...' : '开始扫描'}
    </button>
  )
}
