/** Builds a URL for the shared Axios instance. In the browser a relative path
 * is enough (same origin). On the server (SSR, route handlers calling other
 * routes) axios needs an absolute URL, so fall back to the deployed site URL
 * or localhost in dev. */
export function buildUrl(path: string): string {
  const base =
    typeof window !== 'undefined'
      ? ''
      : (process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`)

  return `${base}/${path.replace(/^\/+/, '')}`
}
