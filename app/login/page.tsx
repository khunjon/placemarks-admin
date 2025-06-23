'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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