'use client'

import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  title: string
  showBackButton?: boolean
  lastUpdated?: boolean
}

export default function AdminHeader({ title, showBackButton = true, lastUpdated = false }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    router.push('/login')
  }

  const goBack = () => {
    router.push('/')
  }

  const backButtonStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #00ffff',
    color: '#00ffff',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const signOutButtonStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-800">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={goBack} 
            style={backButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ffff'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.color = '#00ffff'
            }}
          >
            ← BACK
          </button>
        )}
        <h1 className="text-2xl font-medium">{title}</h1>
        <div className="cursor ml-3"></div>
      </div>
      <div className="flex items-center gap-6">
        {lastUpdated && (
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
        <button
          onClick={handleLogout}
          style={signOutButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
            e.currentTarget.style.color = '#ef4444'
          }}
        >
          SIGN OUT
        </button>
      </div>
    </div>
  )
} 