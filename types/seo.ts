export type CheckStatus = 'pass' | 'warn' | 'fail'

export interface CheckItem {
  id: string
  name: string
  status: CheckStatus
  value: string | number | boolean
  recommendation?: string
  snippet?: string
}

export type ScanType = 'basic' | 'deep'

export interface ScanTask {
  id: string
  url: string
  type: ScanType
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
  result?: SeoReport
  error?: string
}

export interface SeoReport {
  url: string
  type: ScanType
  score: number
  basicChecks: CheckItem[]
  techChecks?: CheckItem[]
  serpChecks?: CheckItem[]
  completedAt: string
}
