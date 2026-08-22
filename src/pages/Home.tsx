// Ticket Queueing page

import Header from "../components/Header";

function Home() {
  return (
    <>
      <Header
        title="Home Page"
        description="Welcome to the Freshman Event website."
      />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">
            This is the Home page
          </h2>

          <p className="mt-3 text-gray-600">
            Your landing page will be built here.
          </p>
        </div>
      </main>
    </>
  );
}

export default Home;