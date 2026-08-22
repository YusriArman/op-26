import Header from "../components/Header";

function Prizes() {
  return (
    <>
      <Header
        title="Prizes Page"
        description="Information about event prizes."
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">
            This is the Prizes page
          </h2>

          <p className="mt-3 text-gray-600">
            Prize information will be displayed here.
          </p>
        </div>
      </main>
    </>
  );
}

export default Prizes;