'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import AdminHeader from '../components/AdminHeader'

export default function HomePage() {
  const router = useRouter()
  const { loading, authenticated } = useAuth()



  const navigateTo = (path: string) => {
    router.push(path)
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

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminHeader title="PLACEMARKS ADMIN" showBackButton={false} />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray">Select an administrative function</p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card" onClick={() => navigateTo('/lists')}>
              <h3>LISTS</h3>
              <p>Create curated lists, search existing content, hide/delete inappropriate lists</p>
            </div>
            
            <div className="card" onClick={() => navigateTo('/places')}>
              <h3>PLACES</h3>
              <p>Search Google cached places, refresh data, set custom photos, add admin notes</p>
            </div>
            
            <div className="card" onClick={() => navigateTo('/users')}>
              <h3>USERS</h3>
              <p>Search users, reset passwords, ban accounts, view activity and rankings</p>
            </div>
            
            <div className="card" onClick={() => navigateTo('/database')}>
              <h3>DATABASE</h3>
              <p>Monitor health metrics, view table data, run SQL queries, track migrations</p>
            </div>
            
            <div className="card" onClick={() => navigateTo('/analytics')}>
              <h3>ANALYTICS</h3>
              <p>Backend KPI dashboard with user growth, activity feeds, system performance</p>
            </div>
            
            <div className="card" onClick={() => navigateTo('/audit')}>
              <h3>AUDIT</h3>
              <p>Admin action logging, compliance tracking, security monitoring and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
