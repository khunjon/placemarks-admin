'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('authenticated')
    if (auth === 'true') {
      setAuthenticated(true)
    } else {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

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