import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createResourceHooks } from './createResourceHooks'
import { axiosPatch } from '@/lib/axios'
import type { Tutor, CreateTutorDto, TutorEditDto } from '@/interfaces/tutor'

export type { Tutor, CreateTutorDto, TutorEditDto }

export const {
  /** GET /api/tutors — e.g. useTutors({ subject: 'Math' }) */
  useList: useTutors,
  /** GET /api/tutors/:id */
  useOne: useTutor,
  /** POST /api/tutors */
  useCreate: useCreateTutor,
  /** PUT /api/tutors/:id — full profile replace */
  useUpdate: useUpdateTutor,
  /** PATCH /api/tutors/:id — partial update, e.g. just { verified: true } */
  usePatch: usePatchTutor,
  /** DELETE /api/tutors/:id */
  useDelete: useDeleteTutor,
} = createResourceHooks<Tutor, CreateTutorDto, TutorEditDto>({
  basePath: 'tutors',
  queryKey: 'tutors',
})

/**
 * PATCH /api/tutors/:id/subjects — the one endpoint that doesn't fit the
 * generic factory above, since it's a nested action (replace the tutor's
 * whole subject list) rather than a plain field update. See
 * src/app/api/tutors/[id]/subjects/route.ts for what it does server-side.
 */
export function useReplaceTutorSubjects() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tutorId, subjectIds }: { tutorId: string; subjectIds: string[] }) =>
      axiosPatch<{ subjectIds: string[] }, Tutor>(`tutors/${tutorId}/subjects`, { subjectIds }).then(
        (res) => res.data,
      ),
    onSuccess: (_data, { tutorId }) => {
      queryClient.invalidateQueries({ queryKey: ['tutors', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['tutors', 'one', tutorId] })
    },
  })
}
