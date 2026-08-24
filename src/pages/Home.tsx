// Ticket Queueing page

import Header from "../components/Header";

function Queue() {
  return (
    <>
      <Header
        title="ELYSIUM: ORIENTATION PARTY 2026"
        description="Ticket Queue"
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero / Banner */}
        <section className="h-48 rounded-lg bg-gray-300">
          {/* Hero image will go here */}
        </section>

        {/* Queue Information */}
        <section className="mt-6 rounded-lg bg-gray-200 p-6">
          <h2 className="text-xl font-semibold">
            Ticket Queue
          </h2>

          <p className="mt-2 text-gray-600">
            Please wait while your ticket is being processed.
          </p>

          <div className="mt-6 rounded-lg bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              Your queue position
            </p>

            <p className="mt-2 text-4xl font-bold">
              --
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Queue;