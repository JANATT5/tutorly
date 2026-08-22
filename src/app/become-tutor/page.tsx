// app/become-tutor/page.tsx  →  /become-tutor
//
// Step 1 of 4 (Basic information + What you teach) per the Figma
// reference. Steps 2–4 (verify background, availability, review) aren't
// designed yet — this only builds what's shown. Subjects/curricula/
// languages come from lib/mock-data so this form and Browse's filters
// stay in sync with one list instead of drifting, like Home did before.

"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { subjects, curricula, languages } from "@/lib/mock-data";

function togglePill(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function BecomeTutorPage() {
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

  // Revoke the previous object URL whenever the photo changes or the
  // component unmounts, so we don't leak memory across re-selections.
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

  const isStepValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    hourlyRate.trim().length > 0 &&
    bio.trim().length > 0 &&
    selectedSubjects.length > 0;

  function handleContinue() {
    if (!isStepValid) return;
    // TODO: persist step 1 and route to step 2 (verify your background)
    // once that step is designed. photoFile will need to be uploaded to
    // real storage (Supabase Storage, per the project's planned stack)
    // once that's wired up — for now it's just held in memory.
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
    });
  }

  const inputClasses =
    "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

  return (
    <>
      <PageHero
        eyebrow="For tutors · Step 1 of 4"
        title="Become a tutor"
        subtitle="Set your own rate, manage your own schedule. Students come to you."
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Basic information */}
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
                  Students see this on your profile. JPG or PNG, shown however you&apos;d like to
                  present yourself.
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

        {/* What you teach */}
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
          onClick={handleContinue}
          disabled={!isStepValid}
          className="mt-8 w-full rounded-full bg-forest px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue: verify your background →
        </button>
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