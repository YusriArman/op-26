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

  const [student, setStudent] =
    useState<Student | null>(null);

  const [searching, setSearching] =
    useState(false);

  const [attending, setAttending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /*
   * ----------------------------------------
   * Search student
   * ----------------------------------------
   */

  const handleSearch = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim().toUpperCase();

    if (!trimmedQuery) {
      setError(
        "Please enter a Student ID or Ticket ID."
      );

      setStudent(null);

      return;
    }

    setSearching(true);
    setError(null);
    setSuccess(null);
    setStudent(null);

    try {
      /*
      * Search students by student_id first, then
      * fall back to ticket_id. Two separate .eq()
      * calls instead of .or() so manual/scanned
      * input can't break PostgREST's filter syntax
      * (commas, parens, etc).
      */

      const bySid = await supabase
        .from("students")
        .select(
          `
            student_id,
            ticket_id,
            full_name,
            ticket_status,
            is_attended
          `
        )
        .eq("student_id", trimmedQuery)
        .maybeSingle();

      if (bySid.error) {
        throw bySid.error;
      }

      let data = bySid.data;

      if (!data) {
        const byTid = await supabase
          .from("students")
          .select(
            `
              student_id,
              ticket_id,
              full_name,
              ticket_status,
              is_attended
            `
          )
          .eq("ticket_id", trimmedQuery)
          .maybeSingle();

        if (byTid.error) {
          throw byTid.error;
        }

        data = byTid.data;
      }

      if (!data) {
        setError(
          "No student or ticket was found."
        );

        return;
      }

      setStudent(data as Student);
    } catch (err) {
      console.error(
        "Failed to search student:",
        err
      );

      setError(
        "Unable to search for the student. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  /*
   * ----------------------------------------
   * Mark student as attended
   * ----------------------------------------
   */

  const handleAttend = async () => {
    if (!student) {
      return;
    }

    setAttending(true);
    setError(null);
    setSuccess(null);

    try {
      /*
       * Use the backend RPC created by your
       * colleague.
       */

      const { data, error } =
        await supabase.rpc(
          "toggle_student_attendance",
          {
            p_query:
              student.student_id,
            p_is_attended: true,
          }
        );

      if (error) {
        throw error;
      }

      /*
       * The RPC returns the updated student.
       */

      if (data) {
        const updatedStudent =
          Array.isArray(data)
            ? data[0]
            : data;

        if (updatedStudent) {
          setStudent(
            updatedStudent as Student
          );
        }
      } else {
        /*
         * Fallback in case the RPC doesn't
         * return the updated row.
         */

        setStudent({
          ...student,
          is_attended: true,
        });
      }

      setSuccess(
        "Student successfully marked as attended."
      );
    } catch (err) {
      console.error(
        "Failed to mark student as attended:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update attendance."
      );
    } finally {
      setAttending(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold">
          Event Day Registration
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Search for a student or ticket and
          mark their attendance.
        </p>
      </div>


      {/* Search */}

      <section className="mt-10">

        <h2 className="text-sm font-semibold">
          Find Registration
        </h2>

        <form
          onSubmit={handleSearch}
          className="mt-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Enter Student ID or Ticket ID"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />

            <button
              type="submit"
              disabled={searching}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {searching
                ? "Searching..."
                : "Search"}
            </button>

          </div>
        </form>

      </section>


      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Success */}

      {success && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* Student Result */}

      {student && (
        <StudentRegistrationResult
          studentId={
            student.student_id
          }
          ticketId={
            student.ticket_id
          }
          name={
            student.full_name
          }
          status={
            student.ticket_status
          }
          isAttended={
            student.is_attended
          }
          loading={
            attending
          }
          onAttend={
            handleAttend
          }
        />
      )}

    </main>
  );
}

export default Regi;