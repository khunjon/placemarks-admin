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
          {/* USER ANALYTICS */}
          <div className="mb-12">
            <h2 className="text-2xl mb-6 text-cyan">USER ANALYTICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <h3>TOTAL USERS</h3>
                <div className="text-2xl text-cyan mt-2">12,847</div>
                <div className="text-sm text-gray mt-1">All registered users</div>
              </div>
              <div className="card">
                <h3>NEW USERS LAST 24H</h3>
                <div className="text-2xl text-cyan mt-2">34</div>
                <div className="text-sm text-gray mt-1">+18% from previous day</div>
              </div>
              <div className="card">
                <h3>ACTIVE USERS TODAY</h3>
                <div className="text-2xl text-cyan mt-2">234</div>
                <div className="text-sm text-gray mt-1">Daily active users</div>
              </div>
              <div className="card">
                <h3>MONTHLY ACTIVE USERS</h3>
                <div className="text-2xl text-cyan mt-2">5,847</div>
                <div className="text-sm text-gray mt-1">+12% from last month</div>
              </div>
            </div>
          </div>

          {/* PLACE ANALYTICS */}
          <div className="mb-12">
            <h2 className="text-2xl mb-6 text-cyan">PLACE ANALYTICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <h3>TOTAL PLACES</h3>
                <div className="text-2xl text-cyan mt-2">8,492</div>
                <div className="text-sm text-gray mt-1">All places in database</div>
              </div>
              <div className="card">
                <h3>NEW PLACES LAST 24H</h3>
                <div className="text-2xl text-cyan mt-2">45</div>
                <div className="text-sm text-gray mt-1">+12% from previous day</div>
              </div>
              <div className="card">
                <h3>VERIFIED PLACES</h3>
                <div className="text-2xl text-cyan mt-2">7,234</div>
                <div className="text-sm text-gray mt-1">85% verification rate</div>
              </div>
              <div className="card">
                <h3>TOP CATEGORY</h3>
                <div className="text-2xl text-cyan mt-2">RESTAURANTS</div>
                <div className="text-sm text-gray mt-1">2,456 places (29%)</div>
              </div>
            </div>
          </div>

          {/* LIST ANALYTICS */}
          <div className="mb-12">
            <h2 className="text-2xl mb-6 text-cyan">LIST ANALYTICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <h3>TOTAL LISTS</h3>
                <div className="text-2xl text-cyan mt-2">1,847</div>
                <div className="text-sm text-gray mt-1">All user-created lists</div>
              </div>
              <div className="card">
                <h3>NEW LISTS LAST 24H</h3>
                <div className="text-2xl text-cyan mt-2">12</div>
                <div className="text-sm text-gray mt-1">+25% from previous day</div>
              </div>
              <div className="card">
                <h3>AVERAGE LIST SIZE</h3>
                <div className="text-2xl text-cyan mt-2">8.4</div>
                <div className="text-sm text-gray mt-1">Places per list</div>
              </div>
              <div className="card">
                <h3>MOST POPULAR LIST</h3>
                <div className="text-2xl text-cyan mt-2">COFFEE SPOTS</div>
                <div className="text-sm text-gray mt-1">347 followers</div>
              </div>
            </div>
          </div>

          {/* CHECKIN ANALYTICS */}
          <div className="mb-12">
            <h2 className="text-2xl mb-6 text-cyan">CHECKIN ANALYTICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card">
                <h3>TOTAL CHECKINS</h3>
                <div className="text-2xl text-cyan mt-2">45,892</div>
                <div className="text-sm text-gray mt-1">All time checkins</div>
              </div>
              <div className="card">
                <h3>CHECKINS LAST 24H</h3>
                <div className="text-2xl text-cyan mt-2">156</div>
                <div className="text-sm text-gray mt-1">+8% from previous day</div>
              </div>
              <div className="card">
                <h3>AVERAGE DAILY CHECKINS</h3>
                <div className="text-2xl text-cyan mt-2">127</div>
                <div className="text-sm text-gray mt-1">7-day average</div>
              </div>
              <div className="card">
                <h3>TOP CHECKIN LOCATION</h3>
                <div className="text-2xl text-cyan mt-2">CENTRAL PARK</div>
                <div className="text-sm text-gray mt-1">892 checkins this month</div>
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
        </div>
      </div>
    </div>
  )
} 