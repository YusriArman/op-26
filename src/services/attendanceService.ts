// src/services/attendanceService.ts
import { supabase } from "../utils/supabase";
import type { AttendedStudentRecord } from "../types/student";

/**
 * Fetches all checked-in attendees
 */
export async function fetchAttendedStudents(
  query?: string
): Promise<AttendedStudentRecord[]> {
  let request = supabase
    .from("students")
    .select("student_id, ticket_id, full_name, taylors_email")
    .eq("is_attended", true)
    .order("attended_at", { ascending: false });

  const trimmed = query?.trim();

  if (trimmed) {
    const safe = trimmed.replace(/[,()]/g, "");
    request = request.or(
      `student_id.ilike.%${safe}%,full_name.ilike.%${safe}%,ticket_id.ilike.%${safe}%`
    );
  }

  const { data, error } = await request;

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    student_id: row.student_id,
    ticket_id: row.ticket_id,
    full_name: row.full_name,
    email: row.taylors_email,
  }));
}

/**
 * Toggles student attendance at the gate (Regi.tsx)
 */
export async function toggleAttendance(
  querySidOrTid: string,
  isAttended: boolean
) {
  const { data, error } = await supabase.rpc("toggle_student_attendance", {
    p_query: querySidOrTid.trim().toUpperCase(),
    p_is_attended: isAttended,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}