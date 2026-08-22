import Header from "../../components/Header";

function Dashboard() {
  return (
    <>
      <Header
        title="Admin Dashboard"
        description="Overview of event registration and attendance."
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Registered
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Waitlist
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Attended
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">
            This is the Dashboard page
          </h2>

          <p className="mt-3 text-gray-600">
            Firebase statistics and graphs will go here.
          </p>
        </div>
      </main>
    </>
  );
}

export default Dashboard;