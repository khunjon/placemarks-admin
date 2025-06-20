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
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-white text-lg">LOADING</div>
          <div className="w-3 h-5 bg-cyan-400 mx-auto mt-2 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center">
          <h1 className="text-xl">PLACEMARKS ADMIN</h1>
          <div className="w-3 h-5 bg-cyan-400 ml-3 animate-pulse"></div>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          EXIT
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl mb-4">SYSTEM READY</h2>
            <p className="text-gray-400">Select an administrative function</p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-cyan-400 p-6 hover:bg-cyan-400 hover:bg-opacity-10 transition-all cursor-pointer">
              <h3 className="text-lg mb-2">USER MANAGEMENT</h3>
              <p className="text-gray-400 text-sm">Manage user accounts and permissions</p>
            </div>
            
            <div className="border border-cyan-400 p-6 hover:bg-cyan-400 hover:bg-opacity-10 transition-all cursor-pointer">
              <h3 className="text-lg mb-2">ANALYTICS</h3>
              <p className="text-gray-400 text-sm">View system analytics and reports</p>
            </div>
            
            <div className="border border-cyan-400 p-6 hover:bg-cyan-400 hover:bg-opacity-10 transition-all cursor-pointer">
              <h3 className="text-lg mb-2">DATABASE</h3>
              <p className="text-gray-400 text-sm">Database administration tools</p>
            </div>
            
            <div className="border border-cyan-400 p-6 hover:bg-cyan-400 hover:bg-opacity-10 transition-all cursor-pointer">
              <h3 className="text-lg mb-2">SYSTEM LOGS</h3>
              <p className="text-gray-400 text-sm">View and analyze system logs</p>
            </div>
            
            <div className="border border-cyan-400 p-6 hover:bg-cyan-400 hover:bg-opacity-10 transition-all cursor-pointer">
              <h3 className="text-lg mb-2">SETTINGS</h3>
              <p className="text-gray-400 text-sm">System configuration options</p>
            </div>
            
            <div className="border border-cyan-400 p-6 hover:bg-cyan-400 hover:bg-opacity-10 transition-all cursor-pointer">
              <h3 className="text-lg mb-2">SECURITY</h3>
              <p className="text-gray-400 text-sm">Security monitoring and controls</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
