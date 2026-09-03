// src/components/QueueingSystem.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import type { CollectionSlot } from '../types/student';

interface QueueingSystemProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isWaitlistOnly: boolean;
}

interface RegistrationResult {
    type: 'main' | 'waitlist';
    message: string;
    waitlistNumber?: number;
    slotDetails?: {
        venue: string;
        slotDate: string;
        startTime: string;
        endTime: string;
    };
}

const ENGLISH_NAME_REGEX = /^[a-zA-Z\s'/@.-]+$/;

export default function QueueingSystem({
    isOpen,
    onClose,
    onSuccess,
    isWaitlistOnly,
}: QueueingSystemProps) {
    // Form State
    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [taylorsEmail, setTaylorsEmail] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    // Slots & UI State
    const [slots, setSlots] = useState<CollectionSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [result, setResult] = useState<RegistrationResult | null>(null);

    useEffect(() => {
        if (isWaitlistOnly) return;

        let cancelled = false;

        async function loadSlots() {
            setLoadingSlots(true);

            const { data, error } = await supabase
                .from('collection_slots')
                .select('*')
                .order('slot_date', { ascending: true })
                .order('start_time', { ascending: true });

            if (cancelled) return;

            if (error) {
                console.error('Failed to load slots:', error.message);
            } else if (data) {
                const slotList = data as CollectionSlot[];
                setSlots(slotList);
                const firstAvailable = slotList.find((s: CollectionSlot) => s.booked_count < s.max_capacity);
                if (firstAvailable) {
                    setSelectedSlotId(firstAvailable.id);
                }
            }

            setLoadingSlots(false);
        }

        loadSlots();

        return () => {
            cancelled = true;
        };
    }, [isWaitlistOnly]);

    // Lock background scrolling while modal is open
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const formatTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${m} ${ampm}`;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage(null);

        const cleanSid = studentId.trim().toUpperCase();
        const cleanName = fullName.trim();
        const cleanTaylorsEmail = taylorsEmail.trim().toLowerCase();
        const cleanPersonalEmail = personalEmail.trim().toLowerCase();

        if (!cleanSid || !cleanName || !cleanTaylorsEmail || !cleanPersonalEmail) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        if (!ENGLISH_NAME_REGEX.test(cleanName)) {
            setErrorMessage('Full name must contain English alphabet letters only.');
            return;
        }

        if (!cleanTaylorsEmail.endsWith('@sd.taylors.edu.my') && !cleanTaylorsEmail.endsWith('@taylors.edu.my')) {
            setErrorMessage("Please enter a valid Taylor's student email (e.g. name@sd.taylors.edu.my).");
            return;
        }

        if (!isWaitlistOnly && !selectedSlotId) {
            setErrorMessage('Please choose a physical ticket collection timeslot.');
            return;
        }

        setSubmitting(true);

        try {
            const { data, error } = await supabase.rpc('register_freshman', {
                p_student_id: cleanSid,
                p_full_name: cleanName,
                p_taylors_email: cleanTaylorsEmail,
                p_personal_email: cleanPersonalEmail,
                p_slot_id: isWaitlistOnly ? null : selectedSlotId,
            });

            if (error) {
                setErrorMessage(error.message || 'An error occurred during submission.');
                setSubmitting(false);
                return;
            }

            if (!data.success) {
                setErrorMessage(data.message || 'Registration was unsuccessful.');
                setSubmitting(false);
                return;
            }

            const chosenSlot = slots.find((s) => s.id === selectedSlotId);
            setResult({
                type: data.type,
                message: data.message,
                waitlistNumber: data.waitlist_number,
                slotDetails: chosenSlot
                    ? {
                        venue: chosenSlot.venue,
                        slotDate: chosenSlot.slot_date,
                        startTime: chosenSlot.start_time,
                        endTime: chosenSlot.end_time,
                    }
                    : undefined,
            });

            onSuccess();
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : 'Unexpected network error.');
        } finally {
            setSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-none p-[1px] bg-gradient-to-r from-[#00F0FF]/70 via-[#E000FF]/70 to-[#2596be]/70 shadow-[0_0_35px_rgba(0,240,255,0.25)] relative text-white my-8">
                <div className="w-full h-full bg-[#090520]/95 backdrop-blur-xl p-6 sm:p-8">
                    {/* Tech Corner Decorative Accents */}
                    <div className="absolute top-0 left-0 h-3.5 w-3.5 border-t-2 border-l-2 border-[#00F0FF]" />
                    <div className="absolute top-0 right-0 h-3.5 w-3.5 border-t-2 border-r-2 border-[#00F0FF]" />
                    <div className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-[#00F0FF]" />
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-[#00F0FF]" />

                    {/* Modal Header */}
                    <div className="flex items-start justify-between border-b border-cyan-400/20 pb-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-futura-heavy font-bold uppercase tracking-[0.18em] text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                                {result
                                    ? 'Registration Confirmed!'
                                    : isWaitlistOnly
                                        ? 'Join Elysium Waitlist'
                                        : 'Elysium 2026 Ticket Queue'}
                            </h3>
                            <p className="text-xs font-futura-book text-gray-300 mt-1 tracking-wide">
                                {isWaitlistOnly
                                    ? 'Main passes are full. Join waitlist for uncollected ticket drops.'
                                    : 'Taylor\u2019s Orientation Party Freshman Registration'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-none p-1.5 text-gray-400 hover:text-[#00F0FF] hover:bg-cyan-950/40 transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Modal Content */}
                    {result ? (
                        /* SUCCESS SCREEN */
                        <div className="py-6 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border border-cyan-400 bg-cyan-500/20 text-[#00F0FF] text-2xl font-bold mb-4 shadow-[0_0_15px_rgba(0,240,255,0.6)]">
                                ✓
                            </div>
                            <h4 className="text-base font-futura-heavy font-bold text-cyan-300 uppercase tracking-wider">
                                {result.type === 'main'
                                    ? 'You\u2019ve Secured a Pass!'
                                    : `Waitlist Position #${result.waitlistNumber}`}
                            </h4>
                            <p className="mt-2 text-xs font-futura-book text-gray-200 px-4 leading-relaxed">{result.message}</p>

                            {result.slotDetails && (
                                <div className="mt-5 rounded-none p-[1px] bg-gradient-to-r from-cyan-400/50 via-purple-500/50 to-pink-500/50 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                    <div className="w-full h-full bg-[#160b38]/90 p-4 text-left">
                                        <p className="text-[11px] font-futura-heavy font-bold text-[#00F0FF] uppercase tracking-[0.15em]">
                                            Ticket Collection Venue &amp; Time:
                                        </p>
                                        <p className="text-sm font-futura-heavy font-bold text-white mt-1">
                                            {result.slotDetails.venue === 'TGH'
                                                ? "Taylor's Grand Hall (TGH)"
                                                : 'Lecture Theatre 1 (LT1)'}
                                        </p>
                                        <p className="text-xs font-futura-book text-gray-300 mt-0.5">
                                            {formatDate(result.slotDetails.slotDate)}
                                        </p>
                                        <p className="text-xs font-futura-medium font-semibold text-pink-400 mt-0.5">
                                            {formatTime(result.slotDetails.startTime)} – {formatTime(result.slotDetails.endTime)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 rounded-none p-[1px] bg-gradient-to-r from-purple-500/30 to-cyan-500/30">
                                <div className="bg-[#160b38]/60 p-3 text-xs font-futura-book text-gray-300 text-left space-y-1">
                                    <p><strong className="text-cyan-300">Student ID:</strong> {studentId.toUpperCase()}</p>
                                    <p><strong className="text-cyan-300">Taylor's Email:</strong> {taylorsEmail.toLowerCase()}</p>
                                    <p><strong className="text-cyan-300">Personal Email:</strong> {personalEmail.toLowerCase()}</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-6 w-full rounded-none bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 py-3 text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] transition"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        /* REGISTRATION FORM */
                        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                            {errorMessage && (
                                <div className="rounded-none bg-red-950/70 border border-red-500/50 p-3 text-xs font-futura-book text-red-200">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-futura-heavy font-bold text-cyan-300 uppercase tracking-wider">
                                    Student ID (SID) *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-pink-500/40">
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 0345893"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        className="w-full rounded-none bg-[#160b38]/90 px-3.5 py-2.5 text-xs font-futura-book text-white placeholder-gray-400 focus:outline-none uppercase transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-futura-heavy font-bold text-cyan-300 uppercase tracking-wider">
                                    Full Name (English Letters Only) *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-pink-500/40">
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Alex Tan Wei Ming"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full rounded-none bg-[#160b38]/90 px-3.5 py-2.5 text-xs font-futura-book text-white placeholder-gray-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-futura-heavy font-bold text-cyan-300 uppercase tracking-wider">
                                    Taylor's Student Email *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-pink-500/40">
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. alex@sd.taylors.edu.my"
                                        value={taylorsEmail}
                                        onChange={(e) => setTaylorsEmail(e.target.value)}
                                        className="w-full rounded-none bg-[#160b38]/90 px-3.5 py-2.5 text-xs font-futura-book text-white placeholder-gray-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-futura-heavy font-bold text-cyan-300 uppercase tracking-wider">
                                    Personal Email *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-pink-500/40">
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. alex.personal@gmail.com"
                                        value={personalEmail}
                                        onChange={(e) => setPersonalEmail(e.target.value)}
                                        className="w-full rounded-none bg-[#160b38]/90 px-3.5 py-2.5 text-xs font-futura-book text-white placeholder-gray-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Collection Slot Selection (Only if Main Queue) */}
                            {!isWaitlistOnly && (
                                <div className="pt-2">
                                    <label className="block text-xs font-futura-heavy font-bold text-cyan-300 uppercase tracking-wider mb-2">
                                        Select Physical Ticket Collection Slot *
                                    </label>

                                    {loadingSlots ? (
                                        <div className="py-4 text-center text-xs font-futura-book text-gray-400">
                                            Loading available timeslots...
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                            {slots.map((slot) => {
                                                const spotsLeft = Math.max(0, slot.max_capacity - slot.booked_count);
                                                const isFull = spotsLeft <= 0;
                                                const isSelected = selectedSlotId === slot.id;

                                                return (
                                                    <div
                                                        key={slot.id}
                                                        onClick={() => {
                                                            if (!isFull) setSelectedSlotId(slot.id);
                                                        }}
                                                        className={`cursor-pointer rounded-none p-[1px] transition ${isFull
                                                            ? 'opacity-40 bg-gray-700 cursor-not-allowed'
                                                            : isSelected
                                                                ? 'bg-gradient-to-r from-[#00F0FF] via-[#E000FF] to-[#2596be] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                                                                : 'bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-pink-500/30 hover:from-cyan-400/60 hover:to-purple-400/60'
                                                            }`}
                                                    >
                                                        <div className="w-full h-full bg-[#160b38]/90 p-3 flex items-center justify-between">
                                                            <div>
                                                                <div className="text-xs font-futura-heavy font-bold text-white">
                                                                    {slot.venue === 'TGH' ? "Taylor's Grand Hall (TGH)" : 'LT1'} •{' '}
                                                                    {formatDate(slot.slot_date)}
                                                                </div>
                                                                <div className="text-xs font-futura-book text-gray-300 mt-0.5">
                                                                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                                                </div>
                                                            </div>

                                                            <div className="text-right">
                                                                {isFull ? (
                                                                    <span className="rounded-none border border-red-500 bg-red-950/80 px-2 py-0.5 text-[10px] font-futura-heavy font-bold text-red-400">
                                                                        FULL
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[11px] font-futura-medium font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,240,255,0.8)]">
                                                                        {spotsLeft} spots left
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-cyan-400/20">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={submitting}
                                    className="rounded-none border border-purple-500/40 px-4 py-2.5 text-xs font-futura-medium text-gray-300 hover:text-white hover:bg-purple-900/30 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || (!isWaitlistOnly && !selectedSlotId)}
                                    className="rounded-none bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 px-6 py-2.5 text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.4)] transition flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                            Processing...
                                        </>
                                    ) : isWaitlistOnly ? (
                                        'Join Waitlist'
                                    ) : (
                                        'Confirm & Queue'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}