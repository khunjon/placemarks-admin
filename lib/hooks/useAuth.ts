'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, type SupabaseClient } from '@/lib/supabase/client'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        } else {
          setUser(null)
          // Only redirect to login if we're not already on the login page
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            router.push('/login')
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
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          router.push('/login')
        }
      } else if (session) {
        setUser(session.user)
        setError(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const signOut = async () => {
    if (!supabase) {
      setError('Cannot sign out: Supabase client not available')
      return
    }
    
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Sign out error:', err)
      setError('Failed to sign out')
    }
  }

  return {
    user,
    loading,
    authenticated: !!user,
    error,
    signOut
  }
} 