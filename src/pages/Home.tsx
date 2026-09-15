// src/pages/Home.tsx
import Header from '../components/Header';
import QueueingSystem from '../components/QueuingSystem';
import WaitlistSystem from '../components/WaitlistSystem';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { fetchAnnouncements } from '../services/announcementService';
import type { Announcement } from '../types/announcement';

// Make sure the hero video only plays once per session
let heroHasPlayed = false;

function Queue() {
  // Video ref for programmatic mobile autoplay
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live State
  const [queueCount, setQueueCount] = useState<number>(0);
  const [waitingCount, setWaitingCount] = useState<number>(0);

  // Modals State
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState<boolean>(false);

  // Announcements State & Detail Modal
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncements)
      .catch((err) => console.error('Failed to fetch announcements:', err));

    const channel = supabase
      .channel('announcements-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          const newPost = payload.new as Announcement;
          // Only show immediately if it is active and publish time has arrived!
          const isPublished = !newPost.publish_at || new Date(newPost.publish_at) <= new Date();
          if (newPost.is_active !== false && isPublished) {
            setAnnouncements((prev) => [newPost, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Lock body scroll when announcement modal is open
  useEffect(() => {
    if (selectedAnnouncement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAnnouncement]);

  function timeAgo(dateString: string) {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const maxTickets = 1500;
  const maxWaiting = 200;

  const queueFull = queueCount >= maxTickets;
  const waitlistFull = waitingCount >= maxWaiting;

  // Calculate clamped percentage for progress bars (0% to 100%)
  const queuePct = Math.min(100, Math.max(0, (queueCount / maxTickets) * 100));
  const waitingPct = Math.min(100, Math.max(0, (waitingCount / maxWaiting) * 100));

  // Dynamic Button State Logic
  const canQueue = !queueFull;
  const canWaitlist = queueFull && !waitlistFull;

  const queueButtonLabel = queueFull ? 'Main Queue Full' : 'Click to Queue';
  const waitlistButtonLabel = waitlistFull
    ? 'Waitlist Full'
    : queueFull
      ? 'Enter Waitlist'
      : 'Waitlist (Opens at 1,500)';

  // Transition animation for Hero video
  const [heroDismissed, setHeroDismissed] = useState(heroHasPlayed);

  const dismissHero = () => {
    setHeroDismissed(true);
    heroHasPlayed = true;
  };

  // Force Autoplay on Mobile Devices (iOS & Android)
  useEffect(() => {
    if (videoRef.current && !heroDismissed) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        console.log('Mobile autoplay handled by user interaction.');
      });
    }
  }, [heroDismissed]);

  // Live Count Polling Function
  const fetchLiveCounts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_overall_metrics')
        .select('total_queue_claimed, total_waitlisted')
        .single();

      if (error) {
        console.error('Error fetching live counts:', error.message);
      } else if (data) {
        setQueueCount(data.total_queue_claimed || 0);
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
        className="fixed inset-0 z-50 h-dvh w-full overflow-hidden cursor-pointer bg-black"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/Elysium-Logo.mp4"
          poster="/Elysium-Logo.png"
          autoPlay
          muted
          playsInline
          preload="auto"
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
                      className="h-12 w-12 max-w-none object-contain drop-shadow-[0_0_12px_rgba(225,57,250,1)]"
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
                disabled={!canQueue}
                className={`w-full sm:w-72 h-14 rounded-none px-6 font-futura-heavy font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center text-center transition-all duration-300 ${canQueue
                  ? 'text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_0_10px_rgba(60,246,247,0.9)] bg-gradient-to-r from-[#6045f4] via-[#3cf6f7] to-[#e139fa] hover:brightness-110 hover:shadow-[0_0_25px_rgba(60,246,247,0.8)] border border-[#3cf6f7] shadow-[0_0_20px_rgba(60,246,247,0.3)] cursor-pointer'
                  : 'text-gray-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.9)] bg-[#090520]/80 backdrop-blur-md border border-white/20 cursor-not-allowed shadow-none'
                  }`}
              >
                {queueButtonLabel}
              </button>

              {/* Button 2: Enter Waitlist */}
              <button
                onClick={() => setShowWaitlistModal(true)}
                disabled={!canWaitlist}
                className={`w-full sm:w-72 h-14 rounded-none px-6 font-futura-heavy font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center text-center transition-all duration-300 ${canWaitlist
                  ? 'text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.95),0_0_10px_rgba(225,57,250,0.9)] bg-gradient-to-r from-[#e139fa] via-[#6045f4] to-[#3cf6f7] hover:brightness-110 hover:shadow-[0_0_25px_rgba(225,57,250,0.8)] border border-[#e139fa] shadow-[0_0_20px_rgba(225,57,250,0.3)] cursor-pointer'
                  : 'text-gray-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.9)] bg-[#090520]/80 backdrop-blur-md border border-white/20 cursor-not-allowed shadow-none'
                  }`}
              >
                {waitlistButtonLabel}
              </button>

            </div>

          </section>

          {/* Live Announcements Section (Optimized Padding) */}
          <section className="mt-14 sm:mt-16 rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_25px_rgba(60,246,247,0.25)] relative">
            <div className="w-full h-full bg-[#090520]/80 backdrop-blur-md p-4 sm:p-6">
              <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#3cf6f7]" />

              {/* Announcements Header (Mobile Responsive & Non-Wrapping Badge) */}
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-futura-heavy font-bold uppercase tracking-[0.2em] text-[#3cf6f7] drop-shadow-[0_0_8px_rgba(60,246,247,0.7)]">
                    Announcements
                  </h3>
                  <p className="mt-1 text-xs font-futura-book text-gray-200 tracking-wide leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    Live updates from the Elysium team. Click on any update to expand.
                  </p>
                </div>

                {/* 3 LIVE Badge — Locked to single line with breathing room */}
                {announcements.length > 0 && (
                  <span className="whitespace-nowrap shrink-0 text-[10px] sm:text-[11px] font-futura-medium text-[#3cf6f7] border border-[#3cf6f7]/40 bg-cyan-950/60 px-2.5 py-1 uppercase tracking-wider rounded-none shadow-[0_0_10px_rgba(60,246,247,0.25)]">
                    {announcements.length} Live
                  </span>
                )}
              </div>

              {/* Announcements List Container (Padded so hover glow never clips) */}
              <div className="mt-4 space-y-4 max-h-80 overflow-y-auto overflow-x-hidden p-3 sm:p-3.5 pr-3 sm:pr-4 -mx-1">
                {announcements.length === 0 ? (
                  <div className="py-8 text-center text-xs font-futura-book text-gray-400">
                    No active announcements at the moment.
                  </div>
                ) : (
                  announcements.map((a, index) => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAnnouncement(a)}
                      className="group p-[1px] rounded-xl bg-gradient-to-br from-[#3cf6f7]/60 via-[#e139fa]/60 to-[#6045f4]/60 shadow-[0_0_15px_rgba(0,0,0,0.4)] cursor-pointer transition-all duration-200 hover:shadow-[0_0_6px_rgba(60,246,247,0.25)]"
                    >
                      <div className="rounded-[11px] bg-[#160b38]/90 group-hover:bg-[#1f0f4e] backdrop-blur-sm p-4 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* PINNED BADGE */}
                            {a.is_pinned && (
                              <span className="inline-flex items-center gap-1 shrink-0 rounded-full border border-[#3cf6f7] bg-[#3cf6f7]/20 px-2 py-0.5 text-[10px] font-futura-heavy font-bold text-[#3cf6f7] shadow-[0_0_8px_rgba(60,246,247,0.6)] uppercase tracking-wider">
                                <svg
                                  className="w-3 h-3 fill-current"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
                                </svg>
                                Pinned
                              </span>
                            )}

                            {/* NEW BADGE */}
                            {index === 0 && !a.is_pinned && (
                              <span className="shrink-0 rounded-full bg-[#e139fa] px-2 py-0.5 text-[10px] font-futura-heavy font-bold text-white shadow-[0_0_8px_rgba(225,57,250,0.7)] uppercase tracking-wider">
                                NEW
                              </span>
                            )}

                            {/* CATEGORY BADGE */}
                            {a.category && a.category !== 'info' && (
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-futura-heavy font-bold uppercase tracking-wider ${a.category === 'urgent'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : a.category === 'event'
                                  ? 'bg-cyan-500/20 text-[#3cf6f7] border border-cyan-500/40'
                                  : a.category === 'warning'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                }`}>
                                {a.category}
                              </span>
                            )}

                            <h4 className="text-sm font-futura-heavy font-bold text-[#3cf6f7] group-hover:text-white uppercase tracking-[0.1em] transition-colors">
                              {a.title}
                            </h4>
                          </div>

                          <span className="text-[10px] font-futura-book uppercase tracking-wider text-gray-400 shrink-0 mt-0.5">
                            {timeAgo(a.created_at)}
                          </span>
                        </div>

                        {/* Snippet Content */}
                        <p className="mt-2 text-xs font-futura-book text-gray-200 leading-relaxed line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                          {a.content}
                        </p>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[10px] font-futura-medium text-cyan-300/80 group-hover:text-cyan-300 flex items-center gap-1 transition-colors">
                            Click to expand
                            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          <span className="text-[10px] font-futura-book text-gray-400">
                            {new Date(a.publish_at || a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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

      {/* ENLARGEABLE ANNOUNCEMENT MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-none p-[1px] bg-gradient-to-r from-[#3cf6f7]/80 via-[#e139fa]/80 to-[#6045f4]/80 shadow-[0_0_40px_rgba(60,246,247,0.3)] relative text-white my-8">
            <div className="w-full h-full bg-[#090520]/95 backdrop-blur-xl p-6 sm:p-8">
              {/* Tech Corner Decorative Accents */}
              <div className="absolute top-0 left-0 h-3.5 w-3.5 border-t-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute top-0 right-0 h-3.5 w-3.5 border-t-2 border-r-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-[#3cf6f7]" />
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-[#3cf6f7]" />

              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-cyan-400/20 pb-4">
                <div className="space-y-2 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedAnnouncement.is_pinned && (
                      <span className="inline-flex items-center gap-1 shrink-0 rounded-full border border-[#3cf6f7] bg-[#3cf6f7]/20 px-2 py-0.5 text-[10px] font-futura-heavy font-bold text-[#3cf6f7] shadow-[0_0_8px_rgba(60,246,247,0.6)] uppercase tracking-wider">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
                        </svg>
                        Pinned
                      </span>
                    )}
                    {selectedAnnouncement.category && (
                      <span className="shrink-0 rounded-full bg-cyan-500/20 text-[#3cf6f7] border border-cyan-500/40 px-2 py-0.5 text-[10px] font-futura-heavy font-bold uppercase tracking-wider">
                        {selectedAnnouncement.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-futura-heavy font-bold uppercase tracking-[0.15em] text-[#3cf6f7] drop-shadow-[0_0_8px_rgba(60,246,247,0.6)]">
                    {selectedAnnouncement.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="rounded-none p-1.5 text-gray-400 hover:text-[#3cf6f7] hover:bg-cyan-950/40 transition shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-6">
                <div className="rounded-xl border border-purple-500/30 bg-[#160b38]/70 p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                  <p className="text-xs sm:text-sm font-futura-book text-gray-100 whitespace-pre-line leading-relaxed">
                    {selectedAnnouncement.content}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-futura-book text-gray-400 px-1">
                  <span>
                    Published: {new Date(selectedAnnouncement.publish_at || selectedAnnouncement.created_at).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>{timeAgo(selectedAnnouncement.created_at)}</span>
                </div>
              </div>

              {/* Modal Footer Button */}
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-full rounded-none bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 py-3 text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_20px_rgba(60,246,247,0.4)] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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