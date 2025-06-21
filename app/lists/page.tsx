'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ListManagementPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedList, setSelectedList] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListData, setNewListData] = useState({
    name: '',
    publisher: '',
    photo: '',
    link_url: ''
  })
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

  // Mock data for lists
  const mockLists = [
    { 
      id: 1, 
      name: 'Best Coffee Shops in SF', 
      publisher: 'john_doe', 
      places: 24, 
      created: '2024-01-15', 
      status: 'ACTIVE',
      photo: 'https://example.com/coffee.jpg',
      link_url: 'https://placemarks.app/lists/coffee-sf',
      views: 1247,
      likes: 89
    },
    { 
      id: 2, 
      name: 'Hidden Gems NYC', 
      publisher: 'jane_smith', 
      places: 67, 
      created: '2024-01-20', 
      status: 'ACTIVE',
      photo: 'https://example.com/nyc.jpg',
      link_url: 'https://placemarks.app/lists/hidden-nyc',
      views: 2156,
      likes: 234
    },
    { 
      id: 3, 
      name: 'Weekend Hiking Spots', 
      publisher: 'outdoor_explorer', 
      places: 15, 
      created: '2024-02-01', 
      status: 'HIDDEN',
      photo: 'https://example.com/hiking.jpg',
      link_url: 'https://placemarks.app/lists/hiking',
      views: 892,
      likes: 67
    },
    { 
      id: 4, 
      name: 'Food Truck Favorites', 
      publisher: 'foodie_mike', 
      places: 32, 
      created: '2024-02-10', 
      status: 'ACTIVE',
      photo: 'https://example.com/foodtruck.jpg',
      link_url: 'https://placemarks.app/lists/food-trucks',
      views: 743,
      likes: 45
    },
    { 
      id: 5, 
      name: 'Art & Culture Guide', 
      publisher: 'culture_curator', 
      places: 28, 
      created: '2024-02-15', 
      status: 'DRAFT',
      photo: 'https://example.com/art.jpg',
      link_url: 'https://placemarks.app/lists/art-culture',
      views: 234,
      likes: 12
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

  const filteredLists = mockLists.filter(list => 
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

  const handleCreateList = () => {
    // Handle list creation logic here
    console.log('Creating list:', newListData)
    setShowCreateModal(false)
    setNewListData({ name: '', publisher: '', photo: '', link_url: '' })
  }

  const handleListAction = (action: string, listId: number) => {
    console.log(`${action} list ${listId}`)
    // Handle list actions here
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
             <div style={dashboardStyles.metricValue}>147</div>
             <div style={{ fontSize: '14px', color: '#10b981' }}>
               +12 <span style={{ color: '#666', marginLeft: '8px' }}>this month</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Unique Places</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>2,847</div>
             <div style={{ fontSize: '14px', color: '#3b82f6' }}>
               87% <span style={{ color: '#666', marginLeft: '8px' }}>of total places</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>% Private</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>23%</div>
             <div style={{ fontSize: '14px', color: '#f59e0b' }}>
               34 <span style={{ color: '#666', marginLeft: '8px' }}>private lists</span>
             </div>
           </div>

           <div style={dashboardStyles.metricsCard}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
               <h3 style={dashboardStyles.metricLabel}>Total Views</h3>
               <div style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
             </div>
             <div style={dashboardStyles.metricValue}>89.2K</div>
             <div style={{ fontSize: '14px', color: '#8b5cf6' }}>
               +15% <span style={{ color: '#666', marginLeft: '8px' }}>vs last month</span>
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
                  Publisher
                </label>
                <input
                  type="text"
                  value={newListData.publisher}
                  onChange={(e) => setNewListData({...newListData, publisher: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter publisher username..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Cover Photo URL
                </label>
                <input
                  type="text"
                  value={newListData.photo}
                  onChange={(e) => setNewListData({...newListData, photo: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter photo URL..."
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  List URL
                </label>
                <input
                  type="text"
                  value={newListData.link_url}
                  onChange={(e) => setNewListData({...newListData, link_url: e.target.value})}
                  style={dashboardStyles.input}
                  placeholder="Enter list URL..."
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