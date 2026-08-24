import Metric from "../../components/admin/Metric";
import EventDayCard from "../../components/admin/EventDayCard";
import WaitlistCard from "../../components/admin/WaitlistCard";

import { useDashboardStats } from "../../hooks/useDashboardStats";

function Dashboard() {
  const {
    stats,
    loading,
    error,
  } = useDashboardStats();

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold">
          Event Day Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Overall registration and attendance
          overview.
        </p>
      </div>


      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          {error}
        </div>
      )}


      {/* Overall Statistics */}

      <section className="mt-12">

        <h2 className="text-sm font-semibold">
          Overall Statistics
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          <Metric
            label="Total Registered"
            value={
              loading
                ? "—"
                : stats.overall
                    .total_main_registered
            }
            description="Main event registrations"
          />

          <Metric
            label="Total Attended"
            value={
              loading
                ? "—"
                : stats.overall
                    .total_students_attended
            }
            description="Students checked in"
            to="/attended"
          />

          <Metric
            label="Available Slots"
            value={
              loading
                ? "—"
                : stats.overall
                    .open_dday_slots
            }
            description="Remaining event capacity"
          />

        </div>

      </section>


      {/* Event Days */}

      <section className="mt-12">

        <h2 className="text-sm font-semibold">
          Event Days
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Attendance and registration by collection
          day.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

          <EventDayCard
            title="Day 1 — TGH"
            subtitle="15 September · Taylor's Grand Hall"
            attended={
              loading
                ? 0
                : stats.day1.attended
            }
            registered={
              loading
                ? 0
                : stats.day1.registered
            }
            capacity={
              stats.day1.capacity
            }
          />

          <EventDayCard
            title="Day 2 — LT1"
            subtitle="17 September · Lecture Theatre 1"
            attended={
              loading
                ? 0
                : stats.day2.attended
            }
            registered={
              loading
                ? 0
                : stats.day2.registered
            }
            capacity={
              stats.day2.capacity
            }
          />

          <WaitlistCard
            registered={
              loading
                ? 0
                : stats.waitlist.registered
            }
            capacity={
              stats.waitlist.capacity
            }
            available={
              loading
                ? stats.waitlist.capacity
                : stats.waitlist.available
            }
          />

        </div>

      </section>

    </main>
  );
}

export default Dashboard;