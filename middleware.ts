import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth cookie
  const isAuthenticated = request.cookies.get('mtm-auth')?.value === 'true';
  
  // Create response
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to login if not authenticated and not on public route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to home if authenticated and on login page
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Handle legacy routes - redirect old patterns to new structure
  if (pathname === '/index' || pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Add breadcrumb context via header
  const breadcrumbMap: Record<string, string> = {
    '/': 'Dashboard',
    '/upload': 'Upload',
    '/review': 'Review',
    '/export': 'Export',
    '/login': 'Login',
  };
  
  const currentBreadcrumb = breadcrumbMap[pathname] || 'Unknown';
  response.headers.set('X-Current-Page', currentBreadcrumb);
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
