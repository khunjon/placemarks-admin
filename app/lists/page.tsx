'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ListManagementPage() {
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

  const mockLists = [
    { id: 1, name: 'FAVORITE RESTAURANTS', places: 24, created: '2024-01-15', status: 'ACTIVE' },
    { id: 2, name: 'TRAVEL DESTINATIONS', places: 67, created: '2024-01-20', status: 'ACTIVE' },
    { id: 3, name: 'COFFEE SHOPS', places: 15, created: '2024-02-01', status: 'ACTIVE' },
    { id: 4, name: 'HIKING TRAILS', places: 32, created: '2024-02-10', status: 'DRAFT' },
    { id: 5, name: 'MUSEUMS', places: 8, created: '2024-02-15', status: 'ARCHIVED' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-4 transition">&lt; BACK</button>
          <h1 className="text-xl">LIST MANAGEMENT</h1>
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
              <h2 className="text-2xl mb-2">PLACEMARK LISTS</h2>
              <p className="text-gray">Manage and organize placemark collections</p>
            </div>
            <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
              CREATE NEW LIST
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <h3>TOTAL LISTS</h3>
              <div className="text-2xl text-cyan mt-2">5</div>
            </div>
            <div className="card">
              <h3>ACTIVE LISTS</h3>
              <div className="text-2xl text-cyan mt-2">3</div>
            </div>
            <div className="card">
              <h3>TOTAL PLACES</h3>
              <div className="text-2xl text-cyan mt-2">146</div>
            </div>
            <div className="card">
              <h3>DRAFT LISTS</h3>
              <div className="text-2xl text-cyan mt-2">1</div>
            </div>
          </div>

          {/* Lists Table */}
          <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">ACTIVE LISTS</h3>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 mb-4 pb-2 border-b" style={{borderBottomColor: '#333'}}>
              <div className="text-cyan text-sm">NAME</div>
              <div className="text-cyan text-sm">PLACES</div>
              <div className="text-cyan text-sm">CREATED</div>
              <div className="text-cyan text-sm">STATUS</div>
              <div className="text-cyan text-sm">ACTIONS</div>
            </div>

            {/* Table Rows */}
            {mockLists.map(list => (
              <div key={list.id} className="grid grid-cols-5 gap-4 py-3 border-b transition" style={{borderBottomColor: '#222'}}>
                <div className="text-white">{list.name}</div>
                <div className="text-gray">{list.places}</div>
                <div className="text-gray">{list.created}</div>
                <div className={`text-sm ${list.status === 'ACTIVE' ? 'text-cyan' : list.status === 'DRAFT' ? 'text-yellow' : 'text-gray'}`}>
                  {list.status}
                </div>
                <div className="flex gap-2">
                  <button className="text-cyan text-sm transition">EDIT</button>
                  <button className="text-red text-sm transition">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 