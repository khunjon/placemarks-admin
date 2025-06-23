import { useState, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface SortConfig<T> {
  key: keyof T | null
  direction: SortDirection
}

export interface UseSortingReturn<T> {
  sortConfig: SortConfig<T>
  sortedData: T[]
  handleSort: (key: keyof T) => void
  getSortIcon: (key: keyof T) => string
}

export function useSorting<T>(data: T[], initialSort?: SortConfig<T>): UseSortingReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(
    initialSort || { key: null, direction: null }
  )

  const sortedData = useMemo(() => {
    // Return data as-is if empty or no sorting configured
    if (!data.length || !sortConfig.key || !sortConfig.direction) {
      return data
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      // Convert to string for comparison if not numbers
      const aStr = typeof aValue === 'string' ? aValue.toLowerCase() : String(aValue).toLowerCase()
      const bStr = typeof bValue === 'string' ? bValue.toLowerCase() : String(bValue).toLowerCase()
      
      // Numeric comparison for numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // String comparison
      if (aStr < bStr) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aStr > bStr) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key: keyof T) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // Cycle through: asc -> desc -> null -> asc
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' }
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null }
        } else {
          return { key, direction: 'asc' }
        }
      } else {
        // New column, start with ascending
        return { key, direction: 'asc' }
      }
    })
  }

  const getSortIcon = (key: keyof T): string => {
    if (sortConfig.key !== key) {
      return '↕️' // Both arrows when not sorted
    }
    if (sortConfig.direction === 'asc') {
      return '↑'
    } else if (sortConfig.direction === 'desc') {
      return '↓'
    }
    return '↕️'
  }

  return {
    sortConfig,
    sortedData,
    handleSort,
    getSortIcon
  }
} 