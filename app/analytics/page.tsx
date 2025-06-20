'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyticsPage() {
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

  const goBack = () => {
    router.push('/')
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

  const mockMetrics = [
    { period: 'TODAY', users: 234, places: 45, lists: 12 },
    { period: 'YESTERDAY', users: 198, places: 38, lists: 8 },
    { period: 'THIS WEEK', users: 1456, places: 287, lists: 67 },
    { period: 'LAST WEEK', users: 1289, places: 245, lists: 54 },
    { period: 'THIS MONTH', users: 5847, places: 1124, lists: 234 }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-4 transition">&lt; BACK</button>
          <h1 className="text-xl">ANALYTICS DASHBOARD</h1>
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
        <div className="max-w-6xl mx-auto">
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl mb-2">SYSTEM ANALYTICS</h2>
              <p className="text-gray">Monitor usage patterns and performance metrics</p>
            </div>
            <div className="flex gap-4">
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                EXPORT REPORT
              </button>
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                CUSTOM QUERY
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <h3>DAILY ACTIVE USERS</h3>
              <div className="text-2xl text-cyan mt-2">234</div>
              <div className="text-sm text-gray mt-1">+18% from yesterday</div>
            </div>
            <div className="card">
              <h3>NEW PLACES TODAY</h3>
              <div className="text-2xl text-cyan mt-2">45</div>
              <div className="text-sm text-gray mt-1">+12% from yesterday</div>
            </div>
            <div className="card">
              <h3>LISTS CREATED</h3>
              <div className="text-2xl text-cyan mt-2">12</div>
              <div className="text-sm text-gray mt-1">+25% from yesterday</div>
            </div>
            <div className="card">
              <h3>API REQUESTS</h3>
              <div className="text-2xl text-cyan mt-2">8,942</div>
              <div className="text-sm text-gray mt-1">+5% from yesterday</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
              <h3 className="text-lg mb-4">USER ACTIVITY TREND</h3>
              <div className="h-48 flex items-end justify-between px-4">
                {[65, 45, 78, 52, 89, 67, 94].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-cyan w-8 transition-all"
                      style={{height: `${height}%`}}
                    ></div>
                    <div className="text-xs text-gray mt-2">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
              <h3 className="text-lg mb-4">PLACE CATEGORIES</h3>
              <div className="space-y-3">
                {[
                  { name: 'RESTAURANTS', count: 456, percentage: 65 },
                  { name: 'COFFEE SHOPS', count: 234, percentage: 45 },
                  { name: 'PARKS', count: 189, percentage: 35 },
                  { name: 'MUSEUMS', count: 123, percentage: 25 },
                  { name: 'SHOPPING', count: 98, percentage: 20 }
                ].map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span className="text-cyan">{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2">
                      <div 
                        className="bg-cyan h-2 transition-all"
                        style={{width: `${category.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3>RESPONSE TIMES</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Average</span>
                  <span className="text-cyan">23ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Database</span>
                  <span className="text-cyan">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Page Load</span>
                  <span className="text-cyan">1.2s</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>ERROR RATES</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">4xx Errors</span>
                  <span className="text-yellow">0.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">5xx Errors</span>
                  <span className="text-red">0.01%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="text-cyan">99.9%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>STORAGE USAGE</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Database</span>
                  <span className="text-cyan">160.8 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Images</span>
                  <span className="text-cyan">2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Backups</span>
                  <span className="text-cyan">890 MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">RECENT ACTIVITY</h3>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b" style={{borderBottomColor: '#333'}}>
              <div className="text-cyan text-sm">TIME PERIOD</div>
              <div className="text-cyan text-sm">ACTIVE USERS</div>
              <div className="text-cyan text-sm">NEW PLACES</div>
              <div className="text-cyan text-sm">LISTS CREATED</div>
            </div>

            {/* Table Rows */}
            {mockMetrics.map((metric, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b transition" style={{borderBottomColor: '#222'}}>
                <div className="text-white">{metric.period}</div>
                <div className="text-gray">{metric.users.toLocaleString()}</div>
                <div className="text-gray">{metric.places}</div>
                <div className="text-gray">{metric.lists}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 