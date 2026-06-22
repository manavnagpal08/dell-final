import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null;
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl.includes('your-project')) {
      console.log('Middleware: Supabase URL is placeholder, using mock user if tenant cookie exists');
      if (request.cookies.has('tenant')) {
        user = { email: request.cookies.get('tenant')?.value };
      }
    } else {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }
  } catch (error) {
    console.warn('Middleware: Supabase auth.getUser failed, falling back to cookie auth');
    if (request.cookies.has('tenant')) {
      user = { email: request.cookies.get('tenant')?.value };
    }
  }

  // Protected routes condition
  const isProtectedRoute = [
    '/dashboard', '/executive', '/analytics', '/devices', '/savings', 
    '/integrations', '/predictions', '/recommendations', '/explainability', 
    '/alerts', '/anomalies', '/settings'
  ].some(route => request.nextUrl.pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Prevent logged in users from seeing login page
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
