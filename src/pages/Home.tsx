// Ticket Queueing page

import Header from "../components/Header";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Queue() {
  // Placeholder Queue Values
  const queueCount = 67;
  const maxTickets = 1500;
  const waitingCount = 67;
  const maxWaiting = 500;
  const [showQueueModal, setShowQueueModal] = useState(false);

  const queueFull = queueCount >= maxTickets;
  const waitlistFull = waitingCount >= maxWaiting;
  const buttonLabel = waitlistFull
    ? "Slots Full"
    : queueFull
      ? "Click to Join Waiting List"
      : "Click to Queue";

  // Transition animation for the  video
  const [heroDismissed, setHeroDismissed] = useState(false);


  useEffect(() => {
    if (heroDismissed) return;

    const dismiss = () => setHeroDismissed(true);

    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("keydown", dismiss);
    window.addEventListener("touchstart", dismiss, { passive: true });

    return () => {
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [heroDismissed]);


  return (
    <>
      {/* Hero video */}

      <motion.section
        onClick={() => setHeroDismissed(true)}
        animate={{ opacity: heroDismissed ? 0 : 1, scale: heroDismissed ? 1.1 : 1 }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: heroDismissed ? "none" : "auto" }}
        className="fixed inset-0 z-50 h-screen w-full overflow-hidden cursor-pointer"
      >
        <video
          className="h-full w-full object-cover"
          src="/Elysium Word.mp4"
          autoPlay
          muted
          playsInline
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-pulse"
        >
          <p
            className="text-sm font-light uppercase tracking-[0.3em] text-white"
            style={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
          >
            Click to Enter Elysium
          </p>
        </motion.div>
      </motion.section>

      <Header
        title="ELYSIUM: ORIENTATION PARTY 2026"
        description="Ticket Queue"
      />


      <main className="w-full bg-[url('/temp-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="mx-auto max-w-6xl px-6 py-12">
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
              Be sure to come to your collection slot on time!
            </p>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Queuing: <span className="font-semibold">{queueCount} / {maxTickets}</span>
              </p>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-300">
                <div
                  className="h-3 rounded-full bg-black"
                  style={{ width: `${(queueCount / maxTickets) * 100}%` }}
                />
              </div>
            </div>

            {/* Button */}

            <button
              onClick={() => setShowQueueModal(true)}
              disabled={waitlistFull}
              className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {buttonLabel}
            </button>

          </section>

          {/* Waiting List Information */}
          <section className="mt-6 rounded-lg bg-gray-200 p-6">
            <h2 className="text-xl font-semibold">
              Waiting List
            </h2>

            <p className="mt-2 text-gray-600">
              Be sure to check your email for your waiting list information!
            </p>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Waiting: <span className="font-semibold">{waitingCount} / {maxWaiting}</span>
              </p>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-300">
                <div
                  className="h-3 rounded-full bg-black"
                  style={{ width: `${(waitingCount / maxWaiting) * 100}%` }}
                />
              </div>
            </div>

          </section>
        </div>
      </main >
    </>
  );
}

export default Queue;