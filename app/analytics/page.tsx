'use client'

import AdminLayout from '../../components/AdminLayout'
import { dashboardStyles } from '../../lib/dashboardStyles'

export default function AnalyticsPage() {
  // Mock data for charts
  const userGrowthData = [
    { day: 'Mon', users: 1240, newUsers: 45 },
    { day: 'Tue', users: 1285, newUsers: 52 },
    { day: 'Wed', users: 1320, newUsers: 38 },
    { day: 'Thu', users: 1365, newUsers: 67 },
    { day: 'Fri', users: 1420, newUsers: 73 },
    { day: 'Sat', users: 1445, newUsers: 34 },
    { day: 'Sun', users: 1478, newUsers: 41 }
  ]

  const placesByCategory = [
    { category: 'Restaurants', count: 2456, percentage: 29 },
    { category: 'Coffee Shops', count: 1834, percentage: 22 },
    { category: 'Parks & Recreation', count: 1245, percentage: 15 },
    { category: 'Shopping', count: 987, percentage: 12 },
    { category: 'Museums & Culture', count: 743, percentage: 9 },
    { category: 'Hotels & Lodging', count: 612, percentage: 7 },
    { category: 'Other', count: 515, percentage: 6 }
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

      {/* Main Chart Section */}
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
        <div style={{ height: '280px', display: 'flex', alignItems: 'end', justifyContent: 'space-between', padding: '0 16px' }}>
          {userGrowthData.map((data, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{ width: '100%', maxWidth: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    style={{
                      backgroundColor: '#00ffff',
                      width: '100%',
                      height: `${(data.users / 1500) * 220}px`,
                      transition: 'all 0.5s ease-out',
                      borderRadius: '2px 2px 0 0'
                    }}
                  ></div>
                  <div 
                    style={{
                      backgroundColor: '#10b981',
                      width: '16px',
                      height: `${(data.newUsers / 80) * 70}px`,
                      transition: 'all 0.5s ease-out',
                      borderRadius: '2px 2px 0 0',
                      position: 'absolute',
                      bottom: 0
                    }}
                  ></div>
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>{data.day}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Places by Category */}
        <div style={dashboardStyles.chartContainer}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            Places by Category
          </h3>
          <table style={dashboardStyles.metricsTable}>
            <thead>
              <tr>
                <th style={dashboardStyles.tableHeader}>Category</th>
                <th style={dashboardStyles.tableHeader}>Count</th>
                <th style={dashboardStyles.tableHeader}>%</th>
              </tr>
            </thead>
            <tbody>
              {placesByCategory.map((category) => (
                <tr key={category.category}>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ fontWeight: '600' }}>{category.category}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ color: '#00ffff' }}>{category.count.toLocaleString()}</div>
                  </td>
                  <td style={dashboardStyles.tableCell}>
                    <div style={{ color: '#999' }}>{category.percentage}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div style={dashboardStyles.chartContainer}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
            Real-time Activity
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#2a2a2a', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>New User Registration</div>
              <div style={{ fontSize: '12px', color: '#999' }}>sarah_m joined • 2 minutes ago</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#2a2a2a', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>List Created</div>
              <div style={{ fontSize: '12px', color: '#999' }}>mike_chen created &quot;Best Coffee in SF&quot; • 5 minutes ago</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#2a2a2a', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Place Check-in</div>
              <div style={{ fontSize: '12px', color: '#999' }}>alex_k checked in at Blue Bottle Coffee • 8 minutes ago</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#2a2a2a', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>New Review</div>
              <div style={{ fontSize: '12px', color: '#999' }}>jenny_l rated Tartine Bakery • 12 minutes ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div style={dashboardStyles.chartContainer}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
          System Performance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>API Response Time</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>127ms</div>
            <div style={{ fontSize: '10px', color: '#10b981' }}>-15ms vs yesterday</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Database Queries/sec</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6' }}>1,247</div>
            <div style={{ fontSize: '10px', color: '#3b82f6' }}>+12% vs yesterday</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Error Rate</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>0.02%</div>
            <div style={{ fontSize: '10px', color: '#10b981' }}>-0.01% vs yesterday</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Active Sessions</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#f59e0b' }}>3,421</div>
            <div style={{ fontSize: '10px', color: '#f59e0b' }}>+8% vs yesterday</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}