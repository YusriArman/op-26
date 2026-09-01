import { useState } from "react";

import { supabase } from "../../utils/supabase";

import StudentRegistrationResult from "../../components/admin/StudentRegistrationResult";

interface Student {
  student_id: string;
  ticket_id: string | null;
  full_name: string;
  ticket_status: string;
  is_attended: boolean;
}

function Regi() {
  const [query, setQuery] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [searching, setSearching] = useState(false);
  const [attending, setAttending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim().toUpperCase();

    if (!trimmedQuery) {
      setError("Please enter a Student ID or Ticket ID.");
      setStudent(null);
      return;
    }

    setSearching(true);
    setError(null);
    setSuccess(null);
    setStudent(null);

    try {
      const bySid = await supabase
        .from("students")
        .select(`student_id, ticket_id, full_name, ticket_status, is_attended`)
        .eq("student_id", trimmedQuery)
        .maybeSingle();

      if (bySid.error) throw bySid.error;

      let data = bySid.data;

      if (!data) {
        const byTid = await supabase
          .from("students")
          .select(`student_id, ticket_id, full_name, ticket_status, is_attended`)
          .eq("ticket_id", trimmedQuery)
          .maybeSingle();

        if (byTid.error) throw byTid.error;
        data = byTid.data;
      }

      if (!data) {
        setError("No student or ticket was found.");
        return;
      }

      setStudent(data as Student);
    } catch (err) {
      console.error("Failed to search student:", err);
      setError("Unable to search for the student. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleAttend = async () => {
    if (!student) return;

    setAttending(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.rpc("toggle_student_attendance", {
        p_query: student.student_id,
        p_is_attended: true,
      });

      if (error) throw error;

      if (data) {
        const updatedStudent = Array.isArray(data) ? data[0] : data;
        if (updatedStudent) {
          setStudent(updatedStudent as Student);
        }
      } else {
        setStudent({ ...student, is_attended: true });
      }

      setSuccess("Student successfully marked as attended.");
    } catch (err) {
      console.error("Failed to mark student as attended:", err);
      setError(err instanceof Error ? err.message : "Unable to update attendance.");
    } finally {
      setAttending(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Event Day Registration</h1>
        <p className="mt-2 text-sm text-[#8592B4]">
          Search for a student or ticket and mark their attendance.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Find Registration</h2>

        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter Student ID or Ticket ID"
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

      {success && (
        <div className="mt-6 rounded-lg border border-[#34D399]/20 bg-[#34D399]/10 px-4 py-3 text-sm text-[#34D399]">
          {success}
        </div>
      )}

      {student && (
        <StudentRegistrationResult
          studentId={student.student_id}
          ticketId={student.ticket_id}
          name={student.full_name}
          status={student.ticket_status}
          isAttended={student.is_attended}
          loading={attending}
          onAttend={handleAttend}
        />
      )}

    </main>
  );
}

export default Regi;