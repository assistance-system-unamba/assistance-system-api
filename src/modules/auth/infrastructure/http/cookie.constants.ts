export const REFRESH_COOKIE = 'refresh_token';
export const CSRF_COOKIE = 'csrf_token';

export const cookieBase = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // 'strict' también vale si es mismo sitio; usa 'none' (con secure:true) si tienes dominios distintos
} as const;

export function refreshCookieOptions(maxAgeMs: number) {
  return {
    ...cookieBase,
    path: '/auth',
    maxAge: maxAgeMs,
  };
}
