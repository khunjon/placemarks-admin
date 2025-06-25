'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { AutocompleteInput } from '@/components/ui/autocomplete-input'
import { PhotoReference } from '@/lib/utils/photo-utils'

interface Place {
  id: string
  name: string
  address: string
  google_place_id: string
  photo_references?: PhotoReference[]
  place_type?: string
  coordinates?: { x: number; y: number } | { lat: number; lng: number }
  created_at: string
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export default function PlaceManagementPage() {
  const { loading, authenticated, error, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
  }

  const goBack = () => {
    router.push('/')
  }

  const loadData = useCallback(async (searchTerm?: string) => {
    setLoadingData(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim())
        params.append('limit', '50') // Show more results when searching
      } else {
        params.append('limit', '15') // Default to 15 most recent places
      }
      
      const response = await fetch(`/api/admin/places?${params}`)
      
      if (response.ok) {
        const placesData = await response.json()
        setPlaces(placesData || [])
      } else {
        console.error('Failed to fetch places:', response.statusText)
        setPlaces([])
      }
    } catch (error) {
      console.error('Error fetching places:', error)
      setPlaces([])
    } finally {
      setLoadingData(false)
    }
  }, [])

  const loadPlaceSuggestions = useCallback(async () => {
    if (loadingSuggestions) return
    
    setLoadingSuggestions(true)
    try {
      const response = await fetch(`/api/admin/places/suggestions?q=${searchTerm}`)
      if (response.ok) {
        const suggestions = await response.json()
        setPlaceSuggestions(suggestions || [])
      }
    } catch (error) {
      console.error('Error fetching place suggestions:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }, [searchTerm, loadingSuggestions])

  // Handle search term changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    if (value.trim()) {
      loadData(value)
    } else {
      loadData() // Load default 15 places
    }
  }, [loadData])

  // Load data on component mount
  useEffect(() => {
    if (authenticated) {
      loadData()
    }
  }, [authenticated, loadData])

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg">LOADING</div>
          <div className="cursor mx-auto mt-2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg">ERROR</div>
          <div className="text-white text-sm mt-2">{error}</div>
          <button 
            onClick={() => router.push('/login')} 
            className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded"
          >
            GO TO LOGIN
          </button>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

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


  const handleRefreshPlace = (placeId: string) => {
    console.log(`Refreshing data for place ${placeId}`)
    // Handle refresh logic here - could reload data or fetch updated place details
    loadData(searchTerm)
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
             <div style={dashboardStyles.metricValue}>{places.length.toLocaleString()}</div>
             <div style={{ fontSize: '14px', color: '#10b981' }}>
               Total <span style={{ color: '#666', marginLeft: '8px' }}>in database</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Filtered Results</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>{places.length.toLocaleString()}</div>
             <div style={{ fontSize: '14px', color: '#3b82f6' }}>
               {searchTerm ? 'Matching' : 'Showing'} <span style={{ color: '#666', marginLeft: '8px' }}>{searchTerm ? 'search criteria' : 'recent places'}</span>
             </div>
           </div>
         </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ maxWidth: '600px' }}>
            <AutocompleteInput
              value={searchTerm}
              onChange={handleSearchChange}
              suggestions={placeSuggestions}
              placeholder="Search places by name, address, or type..."
              style={dashboardStyles.input}
              onFocus={loadPlaceSuggestions}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Search through places in the database
            </div>
          </div>
        </div>

        {/* Places Management Section */}
        <div style={dashboardStyles.chartContainer}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            Places Database ({places.length})
          </h3>
          <table style={dashboardStyles.metricsTable}>
            <thead>
              <tr>
                <th style={dashboardStyles.tableHeader}>Place Details</th>
                <th style={dashboardStyles.tableHeader}>Type</th>
                <th style={dashboardStyles.tableHeader}>Last Edited</th>
                <th style={dashboardStyles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.length > 0 ? (
                places.map((place) => (
                    <tr key={place.id}>
                      <td style={dashboardStyles.tableCell}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{place.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{place.address}</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>ID: {place.google_place_id}</div>
                        </div>
                      </td>
                      <td style={dashboardStyles.tableCell}>{place.place_type || 'Unknown'}</td>
                      <td style={dashboardStyles.tableCell}>
                        <div style={{ fontSize: '12px' }}>
                          {new Date(place.created_at).toLocaleDateString()}
                        </div>
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
                            onClick={() => handleRefreshPlace(place.id)}
                            style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#10b981', borderColor: '#10b981' }}
                          >
                            REFRESH
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={4} style={{
                    ...dashboardStyles.tableCell,
                    textAlign: 'center',
                    padding: '48px 16px',
                    color: '#666',
                    fontSize: '16px',
                    fontStyle: 'italic'
                  }}>
                    {loadingData ? 'Loading places...' : 'No places found'}
                  </td>
                </tr>
              )}
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
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Type</div>
                  <div style={{ color: '#fff' }}>{selectedPlace.place_type || 'Unknown'}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Created</div>
                  <div style={{ color: '#fff' }}>
                    {new Date(selectedPlace.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Address</div>
                <div style={{ color: '#fff' }}>{selectedPlace.address}</div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Google Place ID</div>
                <div style={{ color: '#00ffff', fontSize: '14px', fontFamily: 'monospace' }}>{selectedPlace.google_place_id}</div>
              </div>
              {selectedPlace.coordinates && (
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Coordinates</div>
                  <div style={{ color: '#fff' }}>
                    {(() => {
                      let lat, lng
                      if ('x' in selectedPlace.coordinates && 'y' in selectedPlace.coordinates) {
                        lng = selectedPlace.coordinates.x
                        lat = selectedPlace.coordinates.y
                      } else if ('lat' in selectedPlace.coordinates && 'lng' in selectedPlace.coordinates) {
                        lat = selectedPlace.coordinates.lat
                        lng = selectedPlace.coordinates.lng
                      }
                      return lat && lng ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : 'Invalid coordinates'
                    })()}
                  </div>
                </div>
              )}
              {selectedPlace.photo_references && selectedPlace.photo_references.length > 0 && (
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Photos</div>
                  <div style={{ color: '#fff' }}>
                    {selectedPlace.photo_references.length} photo reference{selectedPlace.photo_references.length !== 1 ? 's' : ''} available
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
} 