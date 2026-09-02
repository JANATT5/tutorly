// components/tutors/BookingForm.tsx
//
// Wired to the real POST /api/bookings endpoint. Two things worth calling
// out about how the DB schema shaped this:
//
// 1. Booking.studentId is a required foreign key to a real StudentProfile
//    — there's no "guest booking" concept in prisma/schema.prisma, so
//    (despite the page copy this used to have) an actual student account
//    is required to book. Since real sign-up/login is out of scope for
//    this pass, this form uses the same demo-account bridge as the rest of
//    the app (see src/hooks/useCurrentUser.ts) — if nobody's "logged in"
//    as the demo student, it shows a prompt instead of the form.
// 2. Booking.date is a real DateTime, but the picker UI only offers a
//    weekday + time-of-day (e.g. "Wed" / "5:00 PM"), not a calendar date.
//    nextDateForWeekday() below turns that pair into the next real
//    occurrence of that weekday/time, so a genuine, storable Date reaches
//    the API.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Tutor } from "@/hooks/useTutors";
import { useCreateBooking } from "@/hooks/useBookings";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const upcomingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const timeSlots = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"] as const;

const weekdayIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

// Turns a ("Wed", "5:00 PM") pair into the next real Date that actually
// falls on that weekday at that time — today if it hasn't passed yet,
// otherwise the following week.
function nextDateForWeekday(dayAbbrev: string, timeLabel: string): Date {
  const match = timeLabel.match(/(\d+):(\d+)\s?(AM|PM)/i);
  let hour = match ? parseInt(match[1], 10) : 0;
  const minute = match ? parseInt(match[2], 10) : 0;
  const meridiem = match?.[3]?.toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  const result = new Date();
  result.setHours(hour, minute, 0, 0);

  const targetDay = weekdayIndex[dayAbbrev] ?? result.getDay();
  let diffDays = (targetDay - result.getDay() + 7) % 7;
  if (diffDays === 0 && result.getTime() <= Date.now()) diffDays = 7;
  result.setDate(result.getDate() + diffDays);

  return result;
}

const inputClasses =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

// ---- Type ----
type BookingFormData = {
  day: string;
  time: string;
  subject: string;
};

type BookingFormErrors = Partial<Record<keyof BookingFormData, string>>;

// ---- Initialization ----
const initialBookingFormData: BookingFormData = { day: "", time: "", subject: "" };

// ---- Validation ----
function validateBookingForm(data: BookingFormData): BookingFormErrors {
  const errors: BookingFormErrors = {};
  if (!data.day) errors.day = "Pick a day.";
  if (!data.time) errors.time = "Pick a time.";
  if (!data.subject) errors.subject = "Select a subject.";
  return errors;
}

export default function BookingForm({ tutor }: { tutor: Tutor }) {
  const router = useRouter();
  const { role, studentProfile, isLoading: userLoading } = useCurrentUser();
  const createBooking = useCreateBooking();

  const [formData, setFormData] = useState<BookingFormData>(initialBookingFormData);
  const [errors, setErrors] = useState<BookingFormErrors>({});

  function handleChange<K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // ---- Handling ----
  function handleSubmit() {
    const validationErrors = validateBookingForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0 || !studentProfile) return;

    createBooking.mutate(
      {
        studentId: studentProfile.id,
        tutorId: tutor.id,
        subject: formData.subject,
        date: nextDateForWeekday(formData.day, formData.time),
      },
      {
        onSuccess: (booking) => {
          if (!booking) return;
          router.push(`/tutors/${tutor.id}/book/confirmation?bookingId=${booking.id}`);
        },
      },
    );
  }

  if (userLoading) {
    return <p className="text-sm text-subtle">Loading…</p>;
  }

  // No "guest booking" exists in the database — booking requires a real
  // student account. Real sign-up is out of scope for now, so this points
  // at the same demo login the rest of the app uses.
  if (role !== "student" || !studentProfile) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-6 text-center">
        <p className="text-sm text-body">
          You need to be logged in as a student to book a session.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
        >
          Log in
        </Link>
      </div>
    );
  }

  const subjectNames = tutor.subjects.map((ts) => ts.subject.name);

  return (
    <div>
      {/* Time slots */}
      <div className="mb-6 rounded-xl border border-border bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
          Pick a time <span className="text-amber">*</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {upcomingDays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleChange("day", day)}
              aria-pressed={formData.day === day}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                formData.day === day
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-fg hover:border-forest"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {errors.day && <p className="mt-2 text-xs text-[#B3261E]">{errors.day}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleChange("time", time)}
              aria-pressed={formData.time === time}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                formData.time === time
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-fg hover:border-forest"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        {errors.time && <p className="mt-2 text-xs text-[#B3261E]">{errors.time}</p>}
      </div>

      {/* Subject */}
      <div className="rounded-xl border border-border bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
          Session details
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Subject <span className="text-amber">*</span>
            </span>
            <select
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className={`${inputClasses} mt-2`}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjectNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-xs text-[#B3261E]">{errors.subject}</p>
            )}
          </label>

          <p className="text-sm text-subtle">
            Booking as <span className="font-medium text-fg">{studentProfile.fullName}</span>
          </p>
        </div>
      </div>

      {createBooking.isError && (
        <p className="mt-4 text-sm text-[#B3261E]">
          {createBooking.error instanceof Error
            ? createBooking.error.message
            : "Something went wrong. Please try again."}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={createBooking.isPending}
        className="mt-6 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createBooking.isPending ? "Requesting…" : "Request session →"}
      </button>
    </div>
  );
}
