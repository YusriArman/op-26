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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-5 md:items-center">
        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Student ID</p>
          <p className="mt-1 font-medium">{studentId}</p>
          <p className="mt-1 text-sm text-gray-500">{fullName}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Email</p>
          <p className="mt-1 break-all text-sm">{email}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Timeslot</p>
          <p className="mt-1 text-sm">
            {timeSlotLabel ?? "—"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Status</p>
          <p className={`mt-1 font-medium ${isBound ? "text-green-600" : "text-orange-600"}`}>{status}</p>
        </div>

        {!isBound && (
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">Ticket ID</p>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Scan or type ticket ID"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={isBound || binding || (!isBound && !ticketId.trim())}
          onClick={handleBindClick}
          className="rounded-lg bg-black px-6 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isBound ? "Bound" : binding ? "Binding..." : "Bind"}
        </button>
      </div>
    </div>
  );
}

export default BindingResult;