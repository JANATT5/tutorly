import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#1B4D3E] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        
         <a href="#"
          className="font-display text-xl font-semibold text-white tracking-tight shrink-0"
        >
          tutorly
          <span className="text-[#D47A2A] text-2xl leading-none">.</span>
        </a>

        <div className="hidden sm:flex items-center gap-5 text-sm font-medium">
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Find a tutor
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Practice
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors">
            Career quiz
          </a>

          <Button variant="outline" icon="✦">
            Planr
          </Button>
          <Button variant="primary">Become a tutor</Button>
        </div>
      </div>
    </nav>
  );
}