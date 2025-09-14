import { NextRequest, NextResponse } from 'next/server'
import { SecurityDetector } from './lib/security-detector'

// Simple in-memory rate limiting
const requests = new Map<string, number[]>()
const blockedIPs = new Map<string, number>()
const suspiciousAttempts = new Map<string, number>()

function isRateLimited(ip: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const userRequests = requests.get(ip) || []
  
  // Remove old requests
  const validRequests = userRequests.filter(time => now - time < windowMs)
  
  if (validRequests.length >= maxRequests) {
    return true
  }
  
  validRequests.push(now)
  requests.set(ip, validRequests)
  return false
}

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''
  const url = request.nextUrl.pathname + request.nextUrl.search
  
  // Remove blocking for false flags, keep only rate limiting and security headers
  // Commenting out IP blocking and hacking tool detection
  /*
  const blockTime = blockedIPs.get(ip)
  if (blockTime && Date.now() - blockTime < 300000) {
    console.log(`Security: Blocked IP ${ip} - Previous malicious activity`)
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    console.log('Request URL:', request.nextUrl.href)
    return new NextResponse('Access Denied: Malicious Activity Detected', {
      status: 403,
      headers: {
        'X-Security-Block': 'MALICIOUS_ACTIVITY'
      }
    })
  }

  const headers = Object.fromEntries(request.headers.entries())
  if (SecurityDetector.detectHackingTool(userAgent, headers)) {
    console.log(`Security: Blocked hacking tool from IP ${ip}, UA: ${userAgent}`)
    blockedIPs.set(ip, Date.now())
    return new NextResponse('Access Denied: Automated Security Tools Not Allowed', {
      status: 403,
      headers: {
        'X-Security-Block': 'HACKING_TOOL_DETECTED'
      }
    })
  }
  */

  // Remove blocking for malicious input to avoid false positives, keep only hacking tool and rate limiting blocks
  // Commenting out malicious input blocking for now
  /*
  if (SecurityDetector.isMaliciousInput(request.nextUrl.search)) {
    const safePaths = ['/favicon.ico', '/robots.txt', '/sitemap.xml']
    if (!safePaths.includes(request.nextUrl.pathname) && request.nextUrl.search) {
      const attempts = (suspiciousAttempts.get(ip) || 0) + 1
      suspiciousAttempts.set(ip, attempts)

      console.log(`Security: Malicious input detected from IP ${ip}, query: ${request.nextUrl.search}, attempts: ${attempts}`)

      if (attempts >= 5) {
        blockedIPs.set(ip, Date.now())
      }

      return new NextResponse('Access Denied: Malicious Input Detected', {
        status: 403,
        headers: {
          'X-Security-Block': 'MALICIOUS_INPUT'
        }
      })
    }
  }
  */
  
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Remove potentially dangerous headers
  response.headers.delete('x-now-route-matches')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' *.supabase.co wss://*.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Rate limiting - adjusted for better user experience while maintaining security
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isMobile = userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')

  const maxRequests = isApiRoute ? (isMobile ? 75 : 100) : (isMobile ? 300 : 500)
  
  if (isRateLimited(ip, maxRequests)) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '900'
      }
    })
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}