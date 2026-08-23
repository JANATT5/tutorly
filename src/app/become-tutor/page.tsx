// app/become-tutor/page.tsx  →  /become-tutor
//
// Redesigned 4-step flow:
//   1. All your info — basic details, what you teach, availability
//   2. Certificates — AI screens for authenticity
//   3. Teaching videos (4+) — AI screens for real teaching content
//   4. Review & submit
//
// Two-stage approval, on purpose: passing the AI checks in steps 2–3
// only clears the *AI* gate. Submitting in step 4 always lands on
// "pending admin review" — never an immediate "approved" — because a
// human still makes the final call. There's no backend yet (see the
// TODO in handleSubmit), so "AI analysis" is a simulated delay with a
// weighted random outcome — see components/become-tutor/CertificateStep
// and VideoStep for that logic.

"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { subjects, curricula, languages } from "@/lib/mock-data";
import CertificateStep, {
  isCertificateStepValid,
  type Certificate,
} from "@/components/become-tutor/CertificateStep";
import VideoStep, {
  isVideoStepValid,
  type TeachingVideo,
} from "@/components/become-tutor/VideoStep";

type Step = 1 | 2 | 3 | 4 | "submitted";

const dayOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const timeOfDayOptions = ["Mornings", "Afternoons", "Evenings"] as const;

function togglePill(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

const inputClasses =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

export default function BecomeTutorPage() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 — everything about the applicant
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
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimesOfDay, setSelectedTimesOfDay] = useState<string[]>([]);

  // Step 2 — certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Step 3 — teaching videos
  const [videos, setVideos] = useState<TeachingVideo[]>([]);

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
    selectedSubjects.length > 0 &&
    selectedDays.length > 0 &&
    selectedTimesOfDay.length > 0;

  const isStep2Valid = isCertificateStepValid(certificates);
  const isStep3Valid = isVideoStepValid(videos);

  function handleSubmit() {
    // TODO: send the full application to the backend once it exists.
    // photoFile, certificates, and videos will need real file storage.
    // Status is always "pending_admin_review" on submit — AI passing
    // steps 2–3 clears the AI gate, but an admin still makes the final
    // call (see (admin)/admin-dashboard's Verification tab).
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
      availability: { days: selectedDays, timesOfDay: selectedTimesOfDay },
      certificates: certificates.map((c) => ({ name: c.file.name, status: c.status })),
      videos: videos.map((v) => ({
        source: v.source.type === "file" ? v.source.file.name : v.source.url,
        status: v.status,
      })),
      status: "pending_admin_review",
    });
    setStep("submitted");
  }

  if (step === "submitted") {
    return (
      <>
        <PageHero eyebrow="For tutors" title="Application submitted" />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber/15 text-3xl">
            🕐
          </div>
          <h2 className="font-display text-2xl text-fg">Almost there, {fullName || "there"}!</h2>
          <p className="mt-3 text-body">
            Your certificates and teaching videos passed our AI screening — but that&apos;s only
            the first check. A member of our team now reviews every application by hand before
            it&apos;s approved, so you&apos;re not live on Tutorly just yet.
          </p>
          <p className="mt-3 text-sm text-subtle">
            We&apos;ll email {email || "you"} once an admin has made a final decision — usually
            within 2–3 business days.
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

            <div className="mt-8 rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">Availability</h2>

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
            </div>

            <button
              type="button"
              onClick={() => isStep1Valid && setStep(2)}
              disabled={!isStep1Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: verify your certificates →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <CertificateStep certificates={certificates} onChange={setCertificates} />
            <button
              type="button"
              onClick={() => isStep2Valid && setStep(3)}
              disabled={!isStep2Valid}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue: upload teaching videos →
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <VideoStep videos={videos} onChange={setVideos} />
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
              <p className="mt-2 text-sm text-subtle">
                Passing the AI checks below is the first step, not the last — an admin still
                reviews every application before it goes live.
              </p>

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

              <ReviewSection title="Availability">
                <ReviewRow label="Days" value={selectedDays.join(", ")} />
                <ReviewRow label="Time of day" value={selectedTimesOfDay.join(", ")} />
              </ReviewSection>

              <ReviewSection title="Certificates">
                <ReviewRow
                  label="AI check"
                  value={`${certificates.length} uploaded, ${
                    certificates.filter((c) => c.status === "verified").length
                  } verified`}
                />
              </ReviewSection>

              <ReviewSection title="Teaching videos">
                <ReviewRow
                  label="AI check"
                  value={`${videos.length} uploaded, ${
                    videos.filter((v) => v.status === "verified").length
                  } verified`}
                />
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