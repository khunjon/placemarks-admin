'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DatabasePage() {
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

  const mockTables = [
    { name: 'users', records: 2847, size: '45.2 MB', lastUpdated: '2024-02-20 14:32' },
    { name: 'places', records: 1247, size: '23.8 MB', lastUpdated: '2024-02-20 14:28' },
    { name: 'lists', records: 156, size: '2.1 MB', lastUpdated: '2024-02-20 13:45' },
    { name: 'categories', records: 24, size: '0.3 MB', lastUpdated: '2024-02-15 09:12' },
    { name: 'audit_logs', records: 15623, size: '89.4 MB', lastUpdated: '2024-02-20 14:35' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-4 transition">&lt; BACK</button>
          <h1 className="text-xl">DATABASE ADMINISTRATION</h1>
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
              <h2 className="text-2xl mb-2">DATABASE CONSOLE</h2>
              <p className="text-gray">Monitor and manage database operations</p>
            </div>
            <div className="flex gap-4">
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                BACKUP DATABASE
              </button>
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                SQL CONSOLE
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <h3>CONNECTION STATUS</h3>
              <div className="text-cyan mt-2">● CONNECTED</div>
            </div>
            <div className="card">
              <h3>DATABASE SIZE</h3>
              <div className="text-2xl text-cyan mt-2">160.8 MB</div>
            </div>
            <div className="card">
              <h3>ACTIVE CONNECTIONS</h3>
              <div className="text-2xl text-cyan mt-2">12</div>
            </div>
            <div className="card">
              <h3>QUERY RESPONSE</h3>
              <div className="text-2xl text-cyan mt-2">23ms</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3>MAINTENANCE</h3>
              <p className="mb-4">Database maintenance operations</p>
              <div className="space-y-2">
                <button className="text-cyan text-sm transition block">OPTIMIZE TABLES</button>
                <button className="text-cyan text-sm transition block">REBUILD INDEXES</button>
                <button className="text-cyan text-sm transition block">ANALYZE PERFORMANCE</button>
              </div>
            </div>
            
            <div className="card">
              <h3>BACKUP & RESTORE</h3>
              <p className="mb-4">Data backup and recovery</p>
              <div className="space-y-2">
                <button className="text-cyan text-sm transition block">CREATE BACKUP</button>
                <button className="text-cyan text-sm transition block">RESTORE FROM BACKUP</button>
                <button className="text-cyan text-sm transition block">SCHEDULE BACKUP</button>
              </div>
            </div>
            
            <div className="card">
              <h3>MONITORING</h3>
              <p className="mb-4">Database monitoring tools</p>
              <div className="space-y-2">
                <button className="text-cyan text-sm transition block">QUERY LOGS</button>
                <button className="text-cyan text-sm transition block">PERFORMANCE METRICS</button>
                <button className="text-cyan text-sm transition block">CONNECTION POOL</button>
              </div>
            </div>
          </div>

          {/* Tables Overview */}
          <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">DATABASE TABLES</h3>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 mb-4 pb-2 border-b" style={{borderBottomColor: '#333'}}>
              <div className="text-cyan text-sm">TABLE NAME</div>
              <div className="text-cyan text-sm">RECORDS</div>
              <div className="text-cyan text-sm">SIZE</div>
              <div className="text-cyan text-sm">LAST UPDATED</div>
              <div className="text-cyan text-sm">ACTIONS</div>
            </div>

            {/* Table Rows */}
            {mockTables.map((table, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 py-3 border-b transition" style={{borderBottomColor: '#222'}}>
                <div className="text-white">{table.name}</div>
                <div className="text-gray">{table.records.toLocaleString()}</div>
                <div className="text-gray">{table.size}</div>
                <div className="text-gray">{table.lastUpdated}</div>
                <div className="flex gap-2">
                  <button className="text-cyan text-sm transition">BROWSE</button>
                  <button className="text-yellow text-sm transition">STRUCTURE</button>
                  <button className="text-gray text-sm transition">EXPORT</button>
                </div>
              </div>
            ))}
          </div>

          {/* SQL Console */}
          <div className="mt-8 border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">QUICK SQL CONSOLE</h3>
            </div>
            <textarea 
              className="w-full bg-black border-cyan text-white p-4 text-sm font-mono"
              style={{border: '1px solid #00ffff', minHeight: '120px'}}
              placeholder="SELECT * FROM users WHERE status = 'ACTIVE' LIMIT 10;"
            />
            <div className="mt-4 flex gap-4">
              <button className="btn" style={{width: 'auto', padding: '0.5rem 1rem'}}>
                EXECUTE QUERY
              </button>
              <button className="text-gray text-sm transition">CLEAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 