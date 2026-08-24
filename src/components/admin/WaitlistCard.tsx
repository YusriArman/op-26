interface WaitlistCardProps {
  registered: number;
  capacity: number;
  available: number;
}

function WaitlistCard({
  registered,
  capacity,
  available,
}: WaitlistCardProps) {
  const percentage =
    capacity > 0
      ? Math.round(
          (registered / capacity) * 100
        )
      : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div>
        <h3 className="text-lg font-semibold">
          Waitlist
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Students currently on the waitlist
        </p>
      </div>

      <div className="mt-8">
        <p className="text-3xl font-semibold">
          {registered}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          people on waitlist
        </p>
      </div>

      <div className="mt-6">

        <div className="flex justify-between text-xs text-gray-500">
          <span>
            Waitlist capacity
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
                percentage,
                100
              )}%`,
            }}
          />
        </div>

      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          Available waitlist slots
        </p>

        <p className="mt-1 text-sm font-medium">
          {available}
        </p>
      </div>

    </div>
  );
}

export default WaitlistCard;