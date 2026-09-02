import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosGet, axiosPost, axiosPut, axiosPatch, axiosDelete } from '@/lib/axios'

/**
 * Builds the standard set of react-query hooks for one REST resource, so
 * every resource (tutors, bookings, subjects, ...) gets the exact same
 * list/one/create/update/patch/delete hooks without copy-pasting the same
 * useQuery/useMutation code ten times. See src/hooks/useTutors.ts for a
 * fully worked example of how a resource file uses this.
 *
 * Generic parameters:
 *   TEntity — the shape GET returns (a list item, or one record)
 *   TCreate — the shape POST expects (matches a createXSchema on the
 *             matching /api/<resource>/schema.ts)
 *   TEdit   — the shape PUT/PATCH expect (matches the xEditSchema on that
 *             same file) — PATCH sends `Partial<TEdit>` since it's allowed
 *             to omit fields.
 */
export function createResourceHooks<TEntity, TCreate, TEdit>({
  basePath,
  queryKey,
}: {
  /** URL segment under /api, e.g. "tutors" -> GET /api/tutors, /api/tutors/:id */
  basePath: string
  /** react-query cache-key prefix for this resource (usually same as basePath) */
  queryKey: string
}) {
  // GET /api/<basePath> — list, with optional query-string filters, e.g.
  // useList({ subject: 'Math' }) -> GET /api/tutors?subject=Math
  //
  // `options.enabled` lets a caller hold the request off until it actually
  // has something meaningful to filter by — e.g.
  // src/hooks/useCurrentUser.ts only wants to fetch tutors once it knows a
  // real userId, not fetch every tutor in the meantime.
  function useList(
    filters?: Record<string, string | undefined>,
    options?: { enabled?: boolean },
  ) {
    return useQuery({
      queryKey: [queryKey, 'list', filters ?? {}],
      queryFn: () =>
        axiosGet<TEntity[]>(buildListPath(basePath, filters)).then((res) => res.data),
      enabled: options?.enabled,
    })
  }

  // GET /api/<basePath>/:id — one record. `enabled` lets a caller wait
  // until an id is actually known (e.g. a dynamic route param that starts
  // out undefined) before firing the request.
  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [queryKey, 'one', id],
      queryFn: () => axiosGet<TEntity>(`${basePath}/${id}`).then((res) => res.data),
      enabled: Boolean(id),
    })
  }

  // POST /api/<basePath> — create. On success, invalidates the list query so
  // every screen showing this resource's list refetches automatically.
  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (dto: TCreate) =>
        axiosPost<TCreate, TEntity>(basePath, dto).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] }),
    })
  }

  // PUT /api/<basePath>/:id — full replace
  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, dto }: { id: string; dto: TEdit }) =>
        axiosPut<TEdit, TEntity>(`${basePath}/${id}`, dto).then((res) => res.data),
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] })
        queryClient.invalidateQueries({ queryKey: [queryKey, 'one', id] })
      },
    })
  }

  // PATCH /api/<basePath>/:id — partial update
  function usePatch() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, dto }: { id: string; dto: Partial<TEdit> }) =>
        axiosPatch<Partial<TEdit>, TEntity>(`${basePath}/${id}`, dto).then((res) => res.data),
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] })
        queryClient.invalidateQueries({ queryKey: [queryKey, 'one', id] })
      },
    })
  }

  // DELETE /api/<basePath>/:id
  function useDelete() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => axiosDelete<null>(`${basePath}/${id}`).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey, 'list'] }),
    })
  }

  return { useList, useOne, useCreate, useUpdate, usePatch, useDelete }
}

// Turns { subject: "Math", verified: undefined } into "tutors?subject=Math"
// — undefined values are skipped so callers can pass a full filter object
// without worrying about which fields are actually set to something.
function buildListPath(basePath: string, filters?: Record<string, string | undefined>) {
  if (!filters) return basePath

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) params.set(key, value)
  }

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}
