import Navbar from "@/components/Navbar";

export default function Browse() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F5F1E8] min-h-screen px-8 py-16 md:px-24">
        <p className="text-[#4A7C59] tracking-widest text-sm font-semibold mb-4">
          FIND A TUTOR
        </p>
        <h1 className="text-4xl font-serif text-[#1B3B2F]">Browse tutors</h1>
      </main>
    </>
  );
}