export const getDisplayStatus = (visibility: string | null): string => {
  switch (visibility) {
    case 'public': return 'ACTIVE'
    case 'curated': return 'ACTIVE'
    case 'private': return 'HIDDEN'
    case null: return 'DRAFT'
    default: return 'DRAFT'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return '#10b981'
    case 'HIDDEN': return '#f59e0b'
    case 'DRAFT': return '#6b7280'
    default: return '#6b7280'
  }
}