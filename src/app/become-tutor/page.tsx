// app/become-tutor/page.tsx  →  /become-tutor
//
// Full 4-step wizard: Basic information + What you teach (step 1,
// matches the Figma reference exactly), then Verify your background,
// Availability, and Review & submit — steps 2–4 weren't designed in
// Figma yet, so these are built to a sensible, functional standard
// rather than a pixel spec. Steps are local component state (like
// the Career Quiz's intro/questions/results pattern — see the "Nav
// Data Gotcha" note in app/quiz/page.tsx) rather than separate routes,
// since nothing here needs to be independently bookmarkable and a
// single page keeps all the form state in one place with no data
// passed across a navigation boundary.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { subjects, curricula, languages } from "@/lib/mock-data";

type Step = 1 | 2 | 3 | 4 | "submitted";

const qualificationOptions = [
  "High school diploma",
  "Currently enrolled — university student",
  "Bachelor's degree",
  "Master's degree",
  "PhD",
] as const;

const dayOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const timeOfDayOptions = ["Mornings", "Afternoons", "Evenings"] as const;

function togglePill(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

const inputClasses =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

export default function BecomeTutorPage() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — Basic information + What you teach
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [specificTopics, setSpecificTopics] = useState("");
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Step 2 — Verify your background
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [qualification, setQualification] = useState<string>("");
  const [institution, setInstitution] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");

  // Step 3 — Availability
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimesOfDay, setSelectedTimesOfDay] = useState<string[]>([]);
  const [availabilityNotes, setAvailabilityNotes] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handleRemovePhoto() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
  }

  const isStep1Valid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    hourlyRate.trim().length > 0 &&
    bio.trim().length > 0 &&
    selectedSubjects.length > 0;

  const isStep2Valid =
    idDocument !== null && qualification.length > 0 && institution.trim().length > 0;

  const isStep3Valid = selectedDays.length > 0 && selectedTimesOfDay.length > 0;

  function handleSubmit() {
    // TODO: send the full application to the backend once it exists
    // (Prisma/Supabase, per the project's planned stack). photoFile and
    // idDocument will need real file storage — for now everything just
    // lives in memory for this session.
    console.log({
      fullName,
      email,
      phone,
      hourlyRate,
      bio,
      photoFile,
      subjects: selectedSubjects,
      specificTopics,
      curricula: selectedCurricula,
      languages: selectedLanguages,
      idDocument,
      qualification,
      institution,
      yearsExperience,
      availability: { days: selectedDays, timesOfDay: selectedTimesOfDay, notes: availabilityNotes },
    });
    setStep("submitted");
  }

  if (step === "submitted") {
    return (
      <>
        <PageHero eyebrow="For tutors" title="Application submitted" />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
            ✅
          </div>
          <h2 className="font-display text-2xl text-fg">Thanks, {fullName || "there"}!</h2>
          <p className="mt-3 text-body">
            We&apos;ve received your application. Our team typically reviews new tutor
            applications within 2–3 business days — we&apos;ll email you at{" "}
            <span className="font-medium text-fg">{email || "your address"}</span> once it&apos;s
            approved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Back to home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={`For tutors · Step ${step} of 4`}
        title="Become a tutor"
        subtitle="Set your own rate, manage your own schedule. Students come to you."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (typeof s === "number" ? ((s - 1) as Step) : s))}
            className="mb-6 flex items-center gap-1.5 text-sm text-subtle hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        )}

        {step === 1 && (
          <>
            <div className="rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">Basic information</h2>

              <div className="mt-6">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                  Profile photo
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
                    {photoPreviewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreviewUrl}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-subtle" aria-hidden="true">
                        👤
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="inline-block w-fit cursor-pointer rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-forest">
                      {photoFile ? "Change photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                    {photoFile && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-xs text-subtle underline underline-offset-2 hover:text-fg"
                      >
                        Remove photo
                      </button>
                    )}
                    <p className="text-xs text-subtle">
                      Students see this on your profile. JPG or PNG, shown however you&apos;d
                      like to present yourself.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Email" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Phone" required>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+961 70 000 000"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Hourly rate (USD)" required>
                  <input
                    type="number"
                    min={0}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="25"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Short bio" required>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell students about your background, teaching style, and what makes you effective…"
                    rows={4}
                    className={`${inputClasses} resize-none`}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">What you teach</h2>

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Subjects <span className="text-amber">*</span>
              </p>
              <PillGroup
                options={subjects.map((s) => s.label)}
                selected={selectedSubjects}
                onToggle={(value) => setSelectedSubjects((prev) => togglePill(prev, value))}
              />

              <div className="mt-6">
                <Field label="Specific topics">
                  <input
                    type="text"
                    value={specificTopics}
                    onChange={(e) => setSpecificTopics(e.target.value)}
                    placeholder="e.g. Mechanics, Organic Chemistry, Python, Calculus…"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Curricula
              </p>
              <PillGroup
                options={[...curricula]}
                selected={selectedCurricula}
                onToggle={(value) => setSelectedCurricula((prev) => togglePill(prev, value))}
              />

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Languages
              </p>
              <PillGroup
                options={[...languages]}
                selected={selectedLanguages}
                onToggle={(value) => setSelectedLanguages((prev) => togglePill(prev, value))}
              />
            </div>

            <button
              type="button"
              onClick={() => isStep1Valid && setStep(2)}
              disabled={!isStep1Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: verify your background →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">Verify your background</h2>
              <p className="mt-2 text-sm text-subtle">
                This helps students trust who they&apos;re booking with. Your ID is never shown
                publicly.
              </p>

              <div className="mt-6">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                  ID document <span className="text-amber">*</span>
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-block w-fit cursor-pointer rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-forest">
                    {idDocument ? "Change file" : "Upload ID"}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setIdDocument(e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  {idDocument && (
                    <span className="text-sm text-body">{idDocument.name}</span>
                  )}
                </div>
                <p className="mt-2 text-xs text-subtle">
                  A national ID, passport, or student ID. JPG, PNG, or PDF.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Highest qualification" required>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {qualificationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Institution" required>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. American University of Beirut"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Years of teaching experience">
                  <input
                    type="number"
                    min={0}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="2"
                    className={inputClasses}
                  />
                </Field>
              </div>
            </div>

            <button
              type="button"
              onClick={() => isStep2Valid && setStep(3)}
              disabled={!isStep2Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: set your availability →
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">Availability</h2>
              <p className="mt-2 text-sm text-subtle">
                A general sense of when you&apos;re free — students will request specific times
                within this once you&apos;re live.
              </p>

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Days <span className="text-amber">*</span>
              </p>
              <PillGroup
                options={[...dayOptions]}
                selected={selectedDays}
                onToggle={(value) => setSelectedDays((prev) => togglePill(prev, value))}
              />

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Time of day <span className="text-amber">*</span>
              </p>
              <PillGroup
                options={[...timeOfDayOptions]}
                selected={selectedTimesOfDay}
                onToggle={(value) => setSelectedTimesOfDay((prev) => togglePill(prev, value))}
              />

              <div className="mt-6">
                <Field label="Anything else students should know?">
                  <textarea
                    value={availabilityNotes}
                    onChange={(e) => setAvailabilityNotes(e.target.value)}
                    placeholder="e.g. Not available during exam weeks in June"
                    rows={3}
                    className={`${inputClasses} resize-none`}
                  />
                </Field>
              </div>
            </div>

            <button
              type="button"
              onClick={() => isStep3Valid && setStep(4)}
              disabled={!isStep3Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: review &amp; submit →
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">Review &amp; submit</h2>

              <ReviewSection title="Basic information">
                <ReviewRow label="Name" value={fullName} />
                <ReviewRow label="Email" value={email} />
                <ReviewRow label="Phone" value={phone} />
                <ReviewRow label="Rate" value={hourlyRate ? `$${hourlyRate}/hr` : ""} />
              </ReviewSection>

              <ReviewSection title="What you teach">
                <ReviewRow label="Subjects" value={selectedSubjects.join(", ")} />
                <ReviewRow label="Curricula" value={selectedCurricula.join(", ")} />
                <ReviewRow label="Languages" value={selectedLanguages.join(", ")} />
              </ReviewSection>

              <ReviewSection title="Background">
                <ReviewRow label="Qualification" value={qualification} />
                <ReviewRow label="Institution" value={institution} />
                <ReviewRow
                  label="ID document"
                  value={idDocument ? idDocument.name : "Not uploaded"}
                />
              </ReviewSection>

              <ReviewSection title="Availability">
                <ReviewRow label="Days" value={selectedDays.join(", ")} />
                <ReviewRow label="Time of day" value={selectedTimesOfDay.join(", ")} />
              </ReviewSection>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-8 w-full rounded-full bg-amber px-7 py-4 text-sm font-semibold text-fg transition-colors hover:bg-amber-hover"
            >
              Submit application
            </button>
          </>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
        {label}
        {required && <span className="text-amber"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function PillGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-forest text-white"
                : "border border-border bg-white text-fg hover:border-forest"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">{title}</p>
      <div className="mt-3 space-y-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 text-sm">
      <span className="text-subtle">{label}</span>
      <span className="font-medium text-fg">{value || "—"}</span>
    </div>
  );
}
