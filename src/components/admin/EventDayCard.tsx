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
  const attendancePercentage =
    registered > 0
      ? Math.round(
          (attended / registered) * 100
        )
      : 0;

  const registrationPercentage =
    capacity > 0
      ? Math.round(
          (registered / capacity) * 100
        )
      : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div>
        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold">
            {attended}
          </span>

          <span className="text-sm text-gray-500">
            / {registered}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          attended / registered
        </p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            Registration
          </span>

          <span>
            {registered} / {capacity}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-black transition-all duration-500"
            style={{
              width: `${Math.min(
                registrationPercentage,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          Attendance rate
        </p>

        <p className="mt-1 text-sm font-medium">
          {attendancePercentage}%
        </p>
      </div>

    </div>
  );
}

export default EventDayCard;