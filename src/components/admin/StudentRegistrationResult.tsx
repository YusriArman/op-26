interface StudentRegistrationResultProps {
  studentId: string;
  ticketId: string | null;
  name: string;
  status: string;
  isAttended: boolean;
  loading: boolean;
  onAttend: () => void;
}

function StudentRegistrationResult({
  studentId,
  ticketId,
  name,
  status,
  isAttended,
  loading,
  onAttend,
}: StudentRegistrationResultProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-lg font-semibold">
            Student Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Registration details
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isAttended
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {isAttended
            ? "Attended"
            : status}
        </span>

      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Student ID
          </p>

          <p className="mt-1 text-sm font-medium">
            {studentId}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Ticket ID
          </p>

          <p className="mt-1 text-sm font-medium">
            {ticketId || "Not assigned"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Name
          </p>

          <p className="mt-1 text-sm font-medium">
            {name}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Status
          </p>

          <p className="mt-1 text-sm font-medium">
            {isAttended
              ? "Attended"
              : status}
          </p>
        </div>

      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">

        {isAttended ? (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            This student has already been marked as attended.
          </div>
        ) : (
          <button
            type="button"
            onClick={onAttend}
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Mark as Attended"}
          </button>
        )}

      </div>

    </div>
  );
}

export default StudentRegistrationResult;