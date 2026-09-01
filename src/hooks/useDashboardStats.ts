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

const TARGET_CAPACITY = 1500;
const WAITLIST_CAPACITY = 500;
const emptyDay: DayStats = { registered: 0, binded: 0, attended: 0, emptySlots: 0, capacity: 0 };

const emptyStats: DashboardStats = {
  overall: {
    total_main_registered: 0,
    total_waitlisted: 0,
    total_students_attended: 0,
    target_capacity: TARGET_CAPACITY,
    open_dday_slots: TARGET_CAPACITY,
  },
  day1: emptyDay,
  day2: emptyDay,
  waitlist: { registered: 0, attended: 0, capacity: WAITLIST_CAPACITY, available: WAITLIST_CAPACITY },
};

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

      const [studentsRes, slotsRes] = await Promise.all([
        supabase.from("students").select("reg_type, ticket_status, is_attended, slot_id"),
        supabase.from("collection_slots").select("id, venue, max_capacity"),
      ]);

      if (cancelled) return;

      if (studentsRes.error || slotsRes.error) {
        setError(studentsRes.error?.message ?? slotsRes.error?.message ?? "Failed to load stats.");
        setLoading(false);
        return;
      }

      const students = studentsRes.data ?? [];
      const slots = slotsRes.data ?? [];

      const aggregate = (venue: "TGH" | "LT1"): DayStats => {
        const venueSlots = slots.filter((s) => s.venue === venue);
        const venueSlotIds = new Set(venueSlots.map((s) => s.id));
        const capacity = venueSlots.reduce((sum, s) => sum + s.max_capacity, 0);

        const venueStudents = students.filter(
          (s) => s.reg_type === "main" && s.slot_id && venueSlotIds.has(s.slot_id)
        );

        return {
          registered: venueStudents.length,
          binded: venueStudents.filter((s) => s.ticket_status === "collected").length,
          attended: venueStudents.filter((s) => s.is_attended).length,
          emptySlots: venueStudents.filter((s) => s.ticket_status === "pending_collection").length,
          capacity,
        };
      };

      const mainStudents = students.filter((s) => s.reg_type === "main");
      const waitlistStudents = students.filter((s) => s.reg_type === "waitlist");

      const mainRegistered = mainStudents.length;
      const waitlisted = waitlistStudents.length;
      const attended = students.filter((s) => s.is_attended).length;

      // "Available Slots" represents how many main-event seats remain
      // based on who is physically checked in right now (is_attended),
      // not how many tickets have merely been collected. Waitlist is
      // excluded — it draws from its own separate 500-slot pool, not
      // the main 1500-seat venue capacity.
      const mainAttended = mainStudents.filter((s) => s.is_attended).length;
      const waitlistAttended = waitlistStudents.filter((s) => s.is_attended).length;

      setStats({
        overall: {
          total_main_registered: mainRegistered,
          total_waitlisted: waitlisted,
          total_students_attended: attended,
          target_capacity: TARGET_CAPACITY,
          open_dday_slots: Math.max(TARGET_CAPACITY - mainAttended, 0),
        },
        day1: aggregate("TGH"),
        day2: aggregate("LT1"),
        waitlist: {
          registered: waitlisted,
          attended: waitlistAttended,
          capacity: WAITLIST_CAPACITY,
          available: Math.max(WAITLIST_CAPACITY - waitlisted, 0),
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