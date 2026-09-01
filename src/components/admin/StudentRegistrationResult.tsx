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
    <div className="glass-card mt-6 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Student Information</h2>
          <p className="mt-1 text-sm text-[#8592B4]">Registration details</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isAttended
              ? "bg-[#34D399]/15 text-[#34D399]"
              : "bg-white/10 text-[#8592B4]"
          }`}
        >
          {isAttended ? "Attended" : status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Student ID</p>
          <p className="mt-1 text-sm font-medium text-white">{studentId}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Ticket ID</p>
          <p className="mt-1 text-sm font-medium text-white">{ticketId || "Not assigned"}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Name</p>
          <p className="mt-1 text-sm font-medium text-white">{name}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Status</p>
          <p className="mt-1 text-sm font-medium text-white">{isAttended ? "Attended" : status}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        {isAttended ? (
          <div className="rounded-lg bg-[#34D399]/10 px-4 py-3 text-sm text-[#34D399]">
            This student has already been marked as attended.
          </div>
        ) : (
          <button
            type="button"
            onClick={onAttend}
            disabled={loading}
            className="w-full rounded-lg bg-[#4C7CFF] px-4 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#5b6785] disabled:shadow-none"
          >
            {loading ? "Updating..." : "Mark as Attended"}
          </button>
        )}
      </div>
    </div>
  );
}

export default StudentRegistrationResult;