'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
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

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    router.push('/login')
  }

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
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <h1 className="text-xl">PLACEMARKS ADMIN</h1>
          <div className="cursor ml-3"></div>
        </div>
        <button
          onClick={handleLogout}
          className="text-red transition"
        >
          EXIT
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl mb-4">SYSTEM READY</h2>
            <p className="text-gray">Select an administrative function</p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <h3>USER MANAGEMENT</h3>
              <p>Manage user accounts and permissions</p>
            </div>
            
            <div className="card">
              <h3>ANALYTICS</h3>
              <p>View system analytics and reports</p>
            </div>
            
            <div className="card">
              <h3>DATABASE</h3>
              <p>Database administration tools</p>
            </div>
            
            <div className="card">
              <h3>SYSTEM LOGS</h3>
              <p>View and analyze system logs</p>
            </div>
            
            <div className="card">
              <h3>SETTINGS</h3>
              <p>System configuration options</p>
            </div>
            
            <div className="card">
              <h3>SECURITY</h3>
              <p>Security monitoring and controls</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
