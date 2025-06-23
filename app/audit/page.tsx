'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuditLog {
  id: number
  timestamp: string
  adminUser: string
  action: string
  category: string
  targetUser: string | null
  targetResource: string
  details: string
  ipAddress: string
  userAgent: string
  status: string
  severity: string
}

export default function AuditPage() {
  const { loading, authenticated, signOut } = useAuth()
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [filterAction, setFilterAction] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTimeRange, setFilterTimeRange] = useState('24h')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
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

  // Mock audit log data focusing on admin actions
  const mockAuditLogs = [
    {
      id: 1,
      timestamp: '2024-02-20 14:35:22',
      adminUser: 'admin@placemarks.com',
      action: 'USER_BANNED',
      category: 'USER_MANAGEMENT',
      targetUser: 'david.spam@temp.com',
      targetResource: 'User ID: 5',
      details: 'Banned user for suspicious activity - creating many low-quality lists',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'SUCCESS',
      severity: 'HIGH'
    },
    {
      id: 2,
      timestamp: '2024-02-20 14:32:15',
      adminUser: 'admin@placemarks.com',
      action: 'PASSWORD_RESET',
      category: 'USER_MANAGEMENT',
      targetUser: 'jenny.travels@outlook.com',
      targetResource: 'User ID: 3',
      details: 'Password reset initiated by admin for user account recovery',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'SUCCESS',
      severity: 'MEDIUM'
    },
    {
      id: 3,
      timestamp: '2024-02-20 14:28:03',
      adminUser: 'admin@placemarks.com',
      action: 'LIST_HIDDEN',
      category: 'LIST_MANAGEMENT',
      targetUser: 'mike.foodie@yahoo.com',
      targetResource: 'List: "Sketchy Places Downtown"',
      details: 'List hidden from public view due to inappropriate content',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'SUCCESS',
      severity: 'MEDIUM'
    },
    {
      id: 4,
      timestamp: '2024-02-20 14:25:18',
      adminUser: 'moderator@placemarks.com',
      action: 'LIST_DELETED',
      category: 'LIST_MANAGEMENT',
      targetUser: 'alex.coffee@gmail.com',
      targetResource: 'List: "Private Coffee Spots"',
      details: 'List permanently deleted due to copyright violations',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'SUCCESS',
      severity: 'HIGH'
    },
    {
      id: 5,
      timestamp: '2024-02-20 14:20:45',
      adminUser: 'admin@placemarks.com',
      action: 'USER_ROLE_CHANGED',
      category: 'USER_MANAGEMENT',
      targetUser: 'sarah.explorer@gmail.com',
      targetResource: 'User ID: 1',
      details: 'User role changed from USER to MODERATOR',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'SUCCESS',
      severity: 'HIGH'
    },
    {
      id: 6,
      timestamp: '2024-02-20 14:15:33',
      adminUser: 'system',
      action: 'SECURITY_SCAN',
      category: 'SECURITY',
      targetUser: null,
      targetResource: 'System Wide',
      details: 'Automated security scan detected 3 failed login attempts from IP 203.0.113.42',
      ipAddress: '127.0.0.1',
      userAgent: 'System/1.0',
      status: 'WARNING',
      severity: 'MEDIUM'
    },
    {
      id: 7,
      timestamp: '2024-02-20 14:10:12',
      adminUser: 'admin@placemarks.com',
      action: 'DATA_EXPORT',
      category: 'DATA_MANAGEMENT',
      targetUser: null,
      targetResource: 'User Analytics Report',
      details: 'Exported user analytics data for compliance reporting',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'SUCCESS',
      severity: 'LOW'
    },
    {
      id: 8,
      timestamp: '2024-02-20 14:05:28',
      adminUser: 'moderator@placemarks.com',
      action: 'LIST_APPROVED',
      category: 'LIST_MANAGEMENT',
      targetUser: 'lisa.local@gmail.com',
      targetResource: 'List: "Hidden Gems Portland"',
      details: 'List approved after content review and published',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'SUCCESS',
      severity: 'LOW'
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
    select: {
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
      maxWidth: '800px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return '#ef4444'
      case 'MEDIUM': return '#f59e0b'
      case 'LOW': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return '#10b981'
      case 'WARNING': return '#f59e0b'
      case 'FAILED': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.adminUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = filterAction === '' || log.action === filterAction
    const matchesStatus = filterStatus === '' || log.status === filterStatus
    
    return matchesSearch && matchesAction && matchesStatus
  })

  // Calculate audit metrics
  const totalLogs = mockAuditLogs.length
  const highSeverityCount = mockAuditLogs.filter(log => log.severity === 'HIGH').length
  const failedActionsCount = mockAuditLogs.filter(log => log.status === 'FAILED' || log.status === 'WARNING').length
  const userManagementCount = mockAuditLogs.filter(log => log.category === 'USER_MANAGEMENT').length
  const listManagementCount = mockAuditLogs.filter(log => log.category === 'LIST_MANAGEMENT').length

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
          <h1 className="text-2xl font-medium">Audit & Compliance</h1>
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
        
        {/* Audit Overview KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Total Audit Logs</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>{totalLogs.toLocaleString()}</div>
            <div style={{ fontSize: '14px', color: '#10b981' }}>
              +{Math.floor(totalLogs * 0.12)} <span style={{ color: '#666', marginLeft: '8px' }}>this week</span>
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>High Severity Events</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>{highSeverityCount}</div>
            <div style={{ fontSize: '14px', color: '#ef4444' }}>
              Requires attention
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Failed/Warning Actions</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>{failedActionsCount}</div>
            <div style={{ fontSize: '14px', color: '#f59e0b' }}>
              {((failedActionsCount / totalLogs) * 100).toFixed(1)}% <span style={{ color: '#666', marginLeft: '8px' }}>failure rate</span>
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Admin Actions</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>{userManagementCount + listManagementCount}</div>
            <div style={{ fontSize: '14px', color: '#8b5cf6' }}>
              User: {userManagementCount} | List: {listManagementCount}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <input
              type="text"
              placeholder="Search by admin, user, action, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={dashboardStyles.input}
            />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              style={dashboardStyles.select}
            >
              <option value="">All Actions</option>
              <option value="USER_BANNED">User Banned</option>
              <option value="PASSWORD_RESET">Password Reset</option>
              <option value="USER_ROLE_CHANGED">Role Changed</option>
              <option value="LIST_HIDDEN">List Hidden</option>
              <option value="LIST_DELETED">List Deleted</option>
              <option value="LIST_APPROVED">List Approved</option>
              <option value="DATA_EXPORT">Data Export</option>
              <option value="SECURITY_SCAN">Security Scan</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={dashboardStyles.select}
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="FAILED">Failed</option>
            </select>
            <select
              value={filterTimeRange}
              onChange={(e) => setFilterTimeRange(e.target.value)}
              style={dashboardStyles.select}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div style={dashboardStyles.chartContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>
              Audit Log ({filteredLogs.length} entries)
            </h3>
            <button style={dashboardStyles.buttonSecondary}>
              EXPORT LOGS
            </button>
          </div>
          <table style={dashboardStyles.metricsTable}>
            <thead>
              <tr>
                <th style={dashboardStyles.tableHeader}>Timestamp</th>
                <th style={dashboardStyles.tableHeader}>Admin User</th>
                <th style={dashboardStyles.tableHeader}>Action</th>
                <th style={dashboardStyles.tableHeader}>Target</th>
                <th style={dashboardStyles.tableHeader}>Severity</th>
                <th style={dashboardStyles.tableHeader}>Status</th>
                <th style={dashboardStyles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontSize: '12px' }}>{log.timestamp}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{log.adminUser}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{log.category}</div>
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontWeight: '600' }}>{log.action.replace(/_/g, ' ')}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div>
                      {log.targetUser && (
                        <div style={{ fontSize: '12px', color: '#00ffff' }}>{log.targetUser}</div>
                      )}
                      <div style={{ fontSize: '11px', color: '#999' }}>{log.targetResource}</div>
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <span style={{ 
                      color: getSeverityColor(log.severity),
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      backgroundColor: `${getSeverityColor(log.severity)}20`,
                      borderRadius: '4px'
                    }}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <span style={{ 
                      color: getStatusColor(log.status),
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      backgroundColor: `${getStatusColor(log.status)}20`,
                      borderRadius: '4px'
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <button
                      onClick={() => setSelectedLog(log)}
                      style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                    >
                      VIEW DETAILS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                Audit Log Details
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Timestamp</div>
                  <div style={{ color: '#fff' }}>{selectedLog.timestamp}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Admin User</div>
                  <div style={{ color: '#00ffff' }}>{selectedLog.adminUser}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Action</div>
                  <div style={{ color: '#fff' }}>{selectedLog.action.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Category</div>
                  <div style={{ color: '#fff' }}>{selectedLog.category.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Target User</div>
                  <div style={{ color: selectedLog.targetUser ? '#00ffff' : '#666' }}>
                    {selectedLog.targetUser || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Resource</div>
                  <div style={{ color: '#fff' }}>{selectedLog.targetResource}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Severity</div>
                  <div style={{ color: getSeverityColor(selectedLog.severity) }}>{selectedLog.severity}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Status</div>
                  <div style={{ color: getStatusColor(selectedLog.status) }}>{selectedLog.status}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Details</div>
                <div style={{ color: '#fff', backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '4px' }}>
                  {selectedLog.details}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>IP Address</div>
                  <div style={{ color: '#fff', fontFamily: 'monospace' }}>{selectedLog.ipAddress}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>User Agent</div>
                  <div style={{ color: '#999', fontSize: '12px' }}>{selectedLog.userAgent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 