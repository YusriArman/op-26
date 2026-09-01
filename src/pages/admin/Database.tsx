import { useState } from "react";

import { supabase } from "../../utils/supabase";

interface FreshmanRecord {
  student_id: string;
  name: string;
  nationality: string | null;
  locality: string | null;
  student_level: string | null;
  school: string | null;
  faculty: string | null;
  programme: string | null;
  taylors_email: string | null;
  personal_email: string | null;
  contact_no: string | null;
  flame_mentor_name: string | null;
  flame_mentor_email: string | null;
  is_eligible: boolean;
}

function Database() {
  const [query, setQuery] = useState("");
  const [student, setStudent] = useState<FreshmanRecord | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter a Student ID.");
      setStudent(null);
      setNotFound(false);
      return;
    }

    setSearching(true);
    setError(null);
    setStudent(null);
    setNotFound(false);

    try {
      const { data, error } = await supabase
        .from("freshmen_directory")
        .select(
          `
            student_id,
            name,
            nationality,
            locality,
            student_level,
            school,
            faculty,
            programme,
            taylors_email,
            personal_email,
            contact_no,
            flame_mentor_name,
            flame_mentor_email,
            is_eligible
          `
        )
        .or(`student_id.eq.${trimmedQuery},student_id.eq.${trimmedQuery.toUpperCase()}`)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
        return;
      }

      setStudent(data as FreshmanRecord);
    } catch (err) {
      console.error("Failed to search freshmen directory:", err);
      setError("Unable to search the database. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Freshmen Database</h1>
        <p className="mt-2 text-sm text-[#8592B4]">
          Search the freshmen directory to confirm if a student is an eligible freshman.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Search by Student ID</h2>

        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter Student ID"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-[#5b6785] outline-none transition focus:border-[#4C7CFF]"
            />

            <button
              type="submit"
              disabled={searching}
              className="rounded-lg bg-[#4C7CFF] px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#5b6785] disabled:shadow-none"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="mt-6 rounded-lg border border-[#F87171]/20 bg-[#F87171]/10 px-4 py-3 text-sm text-[#F87171]">
          {error}
        </div>
      )}

      {notFound && (
        <div className="mt-6 rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/10 px-4 py-3 text-sm text-[#FBBF24]">
          No freshman record found for that Student ID. This student is not in the directory.
        </div>
      )}

      {student && (
        <div className="glass-card mt-6 rounded-2xl p-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">{student.name}</h2>
              <p className="mt-1 text-sm text-[#8592B4]">{student.student_id}</p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                student.is_eligible
                  ? "bg-[#34D399]/15 text-[#34D399]"
                  : "bg-[#F87171]/15 text-[#F87171]"
              }`}
            >
              {student.is_eligible ? "Eligible Freshman" : "Not Eligible"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">School</p>
              <p className="mt-1 text-sm font-medium text-white">{student.school || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Faculty</p>
              <p className="mt-1 text-sm font-medium text-white">{student.faculty || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Programme</p>
              <p className="mt-1 text-sm font-medium text-white">{student.programme || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Student Level</p>
              <p className="mt-1 text-sm font-medium text-white">{student.student_level || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Nationality</p>
              <p className="mt-1 text-sm font-medium text-white">{student.nationality || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Locality</p>
              <p className="mt-1 text-sm font-medium text-white">{student.locality || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Taylor's Email</p>
              <p className="mt-1 break-all text-sm font-medium text-white">{student.taylors_email || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Personal Email</p>
              <p className="mt-1 break-all text-sm font-medium text-white">{student.personal_email || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Contact No.</p>
              <p className="mt-1 text-sm font-medium text-white">{student.contact_no || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5b6785]">Flame Mentor</p>
              <p className="mt-1 text-sm font-medium text-white">{student.flame_mentor_name || "—"}</p>
              {student.flame_mentor_email && (
                <p className="mt-0.5 break-all text-xs text-[#8592B4]">{student.flame_mentor_email}</p>
              )}
            </div>
          </div>

        </div>
      )}

    </main>
  );
}

export default Database;