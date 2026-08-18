type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  active = false,
  onClick,
  icon,
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        className="bg-[#D47A2A] text-[#1A1714] font-semibold px-4 py-1.5 rounded-full hover:bg-[#C06820] transition-colors"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
        active
          ? "bg-[#D47A2A] border-[#D47A2A] text-[#1A1714]"
          : "border-[#D47A2A]/50 text-[#D47A2A] hover:bg-[#D47A2A] hover:border-[#D47A2A] hover:text-[#1A1714]"
      }`}
    >
      {icon && <span className="text-xs leading-none">{icon}</span>}
      {children}
    </button>
  );
}