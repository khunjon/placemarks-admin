'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PlaceManagementPage() {
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

  const mockPlaces = [
    { id: 1, name: 'BLUE BOTTLE COFFEE', category: 'COFFEE', location: 'SAN FRANCISCO, CA', status: 'VERIFIED', added: '2024-01-15' },
    { id: 2, name: 'GOLDEN GATE PARK', category: 'PARK', location: 'SAN FRANCISCO, CA', status: 'VERIFIED', added: '2024-01-18' },
    { id: 3, name: 'TARTINE BAKERY', category: 'RESTAURANT', location: 'SAN FRANCISCO, CA', status: 'PENDING', added: '2024-02-01' },
    { id: 4, name: 'MUIR WOODS', category: 'NATURE', location: 'MILL VALLEY, CA', status: 'VERIFIED', added: '2024-02-05' },
    { id: 5, name: 'ALCATRAZ ISLAND', category: 'ATTRACTION', location: 'SAN FRANCISCO, CA', status: 'VERIFIED', added: '2024-02-10' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center">
          <button onClick={goBack} className="text-cyan mr-4 transition">&lt; BACK</button>
          <h1 className="text-xl">PLACE MANAGEMENT</h1>
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
              <h2 className="text-2xl mb-2">PLACES DATABASE</h2>
              <p className="text-gray">Add, edit, and manage individual places</p>
            </div>
            <div className="flex gap-4">
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                IMPORT PLACES
              </button>
              <button className="btn" style={{width: 'auto', padding: '0.75rem 1.5rem'}}>
                ADD NEW PLACE
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <h3>TOTAL PLACES</h3>
              <div className="text-2xl text-cyan mt-2">1,247</div>
            </div>
            <div className="card">
              <h3>VERIFIED</h3>
              <div className="text-2xl text-cyan mt-2">1,156</div>
            </div>
            <div className="card">
              <h3>PENDING</h3>
              <div className="text-2xl text-cyan mt-2">91</div>
            </div>
            <div className="card">
              <h3>CATEGORIES</h3>
              <div className="text-2xl text-cyan mt-2">24</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="SEARCH PLACES..." 
                className="form-input"
              />
              <select className="form-input">
                <option>ALL CATEGORIES</option>
                <option>RESTAURANT</option>
                <option>COFFEE</option>
                <option>PARK</option>
                <option>ATTRACTION</option>
              </select>
              <select className="form-input">
                <option>ALL STATUS</option>
                <option>VERIFIED</option>
                <option>PENDING</option>
                <option>REJECTED</option>
              </select>
            </div>
          </div>

          {/* Places Table */}
          <div className="border-cyan" style={{border: '1px solid #00ffff', padding: '1rem'}}>
            <div className="mb-4">
              <h3 className="text-lg mb-2">RECENT PLACES</h3>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 mb-4 pb-2 border-b" style={{borderBottomColor: '#333'}}>
              <div className="text-cyan text-sm">NAME</div>
              <div className="text-cyan text-sm">CATEGORY</div>
              <div className="text-cyan text-sm">LOCATION</div>
              <div className="text-cyan text-sm">STATUS</div>
              <div className="text-cyan text-sm">ADDED</div>
              <div className="text-cyan text-sm">ACTIONS</div>
            </div>

            {/* Table Rows */}
            {mockPlaces.map(place => (
              <div key={place.id} className="grid grid-cols-6 gap-4 py-3 border-b transition" style={{borderBottomColor: '#222'}}>
                <div className="text-white">{place.name}</div>
                <div className="text-gray">{place.category}</div>
                <div className="text-gray">{place.location}</div>
                <div className={`text-sm ${place.status === 'VERIFIED' ? 'text-cyan' : 'text-yellow'}`}>
                  {place.status}
                </div>
                <div className="text-gray">{place.added}</div>
                <div className="flex gap-2">
                  <button className="text-cyan text-sm transition">EDIT</button>
                  <button className="text-yellow text-sm transition">VIEW</button>
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