// components/tutors/BookingForm.tsx
//
// The actual interactive part of /tutors/[tutorId]/book — split out
// from the page itself because the page needs to stay a server
// component (it looks the tutor up by id and 404s if missing), while
// this needs client-side state for the slot picker and form fields.
// No backend exists yet, so "submitting" generates a mock booking id
// and navigates to the confirmation route with the chosen details as
// query params — enough for that screen to show something real rather
// than a placeholder, without pretending there's a database behind it.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SubjectKey, Tutor } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

const upcomingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

function generateBookingId(): string {
  return `bk-${Math.random().toString(36).slice(2, 8)}`;
}

const inputClasses =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

export default function BookingForm({ tutor }: { tutor: Tutor }) {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [subject, setSubject] = useState<SubjectKey | "">("");
  const [studentName, setStudentName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const isValid =
    selectedDay !== null &&
    selectedTime !== null &&
    subject !== "" &&
    studentName.trim().length > 0 &&
    contact.trim().length > 0;

  function handleSubmit() {
    if (!isValid) return;

    const bookingId = generateBookingId();
    const params = new URLSearchParams({
      bookingId,
      subject,
      day: selectedDay!,
      time: selectedTime!,
    });
    router.push(`/tutors/${tutor.id}/book/confirmation?${params.toString()}`);
  }

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
              onClick={() => setSelectedDay(day)}
              aria-pressed={selectedDay === day}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                selectedDay === day
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-fg hover:border-forest"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSelectedTime(time)}
              aria-pressed={selectedTime === time}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                selectedTime === time
                  ? "bg-forest text-white"
                  : "border border-border bg-white text-fg hover:border-forest"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Contact + booking details */}
      <div className="rounded-xl border border-border bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
          Your details
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Subject <span className="text-amber">*</span>
            </span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectKey)}
              className={`${inputClasses} mt-2`}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {tutor.subjects.map((s) => (
                <option key={s} value={s}>
                  {subjectLabel[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Your name <span className="text-amber">*</span>
            </span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Full name"
              className={`${inputClasses} mt-2`}
            />
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Email or phone <span className="text-amber">*</span>
            </span>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@example.com or +961 70 000 000"
              className={`${inputClasses} mt-2`}
            />
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Notes for the tutor
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would you like to focus on?"
              rows={3}
              className={`${inputClasses} mt-2 resize-none`}
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className="mt-6 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Request session →
      </button>
    </div>
  );
}
