'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { CuratedList, CuratedListStats } from '@/lib/services/curated-lists'
import { useSorting } from '@/lib/hooks/useSorting'
import { PlacesService } from '@/lib/services/places'

interface DisplayList {
  id: string
  name: string
  publisher: string
  places: number
  created: string
  status: string
  photo: string
  link_url: string
  views: number
  likes: number
  visibility: string
  location_scope: string | null
  curator_priority: number
}

export default function ListManagementPage() {
  const { loading, authenticated, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedList, setSelectedList] = useState<DisplayList | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editListData, setEditListData] = useState({
    id: '',
    name: '',
    publisher_name: '',
    description: '',
    location_scope: '',
    external_link: ''
  })
  const [lists, setLists] = useState<DisplayList[]>([])
  const [stats, setStats] = useState<CuratedListStats | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [newListData, setNewListData] = useState({
    name: '',
    publisher_name: '',
    description: '',
    location_scope: '',
    external_link: ''
  })
  const [selectedPlaces, setSelectedPlaces] = useState<Array<{
    id: string
    name: string
    address: string
    lat?: number
    lng?: number
  }>>([])
  const [editSelectedPlaces, setEditSelectedPlaces] = useState<Array<{
    id: string
    name: string
    address: string
    lat?: number
    lng?: number
  }>>([])
  const [placeSearchTerm, setPlaceSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    id: string
    name: string
    address: string
    lat?: number
    lng?: number
  }>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [placesService] = useState(() => new PlacesService())
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
  }

  const goBack = () => {
    router.push('/')
  }

  const getDisplayStatus = (visibility: string): string => {
    switch (visibility) {
      case 'public': return 'ACTIVE'
      case 'curated': return 'ACTIVE'
      case 'private': return 'HIDDEN'
      default: return 'DRAFT'
    }
  }

  const loadData = useCallback(async () => {
    setLoadingData(true)
    try {
      // Load both stats and lists in parallel
      const [statsResponse, listsResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/lists')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (listsResponse.ok) {
        const listsData: CuratedList[] = await listsResponse.json()
        
        // Transform to display format (place counts will be updated via API or default to 0)
        const displayLists: DisplayList[] = listsData.map(list => ({
          id: list.id,
          name: list.name,
          publisher: list.publisher_name || 'Unknown',
          places: 0, // Will be updated by fetching list details if needed
          created: new Date(list.created_at).toLocaleDateString(),
          status: getDisplayStatus(list.visibility),
          photo: list.publisher_logo_url || '',
          link_url: list.external_link || '',
          views: 0, // TODO: Add view tracking
          likes: 0, // TODO: Add like tracking
          visibility: list.visibility,
          location_scope: list.location_scope,
          curator_priority: list.curator_priority
        }))
        setLists(displayLists)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoadingData(false)
    }
  }, [])

  // Debounced search function for Google Places
  const searchPlaces = useCallback(async (searchTerm: string, locationScope?: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Combine search term with location scope for better geographic filtering
      const combinedQuery = locationScope && locationScope.trim() 
        ? `${searchTerm.trim()} ${locationScope.trim()}`
        : searchTerm.trim()
      
      const results = await placesService.searchPlaces(combinedQuery)
      
      // Format results for the UI
      const formattedResults = results.map(place => ({
        id: place.place_id || place.id,
        name: place.name,
        address: place.address,
        lat: place.lat,
        lng: place.lng
      }))
      
      setSearchResults(formattedResults)
    } catch (error) {
      console.error('❌ [Places Search] Error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [placesService])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (placeSearchTerm) {
        // Use location scope from the appropriate modal context
        const locationScope = showCreateModal 
          ? newListData.location_scope 
          : showEditModal 
            ? editListData.location_scope 
            : ''
        searchPlaces(placeSearchTerm, locationScope)
      } else {
        setSearchResults([])
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [placeSearchTerm, searchPlaces, showCreateModal, showEditModal, newListData.location_scope, editListData.location_scope])

  // Load data on component mount
  useEffect(() => {
    if (authenticated) {
      loadData()
    }
  }, [authenticated, loadData])

  // Filtering and sorting logic - moved before early returns to comply with Rules of Hooks
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.location_scope && list.location_scope.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Initialize sorting with default sort by created date DESC (newest first)
  const { sortedData, handleSort, getSortIcon } = useSorting(filteredLists, {
    key: 'created',
    direction: 'desc'
  })

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
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#10b981'
      case 'HIDDEN': return '#f59e0b'
      case 'DRAFT': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const handleCreateList = async () => {
    try {
      const response = await fetch('/api/admin/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newListData,
          visibility: 'private', // Default to Hidden status
          places: selectedPlaces
        })
      })

      if (response.ok) {
        const createdList = await response.json()
        console.log(`✅ Successfully created list: ${createdList.name}`)
        setShowCreateModal(false)
        setNewListData({ 
          name: '', 
          publisher_name: '', 
          description: '', 
          location_scope: '', 
          external_link: '' 
        })
        setSelectedPlaces([])
        setPlaceSearchTerm('')
        loadData() // Refresh the list
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Failed to create list:', errorData.error)
        // Still refresh in case of partial success
        loadData()
      }
    } catch (error) {
      console.error('❌ Unexpected error creating list:', error)
      // Always refresh on error to ensure UI consistency
      loadData()
    }
  }

  const handleAddPlace = (place: { id: string, name: string, address: string }) => {
    if (showEditModal) {
      // Check if place is already added to edit list
      if (!editSelectedPlaces.find(p => p.id === place.id)) {
        setEditSelectedPlaces([...editSelectedPlaces, place])
      }
    } else {
      // Check if place is already added to create list
      if (!selectedPlaces.find(p => p.id === place.id)) {
        setSelectedPlaces([...selectedPlaces, place])
      }
    }
    setPlaceSearchTerm('')
  }

  const handleRemovePlace = (placeId: string) => {
    if (showEditModal) {
      setEditSelectedPlaces(editSelectedPlaces.filter(p => p.id !== placeId))
    } else {
      setSelectedPlaces(selectedPlaces.filter(p => p.id !== placeId))
    }
  }

  const handleEditList = async (list: DisplayList) => {
    // Fetch full list details including description
    try {
      const [listResponse, placesResponse] = await Promise.all([
        fetch(`/api/admin/lists/${list.id}`),
        fetch(`/api/admin/lists/${list.id}/places`)
      ])

      // Load list details
      if (listResponse.ok) {
        const listDetails = await listResponse.json()
        setEditListData({
          id: list.id,
          name: list.name,
          publisher_name: list.publisher,
          description: listDetails.description || '',
          location_scope: list.location_scope || '',
          external_link: list.link_url || ''
        })
      } else {
        // Fallback to basic data if API fails
        setEditListData({
          id: list.id,
          name: list.name,
          publisher_name: list.publisher,
          description: '',
          location_scope: list.location_scope || '',
          external_link: list.link_url || ''
        })
      }

      // Load places
      if (placesResponse.ok) {
        const places = await placesResponse.json()
        setEditSelectedPlaces(places)
      } else {
        console.error('Failed to fetch list places')
        setEditSelectedPlaces([])
      }
    } catch (error) {
      console.error('Error fetching list details:', error)
      // Fallback to basic data
      setEditListData({
        id: list.id,
        name: list.name,
        publisher_name: list.publisher,
        description: '',
        location_scope: list.location_scope || '',
        external_link: list.link_url || ''
      })
      setEditSelectedPlaces([])
    }
    
    setPlaceSearchTerm('')
    setShowEditModal(true)
  }

  const handleUpdateList = async () => {
    try {
      const response = await fetch(`/api/admin/lists/${editListData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editListData.name,
          publisher_name: editListData.publisher_name,
          description: editListData.description,
          location_scope: editListData.location_scope,
          external_link: editListData.external_link,
          places: editSelectedPlaces
        })
      })

      if (response.ok) {
        const updatedList = await response.json()
        console.log(`✅ Successfully updated list: ${updatedList.name}`)
        setShowEditModal(false)
        setEditListData({ 
          id: '',
          name: '', 
          publisher_name: '', 
          description: '', 
          location_scope: '', 
          external_link: '' 
        })
        setEditSelectedPlaces([])
        setPlaceSearchTerm('')
        loadData() // Refresh the list
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Failed to update list:', errorData.error)
        // Still refresh in case of partial success
        loadData()
      }
    } catch (error) {
      console.error('❌ Unexpected error updating list:', error)
      // Always refresh on error to ensure UI consistency
      loadData()
    }
  }

  const handleListAction = async (action: string, listId: string) => {
    try {
      if (action === 'delete') {
        // Find the list to get its name for the confirmation
        const list = lists.find(l => l.id === listId)
        const listName = list?.name || 'this list'
        
        // Show confirmation dialog
        if (!confirm(`Are you sure you want to delete "${listName}"?\n\nThis action cannot be undone.`)) {
          return // User cancelled, don't proceed with deletion
        }
        
        const response = await fetch(`/api/admin/lists/${listId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          console.log(`✅ Successfully deleted list ${listId}`)
          loadData() // Refresh the list
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error(`❌ Failed to delete list ${listId}:`, errorData.error)
          // Still refresh to ensure UI is in sync with server state
          loadData()
        }
      } else if (action === 'hide' || action === 'show') {
        const list = lists.find(l => l.id === listId)
        if (list) {
          const newVisibility = action === 'hide' ? 'private' : 'public'
          const response = await fetch(`/api/admin/lists/${listId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visibility: newVisibility })
          })
          if (response.ok) {
            console.log(`✅ Successfully ${action === 'hide' ? 'hid' : 'published'} list ${listId}`)
            loadData() // Refresh the list
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            console.error(`❌ Failed to ${action} list ${listId}:`, errorData.error)
            // Still refresh to ensure UI is in sync with server state
            loadData()
          }
        }
      }
    } catch (error) {
      console.error(`❌ Unexpected error ${action}ing list ${listId}:`, error)
      // Always refresh on error to ensure UI consistency
      loadData()
    }
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
          <h1 className="text-2xl font-medium">List Management</h1>
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
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Total Lists</h3>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.total_all_lists || 0}</div>
             <div style={{ fontSize: '14px', color: '#10b981' }}>
               All lists <span style={{ color: '#666', marginLeft: '8px' }}>curated + user-created</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Curated Lists</h3>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.total_curated_lists || 0}</div>
             <div style={{ fontSize: '14px', color: '#3b82f6' }}>
               {stats?.publishers_count || 0} <span style={{ color: '#666', marginLeft: '8px' }}>publishers</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Unique Places</h3>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.total_places_in_curated_lists || 0}</div>
             <div style={{ fontSize: '14px', color: '#f59e0b' }}>
               {stats?.avg_places_per_list?.toFixed(1) || 0} <span style={{ color: '#666', marginLeft: '8px' }}>avg per list</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>% Private</h3>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.private_percentage || 0}%</div>
             <div style={{ fontSize: '14px', color: '#8b5cf6' }}>
               {stats?.private_lists || 0} <span style={{ color: '#666', marginLeft: '8px' }}>private lists</span>
             </div>
           </div>
         </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search lists by name, publisher, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={dashboardStyles.input}
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={dashboardStyles.button}
          >
            CREATE NEW LIST
          </button>
        </div>

        {/* Lists Management Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
          
          {/* Lists Table */}
          <div style={{ ...dashboardStyles.chartContainer, gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
              Curated Lists ({sortedData.length})
            </h3>
            <table style={dashboardStyles.metricsTable}>
              <thead>
                <tr>
                  <th 
                    style={{
                      ...dashboardStyles.tableHeader,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleSort('name')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>List Name</span>
                      <span style={{ fontSize: '12px', opacity: 0.7, minWidth: '16px', textAlign: 'center' }}>
                        {getSortIcon('name')}
                      </span>
                    </div>
                  </th>
                  <th 
                    style={{
                      ...dashboardStyles.tableHeader,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleSort('created')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>Created</span>
                      <span style={{ fontSize: '12px', opacity: 0.7, minWidth: '16px', textAlign: 'center' }}>
                        {getSortIcon('created')}
                      </span>
                    </div>
                  </th>
                  <th 
                    style={{
                      ...dashboardStyles.tableHeader,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleSort('publisher')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>Publisher</span>
                      <span style={{ fontSize: '12px', opacity: 0.7, minWidth: '16px', textAlign: 'center' }}>
                        {getSortIcon('publisher')}
                      </span>
                    </div>
                  </th>
                  <th 
                    style={{
                      ...dashboardStyles.tableHeader,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleSort('location_scope')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>Location Scope</span>
                      <span style={{ fontSize: '12px', opacity: 0.7, minWidth: '16px', textAlign: 'center' }}>
                        {getSortIcon('location_scope')}
                      </span>
                    </div>
                  </th>
                  <th 
                    style={{
                      ...dashboardStyles.tableHeader,
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => handleSort('status')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span>Status</span>
                      <span style={{ fontSize: '12px', opacity: 0.7, minWidth: '16px', textAlign: 'center' }}>
                        {getSortIcon('status')}
                      </span>
                    </div>
                  </th>
                  <th style={dashboardStyles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((list) => (
                    <tr key={list.id}>
                      <td style={dashboardStyles.tableCell}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{list.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{list.link_url}</div>
                        </div>
                      </td>
                      <td style={dashboardStyles.tableCell}>{list.created}</td>
                      <td style={dashboardStyles.tableCell}>@{list.publisher}</td>
                      <td style={dashboardStyles.tableCell}>{list.location_scope || 'Global'}</td>
                      <td style={dashboardStyles.tableCell}>
                        <span style={{ 
                          color: getStatusColor(list.status),
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          backgroundColor: `${getStatusColor(list.status)}20`,
                          borderRadius: '4px'
                        }}>
                          {list.status}
                        </span>
                      </td>
                      <td style={dashboardStyles.tableCell}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditList(list)}
                            style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleListAction(list.status === 'HIDDEN' ? 'show' : 'hide', list.id)}
                            style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#f59e0b', borderColor: '#f59e0b' }}
                          >
                            {list.status === 'HIDDEN' ? 'PUBLISH' : 'HIDE'}
                          </button>
                          <button
                            onClick={() => handleListAction('delete', list.id)}
                            style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#ef4444', borderColor: '#ef4444' }}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{
                      ...dashboardStyles.tableCell,
                      textAlign: 'center',
                      padding: '48px 16px',
                      color: '#666',
                      fontSize: '16px',
                      fontStyle: 'italic'
                    }}>
                      There are no curated lists
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

            {/* Create List Modal */}
      {showCreateModal && (
        <div style={dashboardStyles.modal}>
          <div style={{ 
            ...dashboardStyles.modalContent,
            maxWidth: '1200px',
            width: '95%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
              Create New Curated List
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              {/* Left Column - Form */}
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  List Name
                </label>
                <input
                  type="text"
                  value={newListData.name}
                  onChange={(e) => setNewListData({...newListData, name: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter list name..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Publisher Name
                </label>
                <input
                  type="text"
                  value={newListData.publisher_name}
                  onChange={(e) => setNewListData({...newListData, publisher_name: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter publisher name..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newListData.description}
                  onChange={(e) => setNewListData({...newListData, description: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter list description..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Location Scope
                </label>
                <input
                  type="text"
                  value={newListData.location_scope}
                  onChange={(e) => setNewListData({...newListData, location_scope: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="e.g., Bangkok, Sukhumvit..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  External Link
                </label>
                <input
                  type="text"
                  value={newListData.external_link}
                  onChange={(e) => setNewListData({...newListData, external_link: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter external link..."
                />
              </div>
              </div>

              {/* Right Column - Add Places */}
              <div>
                {/* Add Places Search */}
                <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Add Places
                </label>
                <input
                  type="text"
                    value={placeSearchTerm}
                    onChange={(e) => setPlaceSearchTerm(e.target.value)}
                  style={dashboardStyles.input}
                    placeholder="Search for restaurants to add..."
                  />
                  
                  {/* Search Results */}
                  {placeSearchTerm && (
                    <div style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      marginTop: '8px',
                      backgroundColor: '#2a2a2a',
                      position: 'relative',
                      zIndex: 10
                    }}>
                      {isSearching ? (
                        <div style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#999',
                          fontSize: '14px'
                        }}>
                          🔍 Searching places...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((place) => (
                          <div
                            key={place.id}
                            onClick={() => handleAddPlace(place)}
                            style={{
                              padding: '12px',
                              borderBottom: '1px solid #444',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#3a3a3a'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                              {place.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              {place.address}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#666',
                          fontSize: '14px',
                          fontStyle: 'italic'
                        }}>
                          No places found for &quot;{placeSearchTerm}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Places List */}
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                    Selected Places ({selectedPlaces.length})
                  </h3>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    Places that will be added to this curated list
                  </div>
                </div>
                
                <div style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  display: 'grid',
                  gap: '12px'
                }}>
                  {selectedPlaces.map((place) => (
                    <div key={place.id} style={{
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      padding: '16px',
                      position: 'relative'
                    }}>
                      <button
                        onClick={() => handleRemovePlace(place.id)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                      <div style={{ fontWeight: '600', color: '#fff', marginBottom: '8px', paddingRight: '32px' }}>
                        {place.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#999', lineHeight: '1.4' }}>
                        {place.address}
                      </div>
                    </div>
                  ))}
                  
                  {selectedPlaces.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '14px',
                      padding: '32px',
                      fontStyle: 'italic'
                    }}>
                      No places selected yet. Use the search to add places.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedPlaces([])
                  setPlaceSearchTerm('')
                  setSearchResults([])
                }}
                style={{ ...dashboardStyles.buttonSecondary, backgroundColor: 'transparent' }}
              >
                CANCEL
              </button>
              <button
                onClick={handleCreateList}
                style={dashboardStyles.button}
              >
                CREATE LIST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {showEditModal && (
        <div style={dashboardStyles.modal}>
          <div style={{ 
            ...dashboardStyles.modalContent,
            maxWidth: '1200px',
            width: '95%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
              Edit Curated List
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              {/* Left Column - Form */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    List Name
                  </label>
                  <input
                    type="text"
                    value={editListData.name}
                    onChange={(e) => setEditListData({...editListData, name: e.target.value})}
                    style={dashboardStyles.input}
                    placeholder="Enter list name..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Publisher Name
                  </label>
                  <input
                    type="text"
                    value={editListData.publisher_name}
                    onChange={(e) => setEditListData({...editListData, publisher_name: e.target.value})}
                    style={dashboardStyles.input}
                    placeholder="Enter publisher name..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={editListData.description}
                    onChange={(e) => setEditListData({...editListData, description: e.target.value})}
                    style={dashboardStyles.input}
                    placeholder="Enter list description..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Location Scope
                  </label>
                  <input
                    type="text"
                    value={editListData.location_scope}
                    onChange={(e) => setEditListData({...editListData, location_scope: e.target.value})}
                    style={dashboardStyles.input}
                    placeholder="e.g., Bangkok, Sukhumvit..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    External Link
                  </label>
                  <input
                    type="text"
                    value={editListData.external_link}
                    onChange={(e) => setEditListData({...editListData, external_link: e.target.value})}
                    style={dashboardStyles.input}
                    placeholder="Enter external link..."
                  />
                </div>
              </div>

              {/* Right Column - Add Places */}
              <div>
                {/* Add Places Search */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                    Add Places
                  </label>
                  <input
                    type="text"
                    value={placeSearchTerm}
                    onChange={(e) => setPlaceSearchTerm(e.target.value)}
                    style={dashboardStyles.input}
                    placeholder="Search for restaurants to add..."
                  />
                  
                  {/* Search Results */}
                  {placeSearchTerm && (
                    <div style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      marginTop: '8px',
                      backgroundColor: '#2a2a2a',
                      position: 'relative',
                      zIndex: 10
                    }}>
                      {isSearching ? (
                        <div style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#999',
                          fontSize: '14px'
                        }}>
                          🔍 Searching places...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((place) => (
                          <div
                            key={place.id}
                            onClick={() => handleAddPlace(place)}
                            style={{
                              padding: '12px',
                              borderBottom: '1px solid #444',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#3a3a3a'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                              {place.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              {place.address}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#666',
                          fontSize: '14px',
                          fontStyle: 'italic'
                        }}>
                          No places found for &quot;{placeSearchTerm}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Places in List */}
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                    Places in List ({editSelectedPlaces.length})
                  </h3>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    Current places in this curated list
                  </div>
                </div>
                
                <div style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  display: 'grid',
                  gap: '12px'
                }}>
                  {editSelectedPlaces.map((place) => (
                    <div key={place.id} style={{
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      padding: '16px',
                      position: 'relative'
                    }}>
                      <button
                        onClick={() => handleRemovePlace(place.id)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                      <div style={{ fontWeight: '600', color: '#fff', marginBottom: '8px', paddingRight: '32px' }}>
                        {place.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#999', lineHeight: '1.4' }}>
                        {place.address}
                      </div>
                    </div>
                  ))}
                  
                  {editSelectedPlaces.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '14px',
                      padding: '32px',
                      fontStyle: 'italic'
                    }}>
                      No places in this list yet. Use the search to add places.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditSelectedPlaces([])
                  setPlaceSearchTerm('')
                  setSearchResults([])
                }}
                style={{ ...dashboardStyles.buttonSecondary, backgroundColor: 'transparent' }}
              >
                CANCEL
              </button>
              <button
                onClick={handleUpdateList}
                style={dashboardStyles.button}
              >
                UPDATE LIST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Details Modal */}
      {selectedList && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                {selectedList.name}
              </h2>
              <button
                onClick={() => setSelectedList(null)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Publisher</div>
                  <div style={{ color: '#fff' }}>@{selectedList.publisher}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Status</div>
                  <div style={{ color: getStatusColor(selectedList.status) }}>{selectedList.status}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Places</div>
                  <div style={{ color: '#fff' }}>{selectedList.places}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Views</div>
                  <div style={{ color: '#fff' }}>{selectedList.views.toLocaleString()}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>List URL</div>
                <div style={{ color: '#00ffff', fontSize: '14px' }}>{selectedList.link_url}</div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Created</div>
                <div style={{ color: '#fff' }}>{selectedList.created}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 