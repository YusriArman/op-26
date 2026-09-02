import { useEffect, useState } from "react";

import BindingSearch from "../../components/admin/BindingSearch";
import { fetchAttendedStudents } from "../../services/attendanceService";
import type { AttendedStudentRecord } from "../../types/student";

function AttendedStudents() {
  const [students, setStudents] = useState<AttendedStudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAttendedStudents(activeQuery);
        if (!cancelled) setStudents(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load attended students.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeQuery]);

  const handleSearch = (query: string) => setActiveQuery(query);
  const handleClear = () => setActiveQuery("");

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Attended Students</h1>
        <p className="mt-2 text-sm text-[#8592B4]">
          {loading
            ? "Loading..."
            : `${students.length} student${students.length === 1 ? "" : "s"} checked in${
                activeQuery ? " matching your search" : ""
              }.`}
        </p>
      </div>

      {/* Search — now full width, on top */}
      <section className="glass-card mt-8 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white">Search</h2>

        <div className="mt-4">
          <BindingSearch
            onSearch={handleSearch}
            placeholder="Student ID, name, or ticket ID"
          />
        </div>

        {activeQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="mt-3 text-xs text-[#8592B4] underline transition hover:text-white"
          >
            Clear search
          </button>
        )}
      </section>

      {/* Table — now full width, underneath */}
      <section className="glass-card mt-6 rounded-2xl">
        {error && (
          <div className="border-b border-[#F87171]/20 bg-[#F87171]/10 px-4 py-3 text-sm text-[#F87171]">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#8592B4]">
                  Student ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#8592B4]">
                  Ticket ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#8592B4]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[#8592B4]">
                  Email
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#5b6785]">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#5b6785]">
                    No attended students found.
                  </td>
                </tr>
              )}

              {!loading &&
                students.map((student) => (
                  <tr key={student.student_id}>
                    <td className="px-4 py-3 font-medium text-white">{student.student_id}</td>
                    <td className="px-4 py-3 text-[#8592B4]">{student.ticket_id ?? "—"}</td>
                    <td className="px-4 py-3 text-white">{student.full_name}</td>
                    <td className="break-all px-4 py-3 text-[#8592B4]">{student.email ?? "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}

export default AttendedStudents;