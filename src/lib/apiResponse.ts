import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

/**
 * Every API route in this project replies through the three helpers below,
 * so every response body has the exact same predictable shape:
 *
 *   { status: number, message: string, data?: T }
 *
 * WHY THE RESPONSE ALWAYS COMES BACK AS HTTP 200
 * -----------------------------------------------
 * The shared client-side fetch helpers in src/lib/axios.ts
 * (axiosGet / axiosPost / axiosPut / axiosDelete) read the *real* outcome
 * from this embedded `status` field, not from the HTTP status code the
 * browser sees. Look at `unwrap()` in axios.ts — it throws an `ApiError`
 * whenever `body.status >= 400`, and otherwise treats the response as a
 * success. So every route handler in this app follows the same rule:
 * whatever the "logical" result is (created, not found, validation failed,
 * ...), the HTTP transport status is always 200, and the *meaningful*
 * status lives inside the JSON body instead.
 *
 * A genuine transport-level failure (the server crashing, the network
 * dropping) is a different thing entirely, and axios already handles that
 * on its own — these helpers are only about our own handlers replying with
 * "here's what happened".
 */

/** 200 — the request succeeded and here is the data. */
export function ok<T>(data: T, message = 'OK') {
  return NextResponse.json({ status: 200, message, data }, { status: 200 })
}

/** 201 — a new row was created. This is its own function (instead of just
 * calling `ok()`) purely so route code reads clearly — "this handler
 * creates something" — even though the HTTP transport status is still 200
 * either way (see the big comment above for why). */
export function created<T>(data: T, message = 'Created') {
  return NextResponse.json({ status: 201, message, data }, { status: 200 })
}

/** Any "logical" failure: a validation error (400), a missing record (404),
 * a conflict like a duplicate unique field (409), etc. `data` is optional
 * and is mainly used to carry zod's `.flatten()` validation details back to
 * the caller. */
export function fail(status: number, message: string, data?: unknown) {
  return NextResponse.json({ status, message, data }, { status: 200 })
}

/**
 * Turns a thrown Prisma error into the right `fail()` response, so every
 * route below doesn't have to repeat this same try/catch logic by hand.
 * Prisma throws a `PrismaClientKnownRequestError` with a `.code` for
 * expected database problems — the three we care about here are:
 *
 *   P2002 — a unique constraint was violated (e.g. creating a second
 *           TutorApplication for a tutor that already has one)
 *   P2025 — the record an update/delete was looking for doesn't exist
 *           (e.g. PATCH/DELETE called with an id that's already gone)
 *   P2003 — a foreign key doesn't point at a real row (e.g. POSTing a
 *           TutorApplication with a `tutorId` that isn't an actual
 *           TutorProfile id) — this is a client mistake, so it should read
 *           as a 400, not a scary unhandled 500.
 *
 * Anything else is unexpected, so it's logged on the server and reported to
 * the client as a generic 500 without leaking internal details.
 */
export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // error.meta.target is the list of column names that collided.
      const fields = (error.meta?.target as string[] | undefined)?.join(', ')
      return fail(409, `A record with this ${fields ?? 'value'} already exists`)
    }
    if (error.code === 'P2025') {
      return fail(404, 'Record not found')
    }
    if (error.code === 'P2003') {
      const field = error.meta?.field_name as string | undefined
      return fail(400, `Invalid reference${field ? ` for ${field}` : ''}: the record it points to doesn't exist`)
    }
  }

  console.error(error)
  return fail(500, 'Something went wrong on our end')
}
