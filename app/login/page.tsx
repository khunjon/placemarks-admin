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
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="w-full max-w-md p-8">
        {/* Simple title with cursor */}
        <div className="text-center mb-12">
          <h1 className="text-2xl text-white mb-2">ADMIN ACCESS</h1>
          <div className="flex items-center justify-center">
            <span className="text-white text-sm">AUTHENTICATE</span>
            <div className="w-3 h-5 bg-cyan-400 ml-2 animate-pulse"></div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-b-2 border-cyan-400 text-white px-0 py-3 text-lg focus:outline-none focus:border-cyan-300 placeholder-gray-500"
              placeholder="EMAIL"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-b-2 border-cyan-400 text-white px-0 py-3 text-lg focus:outline-none focus:border-cyan-300 placeholder-gray-500"
              placeholder="PASSWORD"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border-2 border-cyan-400 text-cyan-400 py-3 px-6 text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-12 text-center text-xs text-gray-600">
          <div>Demo: admin@placemarks.xyz / password</div>
        </div>
      </div>
    </div>
  )
} 