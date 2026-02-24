export type StatCard = {
  label: string
  value: number | string
  sub: string
  tag: string
  tagClass: string
  icon: React.ElementType
  iconBg: string
}

export type RecentEntry = {
  id: number
  hhId: string
  granteeName?: string
  grantee?: string
  date: string
  remarks?: string
  encoded?: string
  documentType: string
  module?: string
}

export type CountResponse = {
  count: number
}

export type ModuleStyle = Record<string, string>

export type SparklineData = Record<string, number[]>

export type SparkColor = Record<string, string>