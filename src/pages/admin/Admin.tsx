import Header from "../../components/Header";

function Admin() {
  return (
    <>
      <Header
        title="Admin Login"
        description="Admin authentication will be handled by Firebase."
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">
            This is the Admin Login page
          </h2>

          <p className="mt-3 text-gray-600">
            Firebase Authentication will be added here later.
          </p>
        </div>
      </main>
    </>
  );
}

export default Admin;