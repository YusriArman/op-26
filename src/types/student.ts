export type BindingStatus = "bound" | "unbound";
export type RegType = "main" | "waitlist";
export type TicketStatus = "pending_collection" | "collected" | "cancelled";
export type Venue = "TGH" | "LT1" | "DDay_Booth";

export interface StudentBindingRecord {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  reg_type: RegType;
  ticket_status: TicketStatus;
  ticket_id: string | null;
  binding_status: BindingStatus;
  waitlist_number: number | null;
  venue: Venue | null;
  slot_date: string | null;
  slot_start_time: string | null;
  slot_end_time: string | null;
}

export interface BindResult {
  success: boolean;
  message: string;
  student_id?: string;
  student_name?: string;
  ticket_id?: string;
}

export interface AttendedStudentRecord {
  student_id: string;
  ticket_id: string | null;
  full_name: string;
  email: string;
}

