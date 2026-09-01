import { supabase } from "../utils/supabase";
import type { StudentBindingRecord, BindResult, Venue } from "../types/student";

export type BindingPageType = "day-1" | "day-2" | "waitlist";

const VENUE_BY_TYPE: Record<"day-1" | "day-2", "TGH" | "LT1"> = {
  "day-1": "TGH",
  "day-2": "LT1",
};

interface RawStudentRow {
  id: string;
  student_id: string;
  full_name: string;
  reg_type: "main" | "waitlist";
  ticket_status: "pending_collection" | "collected" | "cancelled";
  ticket_id: string | null;
  binding_status: "bound" | "unbound";
  waitlist_number: number | null;
  collection_slots: {
    venue: Venue;
    slot_date: string;
    start_time: string;
    end_time: string;
  } | null;
  freshmen_directory: {
    taylors_email: string | null;
  } | null;
}

function normalize(row: RawStudentRow): StudentBindingRecord {
  return {
    id: row.id,
    student_id: row.student_id,
    full_name: row.full_name,
    // students.email does not exist in the live schema — email is only
    // ever available via the freshmen_directory join.
    email: row.freshmen_directory?.taylors_email ?? "",
    reg_type: row.reg_type,
    ticket_status: row.ticket_status,
    ticket_id: row.ticket_id,
    binding_status: row.binding_status,
    waitlist_number: row.waitlist_number,
    venue: row.collection_slots?.venue ?? null,
    slot_date: row.collection_slots?.slot_date ?? null,
    slot_start_time: row.collection_slots?.start_time ?? null,
    slot_end_time: row.collection_slots?.end_time ?? null,
  };
}

export interface BindingSearchResult {
  found: boolean;
  mismatch: boolean;
  student: StudentBindingRecord | null;
}

export async function searchStudentForBinding(
  studentId: string,
  type: BindingPageType
): Promise<BindingSearchResult> {
  const cleanId = studentId.trim().toUpperCase();

  const { data, error } = await supabase
    .from("students")
    .select(
      "*, collection_slots ( venue, slot_date, start_time, end_time ), freshmen_directory ( taylors_email )"
    )
    .eq("student_id", cleanId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return { found: false, mismatch: false, student: null };

  const record = normalize(data as unknown as RawStudentRow);

  const matches =
    type === "waitlist"
      ? record.reg_type === "waitlist"
      : record.reg_type === "main" && record.venue === VENUE_BY_TYPE[type];

  return { found: true, mismatch: !matches, student: record };
}

export async function bindTicketToStudent(
  studentId: string,
  ticketId: string
): Promise<BindResult> {
  const cleanSid = studentId.trim().toUpperCase();
  const cleanTid = ticketId.trim().toUpperCase();

  // Best-effort pre-check for a friendly message; the UNIQUE constraint
  // on students.ticket_id is what actually prevents a real duplicate.
  const { data: existing, error: existingError } = await supabase
    .from("students")
    .select("student_id")
    .eq("ticket_id", cleanTid)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    return {
      success: false,
      message: `Ticket ID [${cleanTid}] is already bound to Student ID: ${existing.student_id}`,
    };
  }

  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("students")
    .update({
      ticket_id: cleanTid,
      binding_status: "bound",
      ticket_status: "collected",
      timestamp_of_binding: new Date().toISOString(),
      bound_by: userData.user?.id ?? null,
    })
    .eq("student_id", cleanSid)
    .eq("binding_status", "unbound") // guard: no-op if already bound between search and click
    .select("student_id, full_name, ticket_id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: `Ticket ID [${cleanTid}] was just bound by someone else. Please refresh and try again.`,
      };
    }
    throw error;
  }

  if (!data) {
    return {
      success: false,
      message: "Student not found, or their ticket was already bound by someone else.",
    };
  }

  return {
    success: true,
    student_id: data.student_id,
    student_name: data.full_name,
    ticket_id: data.ticket_id ?? cleanTid,
    message: `Successfully bound physical ticket [${data.ticket_id}] to ${data.full_name}`,
  };
}