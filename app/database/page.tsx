'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DatabaseTable {
  name: string
  schema: string
  rowCount: number
  sizeBytes: number
  sizeMB: string
  lastUpdated: string
  columns: number
  indexes: number
  primaryKey: string
}

interface QueryResult {
  success: boolean
  data?: unknown[]
  error?: string
  rowCount?: number
  rows?: unknown[]
  executionTime?: string
  rowsAffected?: number
}

export default function DatabasePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null)
  const [showSqlModal, setShowSqlModal] = useState(false)
  const [sqlQuery, setSqlQuery] = useState('')
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
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

  // Mock data that would come from Supabase MCP tools
  const mockTables = [
    { 
      name: 'users', 
      schema: 'public',
      rowCount: 2847, 
      sizeBytes: 47398912,
      sizeMB: '45.2 MB',
      lastUpdated: '2024-02-20 14:32',
      columns: 12,
      indexes: 4,
      primaryKey: 'id'
    },
    { 
      name: 'places', 
      schema: 'public',
      rowCount: 8492, 
      sizeBytes: 24969216,
      sizeMB: '23.8 MB',
      lastUpdated: '2024-02-20 14:28',
      columns: 18,
      indexes: 6,
      primaryKey: 'id'
    },
    { 
      name: 'lists', 
      schema: 'public',
      rowCount: 1456, 
      sizeBytes: 2202009,
      sizeMB: '2.1 MB',
      lastUpdated: '2024-02-20 13:45',
      columns: 9,
      indexes: 3,
      primaryKey: 'id'
    },
    { 
      name: 'checkins', 
      schema: 'public',
      rowCount: 45623, 
      sizeBytes: 12582912,
      sizeMB: '12.0 MB',
      lastUpdated: '2024-02-20 14:35',
      columns: 8,
      indexes: 5,
      primaryKey: 'id'
    },
    { 
      name: 'audit_logs', 
      schema: 'public',
      rowCount: 156234, 
      sizeBytes: 93782016,
      sizeMB: '89.4 MB',
      lastUpdated: '2024-02-20 14:36',
      columns: 7,
      indexes: 2,
      primaryKey: 'id'
    }
  ]

  const mockMigrations = [
    {
      version: '20240220_143000',
      name: 'add_place_thumbs_voting',
      status: 'APPLIED',
      appliedAt: '2024-02-20 14:30:00',
      description: 'Add thumbs up/down voting columns to places table'
    },
    {
      version: '20240218_091500',
      name: 'create_checkins_table',
      status: 'APPLIED',
      appliedAt: '2024-02-18 09:15:00',
      description: 'Create checkins table for user place visits'
    },
    {
      version: '20240215_162000',
      name: 'add_user_location_fields',
      status: 'APPLIED',
      appliedAt: '2024-02-15 16:20:00',
      description: 'Add location and timezone fields to users'
    },
    {
      version: '20240210_103000',
      name: 'create_rls_policies',
      status: 'APPLIED',
      appliedAt: '2024-02-10 10:30:00',
      description: 'Set up Row Level Security policies for all tables'
    }
  ]

  const mockExtensions = [
    { name: 'postgis', version: '3.4.0', description: 'PostGIS geometry and geography spatial types and functions' },
    { name: 'uuid-ossp', version: '1.1', description: 'Generate universally unique identifiers (UUIDs)' },
    { name: 'pg_stat_statements', version: '1.10', description: 'Track planning and execution statistics of all SQL statements' },
    { name: 'pg_trgm', version: '1.6', description: 'Text similarity measurement and index searching based on trigrams' }
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
      minHeight: '120px',
      fontFamily: 'monospace',
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
      maxWidth: '1000px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  }

  const totalDbSize = mockTables.reduce((sum, table) => sum + table.sizeBytes, 0)
  const totalRows = mockTables.reduce((sum, table) => sum + table.rowCount, 0)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const executeQuery = () => {
    console.log('Executing SQL:', sqlQuery)
    // Mock query result
    setQueryResult({
      success: true,
      rows: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'ACTIVE' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'ACTIVE' }
      ],
      executionTime: '23ms',
      rowsAffected: 2
    })
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
          <h1 className="text-2xl font-medium">Database Administration</h1>
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
        
        {/* Database Health Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Database Size</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>{formatBytes(totalDbSize)}</div>
            <div style={{ fontSize: '14px', color: '#10b981' }}>
              +2.3MB <span style={{ color: '#666', marginLeft: '8px' }}>this week</span>
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Total Records</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>{totalRows.toLocaleString()}</div>
            <div style={{ fontSize: '14px', color: '#3b82f6' }}>
              +1,247 <span style={{ color: '#666', marginLeft: '8px' }}>this week</span>
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Active Connections</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>12</div>
            <div style={{ fontSize: '14px', color: '#f59e0b' }}>
              Peak: 28 <span style={{ color: '#666', marginLeft: '8px' }}>today</span>
            </div>
          </div>

          <div style={dashboardStyles.metricsCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={dashboardStyles.metricLabel}>Avg Query Time</h3>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
            </div>
            <div style={dashboardStyles.metricValue}>23ms</div>
            <div style={{ fontSize: '14px', color: '#8b5cf6' }}>
              -5ms <span style={{ color: '#666', marginLeft: '8px' }}>vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* Tables Overview */}
          <div style={dashboardStyles.chartContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>
                Database Tables ({mockTables.length})
              </h3>
              <button
                onClick={() => setShowSqlModal(true)}
                style={dashboardStyles.buttonSecondary}
              >
                SQL CONSOLE
              </button>
            </div>
            <table style={dashboardStyles.metricsTable}>
              <thead>
                <tr>
                  <th style={dashboardStyles.tableHeader}>Table</th>
                  <th style={dashboardStyles.tableHeader}>Rows</th>
                  <th style={dashboardStyles.tableHeader}>Size</th>
                  <th style={dashboardStyles.tableHeader}>Columns</th>
                  <th style={dashboardStyles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTables.map((table) => (
                  <tr key={table.name}>
                    <td style={dashboardStyles.tableCell}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{table.name}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Schema: {table.schema}</div>
                      </div>
                    </td>
                    <td style={dashboardStyles.tableCell}>
                      <div style={{ color: '#fff' }}>{table.rowCount.toLocaleString()}</div>
                    </td>
                    <td style={dashboardStyles.tableCell}>
                      <div style={{ color: '#fff' }}>{table.sizeMB}</div>
                    </td>
                    <td style={dashboardStyles.tableCell}>
                      <div style={{ color: '#fff' }}>{table.columns}</div>
                    </td>
                    <td style={dashboardStyles.tableCell}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedTable(table)}
                          style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px' }}
                        >
                          VIEW
                        </button>
                        <button
                          style={{ ...dashboardStyles.buttonSecondary, padding: '4px 8px', color: '#f59e0b', borderColor: '#f59e0b' }}
                        >
                          ANALYZE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extensions */}
          <div style={dashboardStyles.chartContainer}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
              Installed Extensions
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {mockExtensions.map((ext) => (
                <div key={ext.name} style={{ 
                  backgroundColor: '#2a2a2a', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #333'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{ext.name}</div>
                    <div style={{ fontSize: '12px', color: '#00ffff' }}>v{ext.version}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{ext.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Migrations */}
        <div style={dashboardStyles.chartContainer}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            Recent Migrations
          </h3>
          <table style={dashboardStyles.metricsTable}>
            <thead>
              <tr>
                <th style={dashboardStyles.tableHeader}>Version</th>
                <th style={dashboardStyles.tableHeader}>Name</th>
                <th style={dashboardStyles.tableHeader}>Status</th>
                <th style={dashboardStyles.tableHeader}>Applied At</th>
                <th style={dashboardStyles.tableHeader}>Description</th>
              </tr>
            </thead>
            <tbody>
              {mockMigrations.map((migration) => (
                <tr key={migration.version}>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00ffff' }}>
                      {migration.version}
                    </div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontWeight: '600' }}>{migration.name}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <span style={{ 
                      color: '#10b981',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      backgroundColor: '#10b98120',
                      borderRadius: '4px'
                    }}>
                      {migration.status}
                    </span>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontSize: '12px' }}>{migration.appliedAt}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontSize: '12px', color: '#999' }}>{migration.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Details Modal */}
      {selectedTable && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                Table: {selectedTable.name}
              </h2>
              <button
                onClick={() => setSelectedTable(null)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Schema</div>
                  <div style={{ color: '#fff' }}>{selectedTable.schema}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Primary Key</div>
                  <div style={{ color: '#00ffff' }}>{selectedTable.primaryKey}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Row Count</div>
                  <div style={{ color: '#fff' }}>{selectedTable.rowCount.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Size</div>
                  <div style={{ color: '#fff' }}>{selectedTable.sizeMB}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Columns</div>
                  <div style={{ color: '#fff' }}>{selectedTable.columns}</div>
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Indexes</div>
                  <div style={{ color: '#fff' }}>{selectedTable.indexes}</div>
                </div>
              </div>
              <div>
                <div style={{ color: '#999', fontSize: '14px', marginBottom: '4px' }}>Last Updated</div>
                <div style={{ color: '#fff' }}>{selectedTable.lastUpdated}</div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button style={dashboardStyles.button}>
                  BROWSE DATA
                </button>
                <button style={dashboardStyles.buttonSecondary}>
                  VIEW STRUCTURE
                </button>
                <button style={{ ...dashboardStyles.buttonSecondary, color: '#f59e0b', borderColor: '#f59e0b' }}>
                  EXPORT TABLE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Console Modal */}
      {showSqlModal && (
        <div style={dashboardStyles.modal}>
          <div style={dashboardStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>
                SQL Console
              </h2>
              <button
                onClick={() => setShowSqlModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#999', fontSize: '14px' }}>
                SQL Query
              </label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                style={dashboardStyles.textarea}
                placeholder="SELECT * FROM users WHERE status = 'ACTIVE' LIMIT 10;"
              />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <button
                onClick={executeQuery}
                disabled={!sqlQuery.trim()}
                style={{
                  ...dashboardStyles.button,
                  backgroundColor: sqlQuery.trim() ? '#00ffff' : '#666',
                  cursor: sqlQuery.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                EXECUTE QUERY
              </button>
              <button
                onClick={() => setSqlQuery('')}
                style={dashboardStyles.buttonSecondary}
              >
                CLEAR
              </button>
            </div>
            
            {queryResult && (
              <div style={{ backgroundColor: '#2a2a2a', padding: '16px', borderRadius: '6px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '12px', fontSize: '14px', color: '#10b981' }}>
                  Query executed successfully in {queryResult.executionTime} - {queryResult.rowsAffected} rows returned
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#fff' }}>
                  <pre>{JSON.stringify(queryResult.rows, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 