// src/services/ticketService.ts
import { supabase } from "../utils/supabase";
import type { BindResult, StudentBindingRecord } from "../types/student";

export type BindingPageType = "day1" | "day2" | "day-1" | "day-2" | "waitlist";

export interface SearchBindingResult {
  found: boolean;
  student: StudentBindingRecord | null;
  mismatch: boolean;
}

function mapToStudentBindingRecord(row: any): StudentBindingRecord {
  return {
    id: row.id,
    student_id: row.student_id,
    full_name: row.full_name,
    email: row.taylors_email || row.personal_email || row.email || "",
    reg_type: row.reg_type,
    ticket_status: row.ticket_status,
    ticket_id: row.ticket_id,
    binding_status: row.binding_status,
    waitlist_number: row.waitlist_number,
    venue: row.venue,
    slot_date: row.slot_date,
    slot_start_time: row.start_time || row.slot_start_time || null,
    slot_end_time: row.end_time || row.slot_end_time || null,
  };
}

/**
 * Searches for a student by Student ID (SID) or Ticket ID (TID)
 * and detects venue/day mismatch if searching from a specific day booth.
 */
export async function searchStudentForBinding(
  query: string,
  pageType?: BindingPageType
): Promise<SearchBindingResult> {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) {
    return { found: false, student: null, mismatch: false };
  }

  const { data, error } = await supabase
    .from("admin_students_overview")
    .select("*")
    .or(`student_id.eq.${cleanQuery},ticket_id.eq.${cleanQuery}`)
    .maybeSingle();

  if (error || !data) {
    return { found: false, student: null, mismatch: false };
  }

  const student = mapToStudentBindingRecord(data);

  // Check for booth vs booked slot mismatch
  let mismatch = false;
  if (pageType === "day1" || pageType === "day-1") {
    // Day 1 booth expects TGH main registration
    mismatch = student.venue !== "TGH" || student.reg_type !== "main";
  } else if (pageType === "day2" || pageType === "day-2") {
    // Day 2 booth expects LT1 main registration
    mismatch = student.venue !== "LT1" || student.reg_type !== "main";
  } else if (pageType === "waitlist") {
    // Waitlist booth expects waitlist reg_type
    mismatch = student.reg_type !== "waitlist";
  }

  return {
    found: true,
    student,
    mismatch,
  };
}

/**
 * Binds a physical ticket ID to a student ID
 */
export async function bindTicketToStudent(
  studentId: string,
  ticketId: string
): Promise<BindResult> {
  const cleanSid = studentId.trim().toUpperCase();
  const cleanTid = ticketId.trim().toUpperCase();

  const { data, error } = await supabase.rpc("bind_ticket_to_student", {
    p_student_id: cleanSid,
    p_ticket_id: cleanTid,
  });

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to bind ticket.",
    };
  }

  return {
    success: data.success,
    message: data.message,
    student_id: data.student_id,
    student_name: data.student_name,
    ticket_id: data.ticket_id,
  };
}

// Export alias for backward compatibility
export const bindTicket = bindTicketToStudent;