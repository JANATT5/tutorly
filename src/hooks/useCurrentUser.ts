import { useUsers } from './useUsers'
import { useStudents } from './useStudents'
import { useTutors } from './useTutors'
import { getUsername, getUserRole } from '@/lib/session'

/**
 * Resolves the fake session cookie (src/lib/session.ts — just a role and a
 * username string, no real database id; see that file's own comment on
 * why) into the actual database rows other hooks need: the User account,
 * and — depending on role — their StudentProfile or TutorProfile.
 *
 * This is a *bridge*, not real auth: it does a username lookup instead of
 * trusting a verified server session, which is fine for this demo (the 3
 * static logins are seeded as real rows — see prisma/seed-demo-accounts.mjs)
 * but would need to be replaced by real server-side session verification
 * before this app ever handles real user data. It exists so pages like the
 * dashboard and booking flow have a real id to attach bookings/
 * applications to, without this pass having to build real sign-up/login —
 * a separate, larger task, flagged in docs/API_GUIDE.md.
 */
export function useCurrentUser() {
  const username = getUsername()
  const role = getUserRole()

  const { data: users, isLoading: userLoading } = useUsers(
    username ? { username } : undefined,
    { enabled: Boolean(username) },
  )
  const user = users?.[0]

  const { data: students, isLoading: studentLoading } = useStudents(
    user ? { userId: user.id } : undefined,
    { enabled: role === 'student' && Boolean(user) },
  )
  const { data: tutors, isLoading: tutorLoading } = useTutors(
    user ? { userId: user.id } : undefined,
    { enabled: role === 'tutor' && Boolean(user) },
  )

  const studentProfile = students?.[0]
  const tutorProfile = tutors?.[0]

  return {
    role,
    username,
    user,
    studentProfile,
    tutorProfile,
    // A single id to use for "my bookings" / "my applications" queries —
    // whichever profile matches the current role, or undefined for admin
    // (who isn't scoped to one profile) or while still loading.
    profileId:
      role === 'student' ? studentProfile?.id : role === 'tutor' ? tutorProfile?.id : undefined,
    isLoading:
      userLoading || (role === 'student' && studentLoading) || (role === 'tutor' && tutorLoading),
  }
}
