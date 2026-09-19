import { useState } from "react";
import Header from "../components/Header";
import { supabase } from "../utils/supabase";

interface SlotLookupResult {
  full_name: string;
  reg_type: "main" | "waitlist";
  binding_status: "bound" | "unbound";
  venue: "TGH" | "LT1" | "DDay_Booth" | null;
  slot_date: string | null;
  start_time: string | null;
  end_time: string | null;
}

const venueLabel: Record<string, string> = {
  TGH: "Taylor's Grand Hall (TGH)",
  LT1: "Lecture Theatre 1 (LT1)",
  DDay_Booth: "Event Day Booth",
};

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${m} ${ampm}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SearchSlot() {
  const [studentId, setStudentId] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SlotLookupResult | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const cleanId = studentId.trim();
    if (!cleanId) {
      setErrorMessage("Please enter your Student ID.");
      return;
    }

    setSearching(true);
    setErrorMessage(null);
    setNotFound(false);
    setResult(null);

    try {
      const { data, error } = await supabase.rpc("lookup_collection_timeslot", {
        p_student_id: cleanId,
      });

      if (error) {
        setErrorMessage(error.message || "Something went wrong. Please try again.");
        return;
      }

      const row = Array.isArray(data) ? data[0] : data;

      if (!row) {
        setNotFound(true);
        return;
      }

      setResult(row as SlotLookupResult);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unexpected network error.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_bottom,rgba(0,8,27,0.58),rgba(0,8,27,0.50),rgba(0,8,27,0.65)),url('/bg.png')] bg-cover bg-center bg-fixed text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">

        <Header
          title="Find Your Collection Slot"
          description="Enter your Student ID to check your ticket collection venue and timeslot."
          align="center"
        />

        {/* Search Card */}
        <section className="mt-10 rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_25px_rgba(60,246,247,0.25)] relative">
          <div className="w-full h-full bg-[#090520]/85 backdrop-blur-md p-6 sm:p-8">
            <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#3cf6f7]" />
            <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#3cf6f7]" />
            <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#3cf6f7]" />
            <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#3cf6f7]" />

            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 0345893"
                className="flex-1 rounded-none border border-white/20 bg-[#160b38]/80 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#3cf6f7] uppercase"
              />

              <button
                type="submit"
                disabled={searching}
                className="rounded-none px-6 py-3 font-futura-heavy font-bold uppercase tracking-[0.15em] text-sm text-white bg-gradient-to-r from-[#6045f4] via-[#3cf6f7] to-[#e139fa] hover:brightness-110 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>
          </div>
        </section>

        {/* Error */}
        {errorMessage && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Not found */}
        {notFound && (
          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            No registration found for that Student ID. Please check the ID and try again, or make sure you've registered for a ticket.
          </div>
        )}

        {/* Result */}
        {result && (
          <section className="mt-6 rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_25px_rgba(60,246,247,0.25)] relative">
            <div className="w-full h-full bg-[#090520]/85 backdrop-blur-md p-6 sm:p-8">
              <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#3cf6f7]" />

              <h3 className="text-lg sm:text-xl font-futura-heavy font-bold text-[#3cf6f7] uppercase tracking-[0.1em] drop-shadow-[0_0_8px_rgba(60,246,247,0.6)]">
                {result.full_name}
              </h3>

              {/* Case 1: Main queue with a confirmed venue + slot */}
              {result.reg_type === "main" && result.venue && result.slot_date && result.start_time && result.end_time ? (
                <div className="mt-5 rounded-xl border border-cyan-400/20 bg-[#160b38]/80 p-4">
                  <p className="text-[10px] font-futura-book uppercase tracking-widest text-gray-400">
                    Collection Venue
                  </p>
                  <p className="mt-1 text-base font-futura-heavy font-bold text-white">
                    {venueLabel[result.venue] ?? result.venue}
                  </p>

                  <p className="mt-3 text-[10px] font-futura-book uppercase tracking-widest text-gray-400">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-futura-medium text-gray-100">
                    {formatDate(result.slot_date)}
                  </p>

                  <p className="mt-3 text-[10px] font-futura-book uppercase tracking-widest text-gray-400">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-futura-medium text-[#3cf6f7]">
                    {formatTime(result.start_time)} – {formatTime(result.end_time)}
                  </p>

                  <p className="mt-4 text-xs font-futura-book text-gray-400">
                    Status:{" "}
                    <span className={result.binding_status === "bound" ? "text-green-400" : "text-amber-300"}>
                      {result.binding_status === "bound" ? "Ticket already collected" : "Not yet collected"}
                    </span>
                  </p>
                </div>
              ) : result.reg_type === "waitlist" && result.binding_status === "unbound" ? (
                /* Case 2: Still on the waitlist, no slot assigned yet */
                <div className="mt-5 rounded-xl border border-amber-400/20 bg-[#160b38]/80 p-4">
                  <p className="text-sm text-amber-300">
                    You're currently on the waitlist. Waitlist ticket collection will be from 3.00pm - 6.30pm at the vendor booth in front of LT1 on the event day (18th September 2026).
                  </p>
                </div>
              ) : (
                /* Case 3: Promoted from waitlist, or otherwise bound without an assigned venue */
                <div className="mt-5 rounded-xl border border-cyan-400/20 bg-[#160b38]/80 p-4">
                  <p className="text-sm text-gray-200">
                    You've secured a ticket for the event already! See you at the event, registration starts from 5.15pm - 7.00pm!
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default SearchSlot;