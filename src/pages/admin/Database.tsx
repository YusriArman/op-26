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

  const [student, setStudent] =
    useState<FreshmanRecord | null>(null);

  const [searching, setSearching] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [notFound, setNotFound] =
    useState(false);

  /*
   * ----------------------------------------
   * Search freshmen_directory
   * ----------------------------------------
   */

  const handleSearch = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError(
        "Please enter a Student ID."
      );

      setStudent(null);
      setNotFound(false);

      return;
    }

    setSearching(true);
    setError(null);
    setStudent(null);
    setNotFound(false);

    try {
      /*
       * freshmen_directory.student_id is the
       * primary key, stored as-is (no enforced
       * casing from the schema), so we search
       * both the raw and uppercased form to be
       * forgiving of manual entry.
       */

      const { data, error } =
        await supabase
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
          .or(
            `student_id.eq.${trimmedQuery},student_id.eq.${trimmedQuery.toUpperCase()}`
          )
          .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        setNotFound(true);
        return;
      }

      setStudent(data as FreshmanRecord);
    } catch (err) {
      console.error(
        "Failed to search freshmen directory:",
        err
      );

      setError(
        "Unable to search the database. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold">
          Freshmen Database
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Search the freshmen directory to confirm
          if a student is an eligible freshman.
        </p>
      </div>


      {/* Search */}

      <section className="mt-10">

        <h2 className="text-sm font-semibold">
          Search by Student ID
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
              placeholder="Enter Student ID"
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


      {/* Not Found */}

      {notFound && (
        <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          No freshman record found for that Student ID. This student is
          not in the directory.
        </div>
      )}


      {/* Result */}

      {student && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between gap-4">

            <div>
              <h2 className="text-lg font-semibold">
                {student.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {student.student_id}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                student.is_eligible
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {student.is_eligible
                ? "Eligible Freshman"
                : "Not Eligible"}
            </span>

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                School
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.school || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Faculty
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.faculty || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Programme
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.programme || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Student Level
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.student_level || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Nationality
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.nationality || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Locality
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.locality || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Taylor's Email
              </p>
              <p className="mt-1 break-all text-sm font-medium">
                {student.taylors_email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Personal Email
              </p>
              <p className="mt-1 break-all text-sm font-medium">
                {student.personal_email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Contact No.
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.contact_no || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Flame Mentor
              </p>
              <p className="mt-1 text-sm font-medium">
                {student.flame_mentor_name || "—"}
              </p>
              {student.flame_mentor_email && (
                <p className="mt-0.5 break-all text-xs text-gray-500">
                  {student.flame_mentor_email}
                </p>
              )}
            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Database;