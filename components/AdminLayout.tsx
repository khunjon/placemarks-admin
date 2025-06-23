'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import AdminHeader from './AdminHeader'
import { dashboardStyles } from '../lib/dashboardStyles'

interface AdminLayoutProps {
  title: string
  showBackButton?: boolean
  lastUpdated?: boolean
  children: React.ReactNode
}

export default function AdminLayout({ 
  title, 
  showBackButton = true, 
  lastUpdated = false, 
  children 
}: AdminLayoutProps) {
  const { loading, authenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg">LOADING</div>
          <div className="cursor mx-auto mt-2"></div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminHeader 
        title={title} 
        showBackButton={showBackButton} 
        lastUpdated={lastUpdated} 
      />
      <div style={dashboardStyles.mainContent}>
        {children}
      </div>
    </div>
  )
}