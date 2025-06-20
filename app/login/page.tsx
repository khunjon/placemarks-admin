'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [terminalText, setTerminalText] = useState('')
  const router = useRouter()

  const terminalLines = [
    'PLACEMARKS ADMIN TERMINAL v2.1.4',
    'Initializing secure connection...',
    'Connection established.',
    'Authentication required.',
    ''
  ]

  useEffect(() => {
    let currentLine = 0
    let currentChar = 0
    const typeText = () => {
      if (currentLine < terminalLines.length) {
        if (currentChar < terminalLines[currentLine].length) {
          setTerminalText(prev => prev + terminalLines[currentLine][currentChar])
          currentChar++
          setTimeout(typeText, 50)
        } else {
          setTerminalText(prev => prev + '\n')
          currentLine++
          currentChar = 0
          setTimeout(typeText, 200)
        }
      }
    }
    typeText()
  }, [terminalLines])

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
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Terminal Header */}
      <div className="p-4 border-b border-green-900">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-green-500 text-sm">admin@placemarks:~$</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-6">
        {/* Boot sequence */}
        <div className="mb-8">
          <pre className="text-sm leading-relaxed whitespace-pre-wrap">
            {terminalText}
          </pre>
          <div className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
        </div>

        {/* Login Form */}
        <div className="max-w-md">
          <div className="mb-6">
            <div className="text-green-500 text-sm mb-2">
              {'>'} Enter credentials:
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-green-500 text-sm mb-1">
                user@domain:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-green-900 text-green-400 px-3 py-2 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="admin@placemarks.xyz"
                required
              />
            </div>

            <div>
              <label className="block text-green-500 text-sm mb-1">
                password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-green-900 text-green-400 px-3 py-2 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">
                {'>'} ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 hover:bg-green-800 text-green-400 py-2 px-4 text-sm border border-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          <div className="mt-8 text-xs text-green-700">
            <div>Demo credentials:</div>
            <div>user: admin@placemarks.xyz</div>
            <div>pass: password</div>
          </div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="p-4 border-t border-green-900">
        <div className="text-xs text-green-700">
          System status: SECURE | Uptime: 99.7% | Last login: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  )
} 