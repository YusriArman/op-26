interface RegistrationResultProps {
  studentId: string;
  ticketId: string;
  name: string;
  status: string;
  onAttend: () => void;
  updating?: boolean;
}

function RegistrationResult({
  studentId,
  ticketId,
  name,
  status,
  onAttend,
  updating = false,
}: RegistrationResultProps) {
  const alreadyAttended =
    status.toLowerCase() === "attended";

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

        <div>
          <p className="text-xs text-gray-500">
            Student ID
          </p>

          <p className="mt-1 font-medium">
            {studentId}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Ticket ID
          </p>

          <p className="mt-1 font-medium">
            {ticketId}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Name
          </p>

          <p className="mt-1 font-medium">
            {name}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Status
          </p>

          <p className="mt-1 font-medium">
            {status}
          </p>
        </div>

      </div>

      <div className="mt-6 border-t border-gray-100 pt-5">

        {alreadyAttended ? (
          <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            This student has already been marked as attended.
          </div>
        ) : (
          <button
            type="button"
            onClick={onAttend}
            disabled={updating}
            className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating
              ? "Updating..."
              : "Attended"}
          </button>
        )}

      </div>
    </div>
  );
}

export default RegistrationResult;