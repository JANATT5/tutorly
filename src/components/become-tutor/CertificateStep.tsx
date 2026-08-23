// components/become-tutor/CertificateStep.tsx
//
// Step 2 of the tutor application: upload certificates/qualifications,
// then run a simulated AI check for authenticity before continuing.
// There's no real document-verification AI wired up yet (no backend
// exists for this project — see the TODOs elsewhere in this flow), so
// "analysis" is a fake delay that resolves to verified/flagged with a
// weighted random outcome, just enough to demonstrate the real product
// flow: AI pre-screens, flagged items block progress until replaced,
// and even a fully-verified set only clears the AI gate — it still
// needs human admin approval later (see the review step).

"use client";

import { useState } from "react";

export type CertificateStatus = "pending" | "analyzing" | "verified" | "flagged";

export type Certificate = {
  id: string;
  file: File;
  status: CertificateStatus;
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Weighted heavily toward passing — this is a demo of the flow, not a
// real fraud model. Rejections are rare (~5%) so testing the happy
// path doesn't require repeated retries, but the reject path still
// exists and is reachable.
function simulateAnalysis(): CertificateStatus {
  return Math.random() < 0.97 ? "verified" : "flagged";
}

const inputClasses =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest";

type CertificateStepProps = {
  certificates: Certificate[];
  onChange: (certificates: Certificate[]) => void;
};

export default function CertificateStep({ certificates, onChange }: CertificateStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleAddFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const newCertificates: Certificate[] = files.map((file) => ({
      id: generateId(),
      file,
      status: "pending",
    }));
    onChange([...certificates, ...newCertificates]);
    event.target.value = "";
  }

  function handleRemove(id: string) {
    onChange(certificates.filter((c) => c.id !== id));
  }

  async function handleRunAnalysis() {
    const pendingOrFlagged = certificates.filter(
      (c) => c.status === "pending" || c.status === "flagged"
    );
    if (pendingOrFlagged.length === 0) return;

    setIsAnalyzing(true);
    onChange(
      certificates.map((c) =>
        c.status === "pending" || c.status === "flagged" ? { ...c, status: "analyzing" } : c
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 800));

    onChange(
      certificates.map((c) =>
        c.status === "analyzing" ? { ...c, status: simulateAnalysis() } : c
      )
    );
    setIsAnalyzing(false);
  }

  const hasFlagged = certificates.some((c) => c.status === "flagged");
  const hasUnanalyzed = certificates.some(
    (c) => c.status === "pending" || c.status === "analyzing"
  );

  return (
    <div className="rounded-xl border border-border bg-white p-8">
      <h2 className="font-display text-2xl text-fg">Verify your certificates</h2>
      <p className="mt-2 text-sm text-body">
        Upload your degrees, diplomas, or teaching certifications. Our AI screens each one for
        authenticity before your application moves forward — flagged documents can be replaced
        and re-checked.
      </p>

      <label className="mt-6 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 py-8 text-center transition-colors hover:border-forest">
        <span className="text-2xl" aria-hidden="true">
          📄
        </span>
        <span className="text-sm font-medium text-fg">Click to upload certificates</span>
        <span className="text-xs text-subtle">JPG, PNG, or PDF — you can add more than one</span>
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleAddFiles}
          className={inputClasses + " sr-only"}
        />
      </label>

      {certificates.length > 0 && (
        <ul className="mt-6 space-y-3">
          {certificates.map((cert) => (
            <li
              key={cert.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-lg" aria-hidden="true">
                  📄
                </span>
                <span className="truncate text-sm text-fg">{cert.file.name}</span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={cert.status} />
                <button
                  type="button"
                  onClick={() => handleRemove(cert.id)}
                  className="text-xs text-subtle underline underline-offset-2 hover:text-fg"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {certificates.length > 0 && (
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || !hasUnanalyzed}
          className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing…" : "Run AI check"}
        </button>
      )}

      {hasFlagged && (
        <p className="mt-4 text-sm text-[#B3261E]">
          One or more certificates were flagged as potentially fraudulent. Remove them and
          upload a clearer copy, then run the check again.
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: CertificateStatus }) {
  const config: Record<CertificateStatus, { label: string; classes: string }> = {
    pending: { label: "Not analyzed", classes: "bg-secondary text-subtle" },
    analyzing: { label: "Analyzing…", classes: "bg-amber/15 text-amber-hover" },
    verified: { label: "✓ Verified", classes: "bg-forest/10 text-forest" },
    flagged: { label: "⚠ Flagged", classes: "bg-[#FBE9E7] text-[#B3261E]" },
  };
  const { label, classes } = config[status];

  return (
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

export function isCertificateStepValid(certificates: Certificate[]): boolean {
  // Loosened for now: just needs at least one file uploaded — doesn't
  // require the AI check to have run or passed. Tighten this back to
  // requiring "verified" once the AI check is backed by something real.
  return certificates.length > 0;
}