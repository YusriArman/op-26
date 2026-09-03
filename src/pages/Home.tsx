// src/pages/Home.tsx
import Header from '../components/Header';
import QueueingSystem from '../components/QueuingSystem';
import WaitlistSystem from '../components/WaitlistSystem';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

// Make sure the hero video only plays once
let heroHasPlayed = false;

function Queue() {
  // Live State
  const [queueCount, setQueueCount] = useState<number>(0);
  const [waitingCount, setWaitingCount] = useState<number>(0);

  // Modals State
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState<boolean>(false);

  const maxTickets = 1500;
  const maxWaiting = 500;

  const queueFull = queueCount >= maxTickets;
  const waitlistFull = waitingCount >= maxWaiting;

  // Calculate clamped percentage for progress bars (0% to 100%)
  const queuePct = Math.min(100, Math.max(0, (queueCount / maxTickets) * 100));
  const waitingPct = Math.min(100, Math.max(0, (waitingCount / maxWaiting) * 100));

  // Transition animation for Hero video
  const [heroDismissed, setHeroDismissed] = useState(heroHasPlayed);

  const dismissHero = () => {
    setHeroDismissed(true);
    heroHasPlayed = true;
  };

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
    }
  }, []);

  // Poll counts on load and every 10 seconds
  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      if (!isMounted) return;
      await fetchLiveCounts();
    };

    // Run asynchronously on mount
    void poll();

    const interval = setInterval(() => {
      void poll();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchLiveCounts]);

  // Video dismiss listeners
  useEffect(() => {
    if (heroDismissed) return;

    const dismiss = () => dismissHero();

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
      {/* Hero Video Overlay */}
      <motion.section
        initial={false}
        onClick={dismissHero}
        animate={{
          opacity: heroDismissed ? 0 : 1,
          scale: heroDismissed ? 1.05 : 1,
        }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: heroDismissed ? 'none' : 'auto' }}
        className="fixed inset-0 z-50 h-screen w-full overflow-hidden cursor-pointer bg-black"
      >
        <video
          className="h-full w-full object-cover"
          src="/Elysium-Logo.mp4"
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
            className="text-xs sm:text-sm font-futura-book uppercase tracking-[0.3em] text-[#3cf6f7]"
            style={{ textShadow: '0 0 12px rgba(60,246,247,0.85)' }}
          >
            Click to Enter Elysium
          </p>
        </motion.div>
      </motion.section>

      {/* Main Page Layout */}
      <main className="w-full min-h-screen bg-[linear-gradient(to_bottom,rgba(0,8,27,0.7),rgba(0,8,27,0.50),rgba(0,8,27,0.65)),url('/bg.png')] bg-cover bg-center bg-fixed text-white flex flex-col justify-between">

        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-2 sm:pt-4">

          {/* Header Section */}
          <Header
            title="ELYSIUM: ORIENTATION PARTY 2026"
            description="Welcome Freshmen! Secure your official entrance pass and choose your physical ticket collection timeslot for Taylor's Grand Hall (TGH) or Lecture Theatre 1 (LT1)"
            align="center"
          />

          {/* Large Glowing Center Logo */}
          <div className="-mt-2 sm:-mt-3 mb-1 sm:mb-2 flex justify-center overflow-hidden">
            <img
              src="/Elysium-Logo.png"
              alt="Elysium 2026"
              className="w-96 sm:w-[36rem] md:w-[44rem] lg:w-[52rem] max-w-full object-contain drop-shadow-[0_0_15px_rgba(60,246,247,0.4)]"
            />
          </div>

          {/* Progress Bars & Queue Section */}
          <section className="space-y-6 max-w-3xl mx-auto">

            {/* 1. Main Queue Progress Bar */}
            <div className="space-y-2 text-center">
              <div className="text-xs sm:text-sm font-futura-medium font-semibold tracking-wider text-[#3cf6f7] drop-shadow-[0_0_8px_rgba(60,246,247,0.7)]">
                Event Limit: {queueCount}/{maxTickets} Queuing
              </div>

              <div className="relative h-6 w-full rounded-full bg-white/15 p-1 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6045f4] via-[#e139fa] to-[#3cf6f7] shadow-[0_0_18px_rgba(225,57,250,0.85)] transition-all duration-700 ease-out relative"
                  style={{ width: `${Math.max(4, queuePct)}%` }}
                >
                  {/* Mascot riding the tip of the progress bar */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 pointer-events-none">
                    <img
                      src="/rolby-loading.png"
                      alt="Main Queue Mascot"
                      className="h-12 w-12 max-w-none object-contain drop-shadow-[0_0_12px_rgba(60,246,247,1)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Waiting List Progress Bar */}
            <div className="space-y-2 text-center pt-2">
              <div className="text-xs sm:text-sm font-futura-medium font-semibold tracking-wider text-[#3cf6f7] drop-shadow-[0_0_8px_rgba(60,246,247,0.7)]">
                Waiting List: {waitingCount}/{maxWaiting} Waiting
              </div>

              <div className="relative h-6 w-full rounded-full bg-white/15 p-1 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6045f4] via-[#e139fa] to-[#3cf6f7] shadow-[0_0_18px_rgba(225,57,250,0.85)] transition-all duration-700 ease-out relative"
                  style={{ width: `${Math.max(4, waitingPct)}%` }}
                >
                  {/* Mascot riding the tip of the waitlist progress bar */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 pointer-events-none">
                    <img
                      src="/rolby-loading.png"
                      alt="Main Queue Mascot"
                      className="h-12 w-12 max-w-none object-contain drop-shadow-[0_0_12px_rgba(60,246,247,1)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">

              {/* Button 1: Main Queue */}
              <button
                onClick={() => setShowQueueModal(true)}
                disabled={queueFull}
                className={`w-full sm:w-64 rounded-none py-3.5 px-6 font-futura-heavy font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 shadow-[0_0_20px_rgba(60,246,247,0.3)] ${queueFull
                  ? 'cursor-not-allowed bg-gray-600/50 border border-gray-500 text-gray-400'
                  : 'bg-gradient-to-r from-[#6045f4] via-[#3cf6f7] to-[#e139fa] hover:brightness-110 hover:shadow-[0_0_25px_rgba(60,246,247,0.8)] border border-[#3cf6f7]'
                  }`}
              >
                {queueFull ? 'Main Queue Full' : 'Click to Queue'}
              </button>

              {/* Button 2: Enter Waitlist */}
              <button
                onClick={() => setShowWaitlistModal(true)}
                disabled={waitlistFull}
                className={`w-full sm:w-64 rounded-none py-3.5 px-6 font-futura-heavy font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 shadow-[0_0_20px_rgba(225,57,250,0.3)] ${waitlistFull
                  ? 'cursor-not-allowed bg-gray-600/50 border border-gray-500 text-gray-400'
                  : 'bg-gradient-to-r from-[#e139fa] via-[#6045f4] to-[#3cf6f7] hover:brightness-110 hover:shadow-[0_0_25px_rgba(225,57,250,0.8)] border border-[#e139fa]'
                  }`}
              >
                {waitlistFull ? 'Waitlist Full' : 'Enter Waitlist'}
              </button>

            </div>

          </section>

          {/* HOW TICKET QUEUING WORKS? (Tech Container) */}
          <section className="mt-14 sm:mt-20 mb-14 sm:mb-20 rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_25px_rgba(60,246,247,0.25)] relative">
            <div className="w-full h-full bg-[#090520]/80 backdrop-blur-md p-6 sm:p-8">
              <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#3cf6f7]" />

              <h3 className="text-base sm:text-lg font-futura-heavy font-bold uppercase tracking-[0.25em] text-[#3cf6f7] drop-shadow-[0_0_8px_rgba(60,246,247,0.7)]">
                HOW TICKET QUEUING WORKS?
              </h3>
              <p className="mt-1 text-xs font-futura-book text-gray-200 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                Follow these simple steps to ensure a smooth ticket collection process:
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="p-[1px] rounded-xl bg-gradient-to-br from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300 hover:from-[#3cf6f7] hover:to-[#6045f4]">
                  <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-4 h-full">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6045f4] text-xs font-futura-heavy font-bold text-white mb-2 shadow-[0_0_8px_rgba(96,69,244,0.6)]">
                      1
                    </div>
                    <h4 className="text-sm font-futura-heavy font-bold text-[#3cf6f7] uppercase tracking-[0.15em]">
                      REGISTER DETAILS
                    </h4>
                    <p className="mt-1 text-xs font-futura-book text-gray-200 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      Provide your Student ID (SID), Full Name, Taylor's Email, and Personal Email.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-[1px] rounded-xl bg-gradient-to-br from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300 hover:from-[#3cf6f7] hover:to-[#6045f4]">
                  <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-4 h-full">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6045f4] text-xs font-futura-heavy font-bold text-white mb-2 shadow-[0_0_8px_rgba(96,69,244,0.6)]">
                      2
                    </div>
                    <h4 className="text-sm font-futura-heavy font-bold text-[#3cf6f7] uppercase tracking-[0.15em]">
                      SELECT COLLECTION SLOT
                    </h4>
                    <p className="mt-1 text-xs font-futura-book text-gray-200 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      Choose an available date and time slot for collection at Taylor's Grand Hall or Lecture Theatre 1.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-[1px] rounded-xl bg-gradient-to-br from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)] transition duration-300 hover:from-[#3cf6f7] hover:to-[#6045f4]">
                  <div className="rounded-[11px] bg-[#160b38]/90 backdrop-blur-sm p-4 h-full">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6045f4] text-xs font-futura-heavy font-bold text-white mb-2 shadow-[0_0_8px_rgba(96,69,244,0.6)]">
                      3
                    </div>
                    <h4 className="text-sm font-futura-heavy font-bold text-[#3cf6f7] uppercase tracking-[0.15em]">
                      PHYSICAL COLLECTION
                    </h4>
                    <p className="mt-1 text-xs font-futura-book text-gray-200 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      Bring your Student ID to the venue during your assigned slot to collect your physical pass.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Main Registration Modal */}
      <QueueingSystem
        isOpen={showQueueModal}
        onClose={() => setShowQueueModal(false)}
        onSuccess={() => {
          fetchLiveCounts();
        }}
        isWaitlistOnly={false}
      />

      {/* Dedicated Waitlist Modal */}
      <WaitlistSystem
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        onSuccess={() => {
          fetchLiveCounts();
        }}
      />
    </>
  );
}

export default Queue;