import { supabase } from "../utils/supabase";
import type { AttendedStudentRecord } from "../types/student";

interface RawAttendedRow {
  student_id: string;
  ticket_id: string | null;
  full_name: string;
  email: string;
  freshmen_directory: {
    taylors_email: string | null;
  } | null;
}

function normalize(row: RawAttendedRow): AttendedStudentRecord {
  return {
    student_id: row.student_id,
    ticket_id: row.ticket_id,
    full_name: row.full_name,
    // Same rule as binding: prefer the institutional Taylor's email,
    // fall back to students.email only if the directory join is missing.
    email: row.freshmen_directory?.taylors_email ?? row.email,
  };
}

export async function fetchAttendedStudents(
  query?: string
): Promise<AttendedStudentRecord[]> {
  let request = supabase
    .from("students")
    .select(
      "student_id, ticket_id, full_name, email, freshmen_directory ( taylors_email )"
    )
    .eq("is_attended", true)
    .order("full_name", { ascending: true });

  const trimmed = query?.trim();

  if (trimmed) {
    // Strip characters that are syntactically meaningful to PostgREST's
    // .or() filter string (commas, parens) so free-text search input
    // can't break or hijack the query.
    const safe = trimmed.replace(/[,()]/g, "");

    request = request.or(
      `student_id.ilike.%${safe}%,full_name.ilike.%${safe}%,ticket_id.ilike.%${safe}%`
    );
  }

  const { data, error } = await request;

  if (error) throw error;

  return (data ?? []).map((row) =>
    normalize(row as unknown as RawAttendedRow)
  );
}