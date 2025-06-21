'use client'

import AdminLayout from '../AdminLayout'
import { dashboardStyles } from '../../lib/dashboardStyles'

export default function RefactoredAnalyticsPage() {
  // Mock data
  const userGrowthData = [
    { day: 'Mon', users: 1240, newUsers: 45 },
    { day: 'Tue', users: 1285, newUsers: 52 },
    { day: 'Wed', users: 1320, newUsers: 38 },
    { day: 'Thu', users: 1365, newUsers: 67 },
    { day: 'Fri', users: 1420, newUsers: 73 },
    { day: 'Sat', users: 1445, newUsers: 34 },
    { day: 'Sun', users: 1478, newUsers: 41 }
  ]

  return (
    <AdminLayout title="Analytics Dashboard" lastUpdated={true}>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={dashboardStyles.metricsCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={dashboardStyles.metricLabel}>Total Users</h3>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          </div>
          <div style={dashboardStyles.metricValue}>12,847</div>
          <div style={{ fontSize: '14px', color: '#10b981' }}>
            +2.3% <span style={{ color: '#666', marginLeft: '8px' }}>vs last month</span>
          </div>
        </div>

        <div style={dashboardStyles.metricsCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={dashboardStyles.metricLabel}>Active Places</h3>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
          </div>
          <div style={dashboardStyles.metricValue}>8,492</div>
          <div style={{ fontSize: '14px', color: '#3b82f6' }}>
            +5.7% <span style={{ color: '#666', marginLeft: '8px' }}>vs last month</span>
          </div>
        </div>

        <div style={dashboardStyles.metricsCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={dashboardStyles.metricLabel}>Check-ins Today</h3>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
          </div>
          <div style={dashboardStyles.metricValue}>1,247</div>
          <div style={{ fontSize: '14px', color: '#f59e0b' }}>
            +12.1% <span style={{ color: '#666', marginLeft: '8px' }}>vs yesterday</span>
          </div>
        </div>

        <div style={dashboardStyles.metricsCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={dashboardStyles.metricLabel}>System Health</h3>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          </div>
          <div style={dashboardStyles.metricValue}>99.9%</div>
          <div style={{ fontSize: '14px', color: '#10b981' }}>
            Uptime <span style={{ color: '#666', marginLeft: '8px' }}>last 30 days</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={dashboardStyles.chartContainer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>User Growth (7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#00ffff', borderRadius: '2px' }}></div>
              <span style={{ color: '#999' }}>Total Users</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
              <span style={{ color: '#999' }}>New Users</span>
            </div>
          </div>
        </div>
        
        {/* Simple Chart Representation */}
        <div style={{ height: '200px', display: 'flex', alignItems: 'end', justifyContent: 'space-between', padding: '0 16px' }}>
          {userGrowthData.map((data, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#00ffff',
                width: '32px',
                height: `${(data.users / 1500) * 160}px`,
                borderRadius: '2px 2px 0 0',
                marginBottom: '8px'
              }}></div>
              <span style={{ fontSize: '12px', color: '#999' }}>{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div style={dashboardStyles.chartContainer}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
          Real-time Activity
        </h3>
        <table style={dashboardStyles.metricsTable}>
          <thead>
            <tr>
              <th style={dashboardStyles.tableHeader}>Time</th>
              <th style={dashboardStyles.tableHeader}>Event</th>
              <th style={dashboardStyles.tableHeader}>User</th>
              <th style={dashboardStyles.tableHeader}>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={dashboardStyles.tableCell}>2:34 PM</td>
              <td style={dashboardStyles.tableCell}>New Check-in</td>
              <td style={dashboardStyles.tableCell}>sarah_m</td>
              <td style={dashboardStyles.tableCell}>Blue Bottle Coffee, SF</td>
            </tr>
            <tr>
              <td style={dashboardStyles.tableCell}>2:31 PM</td>
              <td style={dashboardStyles.tableCell}>List Created</td>
              <td style={dashboardStyles.tableCell}>mike_chen</td>
              <td style={dashboardStyles.tableCell}>Best Ramen in Tokyo</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
} 