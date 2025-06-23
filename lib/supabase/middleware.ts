import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes without authentication
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    // Redirect to login if not on login page
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle authentication based on route type
    if (!user || error) {
      // User is not authenticated
      if (!isPublicRoute) {
        // Redirect to login for protected routes
        return NextResponse.redirect(new URL('/login', request.url))
      }
      // Allow access to public routes
      return response
    } else {
      // User is authenticated
      if (isPublicRoute) {
        // Redirect authenticated users away from login page
        return NextResponse.redirect(new URL('/', request.url))
      }
      // Allow access to protected routes
      return response
    }
  } catch (error) {
    console.error('Supabase middleware error:', error)
    // On error, redirect to login unless already there
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }
} 