import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth"

export default auth((req) => {
  if (!req.auth) {
    // Redirect to the general signin page instead of directly to GitHub
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(req.url)}`, req.url)
    )
  }
  return NextResponse.next()
})

export const config = {
  matcher: '/chats/:path*'
}