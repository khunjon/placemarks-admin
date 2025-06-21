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

  // Mock data for charts
  const userGrowthData = [
    { day: 'Mon', users: 1240, newUsers: 45 },
    { day: 'Tue', users: 1285, newUsers: 52 },
    { day: 'Wed', users: 1320, newUsers: 38 },
    { day: 'Thu', users: 1365, newUsers: 67 },
    { day: 'Fri', users: 1420, newUsers: 73 },
    { day: 'Sat', users: 1445, newUsers: 34 },
    { day: 'Sun', users: 1478, newUsers: 41 }
  ]

  const placesByCategory = [
    { category: 'Restaurants', count: 2456, percentage: 29 },
    { category: 'Coffee Shops', count: 1834, percentage: 22 },
    { category: 'Parks & Recreation', count: 1245, percentage: 15 },
    { category: 'Shopping', count: 987, percentage: 12 },
    { category: 'Museums & Culture', count: 743, percentage: 9 },
    { category: 'Hotels & Lodging', count: 612, percentage: 7 },
    { category: 'Other', count: 515, percentage: 6 }
  ]

  const recentActivity = [
    { time: '14:32', event: 'New user registration', user: 'user_8492', location: 'San Francisco, CA' },
    { time: '14:28', event: 'Place added', user: 'user_7341', location: 'Brooklyn, NY' },
    { time: '14:25', event: 'List created', user: 'user_9156', location: 'Austin, TX' },
    { time: '14:22', event: 'Check-in recorded', user: 'user_6789', location: 'Seattle, WA' },
    { time: '14:18', event: 'Place verified', user: 'admin_001', location: 'Portland, OR' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-6 hover:text-cyan-400 transition">&lt; BACK</button>
          <h1 className="text-2xl font-medium">Analytics Dashboard</h1>
          <div className="cursor ml-3"></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition"
          >
            EXIT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Users</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">12,847</div>
              <div className="flex items-center text-sm">
                <span className="text-green-500">+2.3%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Active Places</h3>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">8,492</div>
              <div className="flex items-center text-sm">
                <span className="text-blue-500">+5.7%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Check-ins Today</h3>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">1,247</div>
              <div className="flex items-center text-sm">
                <span className="text-yellow-500">+12.1%</span>
                <span className="text-gray-500 ml-2">vs yesterday</span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">System Health</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="flex items-center text-sm">
                <span className="text-green-500">Uptime</span>
                <span className="text-gray-500 ml-2">last 30 days</span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* User Growth Chart */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">User Growth (7 Days)</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                    <span className="text-gray-400">Total Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-400">New Users</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between px-4">
                {userGrowthData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full max-w-16 flex flex-col items-center">
                      <div className="relative w-8 flex flex-col items-center">
                        <div 
                          className="bg-cyan-500 w-full transition-all duration-500 ease-out rounded-t"
                          style={{height: `${(data.users / 1500) * 200}px`}}
                        ></div>
                        <div 
                          className="bg-green-500 w-4 transition-all duration-500 ease-out rounded-t absolute bottom-0"
                          style={{height: `${(data.newUsers / 80) * 60}px`}}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-3">{data.day}</div>
                      <div className="text-xs text-cyan-400 mt-1">{data.users}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-6">Real-time Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-800 last:border-b-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium">{activity.event}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.user}</div>
                      <div className="text-xs text-gray-500">{activity.location}</div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Place Categories */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-6">Places by Category</h3>
              <div className="space-y-4">
                {placesByCategory.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">{category.count.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">({category.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-700 ease-out rounded-full"
                        style={{width: `${category.percentage * 3}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Performance */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-6">System Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4">Response Times</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">API Average</span>
                      <span className="text-sm text-green-400 font-medium">23ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Database</span>
                      <span className="text-sm text-green-400 font-medium">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Page Load</span>
                      <span className="text-sm text-yellow-400 font-medium">1.2s</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-4">Error Rates</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">4xx Errors</span>
                      <span className="text-sm text-yellow-400 font-medium">0.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">5xx Errors</span>
                      <span className="text-sm text-red-400 font-medium">0.01%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Success Rate</span>
                      <span className="text-sm text-green-400 font-medium">99.79%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-4">Resource Usage</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">CPU Usage</span>
                      <span className="text-sm text-cyan-400 font-medium">34%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full">
                      <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{width: '34%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Memory Usage</span>
                      <span className="text-sm text-yellow-400 font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full">
                      <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{width: '67%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">Storage Usage</span>
                      <span className="text-sm text-green-400 font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{width: '23%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Key Metrics Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Analytics */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-6">User Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">New Users (24h)</span>
                  <span className="text-lg font-semibold text-green-400">+156</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Active Sessions</span>
                  <span className="text-lg font-semibold text-cyan-400">2,847</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Avg. Session Duration</span>
                  <span className="text-lg font-semibold text-white">8m 32s</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">User Retention (30d)</span>
                  <span className="text-lg font-semibold text-yellow-400">73.2%</span>
                </div>
              </div>
            </div>

            {/* Content Analytics */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-6">Content Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">New Places (24h)</span>
                  <span className="text-lg font-semibold text-blue-400">+67</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Lists Created (24h)</span>
                  <span className="text-lg font-semibold text-green-400">+23</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Verification Rate</span>
                  <span className="text-lg font-semibold text-cyan-400">94.7%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Avg. List Size</span>
                  <span className="text-lg font-semibold text-white">12.4</span>
                </div>
              </div>
            </div>

            {/* Engagement Analytics */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-6">Engagement Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Check-ins (24h)</span>
                  <span className="text-lg font-semibold text-yellow-400">+1,247</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Shares (24h)</span>
                  <span className="text-lg font-semibold text-green-400">+89</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Comments (24h)</span>
                  <span className="text-lg font-semibold text-blue-400">+234</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Engagement Rate</span>
                  <span className="text-lg font-semibold text-cyan-400">6.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 