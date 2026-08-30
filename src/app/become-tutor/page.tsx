// app/become-tutor/page.tsx  →  /become-tutor
//
// Step 1's form restructured to follow Type → Initial State →
// Validation → Handling, replacing 11 separate useState calls with one
// typed form-data object, a dedicated validate function, and real
// per-field error messages (previously the Continue button was just
// silently disabled with no explanation of what was missing).
//
// 4-step flow:
//   1. All your info — basic details, what you teach, availability
//   2. Certificates — AI screens for authenticity
//   3. Teaching videos (4+) — AI screens for real teaching content
//   4. Review & submit
//
// Two-stage approval, on purpose: passing the AI checks in steps 2–3
// only clears the *AI* gate. Submitting in step 4 always lands on
// "pending admin review" — never an immediate "approved" — because a
// human still makes the final call. There's no backend yet (see the
// TODO in handleSubmit), so "AI analysis" is a simulated delay — see
// components/become-tutor/CertificateStep and VideoStep.

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

// ---- Type ----
// Everything Step 1 collects, in one shape — file upload (photo) is
// kept as separate state below, since a File object isn't really
// "form data" in the same sense as text/selection fields.
type BecomeTutorFormData = {
  fullName: string;
  email: string;
  phone: string;
  hourlyRate: string;
  bio: string;
  subjects: string[];
  specificTopics: string;
  curricula: string[];
  languages: string[];
  days: string[];
  timesOfDay: string[];
};

type BecomeTutorFormErrors = Partial<Record<keyof BecomeTutorFormData, string>>;

// ---- Initialization ----
const initialFormData: BecomeTutorFormData = {
  fullName: "",
  email: "",
  phone: "",
  hourlyRate: "",
  bio: "",
  subjects: [],
  specificTopics: "",
  curricula: [],
  languages: [],
  days: [],
  timesOfDay: [],
};

// ---- Validation ----
function validateStep1(data: BecomeTutorFormData): BecomeTutorFormErrors {
  const errors: BecomeTutorFormErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  if (!data.hourlyRate.trim()) errors.hourlyRate = "Hourly rate is required.";
  if (!data.bio.trim()) errors.bio = "A short bio is required.";
  if (data.subjects.length === 0) errors.subjects = "Select at least one subject.";
  if (data.days.length === 0) errors.days = "Select at least one day.";
  if (data.timesOfDay.length === 0) errors.timesOfDay = "Select at least one time of day.";
  return errors;
}

export default function BecomeTutorPage() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 form state
  const [formData, setFormData] = useState<BecomeTutorFormData>(initialFormData);
  const [errors, setErrors] = useState<BecomeTutorFormErrors>({});

  // Profile photo — separate from formData since it's a File, not a
  // plain field value
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  // Step 2 — certificates
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Step 3 — teaching videos
  const [videos, setVideos] = useState<TeachingVideo[]>([]);

  function handleChange<K extends keyof BecomeTutorFormData>(
    field: K,
    value: BecomeTutorFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleTogglePill(field: "subjects" | "curricula" | "languages" | "days" | "timesOfDay", value: string) {
    handleChange(field, togglePill(formData[field], value));
  }

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

  // ---- Handling ----
  function handleStep1Continue() {
    const validationErrors = validateStep1(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setStep(2);
  }

  const isStep2Valid = isCertificateStepValid(certificates);
  const isStep3Valid = isVideoStepValid(videos);

  function handleSubmit() {
    // TODO: send the full application to the backend once it exists.
    // photoFile, certificates, and videos will need real file storage.
    // Status is always "pending_admin_review" on submit — AI passing
    // steps 2–3 clears the AI gate, but an admin still makes the final
    // call (see components/dashboards/AdminDashboardContent's
    // Verification tab, rendered at /dashboard for the admin role).
    console.log({
      ...formData,
      photoFile,
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
          <h2 className="font-display text-2xl text-fg">
            Almost there, {formData.fullName || "there"}!
          </h2>
          <p className="mt-3 text-body">
            Your certificates and teaching videos passed our AI screening — but that&apos;s only
            the first check. A member of our team now reviews every application by hand before
            it&apos;s approved, so you&apos;re not live on Tutorly just yet.
          </p>
          <p className="mt-3 text-sm text-subtle">
            We&apos;ll email {formData.email || "you"} once an admin has made a final decision —
            usually within 2–3 business days.
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
                <Field label="Full name" required error={errors.fullName}>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Your full name"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Email" required error={errors.email}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Phone" required error={errors.phone}>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+961 70 000 000"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Hourly rate (USD)" required error={errors.hourlyRate}>
                  <input
                    type="number"
                    min={0}
                    value={formData.hourlyRate}
                    onChange={(e) => handleChange("hourlyRate", e.target.value)}
                    placeholder="25"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="mt-6">
                <Field label="Short bio" required error={errors.bio}>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
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
                selected={formData.subjects}
                onToggle={(value) => handleTogglePill("subjects", value)}
              />
              {errors.subjects && (
                <p className="mt-2 text-xs text-[#B3261E]">{errors.subjects}</p>
              )}

              <div className="mt-6">
                <Field label="Specific topics">
                  <input
                    type="text"
                    value={formData.specificTopics}
                    onChange={(e) => handleChange("specificTopics", e.target.value)}
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
                selected={formData.curricula}
                onToggle={(value) => handleTogglePill("curricula", value)}
              />

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Languages
              </p>
              <PillGroup
                options={[...languages]}
                selected={formData.languages}
                onToggle={(value) => handleTogglePill("languages", value)}
              />
            </div>

            <div className="mt-8 rounded-xl border border-border bg-white p-8">
              <h2 className="font-display text-2xl text-fg">Availability</h2>

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Days <span className="text-amber">*</span>
              </p>
              <PillGroup
                options={[...dayOptions]}
                selected={formData.days}
                onToggle={(value) => handleTogglePill("days", value)}
              />
              {errors.days && <p className="mt-2 text-xs text-[#B3261E]">{errors.days}</p>}

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                Time of day <span className="text-amber">*</span>
              </p>
              <PillGroup
                options={[...timeOfDayOptions]}
                selected={formData.timesOfDay}
                onToggle={(value) => handleTogglePill("timesOfDay", value)}
              />
              {errors.timesOfDay && (
                <p className="mt-2 text-xs text-[#B3261E]">{errors.timesOfDay}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleStep1Continue}
              className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
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
                <ReviewRow label="Name" value={formData.fullName} />
                <ReviewRow label="Email" value={formData.email} />
                <ReviewRow label="Phone" value={formData.phone} />
                <ReviewRow
                  label="Rate"
                  value={formData.hourlyRate ? `$${formData.hourlyRate}/hr` : ""}
                />
              </ReviewSection>

              <ReviewSection title="What you teach">
                <ReviewRow label="Subjects" value={formData.subjects.join(", ")} />
                <ReviewRow label="Curricula" value={formData.curricula.join(", ")} />
                <ReviewRow label="Languages" value={formData.languages.join(", ")} />
              </ReviewSection>

              <ReviewSection title="Availability">
                <ReviewRow label="Days" value={formData.days.join(", ")} />
                <ReviewRow label="Time of day" value={formData.timesOfDay.join(", ")} />
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
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-subtle">
        {label}
        {required && <span className="text-amber"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-xs text-[#B3261E]">{error}</p>}
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