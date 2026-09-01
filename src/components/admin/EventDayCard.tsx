interface EventDayCardProps {
  title: string;
  subtitle: string;
  attended: number;
  registered: number;
  capacity: number;
}

function EventDayCard({
  title,
  subtitle,
  attended,
  registered,
  capacity,
}: EventDayCardProps) {
  const attendancePercentage = registered > 0 ? Math.round((attended / registered) * 100) : 0;
  const registrationPercentage = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-[#8592B4]">{subtitle}</p>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-white">{attended}</span>
          <span className="text-sm text-[#8592B4]">/ {registered}</span>
        </div>
        <p className="mt-1 text-xs text-[#5b6785]">attended / registered</p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-[#8592B4]">
          <span>Registration</span>
          <span>{registered} / {capacity}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#4C7CFF] transition-all duration-500"
            style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs text-[#8592B4]">Attendance rate</p>
        <p className="mt-1 text-sm font-medium text-white">{attendancePercentage}%</p>
      </div>
    </div>
  );
}

export default EventDayCard;