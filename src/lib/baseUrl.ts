/** Builds a URL for the shared Axios instance. In the browser a relative path
 * is enough (same origin). On the server (SSR, route handlers calling other
 * routes) axios needs an absolute URL: prefer an explicit site URL, else fall
 * back to Vercel's auto-provided deployment URL, else localhost in dev.
 * Without this fallback, every server-rendered fetch on Vercel would try to
 * hit `localhost:3000` — nothing listens there inside the serverless
 * function — and fail. */
export function buildUrl(path: string): string {
  const base =
    typeof window !== 'undefined'
      ? ''
      : (process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`))

  return `${base}/${path.replace(/^\/+/, '')}`
}
