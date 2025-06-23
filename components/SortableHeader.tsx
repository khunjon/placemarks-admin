import React from 'react'

interface SortableHeaderProps<T> {
  children: React.ReactNode
  sortKey: keyof T
  onSort: (key: keyof T) => void
  getSortIcon: (key: keyof T) => string
  style?: React.CSSProperties
  className?: string
}

export const SortableHeader = <T,>({
  children,
  sortKey,
  onSort,
  getSortIcon,
  style,
  className
}: SortableHeaderProps<T>) => {
  const handleClick = () => {
    onSort(sortKey)
  }

  const defaultStyle: React.CSSProperties = {
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    transition: 'background-color 0.2s ease',
  }

  const hoverStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  }

  return (
    <th 
      style={{ ...defaultStyle, ...style }}
      className={className}
      onClick={handleClick}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyle)
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, { backgroundColor: style?.backgroundColor || '#2a2a2a' })
      }}
    >
      <span>{children}</span>
      <span style={{ 
        fontSize: '12px', 
        opacity: 0.7,
        minWidth: '16px',
        textAlign: 'center'
      }}>
        {getSortIcon(sortKey)}
      </span>
    </th>
  )
} 