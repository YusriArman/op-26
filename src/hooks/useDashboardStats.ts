import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

interface DayStats {
  registered: number;
  binded: number;
  attended: number;
  emptySlots: number;
  capacity: number;
}

interface WaitlistStats {
  registered: number;
  attended: number;
  capacity: number;
  available: number;
  promoted: number;
  promotedAttended: number;
}

interface OverallStats {
  total_main_registered: number;
  total_waitlisted: number;
  total_students_attended: number;
  target_capacity: number;
  open_dday_slots: number;
}

interface DashboardStats {
  overall: OverallStats;
  day1: DayStats;
  day2: DayStats;
  waitlist: WaitlistStats;
}

interface StudentRow {
  reg_type: "main" | "waitlist";
  ticket_status: "pending_collection" | "collected" | "cancelled";
  is_attended: boolean;
  slot_id: string | null;
}

interface OverallMetricsRow {
  target_capacity: number;
  waitlist_capacity: number;
  total_main_registered: number;
  total_waitlisted: number;
  total_students_attended: number;
  open_dday_slots: number;
}

const FALLBACK_TARGET_CAPACITY = 1500;
const FALLBACK_WAITLIST_CAPACITY = 500;
const emptyDay: DayStats = { registered: 0, binded: 0, attended: 0, emptySlots: 0, capacity: 0 };

const emptyStats: DashboardStats = {
  overall: {
    total_main_registered: 0,
    total_waitlisted: 0,
    total_students_attended: 0,
    target_capacity: FALLBACK_TARGET_CAPACITY,
    open_dday_slots: FALLBACK_TARGET_CAPACITY,
  },
  day1: emptyDay,
  day2: emptyDay,
  waitlist: {
    registered: 0,
    attended: 0,
    capacity: FALLBACK_WAITLIST_CAPACITY,
    available: FALLBACK_WAITLIST_CAPACITY,
    promoted: 0,
    promotedAttended: 0,
  },
};

// Matches admin_overall_metrics' own definition: reg_type = 'main' OR
// binding_status = 'bound'. Kept in sync with the view intentionally,
// since the Day 1/Day 2 breakdown below still has to be computed
// client-side (no per-venue view exists yet).
function isMainOccupant(s: StudentRow): boolean {
  return s.reg_type === "main" || s.ticket_status === "collected";
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const [metricsRes, studentsRes, slotsRes] = await Promise.all([
        supabase.from("admin_overall_metrics").select("*").single(),
        supabase.from("students").select("reg_type, ticket_status, is_attended, slot_id"),
        supabase.from("collection_slots").select("id, venue, max_capacity"),
      ]);

      if (cancelled) return;

      if (metricsRes.error || studentsRes.error || slotsRes.error) {
        setError(
          metricsRes.error?.message ??
            studentsRes.error?.message ??
            slotsRes.error?.message ??
            "Failed to load stats."
        );
        setLoading(false);
        return;
      }

      const metrics = metricsRes.data as OverallMetricsRow;
      const students = (studentsRes.data ?? []) as StudentRow[];
      const slots = slotsRes.data ?? [];

      const aggregate = (venue: "TGH" | "LT1"): DayStats => {
        const venueSlots = slots.filter((s) => s.venue === venue);
        const venueSlotIds = new Set(venueSlots.map((s) => s.id));
        const capacity = venueSlots.reduce((sum, s) => sum + s.max_capacity, 0);

        const venueStudents = students.filter(
          (s) => isMainOccupant(s) && s.slot_id && venueSlotIds.has(s.slot_id)
        );

        return {
          registered: venueStudents.length,
          binded: venueStudents.filter((s) => s.ticket_status === "collected").length,
          attended: venueStudents.filter((s) => s.is_attended).length,
          // Remaining capacity for this day — how many more people could
          // still register/collect for this venue, not how many already-
          // registered students haven't collected yet.
          emptySlots: Math.max(capacity - venueStudents.length, 0),
          capacity,
        };
      };

      // Still genuinely waiting — matches the view's own definition:
      // reg_type = 'waitlist' AND binding_status = 'unbound'.
      const waitlistPending = students.filter(
        (s) => s.reg_type === "waitlist" && s.ticket_status !== "collected"
      );
      // Originally waitlisted, now bound — counted in the view's
      // total_main_registered, but has no venue so can't appear in the
      // Day 1/Day 2 breakdown.
      const waitlistPromoted = students.filter(
        (s) => s.reg_type === "waitlist" && s.ticket_status === "collected"
      );

      const waitlistCapacity = metrics.waitlist_capacity ?? FALLBACK_WAITLIST_CAPACITY;

      setStats({
        overall: {
          total_main_registered: metrics.total_main_registered,
          total_waitlisted: metrics.total_waitlisted,
          total_students_attended: metrics.total_students_attended,
          target_capacity: metrics.target_capacity ?? FALLBACK_TARGET_CAPACITY,
          open_dday_slots: metrics.open_dday_slots,
        },
        day1: aggregate("TGH"),
        day2: aggregate("LT1"),
        waitlist: {
          registered: waitlistPending.length,
          attended: waitlistPending.filter((s) => s.is_attended).length,
          capacity: waitlistCapacity,
          // Once a waitlist slot is used — whether the student is still
          // pending or has since been promoted via binding — it stays
          // consumed. It should not free back up just because someone
          // got their ticket.
          available: Math.max(
            waitlistCapacity - (waitlistPending.length + waitlistPromoted.length),
            0
          ),
          promoted: waitlistPromoted.length,
          promotedAttended: waitlistPromoted.filter((s) => s.is_attended).length,
        },
      });
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { stats, loading, error, refetch: () => setRefreshKey((k) => k + 1) };
}