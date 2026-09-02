// app/tutors/[tutorId]/book/confirmation/page.tsx  →  /tutors/123/book/confirmation
//
// Final step of the booking flow, worth its own URL because a user might
// screenshot, refresh, or come back to this exact screen — unlike a modal
// or toast, which disappears. Now that bookings are real rows, this page
// looks the booking up by the id BookingForm got back from
// POST /api/bookings, instead of trusting subject/day/time as query
// params — the same "fetch by id, 404 if missing" pattern as
// ../../page.tsx (tutor detail) and this route's own page.tsx.

import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { axiosGet, ApiError } from "@/lib/axios";
import type { Booking } from "@/hooks/useBookings";

const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23e5e7eb'/%3E%3C/svg%3E";

type ConfirmationPageProps = {
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function BookingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { bookingId } = await searchParams;
  if (!bookingId) notFound();

  let booking: Booking;
  try {
    const response = await axiosGet<Booking>(`bookings/${bookingId}`);
    if (!response.data) notFound();
    booking = response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <PageContainer width="narrow">
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-forest">
          Request sent
        </p>
        <h1 className="mb-4 font-display text-2xl text-fg">
          Your session request is on its way
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-subtle">
          {booking.tutor.fullName} will reach out to confirm the time. Booking reference:{" "}
          {booking.id}.
        </p>
      </div>

      {/* Booking summary card */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.tutor.avatar ?? fallbackAvatar}
            alt={booking.tutor.fullName}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-display text-base text-fg">{booking.tutor.fullName}</p>
            <p className="text-xs text-subtle">${booking.tutor.hourlyRate}/hr</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-subtle">Subject</span>
            <span className="font-medium text-fg">{booking.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtle">Date</span>
            <span className="font-medium text-fg">
              {new Date(booking.date).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtle">Status</span>
            <span className="font-medium text-fg">{booking.status}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
        >
          Back to home
        </Link>
        <Link
          href="/browse"
          className="rounded-lg border border-border bg-white px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-forest"
        >
          Browse more tutors
        </Link>
      </div>
    </PageContainer>
  );
}
