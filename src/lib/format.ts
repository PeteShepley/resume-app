function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function formatDateRange(start: string, end?: string | null): string {
  const startLabel = formatMonthYear(start)
  const endLabel = end ? formatMonthYear(end) : 'Present'
  return `${startLabel} – ${endLabel}`
}

export function formatDate(isoDate?: string | null): string | null {
  return isoDate ? formatMonthYear(isoDate) : null
}
