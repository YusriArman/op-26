// src/hooks/useDashboardStats.ts
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
  total_tickets_collected_and_bound: number;
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

interface OverallMetricsRow {
  target_capacity: number;
  waitlist_capacity: number;
  total_main_registered: number;
  total_waitlisted: number;
  total_tickets_collected_and_bound: number;
  total_students_attended: number;
  open_dday_slots: number;
}

interface CountFilters {
  eq?: Array<[string, string | boolean]>;
  neq?: Array<[string, string]>;
  in?: [string, string[]];
}

const FALLBACK_TARGET_CAPACITY = 1500;
const FALLBACK_WAITLIST_CAPACITY = 500;
const emptyDay: DayStats = { registered: 0, binded: 0, attended: 0, emptySlots: 0, capacity: 0 };

const emptyStats: DashboardStats = {
  overall: {
    total_main_registered: 0,
    total_waitlisted: 0,
    total_tickets_collected_and_bound: 0,
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

// Count-only query — never subject to PostgREST's default 1000-row cap,
// since it returns a single number rather than actual rows. This is why
// we use this instead of fetching every student row and filtering/counting
// in the browser, which was silently truncating and undercounting once the
// students table passed 1000 rows.
async function fetchStudentCount(filters: CountFilters): Promise<number> {
  let query = supabase.from("students").select("*", { count: "exact", head: true });

  for (const [column, value] of filters.eq ?? []) {
    query = query.eq(column, value);
  }
  for (const [column, value] of filters.neq ?? []) {
    query = query.neq(column, value);
  }
  if (filters.in) {
    const [column, values] = filters.in;
    query = query.in(column, values);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
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

      try {
        const [metricsRes, slotsRes] = await Promise.all([
          supabase.from("admin_overall_metrics").select("*").single(),
          // collection_slots is small (a handful of rows) — safe to fetch
          // in full, unlike students.
          supabase.from("collection_slots").select("id, venue, max_capacity"),
        ]);

        if (metricsRes.error) throw new Error(metricsRes.error.message);
        if (slotsRes.error) throw new Error(slotsRes.error.message);

        const metrics = metricsRes.data as OverallMetricsRow;
        const slots = slotsRes.data ?? [];
        const waitlistCapacity = metrics.waitlist_capacity ?? FALLBACK_WAITLIST_CAPACITY;

        const buildDay = async (venue: "TGH" | "LT1"): Promise<DayStats> => {
          const venueSlots = slots.filter((s) => s.venue === venue);
          const venueSlotIds = venueSlots.map((s) => s.id);
          const capacity = venueSlots.reduce((sum, s) => sum + s.max_capacity, 0);

          if (venueSlotIds.length === 0) {
            return { registered: 0, binded: 0, attended: 0, emptySlots: capacity, capacity };
          }

          const [registered, binded, attended] = await Promise.all([
            fetchStudentCount({
              eq: [["reg_type", "main"]],
              neq: [["ticket_status", "cancelled"]],
              in: ["slot_id", venueSlotIds],
            }),
            fetchStudentCount({
              eq: [["reg_type", "main"], ["binding_status", "bound"]],
              in: ["slot_id", venueSlotIds],
            }),
            fetchStudentCount({
              eq: [["reg_type", "main"], ["is_attended", true]],
              in: ["slot_id", venueSlotIds],
            }),
          ]);

          return {
            registered,
            binded,
            attended,
            emptySlots: Math.max(capacity - registered, 0),
            capacity,
          };
        };

        const [
          day1,
          day2,
          waitlistPending,
          waitlistPendingAttended,
          waitlistPromoted,
          waitlistPromotedAttended,
        ] = await Promise.all([
          buildDay("TGH"),
          buildDay("LT1"),
          fetchStudentCount({
            eq: [["reg_type", "waitlist"], ["binding_status", "unbound"]],
            neq: [["ticket_status", "cancelled"]],
          }),
          fetchStudentCount({
            eq: [["reg_type", "waitlist"], ["binding_status", "unbound"], ["is_attended", true]],
            neq: [["ticket_status", "cancelled"]],
          }),
          fetchStudentCount({
            eq: [["reg_type", "waitlist"], ["binding_status", "bound"]],
          }),
          fetchStudentCount({
            eq: [["reg_type", "waitlist"], ["binding_status", "bound"], ["is_attended", true]],
          }),
        ]);

        if (cancelled) return;

        setStats({
          overall: {
            total_main_registered: metrics.total_main_registered,
            total_waitlisted: metrics.total_waitlisted,
            total_tickets_collected_and_bound: metrics.total_tickets_collected_and_bound,
            total_students_attended: metrics.total_students_attended,
            target_capacity: metrics.target_capacity ?? FALLBACK_TARGET_CAPACITY,
            open_dday_slots: metrics.open_dday_slots,
          },
          day1,
          day2,
          waitlist: {
            registered: waitlistPending,
            attended: waitlistPendingAttended,
            capacity: waitlistCapacity,
            available: Math.max(waitlistCapacity - (waitlistPending + waitlistPromoted), 0),
            promoted: waitlistPromoted,
            promotedAttended: waitlistPromotedAttended,
          },
        });
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stats.");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { stats, loading, error, refetch: () => setRefreshKey((k) => k + 1) };
}