/** Shape of every JSON body returned by the app's API routes. Handlers return
 * HTTP 200 with the real outcome embedded in `status` (see src/lib/axios.ts
 * for how the shared Axios helpers unwrap this). */
export interface IResponse<T = unknown> {
  status: number
  message?: string
  data?: T
}
