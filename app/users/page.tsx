'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  name: string
  joinDate: string
  lastActive: string
  status: string
  totalLists: number
  totalCheckins: number
  profilePhoto: string
  location: string
  notes: string
}

export default function UserManagementPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [actionUser, setActionUser] = useState<User | null>(null)
  const [banReason, setBanReason] = useState('')
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

  // Mock data for users with lists and checkins
  const mockUsers = [
    { 
      id: 1, 
      email: 'sarah.explorer@gmail.com', 
      name: 'Sarah Explorer', 
      joinDate: '2023-03-15',
      lastActive: '2024-02-20 15:42',
      status: 'ACTIVE',
      totalLists: 47,
      totalCheckins: 1834,
      profilePhoto: 'https://example.com/sarah.jpg',
      location: 'San Francisco, CA',
      notes: 'Power user, creates high-quality curated lists'
    },
    { 
      id: 2, 
      email: 'mike.foodie@yahoo.com', 
      name: 'Mike Foodie', 
      joinDate: '2023-07-22',
      lastActive: '2024-02-19 18:23',
      status: 'ACTIVE',
      totalLists: 23,
      totalCheckins: 2156,
      profilePhoto: 'https://example.com/mike.jpg',
      location: 'New York, NY',
      notes: 'Focuses on restaurant recommendations'
    },
    { 
      id: 3, 
      email: 'jenny.travels@outlook.com', 
      name: 'Jenny Travels', 
      joinDate: '2023-01-08',
      lastActive: '2024-02-18 12:15',
      status: 'ACTIVE',
      totalLists: 34,
      totalCheckins: 1567,
      profilePhoto: 'https://example.com/jenny.jpg',
      location: 'Austin, TX',
      notes: 'Travel blogger with international focus'
    },
    { 
      id: 4, 
      email: 'alex.coffee@gmail.com', 
      name: 'Alex Coffee', 
      joinDate: '2023-11-12',
      lastActive: '2024-02-17 09:30',
      status: 'ACTIVE',
      totalLists: 18,
      totalCheckins: 892,
      profilePhoto: 'https://example.com/alex.jpg',
      location: 'Seattle, WA',
      notes: 'Coffee shop enthusiast'
    },
    { 
      id: 5, 
      email: 'david.spam@temp.com', 
      name: 'David Spam', 
      joinDate: '2024-01-20',
      lastActive: '2024-02-16 22:45',
      status: 'FLAGGED',
      totalLists: 156,
      totalCheckins: 45,
      profilePhoto: 'https://example.com/david.jpg',
      location: 'Unknown',
      notes: 'Suspicious activity - creating many low-quality lists'
    },
    { 
      id: 6, 
      email: 'lisa.local@gmail.com', 
      name: 'Lisa Local', 
      joinDate: '2023-05-30',
      lastActive: '2024-02-15 14:20',
      status: 'BANNED',
      totalLists: 8,
      totalCheckins: 234,
      profilePhoto: 'https://example.com/lisa.jpg',
      location: 'Portland, OR',
      notes: 'Banned for inappropriate content in lists'
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
    buttonDanger: {
      backgroundColor: 'transparent',
      color: '#ef4444',
      border: '1px solid #ef4444',
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

  const filteredUsers = mockUsers
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by total activity (lists + checkins) for most active users first
      const aActivity = a.totalLists + a.totalCheckins
      const bActivity = b.totalLists + b.totalCheckins
      return bActivity - aActivity
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#10b981'
      case 'FLAGGED': return '#f59e0b'
      case 'BANNED': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const handleBanUser = (user: User) => {
    setActionUser(user)
    setShowBanModal(true)
  }

  const handleResetPassword = (user: User) => {
    setActionUser(user)
    setShowResetModal(true)
  }

  const confirmBan = () => {
    if (actionUser) {
      console.log(`Banning user ${actionUser.email} for reason: ${banReason}`)
    }
    setShowBanModal(false)
    setActionUser(null)
    setBanReason('')
  }

  const confirmPasswordReset = () => {
    if (actionUser) {
      console.log(`Resetting password for user ${actionUser.email}`)
    }
    setShowResetModal(false)
    setActionUser(null)
  }

  // Calculate top users for KPIs
  const topUsersByLists = [...mockUsers].sort((a, b) => b.totalLists - a.totalLists).slice(0, 3)
  const topUsersByCheckins = [...mockUsers].sort((a, b) => b.totalCheckins - a.totalCheckins).slice(0, 3)

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
          <h1 className="text-2xl font-medium">User Management</h1>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Top Users by Lists</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            </div>
            <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
              {topUsersByLists.map((user, index) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#000'
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{user.email}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#00ffff' }}>{user.totalLists}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Top Users by Check-ins</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
            </div>
            <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
              {topUsersByCheckins.map((user, index) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#000'
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{user.email}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#00ffff' }}>{user.totalCheckins}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search users by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={dashboardStyles.input}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Search through user database
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div style={dashboardStyles.chartContainer}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            User Accounts ({filteredUsers.length})
          </h3>
          <table style={dashboardStyles.metricsTable}>
            <thead>
              <tr>
                <th style={dashboardStyles.tableHeader}>User Details</th>
                <th style={dashboardStyles.tableHeader}>Activity</th>
                <th style={dashboardStyles.tableHeader}>Status</th>
                <th style={dashboardStyles.tableHeader}>Last Active</th>
                <th style={dashboardStyles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: '#333', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        IMG
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{user.email}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>{user.location}</div>
                      </div>
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div>
                      <div style={{ color: '#fff' }}>{user.totalLists} lists</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{user.totalCheckins} check-ins</div>
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <span style={{ 
                      color: getStatusColor(user.status),
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      backgroundColor: `${getStatusColor(user.status)}20`,
                      borderRadius: '4px'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontSize: '12px' }}>{user.lastActive}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedUser(user)}
                        style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#f59e0b', borderColor: '#f59e0b' }}
                      >
                        RESET PWD
                      </button>
                      {user.status !== 'BANNED' && (
                        <button
                          onClick={() => handleBanUser(user)}
                          style={{ ...dashboardStyles.buttonDanger, padding: '4px 8px' }}
                        >
                          BAN
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                {selectedUser.name}
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Email</div>
                  <div style={{ color: '#fff' }}>{selectedUser.email}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Status</div>
                  <div style={{ color: getStatusColor(selectedUser.status) }}>{selectedUser.status}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Total Lists</div>
                  <div style={{ color: '#fff' }}>{selectedUser.totalLists}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Total Check-ins</div>
                  <div style={{ color: '#fff' }}>{selectedUser.totalCheckins}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Join Date</div>
                  <div style={{ color: '#fff' }}>{selectedUser.joinDate}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Last Active</div>
                  <div style={{ color: '#fff' }}>{selectedUser.lastActive}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Location</div>
                <div style={{ color: '#fff' }}>{selectedUser.location}</div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Admin Notes</div>
                <div style={{ color: '#fff', backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '4px' }}>
                  {selectedUser.notes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && actionUser && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
              Ban User: {actionUser.name}
            </h2>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#ef4444', marginBottom: '16px' }}>
                ⚠️ This action will immediately ban the user and prevent them from accessing the platform.
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                  Reason for Ban (required)
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  style={dashboardStyles.textarea}
                  placeholder="Enter the reason for banning this user..."
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowBanModal(false)
                  setActionUser(null)
                  setBanReason('')
                }}
                style={dashboardStyles.buttonSecondary}
              >
                CANCEL
              </button>
              <button
                onClick={confirmBan}
                disabled={!banReason.trim()}
                style={{
                  ...dashboardStyles.button,
                  backgroundColor: banReason.trim() ? '#ef4444' : '#666',
                  cursor: banReason.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                BAN USER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && actionUser && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
              Reset Password: {actionUser.name}
            </h2>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#f59e0b', marginBottom: '16px' }}>
                🔑 This will generate a new temporary password and send reset instructions to the user&apos;s email.
              </div>
              <div style={{ color: '#999', fontSize: '14px' }}>
                User email: <span style={{ color: '#00ffff' }}>{actionUser.email}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowResetModal(false)
                  setActionUser(null)
                }}
                style={dashboardStyles.buttonSecondary}
              >
                CANCEL
              </button>
              <button
                onClick={confirmPasswordReset}
                style={{ ...dashboardStyles.button, backgroundColor: '#f59e0b' }}
              >
                RESET PASSWORD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 