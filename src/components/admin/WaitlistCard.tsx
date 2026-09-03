interface WaitlistCardProps {
  totalRegistered: number;
  onWaitlist: number;
  capacity: number;
  available: number;
  promoted: number;
}

function WaitlistCard({
  totalRegistered,
  onWaitlist,
  capacity,
  available,
  promoted,
}: WaitlistCardProps) {
  const totalConsumed = totalRegistered;
  const percentage = capacity > 0 ? Math.round((totalConsumed / capacity) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-white">Waitlist</h3>
        <p className="mt-1 text-sm text-[#8592B4]">Students currently on the waitlist</p>
      </div>

      <div className="mt-8">
        <span className="font-display text-3xl font-semibold text-white">{promoted}</span>
        <p className="mt-1 text-xs text-[#5b6785]">successfully registered from waitlist</p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-[#8592B4]">
          <span>Waitlist capacity</span>
          <span>{totalConsumed} / {capacity}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#38BDF8] transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-[#8592B4]">Still waiting</p>
          <p className="mt-1 text-sm font-medium text-white">{onWaitlist}</p>
        </div>
        <div>
          <p className="text-xs text-[#8592B4]">Available waitlist slots</p>
          <p className="mt-1 text-sm font-medium text-white">{available}</p>
        </div>
      </div>
    </div>
  );
}

export default WaitlistCard;