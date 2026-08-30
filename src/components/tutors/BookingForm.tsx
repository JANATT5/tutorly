// components/tutors/BookingForm.tsx
//
// Restructured to follow Type → Initial State → Validation → Handling.
// Also fixes a real gap the old version had: the submit button was
// just silently disabled with no explanation of which field was
// missing — now validation errors actually render per field.
//
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

// ---- Type ----
type BookingFormData = {
  day: string;
  time: string;
  subject: SubjectKey | "";
  studentName: string;
  contact: string;
  notes: string;
};

type BookingFormErrors = Partial<Record<keyof BookingFormData, string>>;

// ---- Initialization ----
const initialBookingFormData: BookingFormData = {
  day: "",
  time: "",
  subject: "",
  studentName: "",
  contact: "",
  notes: "",
};

// ---- Validation ----
function validateBookingForm(data: BookingFormData): BookingFormErrors {
  const errors: BookingFormErrors = {};
  if (!data.day) errors.day = "Pick a day.";
  if (!data.time) errors.time = "Pick a time.";
  if (!data.subject) errors.subject = "Select a subject.";
  if (!data.studentName.trim()) errors.studentName = "Your name is required.";
  if (!data.contact.trim()) errors.contact = "An email or phone number is required.";
  return errors;
}

export default function BookingForm({ tutor }: { tutor: Tutor }) {
  const router = useRouter();
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
    if (Object.keys(validationErrors).length > 0) return;

    const bookingId = generateBookingId();
    const params = new URLSearchParams({
      bookingId,
      subject: formData.subject,
      day: formData.day,
      time: formData.time,
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
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value as SubjectKey)}
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
            {errors.subject && (
              <p className="mt-1 text-xs text-[#B3261E]">{errors.subject}</p>
            )}
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Your name <span className="text-amber">*</span>
            </span>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => handleChange("studentName", e.target.value)}
              placeholder="Full name"
              className={`${inputClasses} mt-2`}
            />
            {errors.studentName && (
              <p className="mt-1 text-xs text-[#B3261E]">{errors.studentName}</p>
            )}
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Email or phone <span className="text-amber">*</span>
            </span>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              placeholder="you@example.com or +961 70 000 000"
              className={`${inputClasses} mt-2`}
            />
            {errors.contact && (
              <p className="mt-1 text-xs text-[#B3261E]">{errors.contact}</p>
            )}
          </label>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              Notes for the tutor
            </span>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
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
        className="mt-6 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
      >
        Request session →
      </button>
    </div>
  );
}