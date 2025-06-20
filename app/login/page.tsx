'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo authentication
    if (email === 'admin@placemarks.xyz' && password === 'password') {
      localStorage.setItem('authenticated', 'true')
      router.push('/')
    } else {
      setError('ACCESS DENIED')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        {/* Simple title with cursor */}
        <div className="text-center mb-12">
          <h1 className="text-2xl text-white mb-2">ADMIN ACCESS</h1>
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

        {/* Demo credentials */}
        <div className="mt-12 text-center text-xs text-gray-dark">
          <div>Demo: admin@placemarks.xyz / password</div>
        </div>
      </div>
    </div>
  )
} 