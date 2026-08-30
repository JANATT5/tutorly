// components/become-tutor/VideoStep.tsx
//
// Step 3: at least 4 teaching videos, either uploaded directly or
// linked (YouTube, Google Drive, etc.), then the same simulated
// AI-check pattern as CertificateStep — this one screens for whether
// the video actually shows real teaching, not just that a file exists.

"use client";

import { useState } from "react";

export type VideoStatus = "pending" | "analyzing" | "verified" | "flagged";

export type TeachingVideo = {
  id: string;
  source: { type: "file"; file: File } | { type: "link"; url: string };
  status: VideoStatus;
};

const MIN_VIDEOS = 4;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Weighted heavily toward passing — rejections rare (~5%) but still
// reachable, same reasoning as CertificateStep.
function simulateAnalysis(): VideoStatus {
  return Math.random() < 0.97 ? "verified" : "flagged";
}

type VideoStepProps = {
  videos: TeachingVideo[];
  onChange: (videos: TeachingVideo[]) => void;
};

export default function VideoStep({ videos, onChange }: VideoStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [linkInput, setLinkInput] = useState("");

  function handleAddFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const newVideos: TeachingVideo[] = files.map((file) => ({
      id: generateId(),
      source: { type: "file", file },
      status: "pending",
    }));
    onChange([...videos, ...newVideos]);
    event.target.value = "";
  }

  function handleAddLink() {
    const url = linkInput.trim();
    if (!url) return;
    onChange([...videos, { id: generateId(), source: { type: "link", url }, status: "pending" }]);
    setLinkInput("");
  }

  function handleRemove(id: string) {
    onChange(videos.filter((v) => v.id !== id));
  }

  async function handleRunAnalysis() {
    const pendingOrFlagged = videos.filter(
      (v) => v.status === "pending" || v.status === "flagged"
    );
    if (pendingOrFlagged.length === 0) return;

    setIsAnalyzing(true);
    onChange(
      videos.map((v) =>
        v.status === "pending" || v.status === "flagged" ? { ...v, status: "analyzing" } : v
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 900));

    onChange(videos.map((v) => (v.status === "analyzing" ? { ...v, status: simulateAnalysis() } : v)));
    setIsAnalyzing(false);
  }

  const hasFlagged = videos.some((v) => v.status === "flagged");
  const hasUnanalyzed = videos.some((v) => v.status === "pending" || v.status === "analyzing");
  const meetsMinimum = videos.length >= MIN_VIDEOS;

  return (
    <div className="rounded-xl border border-border bg-white p-8">
      <h2 className="font-display text-2xl text-fg">Show us you can teach</h2>
      <p className="mt-2 text-sm text-body">
        Upload at least {MIN_VIDEOS} short videos of yourself teaching — recorded clips or links
        to existing recordings both work. Our AI reviews each one before your application moves
        forward.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 py-8 text-center transition-colors hover:border-forest">
          <span className="text-2xl" aria-hidden="true">
            🎥
          </span>
          <span className="text-sm font-medium text-fg">Upload video files</span>
          <span className="text-xs text-subtle">MP4 or MOV — select up to {MIN_VIDEOS} at once</span>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleAddFiles}
            className="sr-only"
          />
        </label>

        <div className="flex flex-col justify-center gap-2 rounded-xl border border-border p-6">
          <span className="text-sm font-medium text-fg">Or paste a link</span>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://youtube.com/…"
              className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-forest"
            />
            <button
              type="button"
              onClick={handleAddLink}
              disabled={!linkInput.trim()}
              className="shrink-0 rounded-lg bg-forest px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-subtle">
        {videos.length} of {MIN_VIDEOS} minimum videos added
      </p>

      {videos.length > 0 && (
        <ul className="mt-3 space-y-3">
          {videos.map((video, index) => (
            <li
              key={video.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-lg" aria-hidden="true">
                  🎥
                </span>
                <span className="truncate text-sm text-fg">
                  {video.source.type === "file"
                    ? video.source.file.name
                    : `Video ${index + 1} — ${video.source.url}`}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={video.status} />
                <button
                  type="button"
                  onClick={() => handleRemove(video.id)}
                  className="text-xs text-subtle underline underline-offset-2 hover:text-fg"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {videos.length > 0 && (
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || !hasUnanalyzed || !meetsMinimum}
          className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing…" : "Run AI check"}
        </button>
      )}

      {!meetsMinimum && videos.length > 0 && (
        <p className="mt-3 text-sm text-subtle">
          Add {MIN_VIDEOS - videos.length} more video{MIN_VIDEOS - videos.length === 1 ? "" : "s"}{" "}
          before running the AI check.
        </p>
      )}

      {hasFlagged && (
        <p className="mt-4 text-sm text-[#B3261E]">
          One or more videos were flagged — the clip may be unclear or doesn&apos;t show enough
          teaching. Remove it and add a different one, then run the check again.
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: VideoStatus }) {
  const config: Record<VideoStatus, { label: string; classes: string }> = {
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

export function isVideoStepValid(videos: TeachingVideo[]): boolean {
  // Loosened for now: just needs the minimum number uploaded — doesn't
  // require the AI check to have run or passed, matching the same
  // change in CertificateStep. Tighten this back to requiring
  // "verified" once the AI check is backed by something real.
  return videos.length >= MIN_VIDEOS;
}