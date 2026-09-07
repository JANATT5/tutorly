// components/layout/TutorCard.tsx
//
// One tutor result in the Browse grid. Avatar is a placeholder initials
// circle for now — swap `initials` handling for a real photo URL once
// tutor profile images exist in the data model.

type TutorCardProps = {
  name: string;
  languages: string[];
  rating: number;
  sessions: number;
  pricePerHour: number;
  tags: string[];
  bio: string;
  href: string;
};

export default function TutorCard({
  name,
  languages,
  rating,
  sessions,
  pricePerHour,
  tags,
  bio,
  href,
}: TutorCardProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <a
      href={href}
      className="flex flex-col gap-4 rounded-2xl border border-[#DDD8CF] bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0EBE3] font-mono text-sm font-semibold text-[#1B4D3E]">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[#1A1714]">{name}</p>
            <p className="text-xs text-[#6B6560]">{languages.join(" · ")}</p>
            <p className="mt-0.5 text-xs text-[#6B6560]">
              <span className="text-[#F5A623]">★</span> {rating.toFixed(1)} · {sessions} sessions
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-serif text-lg text-[#1A1714]">${pricePerHour}</p>
          <p className="text-[11px] text-[#6B6560]">per hour</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#F0EBE3] px-2.5 py-1 text-xs font-medium text-[#3D3A37]"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="line-clamp-2 text-sm text-[#3D3A37]">{bio}</p>
    </a>
  );
}