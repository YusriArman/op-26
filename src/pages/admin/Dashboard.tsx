import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Metric from "../../components/admin/Metric";
import EventDayCard from "../../components/admin/EventDayCard";
import WaitlistCard from "../../components/admin/WaitlistCard";

import { useDashboardStats } from "../../hooks/useDashboardStats";

function Dashboard() {
  const { stats, loading, error } = useDashboardStats();

  const chartData = [
    { name: "Day 1 (TGH)", registered: stats.day1.registered, attended: stats.day1.attended },
    { name: "Day 2 (LT1)", registered: stats.day2.registered, attended: stats.day2.attended },
    {
      name: "Waitlist",
      registered: stats.waitlist.registered + stats.waitlist.promoted,
      attended: stats.waitlist.attended + stats.waitlist.promotedAttended,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Event Day Dashboard</h1>
        <p className="mt-2 text-sm text-[#8592B4]">
          Overall registration and attendance overview.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card mt-6 rounded-lg px-4 py-3 text-sm text-[#8592B4]">
          {error}
        </div>
      )}

      {/* Overall Statistics */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold text-white">Overall Statistics</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Metric
            label="Total Binded"
            value={loading ? "—" : stats.overall.total_main_registered}
            description="Main event registrations"
          />

          <Metric
            label="Total Attended"
            value={loading ? "—" : stats.overall.total_students_attended}
            description="Students checked in"
            to="/attended"
          />

          <Metric
            label="Available Slots"
            value={loading ? "—" : stats.overall.open_dday_slots}
            description="Remaining event capacity"
          />
        </div>
      </section>

      {/* Chart */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold text-white">Registered vs. Attended</h2>
        <p className="mt-1 text-sm text-[#8592B4]">
          Comparing turnout across both event days and the waitlist.
        </p>

        <div className="glass-card mt-4 rounded-2xl p-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#8592B4" tick={{ fill: "#8592B4", fontSize: 12 }} />
                <YAxis stroke="#8592B4" tick={{ fill: "#8592B4", fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#0b1226",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#EAF0FF",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Legend wrapperStyle={{ color: "#8592B4", fontSize: 12 }} />
                <Bar dataKey="registered" name="Registered" fill="#4C7CFF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attended" name="Attended" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Event Days */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold text-white">Event Days</h2>
        <p className="mt-1 text-sm text-[#8592B4]">
          Attendance and registration by collection day.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <EventDayCard
            title="Day 1 — TGH"
            subtitle="15 September · Taylor's Grand Hall"
            attended={loading ? 0 : stats.day1.attended}
            registered={loading ? 0 : stats.day1.registered}
            capacity={stats.day1.capacity}
          />

          <EventDayCard
            title="Day 2 — LT1"
            subtitle="17 September · Lecture Theatre 1"
            attended={loading ? 0 : stats.day2.attended}
            registered={loading ? 0 : stats.day2.registered}
            capacity={stats.day2.capacity}
          />

          <WaitlistCard
            totalRegistered={loading ? 0 : stats.waitlist.registered + stats.waitlist.promoted}
            onWaitlist={loading ? 0 : stats.waitlist.registered}
            capacity={stats.waitlist.capacity}
            available={loading ? stats.waitlist.capacity : stats.waitlist.available}
            promoted={loading ? 0 : stats.waitlist.promoted}
          />
        </div>
      </section>

    </main>
  );
}

export default Dashboard;