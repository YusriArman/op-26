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
      {/* Header */}
      <div>
        <h2
          className={`text-xl font-semibold ${
            disabled ? "text-gray-400" : "text-black"
          }`}
        >
          {title}
        </h2>

        {date && (
          <p className="mt-1 text-sm text-gray-500">
            {date}
          </p>
        )}
      </div>

      {/* Disabled Message */}
      {disabled && (
        <div className="mt-6 rounded-lg bg-gray-100 p-4">
          <p className="text-sm font-medium text-gray-500">
            Binding unavailable
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Registration capacity has been reached.
          </p>
        </div>
      )}

      {/* Event Day Statistics */}
      {!disabled && !isWaitlist && (
        <div className="mt-6 grid grid-cols-3 gap-3">

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Registered
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {registered ?? "--"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Binded
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {binded ?? "--"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Empty Slots
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {emptySlots ?? "--"}
            </p>
          </div>

        </div>
      )}

      {/* Waitlist Statistics */}
      {!disabled && isWaitlist && (
        <div className="mt-6 grid grid-cols-2 gap-3">

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              Slots Open
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {emptySlots ?? "--"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              People on Waitlist
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {waitlist ?? "--"}
            </p>
          </div>

        </div>
      )}

      {/* Action */}
      {!disabled && (
        <p className="mt-6 text-sm font-medium">
          Open Binding →
        </p>
      )}
    </>
  );

  // Disabled cards should NOT be Links.
  if (disabled) {
    return (
      <div className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 p-6 opacity-60">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-400 hover:shadow-md"
    >
      {cardContent}
    </Link>
  );
}

export default BindingCard;