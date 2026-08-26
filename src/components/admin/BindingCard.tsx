import { Link } from "react-router-dom";

interface BindingCardProps {
  title: string;
  date?: string;
  registered?: number | string;
  binded?: number | string;
  emptySlots?: number | string;
  waitlist?: number | string;
  to: string;
  disabled?: boolean;
}

function BindingCard({
  title,
  date,
  registered,
  binded,
  emptySlots,
  waitlist,
  to,
  disabled = false,
}: BindingCardProps) {
  const isWaitlist = waitlist !== undefined;

  const cardContent = (
    <>
      <div>
        <h2 className={`font-display text-xl font-semibold ${disabled ? "text-[#5b6785]" : "text-white"}`}>
          {title}
        </h2>
        {date && <p className="mt-1 text-sm text-[#8592B4]">{date}</p>}
      </div>

      {disabled && (
        <div className="mt-6 rounded-lg bg-white/5 p-4">
          <p className="text-sm font-medium text-[#8592B4]">Binding unavailable</p>
          <p className="mt-1 text-xs text-[#5b6785]">Registration capacity has been reached.</p>
        </div>
      )}

      {!disabled && !isWaitlist && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs text-[#8592B4]">Registered</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">{registered ?? "--"}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs text-[#8592B4]">Binded</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">{binded ?? "--"}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs text-[#8592B4]">Empty Slots</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">{emptySlots ?? "--"}</p>
          </div>
        </div>
      )}

      {!disabled && isWaitlist && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs text-[#8592B4]">Slots Open</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">{emptySlots ?? "--"}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <p className="text-xs text-[#8592B4]">People on Waitlist</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">{waitlist ?? "--"}</p>
          </div>
        </div>
      )}

      {!disabled && <p className="mt-6 text-sm font-medium text-[#38BDF8]">Open Binding →</p>}
    </>
  );

  if (disabled) {
    return (
      <div className="glass-card cursor-not-allowed rounded-2xl p-6 opacity-60">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="glass-card block rounded-2xl p-6 transition hover:border-[#4C7CFF]/40 hover:shadow-[0_0_30px_rgba(76,124,255,0.15)]"
    >
      {cardContent}
    </Link>
  );
}

export default BindingCard;