'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UserManagementPage() {
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

  const mockUsers = [
    { id: 1, email: 'john.doe@example.com', name: 'JOHN DOE', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2024-02-20', lists: 12 },
    { id: 2, email: 'jane.smith@example.com', name: 'JANE SMITH', role: 'USER', status: 'ACTIVE', lastLogin: '2024-02-19', lists: 8 },
    { id: 3, email: 'mike.wilson@example.com', name: 'MIKE WILSON', role: 'USER', status: 'INACTIVE', lastLogin: '2024-01-15', lists: 3 },
    { id: 4, email: 'sarah.johnson@example.com', name: 'SARAH JOHNSON', role: 'MODERATOR', status: 'ACTIVE', lastLogin: '2024-02-20', lists: 15 },
    { id: 5, email: 'david.brown@example.com', name: 'DAVID BROWN', role: 'USER', status: 'SUSPENDED', lastLogin: '2024-02-10', lists: 5 }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-4 transition">&lt; BACK</button>
          <h1 className="text-xl">USER MANAGEMENT</h1>
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
              <h2 className="text-2xl mb-2">USER ACCOUNTS</h2>
              <p className="text-gray">Manage user accounts, roles, and permissions</p>
            </div>
            <div className="flex gap-4">
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                EXPORT USERS
              </button>
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                INVITE USER
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <h3>TOTAL USERS</h3>
              <div className="text-2xl text-cyan mt-2">2,847</div>
            </div>
            <div className="card">
              <h3>ACTIVE USERS</h3>
              <div className="text-2xl text-cyan mt-2">2,654</div>
            </div>
            <div className="card">
              <h3>NEW THIS MONTH</h3>
              <div className="text-2xl text-cyan mt-2">147</div>
            </div>
            <div className="card">
              <h3>SUSPENDED</h3>
              <div className="text-2xl text-cyan mt-2">23</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="SEARCH USERS..." 
                className="form-input"
              />
              <select className="form-input">
                <option>ALL ROLES</option>
                <option>ADMIN</option>
                <option>MODERATOR</option>
                <option>USER</option>
              </select>
              <select className="form-input">
                <option>ALL STATUS</option>
                <option>ACTIVE</option>
                <option>INACTIVE</option>
                <option>SUSPENDED</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">USER ACCOUNTS</h3>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 mb-4 pb-2 border-b" style={{borderBottomColor: '#333'}}>
              <div className="text-cyan text-sm">EMAIL</div>
              <div className="text-cyan text-sm">NAME</div>
              <div className="text-cyan text-sm">ROLE</div>
              <div className="text-cyan text-sm">STATUS</div>
              <div className="text-cyan text-sm">LAST LOGIN</div>
              <div className="text-cyan text-sm">LISTS</div>
              <div className="text-cyan text-sm">ACTIONS</div>
            </div>

            {/* Table Rows */}
            {mockUsers.map(user => (
              <div key={user.id} className="grid grid-cols-7 gap-4 py-3 border-b transition" style={{borderBottomColor: '#222'}}>
                <div className="text-white">{user.email}</div>
                <div className="text-gray">{user.name}</div>
                <div className={`text-sm ${user.role === 'ADMIN' ? 'text-cyan' : user.role === 'MODERATOR' ? 'text-yellow' : 'text-white'}`}>
                  {user.role}
                </div>
                <div className={`text-sm ${user.status === 'ACTIVE' ? 'text-cyan' : user.status === 'SUSPENDED' ? 'text-red' : 'text-gray'}`}>
                  {user.status}
                </div>
                <div className="text-gray">{user.lastLogin}</div>
                <div className="text-gray">{user.lists}</div>
                <div className="flex gap-2">
                  <button className="text-cyan text-sm transition">EDIT</button>
                  <button className="text-yellow text-sm transition">ROLES</button>
                  <button className="text-red text-sm transition">SUSPEND</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 