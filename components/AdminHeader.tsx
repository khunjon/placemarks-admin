'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface AdminHeaderProps {
  title: string
  showBackButton?: boolean
  lastUpdated?: boolean
}

export default function AdminHeader({ title, showBackButton = true, lastUpdated = false }: AdminHeaderProps) {
  const router = useRouter()
  const { signOut, sessionWarning, refreshSession } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await signOut()
      if (!result?.success) {
        // If logout failed, reset loading state
        setIsLoggingOut(false)
      }
      // If successful, we'll be redirected and component will unmount
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const handleRefreshSession = async () => {
    setIsRefreshing(true)
    try {
      await refreshSession()
    } catch (error) {
      console.error('Session refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
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
        {sessionWarning && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-yellow-400">
              Session expiring soon
            </div>
            <button
              onClick={handleRefreshSession}
              disabled={isRefreshing}
              className="text-xs bg-yellow-600 hover:bg-yellow-500 text-black px-2 py-1 rounded transition-colors"
            >
              {isRefreshing ? 'REFRESHING...' : 'EXTEND'}
            </button>
          </div>
        )}
        {lastUpdated && (
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            ...signOutButtonStyle,
            opacity: isLoggingOut ? 0.6 : 1,
            cursor: isLoggingOut ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = '#ef4444'
              e.currentTarget.style.color = '#fff'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.color = '#ef4444'
            }
          }}
        >
          {isLoggingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
        </button>
      </div>
    </div>
  )
} 