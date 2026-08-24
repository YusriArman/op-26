export const DASHBOARD_CONFIG = {
  table: "registrations",

  columns: {
    id: "id",
    status: "status",
    eventDay: "event_day",
  },

  days: {
    day1: {
      key: "day1",
      title: "Day 1 — TGH",
      subtitle: "15 September · TGH",
      capacity: 120,
    },

    day2: {
      key: "day2",
      title: "Day 2 — LT1",
      subtitle: "17 September · LT1",
      capacity: 40,
    },

    waitlist: {
      key: "waitlist",
      title: "Waitlist",
      subtitle: "Students registered through the waitlist",
      capacity: 20,
    },
  },
} as const;