import Navbar from "@/components/Navbar";
import SubjectPill from "@/components/SubjectPill";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F5F1E8] px-8 py-16 md:px-24">
        <p className="text-[#4A7C59] tracking-widest text-sm font-semibold mb-4">
          ACADEMIC TUTORING FOR GRADE 12 &amp; UNIVERSITY &middot; LEBANON
        </p>

        <h1 className="text-6xl md:text-7xl font-serif text-[#1B3B2F] leading-tight">
          Learn
          <br />
          <span className="italic">smarter,</span>
          <br />
          match faster.
        </h1>

        <p className="text-xl text-[#1B3B2F]/80 mt-6 mb-10">
          Pick a subject and meet your tutor today.
        </p>

        <p className="text-[#4A7C59] tracking-widest text-sm font-semibold mb-4">
          PICK A SUBJECT TO START
        </p>

        <div className="flex gap-3 flex-wrap">
          <SubjectPill icon="Σ" label="Mathematics" />
          <SubjectPill icon="⚡" label="Physics" />
          <SubjectPill icon="🧪" label="Chemistry" />
          <SubjectPill icon="🧬" label="Biology" />
          <SubjectPill icon="</>" label="Computer Science" />
        </div>
      </main>
    </>
  );
}