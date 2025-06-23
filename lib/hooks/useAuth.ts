'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type SupabaseClient } from '@/lib/supabase/client'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionWarning, setSessionWarning] = useState(false)
  const router = useRouter()
  
  // Only create Supabase client in browser environment
  const [supabase] = useState<SupabaseClient>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return createClient()
  })

  useEffect(() => {
    // Skip auth check during server-side rendering or if client creation failed
    if (!supabase) {
      setError('Supabase client not available. Please check your environment variables.')
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Failed to get session')
          setUser(null)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          setUser(session.user)
          setError(null)
          
          // Check session expiry and set up warning
          if (session.expires_at) {
            const expiresAt = new Date(session.expires_at * 1000)
            const now = new Date()
            const timeUntilExpiry = expiresAt.getTime() - now.getTime()
            
            // Show warning 5 minutes before expiry
            const warningTime = timeUntilExpiry - (5 * 60 * 1000)
            
            if (warningTime > 0) {
              setTimeout(() => {
                setSessionWarning(true)
              }, warningTime)
            } else if (timeUntilExpiry <= 5 * 60 * 1000) {
              // Session expires within 5 minutes
              setSessionWarning(true)
            }
          }
        } else {
          setUser(null)
          // Only redirect to login if we're not already on the login page
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            router.replace('/login')
          }
        }
      } catch (err) {
        console.error('Auth check error:', err)
        setError('Authentication check failed')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        setError(null)
        setSessionWarning(false)
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          router.replace('/login')
        }
      } else if (session) {
        setUser(session.user)
        setError(null)
        setSessionWarning(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const signOut = async () => {
    if (!supabase) {
      setError('Cannot sign out: Supabase client not available')
      return { success: false, error: 'Supabase client not available' }
    }
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('Sign out error:', signOutError)
        setError('Failed to sign out')
        return { success: false, error: signOutError.message }
      }
      
      // Clear local state
      setUser(null)
      setError(null)
      
      // Use replace instead of push to prevent back navigation to authenticated pages
      router.replace('/login')
      
      return { success: true }
    } catch (err) {
      console.error('Sign out error:', err)
      setError('Failed to sign out')
      return { success: false, error: 'Unexpected error during sign out' }
    }
  }

  const refreshSession = async () => {
    if (!supabase) return { success: false, error: 'Supabase client not available' }
    
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Session refresh error:', error)
        return { success: false, error: error.message }
      }
      
      setSessionWarning(false)
      return { success: true, session: data.session }
    } catch (err) {
      console.error('Session refresh error:', err)
      return { success: false, error: 'Failed to refresh session' }
    }
  }

  return {
    user,
    loading,
    authenticated: !!user,
    error,
    sessionWarning,
    signOut,
    refreshSession
  }
} 