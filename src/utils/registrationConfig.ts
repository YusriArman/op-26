export const REGISTRATION_CONFIG = {
  table: "registrations",

  columns: {
    id: "id",
    studentId: "student_id",
    ticketId: "ticket_id",
    name: "name",
    status: "status",
  },
} as const;