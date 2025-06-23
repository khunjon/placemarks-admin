'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { CuratedList, CuratedListStats } from '@/lib/services/curated-lists'

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
        // Transform to display format
        const displayLists: DisplayList[] = listsData.map(list => ({
          id: list.id,
          name: list.name,
          publisher: list.publisher_name || 'Unknown',
          places: 0, // TODO: Get place count from list_places
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

  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        body: JSON.stringify(newListData)
      })

      if (response.ok) {
        setShowCreateModal(false)
        setNewListData({ 
          name: '', 
          publisher_name: '', 
          description: '', 
          location_scope: '', 
          external_link: '' 
        })
        loadData() // Refresh the list
      } else {
        console.error('Failed to create list')
      }
    } catch (error) {
      console.error('Error creating list:', error)
    }
  }

  const handleListAction = async (action: string, listId: string) => {
    try {
      if (action === 'delete') {
        const response = await fetch(`/api/admin/lists/${listId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          loadData() // Refresh the list
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
            loadData() // Refresh the list
          }
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing list:`, error)
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
               <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.total_curated_lists || 0}</div>
             <div style={{ fontSize: '14px', color: '#10b981' }}>
               {stats?.publishers_count || 0} <span style={{ color: '#666', marginLeft: '8px' }}>publishers</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Unique Places</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.total_places_in_curated_lists || 0}</div>
             <div style={{ fontSize: '14px', color: '#3b82f6' }}>
               {stats?.avg_places_per_list?.toFixed(1) || 0} <span style={{ color: '#666', marginLeft: '8px' }}>avg per list</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>% Private</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.private_percentage || 0}%</div>
             <div style={{ fontSize: '14px', color: '#f59e0b' }}>
               {stats?.private_lists || 0} <span style={{ color: '#666', marginLeft: '8px' }}>private lists</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Location Scopes</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>{stats?.location_scopes_count || 0}</div>
             <div style={{ fontSize: '14px', color: '#8b5cf6' }}>
               {stats?.public_lists || 0} <span style={{ color: '#666', marginLeft: '8px' }}>public lists</span>
             </div>
           </div>
         </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search lists by name or publisher..."
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
              Curated Lists ({filteredLists.length})
            </h3>
            <table style={dashboardStyles.metricsTable}>
              <thead>
                <tr>
                  <th style={dashboardStyles.tableHeader}>List Name</th>
                  <th style={dashboardStyles.tableHeader}>Publisher</th>
                  <th style={dashboardStyles.tableHeader}>Places</th>
                  <th style={dashboardStyles.tableHeader}>Views</th>
                  <th style={dashboardStyles.tableHeader}>Status</th>
                  <th style={dashboardStyles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLists.map((list) => (
                  <tr key={list.id}>
                    <td style={dashboardStyles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
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
                          <div style={{ fontWeight: '600' }}>{list.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{list.link_url}</div>
                        </div>
                      </div>
                    </td>
                    <td style={dashboardStyles.tableCell}>@{list.publisher}</td>
                    <td style={dashboardStyles.tableCell}>{list.places}</td>
                    <td style={dashboardStyles.tableCell}>{list.views.toLocaleString()}</td>
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
                          onClick={() => setSelectedList(list)}
                          style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                        >
                          VIEW
                        </button>
                        <button
                          onClick={() => handleListAction('hide', list.id)}
                          style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#f59e0b', borderColor: '#f59e0b' }}
                        >
                          {list.status === 'HIDDEN' ? 'SHOW' : 'HIDE'}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
              Create New Curated List
            </h2>
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
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Add Places (Search)
                </label>
                <input
                  type="text"
                  style={dashboardStyles.input}
                  placeholder="Search for places to add... (Google Places integration coming soon)"
                  disabled
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Google Places autocomplete will be integrated here
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
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