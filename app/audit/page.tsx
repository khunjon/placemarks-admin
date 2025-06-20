'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuditPage() {
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

  const mockAuditLogs = [
    { 
      id: 1, 
      timestamp: '2024-02-20 14:35:22', 
      user: 'admin@placemarks.xyz', 
      action: 'USER_LOGIN', 
      resource: 'AUTHENTICATION', 
      ip: '192.168.1.100',
      status: 'SUCCESS' 
    },
    { 
      id: 2, 
      timestamp: '2024-02-20 14:32:15', 
      user: 'jane.smith@example.com', 
      action: 'PLACE_CREATED', 
      resource: 'PLACES', 
      ip: '10.0.0.45',
      status: 'SUCCESS' 
    },
    { 
      id: 3, 
      timestamp: '2024-02-20 14:28:03', 
      user: 'unknown', 
      action: 'LOGIN_ATTEMPT', 
      resource: 'AUTHENTICATION', 
      ip: '203.0.113.42',
      status: 'FAILED' 
    },
    { 
      id: 4, 
      timestamp: '2024-02-20 14:25:18', 
      user: 'john.doe@example.com', 
      action: 'LIST_DELETED', 
      resource: 'LISTS', 
      ip: '192.168.1.105',
      status: 'SUCCESS' 
    },
    { 
      id: 5, 
      timestamp: '2024-02-20 14:20:45', 
      user: 'admin@placemarks.xyz', 
      action: 'USER_SUSPENDED', 
      resource: 'USERS', 
      ip: '192.168.1.100',
      status: 'SUCCESS' 
    }
  ]

  const securityAlerts = [
    { type: 'HIGH', message: 'Multiple failed login attempts from IP 203.0.113.42', time: '14:28' },
    { type: 'MEDIUM', message: 'Unusual API request pattern detected', time: '13:45' },
    { type: 'LOW', message: 'Database backup completed successfully', time: '12:00' },
    { type: 'MEDIUM', message: 'New admin user created', time: '11:30' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-4 transition">&lt; BACK</button>
          <h1 className="text-xl">AUDIT & SECURITY</h1>
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
              <h2 className="text-2xl mb-2">SECURITY MONITORING</h2>
              <p className="text-gray">Monitor system security and audit trails</p>
            </div>
            <div className="flex gap-4">
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                EXPORT LOGS
              </button>
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                SECURITY SCAN
              </button>
            </div>
          </div>

          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <h3>SECURITY STATUS</h3>
              <div className="text-cyan mt-2">● SECURE</div>
            </div>
            <div className="card">
              <h3>FAILED LOGINS</h3>
              <div className="text-2xl text-red mt-2">3</div>
              <div className="text-sm text-gray mt-1">Last 24 hours</div>
            </div>
            <div className="card">
              <h3>ACTIVE SESSIONS</h3>
              <div className="text-2xl text-cyan mt-2">47</div>
              <div className="text-sm text-gray mt-1">Currently online</div>
            </div>
            <div className="card">
              <h3>AUDIT ENTRIES</h3>
              <div className="text-2xl text-cyan mt-2">15,623</div>
              <div className="text-sm text-gray mt-1">Total recorded</div>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
              <h3 className="text-lg mb-4">RECENT SECURITY ALERTS</h3>
              <div className="space-y-3">
                {securityAlerts.map((alert, index) => (
                  <div key={index} className="border-b pb-3" style={{borderBottomColor: '#222'}}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs px-2 py-1 ${
                        alert.type === 'HIGH' ? 'bg-red text-black' : 
                        alert.type === 'MEDIUM' ? 'bg-yellow text-black' : 
                        'bg-gray text-white'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-gray">{alert.time}</span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
              <h3 className="text-lg mb-4">SYSTEM HEALTH</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Authentication System</span>
                    <span className="text-cyan">ONLINE</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div className="bg-cyan h-2 w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Database Security</span>
                    <span className="text-cyan">SECURE</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div className="bg-cyan h-2 w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Rate Limiting</span>
                    <span className="text-cyan">ACTIVE</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div className="bg-cyan h-2 w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Firewall Status</span>
                    <span className="text-cyan">PROTECTED</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div className="bg-cyan h-2 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="text" 
                placeholder="SEARCH LOGS..." 
                className="form-input"
              />
              <select className="form-input">
                <option>ALL ACTIONS</option>
                <option>USER_LOGIN</option>
                <option>USER_LOGOUT</option>
                <option>PLACE_CREATED</option>
                <option>PLACE_DELETED</option>
                <option>LIST_CREATED</option>
                <option>LIST_DELETED</option>
              </select>
              <select className="form-input">
                <option>ALL STATUS</option>
                <option>SUCCESS</option>
                <option>FAILED</option>
                <option>WARNING</option>
              </select>
              <select className="form-input">
                <option>LAST 24 HOURS</option>
                <option>LAST 7 DAYS</option>
                <option>LAST 30 DAYS</option>
                <option>CUSTOM RANGE</option>
              </select>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">AUDIT LOG ENTRIES</h3>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 mb-4 pb-2 border-b" style={{borderBottomColor: '#333'}}>
              <div className="text-cyan text-sm">TIMESTAMP</div>
              <div className="text-cyan text-sm">USER</div>
              <div className="text-cyan text-sm">ACTION</div>
              <div className="text-cyan text-sm">RESOURCE</div>
              <div className="text-cyan text-sm">IP ADDRESS</div>
              <div className="text-cyan text-sm">STATUS</div>
              <div className="text-cyan text-sm">DETAILS</div>
            </div>

            {/* Table Rows */}
            {mockAuditLogs.map(log => (
              <div key={log.id} className="grid grid-cols-7 gap-4 py-3 border-b transition" style={{borderBottomColor: '#222'}}>
                <div className="text-gray text-sm">{log.timestamp}</div>
                <div className="text-white text-sm">{log.user}</div>
                <div className="text-gray text-sm">{log.action}</div>
                <div className="text-gray text-sm">{log.resource}</div>
                <div className="text-gray text-sm">{log.ip}</div>
                <div className={`text-sm ${log.status === 'SUCCESS' ? 'text-cyan' : 'text-red'}`}>
                  {log.status}
                </div>
                <div>
                  <button className="text-cyan text-sm transition">VIEW</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 