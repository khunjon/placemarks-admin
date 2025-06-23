'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type SupabaseClient } from '@/lib/supabase/client'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabase, setSupabase] = useState<SupabaseClient>(null)
  const router = useRouter()

  // Initialize Supabase client only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = createClient()
      setSupabase(client)
      
      if (!client) {
        setError('Configuration error: Please check your environment variables.')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('CONFIGURATION ERROR')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('INVALID CREDENTIALS')
        setLoading(false)
        return
      }

      if (data.user) {
        // Successfully authenticated
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('AUTHENTICATION ERROR')
    }
    
    setLoading(false)
  }

  // Show loading state while initializing
  if (typeof window !== 'undefined' && !supabase && !error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg">INITIALIZING</div>
          <div className="cursor mx-auto mt-2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        {/* Simple title with cursor */}
        <div className="text-center mb-12">
          <h1 className="text-2xl text-white mb-2">PLACEMARKS</h1>
          <div className="flex items-center justify-center">
            <span className="text-white text-sm">AUTHENTICATE</span>
            <div className="cursor ml-2"></div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="EMAIL"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="PASSWORD"
              required
            />
          </div>

          {error && (
            <div className="text-red text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER'}
          </button>
        </form>

        {/* Admin Login */}
        <div className="mt-12 text-center text-xs text-gray-dark">
          <div>Admin access required</div>
        </div>
      </div>
    </div>
  )
} 