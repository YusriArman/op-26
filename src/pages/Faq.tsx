import Header from "../components/Header";

function Faq() {
  return (
    <>
      <Header
        title="FAQ Page"
        description="Frequently asked questions."
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">
            This is the FAQ page
          </h2>

          <p className="mt-3 text-gray-600">
            FAQ data will eventually come from Firebase.
          </p>
        </div>
      </main>
    </>
  );
}

export default Faq;