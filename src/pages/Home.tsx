// src/pages/Home.tsx
import Header from '../components/Header';
import QueueingSystem from '../components/QueuingSystem';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

function Queue() {
  // Live State
  const [queueCount, setQueueCount] = useState<number>(0);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);

  const maxTickets = 1500;
  const maxWaiting = 500;

  const queueFull = queueCount >= maxTickets;
  const waitlistFull = waitingCount >= maxWaiting;

  const buttonLabel = waitlistFull
    ? 'All Passes & Waitlist Full'
    : queueFull
      ? 'Click to Join Waiting List'
      : 'Click to Queue';

  // Transition animation for Hero video
  const [heroDismissed, setHeroDismissed] = useState(false);

  // Live Count Polling Function
  const fetchLiveCounts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_overall_metrics')
        .select('total_main_registered, total_waitlisted')
        .single();

      if (error) {
        console.error('Error fetching live counts:', error.message);
      } else if (data) {
        setQueueCount(data.total_main_registered || 0);
        setWaitingCount(data.total_waitlisted || 0);
      }
    } catch (err) {
      console.error('Failed to poll metrics:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Poll counts on load and every 10 seconds
    useEffect(() => {
      let cancelled = false;

      async function poll() {
        try {
          const { data, error } = await supabase
            .from('admin_overall_metrics')
            .select('total_main_registered, total_waitlisted')
            .single();

          if (cancelled) return;

          if (error) {
            console.error('Error fetching live counts:', error.message);
          } else if (data) {
            setQueueCount(data.total_main_registered || 0);
            setWaitingCount(data.total_waitlisted || 0);
          }
        } catch (err) {
          if (!cancelled) console.error('Failed to poll metrics:', err);
        } finally {
          if (!cancelled) setLoadingStats(false);
        }
      }

      poll();
      const interval = setInterval(poll, 10000);

      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }, []);

  // Video dismiss listeners
  useEffect(() => {
    if (heroDismissed) return;

    const dismiss = () => setHeroDismissed(true);

    window.addEventListener('wheel', dismiss, { passive: true });
    window.addEventListener('keydown', dismiss);
    window.addEventListener('touchstart', dismiss, { passive: true });

    return () => {
      window.removeEventListener('wheel', dismiss);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('touchstart', dismiss);
    };
  }, [heroDismissed]);

  return (
    <>
      {/* Hero Video */}
      <motion.section
        onClick={() => setHeroDismissed(true)}
        animate={{
          opacity: heroDismissed ? 0 : 1,
          scale: heroDismissed ? 1.1 : 1,
        }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: heroDismissed ? 'none' : 'auto' }}
        className="fixed inset-0 z-50 h-screen w-full overflow-hidden cursor-pointer bg-black"
      >
        <video
          className="h-full w-full object-cover"
          src="/Elysium Effect.mp4"
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
            style={{ textShadow: '0 0 8px rgba(255,255,255,0.8)' }}
          >
            Click to Enter Elysium
          </p>
        </motion.div>
      </motion.section>

      <Header
        title="ELYSIUM: ORIENTATION PARTY 2026"
        description="Ticket Queue"
      />

      <main className="w-full min-h-screen bg-[url('/temp-bg.jpg')] bg-cover bg-center bg-fixed">
        <div className="mx-auto max-w-6xl px-6 py-12">
          {/* Hero / Banner */}
          <section className="h-48 rounded-lg bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 font-medium">Elysium 2026 Official Banner</span>
          </section>

          {/* Ticket Queue Section */}
          <section className="mt-6 rounded-lg bg-gray-200/90 backdrop-blur p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Main Ticket Queue
              </h2>
              {loadingStats && (
                <span className="text-xs text-gray-500 animate-pulse">
                  Syncing live queue...
                </span>
              )}
            </div>

            <p className="mt-2 text-gray-600 text-sm">
              Be sure to select and arrive at your ticket collection slot on time!
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Passes Claimed:</span>
                <span className="font-semibold">
                  {queueCount} / {maxTickets}
                </span>
              </div>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-300 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-black transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (queueCount / maxTickets) * 100)}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowQueueModal(true)}
              disabled={waitlistFull}
              className={`mt-6 w-full rounded-lg py-3.5 font-semibold text-white transition shadow ${waitlistFull
                  ? 'cursor-not-allowed bg-gray-400'
                  : queueFull
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-black hover:bg-gray-800'
                }`}
            >
              {buttonLabel}
            </button>
          </section>

          {/* Waiting List Section */}
          <section className="mt-6 rounded-lg bg-gray-200/90 backdrop-blur p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">
              Waiting List Queue
            </h2>

            <p className="mt-2 text-gray-600 text-sm">
              Opens automatically when the 1,500 main queue limit is reached.
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Waitlisted Freshmen:</span>
                <span className="font-semibold">
                  {waitingCount} / {maxWaiting}
                </span>
              </div>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-300 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-amber-600 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (waitingCount / maxWaiting) * 100)}%` }}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Queue Registration Modal */}
      <QueueingSystem
        isOpen={showQueueModal}
        onClose={() => setShowQueueModal(false)}
        onSuccess={() => {
          fetchLiveCounts(); // Instantly refresh live counters on registration success
        }}
        isWaitlistOnly={queueFull}
      />
    </>
  );
}

export default Queue;