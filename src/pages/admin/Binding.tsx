import Header from "../../components/Header";

function Binding() {
  return (
    <>
      <Header
        title="Ticket / Student ID Binding"
        description="Bind a ticket to a student ID."
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">
            This is the Binding page
          </h2>

          <div className="mt-6 flex gap-3">
            <input
              type="text"
              placeholder="Search Student ID"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <button className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800">
              Search
            </button>
          </div>

          <div className="mt-8 rounded-lg bg-gray-50 p-6">
            <p className="text-gray-500">
              Student and ticket information will appear here.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default Binding;