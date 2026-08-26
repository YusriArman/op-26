import { supabase } from "../utils/supabase";
import type { AttendedStudentRecord } from "../types/student";

interface RawAttendedRow {
  student_id: string;
  ticket_id: string | null;
  full_name: string;
  freshmen_directory: {
    taylors_email: string | null;
  } | null;
}

function normalize(row: RawAttendedRow): AttendedStudentRecord {
  return {
    student_id: row.student_id,
    ticket_id: row.ticket_id,
    full_name: row.full_name,
    // students.email does not exist in the live schema — email is only
    // ever available via the freshmen_directory join.
    email: row.freshmen_directory?.taylors_email ?? null,
  };
}

export async function fetchAttendedStudents(
  query?: string
): Promise<AttendedStudentRecord[]> {
  let request = supabase
    .from("students")
    .select(
      "student_id, ticket_id, full_name, freshmen_directory ( taylors_email )"
    )
    .eq("is_attended", true)
    .order("full_name", { ascending: true });

  const trimmed = query?.trim();

  if (trimmed) {
    const safe = trimmed.replace(/[,()]/g, "");

    request = request.or(
      `student_id.ilike.%${safe}%,full_name.ilike.%${safe}%,ticket_id.ilike.%${safe}%`
    );
  }

  const { data, error } = await request;

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    normalize(row as unknown as RawAttendedRow)
  );
}