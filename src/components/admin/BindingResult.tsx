import { useState } from "react";

interface BindingResultProps {
  studentId: string;
  fullName: string;
  email: string;
  status: "Bound" | "Unbound";
  onBind: (ticketId: string) => void;
  binding?: boolean;
  timeSlotLabel?: string | null;
}

function BindingResult({
  studentId,
  fullName,
  email,
  status,
  onBind,
  binding = false,
  timeSlotLabel,
}: BindingResultProps) {
  const [ticketId, setTicketId] = useState("");
  const isBound = status === "Bound";

  const handleBindClick = () => {
    const trimmed = ticketId.trim();
    if (!trimmed) return;
    onBind(trimmed);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="grid gap-6 md:grid-cols-5 md:items-center">
        <div>
          <p className="text-xs font-medium uppercase text-[#8592B4]">Student ID</p>
          <p className="mt-1 font-medium text-white">{studentId}</p>
          <p className="mt-1 text-sm text-[#8592B4]">{fullName}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-[#8592B4]">Email</p>
          <p className="mt-1 break-all text-sm text-white/90">{email}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-[#8592B4]">Timeslot</p>
          <p className="mt-1 text-sm text-white/90">{timeSlotLabel ?? "—"}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-[#8592B4]">Status</p>
          <p className={`mt-1 font-medium ${isBound ? "text-[#34D399]" : "text-[#FBBF24]"}`}>{status}</p>
        </div>

        {!isBound && (
          <div>
            <p className="text-xs font-medium uppercase text-[#8592B4]">Ticket ID</p>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Scan or type ticket ID"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#5b6785] outline-none focus:border-[#4C7CFF]"
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={isBound || binding || (!isBound && !ticketId.trim())}
          onClick={handleBindClick}
          className="rounded-lg bg-[#4C7CFF] px-6 py-2 text-sm text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#5b6785] disabled:shadow-none"
        >
          {isBound ? "Bound" : binding ? "Binding..." : "Bind"}
        </button>
      </div>
    </div>
  );
}

export default BindingResult;