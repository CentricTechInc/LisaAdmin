export type Column<T> = {
  id: string
  header: string
  accessor?: (row: T, index: number, actions?: { isExpanded: boolean; toggleExpand: () => void }) => React.ReactNode
  field?: keyof T
  sortable?: boolean
  visible?: boolean
  width?: string | number
  className?: string
}

export type SortState = { columnId: string; direction: 'asc' | 'desc' }

export type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  selectable?: boolean
  initialSort?: SortState | null
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onSortChange?: (s: SortState | null) => void
  globalFilter?: string
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  showColumnToggle?: boolean
  renderSubComponent?: (row: T) => React.ReactNode
}
