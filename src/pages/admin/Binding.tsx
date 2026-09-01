import Header from "../../components/Header";
import BindingCard from "../../components/admin/BindingCard";
import { useDashboardStats } from "../../hooks/useDashboardStats";

function Binding() {
  const { stats, loading, error } = useDashboardStats();

  const maxTickets = stats.overall.target_capacity;
  const totalRegisteredTickets = stats.overall.total_main_registered;
  const ticketsRemaining = Math.max(maxTickets - totalRegisteredTickets, 0);
  const registrationFull = totalRegisteredTickets >= maxTickets;

  if (error) {
    return (
      <>
        <Header title="Binding Dashboard" description="Select an event day or manage the waitlist." />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="glass-card rounded-xl p-6 text-sm text-[#8592B4]">
            Failed to load dashboard stats: {error}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Binding Dashboard" description="Select an event day or manage the waitlist." />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="glass-card mb-8 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-[#8592B4]">Tickets Registered</p>
              <p className="mt-1 font-display text-3xl font-semibold text-white">
                {loading ? "--" : Math.min(totalRegisteredTickets, maxTickets).toLocaleString()}
                <span className="text-lg font-normal text-[#5b6785]"> / {maxTickets.toLocaleString()}</span>
              </p>
            </div>

            <div className="text-right">
              {registrationFull ? (
                <>
                  <p className="text-sm font-semibold text-[#F87171]">Registration Full</p>
                  <p className="mt-1 text-xs text-[#8592B4]">No more tickets can be bound.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">{loading ? "--" : ticketsRemaining.toLocaleString()}</p>
                  <p className="text-xs text-[#8592B4]">tickets remaining</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${registrationFull ? "bg-[#F87171]" : "bg-[#4C7CFF]"}`}
                style={{
                  width: `${loading ? 0 : Math.min((totalRegisteredTickets / maxTickets) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-[#8592B4]">Maximum capacity: {maxTickets.toLocaleString()} tickets</p>
          </div>
        </section>

        <div className="space-y-6">
          <BindingCard
            title="Day 1 (TGH) Binding"
            date="15 September"
            registered={loading ? "--" : stats.day1.registered}
            binded={loading ? "--" : stats.day1.binded}
            emptySlots={loading ? "--" : stats.day1.emptySlots}
            to="/binding/day-1"
            disabled={registrationFull}
          />

          <BindingCard
            title="Day 2 (LT1) Binding"
            date="17 September"
            registered={loading ? "--" : stats.day2.registered}
            binded={loading ? "--" : stats.day2.binded}
            emptySlots={loading ? "--" : stats.day2.emptySlots}
            to="/binding/day-2"
            disabled={registrationFull}
          />

          <BindingCard
            title="Waitlist Binding"
            waitlist={loading ? "--" : stats.waitlist.registered}
            emptySlots={loading ? "--" : stats.waitlist.available}
            to="/binding/waitlist"
            disabled={registrationFull}
          />
        </div>
      </main>
    </>
  );
}

export default Binding;