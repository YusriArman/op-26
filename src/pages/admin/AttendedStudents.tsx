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

        if (!cancelled) {
          setStudents(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load attended students."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeQuery]);

  const handleSearch = (query: string) => {
    setActiveQuery(query);
  };

  const handleClear = () => {
    setActiveQuery("");
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold">
          Attended Students
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {loading
            ? "Loading..."
            : `${students.length} student${
                students.length === 1 ? "" : "s"
              } checked in${activeQuery ? " matching your search" : ""}.`}
        </p>
      </div>


      {/* Layout: search left, table right */}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

        {/* Search */}

        <section className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-8">

          <h2 className="text-sm font-semibold">
            Search
          </h2>

          <div className="mt-4">
            <BindingSearch
              onSearch={handleSearch}
              placeholder="Student ID, name, or ticket ID"
              stacked
            />
          </div>

          {activeQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-3 text-xs text-gray-500 underline transition hover:text-black"
            >
              Clear search
            </button>
          )}

        </section>


        {/* Table */}

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

          {error && (
            <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Student ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading && students.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-400"
                    >
                      No attended students found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  students.map((student) => (
                    <tr key={student.student_id}>
                      <td className="px-4 py-3 font-medium">
                        {student.student_id}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {student.ticket_id ?? "—"}
                      </td>

                      <td className="px-4 py-3">
                        {student.full_name}
                      </td>

                      <td className="break-all px-4 py-3 text-gray-600">
                        {student.email}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </section>

      </div>

    </main>
  );
}

export default AttendedStudents;