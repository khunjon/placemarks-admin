'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('')
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

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm">Loading...</div>
          <div className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="p-4 border-b border-green-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-green-500 text-sm">admin@placemarks:~/dashboard$</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            [EXIT]
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* System Info */}
        <div className="mb-8">
          <div className="text-green-500 text-sm mb-4">
            {'>'} PLACEMARKS ADMIN DASHBOARD
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-green-900 p-3">
              <div className="text-green-500 mb-1">SYSTEM STATUS</div>
              <div className="text-green-400">● ONLINE</div>
              <div className="text-green-700">Uptime: 99.7%</div>
            </div>
            <div className="border border-green-900 p-3">
              <div className="text-green-500 mb-1">ACTIVE SESSIONS</div>
              <div className="text-green-400">1 USER</div>
              <div className="text-green-700">Last: {currentTime}</div>
            </div>
            <div className="border border-green-900 p-3">
              <div className="text-green-500 mb-1">DATABASE</div>
              <div className="text-green-400">● CONNECTED</div>
              <div className="text-green-700">Latency: 12ms</div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="mb-8">
          <div className="text-green-500 text-sm mb-4">
            {'>'} Available commands:
          </div>
          <div className="space-y-2 text-sm">
            <div className="hover:bg-green-900 hover:bg-opacity-20 p-2 cursor-pointer transition-colors">
              [1] manage_users - User administration
            </div>
            <div className="hover:bg-green-900 hover:bg-opacity-20 p-2 cursor-pointer transition-colors">
              [2] view_analytics - System analytics
            </div>
            <div className="hover:bg-green-900 hover:bg-opacity-20 p-2 cursor-pointer transition-colors">
              [3] database_admin - Database management
            </div>
            <div className="hover:bg-green-900 hover:bg-opacity-20 p-2 cursor-pointer transition-colors">
              [4] system_logs - View system logs
            </div>
            <div className="hover:bg-green-900 hover:bg-opacity-20 p-2 cursor-pointer transition-colors">
              [5] settings - System configuration
            </div>
          </div>
        </div>

        {/* Terminal Input */}
        <div className="border-t border-green-900 pt-4">
          <div className="flex items-center">
            <span className="text-green-500 text-sm mr-2">admin@placemarks:~$</span>
            <div className="flex-1 bg-black border border-green-900 px-3 py-2 text-sm">
              <span className="text-green-700">Type 'help' for available commands</span>
              <div className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-green-900 bg-black">
        <div className="text-xs text-green-700 text-center">
          PLACEMARKS ADMIN v2.1.4 | Secure Terminal Interface | {currentTime}
        </div>
      </div>
    </div>
  )
}
