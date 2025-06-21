'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Place {
  id: number
  name: string
  category: string
  address: string
  googlePlaceId: string
  defaultPhoto: string
  lastRefreshed: string
  thumbsUp: number
  thumbsDown: number
  notes: string
  phoneNumber: string
  website: string
}

export default function PlaceManagementPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
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

  // Mock data for places from Google cache
  const mockPlaces = [
    { 
      id: 1, 
      name: 'Blue Bottle Coffee', 
      category: 'Coffee Shop',
      address: '66 Mint St, San Francisco, CA 94103',
      googlePlaceId: 'ChIJd8BlQ2B-j4ARsJNl3j5KhN8',
      defaultPhoto: 'https://example.com/bluebottle.jpg',
      lastRefreshed: '2024-01-15 14:32',
      thumbsUp: 847,
      thumbsDown: 23,
      notes: 'Popular third-wave coffee chain. High quality beans.',
      phoneNumber: '+1 415-495-3394',
      website: 'https://bluebottlecoffee.com'
    },
    { 
      id: 2, 
      name: 'Golden Gate Park', 
      category: 'Park',
      address: 'Golden Gate Park, San Francisco, CA',
      googlePlaceId: 'ChIJVVVVVVV-j4ARsJNl3j5KhN8',
      defaultPhoto: 'https://example.com/ggpark.jpg',
      lastRefreshed: '2024-01-18 09:15',
      thumbsUp: 1247,
      thumbsDown: 45,
      notes: 'Large urban park with multiple attractions and gardens.',
      phoneNumber: '+1 415-831-2700',
      website: 'https://sfrecpark.org'
    },
    { 
      id: 3, 
      name: 'Tartine Bakery', 
      category: 'Bakery',
      address: '600 Guerrero St, San Francisco, CA 94110',
      googlePlaceId: 'ChIJXXXXXXX-j4ARsJNl3j5KhN8',
      defaultPhoto: 'https://example.com/tartine.jpg',
      lastRefreshed: '2024-02-01 16:45',
      thumbsUp: 623,
      thumbsDown: 87,
      notes: 'Renowned bakery and cafe. Often crowded on weekends.',
      phoneNumber: '+1 415-487-2600',
      website: 'https://tartinebakery.com'
    },
    { 
      id: 4, 
      name: 'Muir Woods National Monument', 
      category: 'National Park',
      address: 'Mill Valley, CA 94941',
      googlePlaceId: 'ChIJYYYYYYY-j4ARsJNl3j5KhN8',
      defaultPhoto: 'https://example.com/muirwoods.jpg',
      lastRefreshed: '2024-02-05 11:20',
      thumbsUp: 1534,
      thumbsDown: 12,
      notes: 'Ancient redwood forest. Requires advance reservations.',
      phoneNumber: '+1 415-388-2595',
      website: 'https://www.nps.gov/muwo'
    },
    { 
      id: 5, 
      name: 'Alcatraz Island', 
      category: 'Tourist Attraction',
      address: 'Alcatraz Island, San Francisco, CA 94133',
      googlePlaceId: 'ChIJZZZZZZZ-j4ARsJNl3j5KhN8',
      defaultPhoto: 'https://example.com/alcatraz.jpg',
      lastRefreshed: '2024-02-10 13:55',
      thumbsUp: 892,
      thumbsDown: 156,
      notes: 'Historic former federal prison. Ferry tickets required.',
      phoneNumber: '+1 415-561-4900',
      website: 'https://www.alcatrazcruises.com'
    }
  ]

  const dashboardStyles = {
    metricsCard: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px'
    },
    metricsTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginTop: '16px'
    },
    tableHeader: {
      backgroundColor: '#2a2a2a',
      color: '#00ffff',
      padding: '12px 16px',
      textAlign: 'left' as const,
      fontSize: '14px',
      fontWeight: '600',
      borderBottom: '1px solid #444'
    },
    tableCell: {
      padding: '12px 16px',
      borderBottom: '1px solid #333',
      color: '#fff',
      fontSize: '14px'
    },
    metricValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#00ffff',
      marginBottom: '8px'
    },
    metricLabel: {
      fontSize: '14px',
      color: '#999',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    chartContainer: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px'
    },
    input: {
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '4px',
      padding: '12px 16px',
      color: '#fff',
      fontSize: '14px',
      width: '100%'
    },
    textarea: {
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '4px',
      padding: '12px 16px',
      color: '#fff',
      fontSize: '14px',
      width: '100%',
      minHeight: '80px',
      resize: 'vertical' as const
    },
    button: {
      backgroundColor: '#00ffff',
      color: '#000',
      border: 'none',
      borderRadius: '4px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: '#00ffff',
      border: '1px solid #00ffff',
      borderRadius: '4px',
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '32px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  }

  const filteredPlaces = mockPlaces
    .filter(place => 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.thumbsUp - a.thumbsUp) // Sort by most thumbs up votes first

  const handleRefreshPlace = (placeId: number) => {
    console.log(`Refreshing data for place ${placeId}`)
    // Handle refresh logic here
  }

  const handleEditPlace = (place: Place) => {
    setEditingPlace({...place})
    setShowEditModal(true)
  }

  const handleSavePlace = () => {
    console.log('Saving place:', editingPlace)
    setShowEditModal(false)
    setEditingPlace(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center">
          <button 
            onClick={goBack} 
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #00ffff',
              color: '#00ffff',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              marginRight: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ffff'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.color = '#00ffff'
            }}
          >
            ← BACK
          </button>
          <h1 className="text-2xl font-medium">Place Management</h1>
          <div className="cursor ml-3"></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.color = '#ef4444'
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px', maxWidth: 'none', margin: '0' }}>
        
                 {/* Overview Cards */}
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Total Places</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>8,492</div>
             <div style={{ fontSize: '14px', color: '#10b981' }}>
               +67 <span style={{ color: '#666', marginLeft: '8px' }}>this week</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Category Breakdown</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
               <div>
                 <div style={{ fontSize: '18px', fontWeight: '600', color: '#00ffff' }}>2,456</div>
                 <div style={{ fontSize: '12px', color: '#999' }}>Restaurants</div>
               </div>
               <div>
                 <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>1,834</div>
                 <div style={{ fontSize: '12px', color: '#999' }}>Coffee Shops</div>
               </div>
               <div>
                 <div style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b' }}>1,245</div>
                 <div style={{ fontSize: '12px', color: '#999' }}>Parks</div>
               </div>
               <div>
                 <div style={{ fontSize: '18px', fontWeight: '600', color: '#8b5cf6' }}>987</div>
                 <div style={{ fontSize: '12px', color: '#999' }}>Shopping</div>
               </div>
               <div>
                 <div style={{ fontSize: '18px', fontWeight: '600', color: '#ef4444' }}>743</div>
                 <div style={{ fontSize: '12px', color: '#999' }}>Attractions</div>
               </div>
               <div>
                 <div style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280' }}>1,227</div>
                 <div style={{ fontSize: '12px', color: '#999' }}>Other</div>
               </div>
             </div>
           </div>
         </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search places by name, address, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={dashboardStyles.input}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Search through Google cached places data
            </div>
          </div>
        </div>

        {/* Places Management Section */}
        <div style={dashboardStyles.chartContainer}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            Google Cached Places ({filteredPlaces.length})
          </h3>
          <table style={dashboardStyles.metricsTable}>
            <thead>
              <tr>
                <th style={dashboardStyles.tableHeader}>Place Details</th>
                <th style={dashboardStyles.tableHeader}>Category</th>
                <th style={dashboardStyles.tableHeader}>👍 Votes</th>
                <th style={dashboardStyles.tableHeader}>Last Refreshed</th>
                <th style={dashboardStyles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlaces.map((place) => (
                <tr key={place.id}>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: '#333', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        IMG
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{place.name}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{place.address}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>ID: {place.googlePlaceId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>{place.category}</td>
                  <td style={dashboardStyles.tableCell}>
                    <div>
                      <div style={{ color: '#10b981', fontWeight: '600' }}>👍 {place.thumbsUp}</div>
                      <div style={{ fontSize: '12px', color: '#ef4444' }}>👎 {place.thumbsDown}</div>
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontSize: '12px' }}>{place.lastRefreshed}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedPlace(place)}
                        style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => handleEditPlace(place)}
                        style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleRefreshPlace(place.id)}
                        style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#10b981', borderColor: '#10b981' }}
                      >
                        REFRESH
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                {selectedPlace.name}
              </h2>
              <button
                onClick={() => setSelectedPlace(null)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Category</div>
                  <div style={{ color: '#fff' }}>{selectedPlace.category}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>User Votes</div>
                  <div style={{ color: '#fff' }}>
                    <span style={{ color: '#10b981' }}>👍 {selectedPlace.thumbsUp}</span>
                    <span style={{ color: '#ef4444', marginLeft: '16px' }}>👎 {selectedPlace.thumbsDown}</span>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Last Refreshed</div>
                  <div style={{ color: '#fff' }}>{selectedPlace.lastRefreshed}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Address</div>
                <div style={{ color: '#fff' }}>{selectedPlace.address}</div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Google Place ID</div>
                <div style={{ color: '#00ffff', fontSize: '14px', fontFamily: 'monospace' }}>{selectedPlace.googlePlaceId}</div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Contact</div>
                <div style={{ color: '#fff' }}>
                  <div>{selectedPlace.phoneNumber}</div>
                  <div style={{ color: '#00ffff' }}>{selectedPlace.website}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Admin Notes</div>
                <div style={{ color: '#fff', backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '4px' }}>
                  {selectedPlace.notes || 'No notes added'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Place Modal */}
      {showEditModal && editingPlace && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
              Edit Place: {editingPlace.name}
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Default Photo URL
                </label>
                <input
                  type="text"
                  value={editingPlace.defaultPhoto || ''}
                  onChange={(e) => setEditingPlace({...editingPlace, defaultPhoto: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter new default photo URL..."
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  This will override the Google-provided photo
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Admin Notes
                </label>
                <textarea
                  value={editingPlace.notes || ''}
                  onChange={(e) => setEditingPlace({...editingPlace, notes: e.target.value})}
                  style={dashboardStyles.textarea}
                  placeholder="Add internal notes about this place..."
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Internal notes for admin use only
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Google Place ID
                  </label>
                  <input
                    type="text"
                    value={editingPlace.googlePlaceId}
                    style={{ ...dashboardStyles.input, backgroundColor: '#333', color: '#999' }}
                    disabled
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Last Refreshed
                  </label>
                  <input
                    type="text"
                    value={editingPlace.lastRefreshed}
                    style={{ ...dashboardStyles.input, backgroundColor: '#333', color: '#999' }}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'space-between' }}>
              <button
                onClick={() => handleRefreshPlace(editingPlace.id)}
                style={{ ...dashboardStyles.buttonSecondary, backgroundColor: '#10b981', color: '#000', borderColor: '#10b981' }}
              >
                FORCE REFRESH DATA
              </button>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{ ...dashboardStyles.buttonSecondary, backgroundColor: 'transparent' }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSavePlace}
                  style={dashboardStyles.button}
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 