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
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(0)
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

  const validateForm = () => {
    let isValid = true
    setEmailError('')
    setPasswordError('')
    setError('')

    // Email validation
    if (!email) {
      setEmailError('Email is required')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }

    return isValid
  }

  const checkRateLimit = () => {
    const now = Date.now()
    const timeSinceLastAttempt = now - lastAttemptTime
    
    // Reset attempts if more than 15 minutes have passed
    if (timeSinceLastAttempt > 15 * 60 * 1000) {
      setLoginAttempts(0)
      return true
    }
    
    // Allow maximum 5 attempts per 15 minutes
    if (loginAttempts >= 5) {
      const remainingTime = Math.ceil((15 * 60 * 1000 - timeSinceLastAttempt) / 1000 / 60)
      setError(`TOO MANY FAILED ATTEMPTS - TRY AGAIN IN ${remainingTime} MINUTES`)
      return false
    }
    
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (!checkRateLimit()) {
      return
    }
    
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
        // Track failed attempts
        setLoginAttempts(prev => prev + 1)
        setLastAttemptTime(Date.now())
        
        // Provide more specific error messages
        switch (authError.message) {
          case 'Invalid login credentials':
            setError('INVALID EMAIL OR PASSWORD')
            break
          case 'Email not confirmed':
            setError('EMAIL NOT VERIFIED')
            break
          case 'Too many requests':
            setError('TOO MANY ATTEMPTS - TRY AGAIN LATER')
            break
          default:
            setError('LOGIN FAILED - PLEASE TRY AGAIN')
        }
        setLoading(false)
        return
      }

      if (data.user) {
        // Reset attempts on successful login
        setLoginAttempts(0)
        setLastAttemptTime(0)
        
        // Successfully authenticated
        router.push('/')
        router.refresh()
      }
    } catch {
      // Track failed attempts on exception
      setLoginAttempts(prev => prev + 1)
      setLastAttemptTime(Date.now())
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
    <div className="min-h-screen bg-black flex items-center justify-center px-8">
      <div className="w-full max-w-3xl">
        {/* Simple title with cursor */}
        <div className="text-center mb-12">
          <h1 className="text-2xl text-white mb-2">PLACEMARKS</h1>
          <div className="flex items-center justify-center">
            <span className="text-white text-sm">AUTHENTICATE</span>
            <div className="cursor ml-2"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="EMAIL"
                autoComplete="email"
                required
              />
              {emailError && (
                <div className="text-red text-sm mt-1">
                  {emailError}
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pr-12"
                placeholder="PASSWORD"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
              {passwordError && (
                <div className="text-red text-sm mt-1">
                  {passwordError}
                </div>
              )}
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
        </div>

        {/* Admin Login */}
        <div className="mt-12 text-center text-xs text-gray-dark">
          <div>Admin access required</div>
        </div>
      </div>
    </div>
  )
} 