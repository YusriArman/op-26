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

    // Load available timeslots on mount, since the parent now only mounts
    // this component when the modal is actually open. There is no need to
    // reset form fields here anymore — because the parent fully unmounts
    // this component on close, every open is a fresh instance with pristine
    // useState defaults already.
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
                // Auto-select first available slot if none selected
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

    // Lock background scrolling while the modal is mounted
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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

        // 1. Basic Empty Validation
        if (!cleanSid || !cleanName || !cleanTaylorsEmail || !cleanPersonalEmail) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        // 2. English Alphabet Name Validation
        if (!ENGLISH_NAME_REGEX.test(cleanName)) {
            setErrorMessage('Full name must contain English alphabet letters only.');
            return;
        }

        // 3. Taylor's Email Domain Validation
        if (!cleanTaylorsEmail.endsWith('@sd.taylors.edu.my') && !cleanTaylorsEmail.endsWith('@taylors.edu.my')) {
            setErrorMessage("Please enter a valid Taylor's student email (e.g. name@sd.taylors.edu.my).");
            return;
        }

        // 4. Slot Selection Check (if main queue)
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

            // Success Path
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

            // Notify parent page to update live queue counters
            onSuccess();
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : 'Unexpected network error.');
        } finally {
            setSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all my-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {result
                                ? 'Registration Confirmed!'
                                : isWaitlistOnly
                                    ? 'Join Elysium Waitlist'
                                    : 'Elysium 2026 Ticket Queue'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {isWaitlistOnly
                                ? 'Main passes are full. Join waitlist for uncollected ticket drops.'
                                : 'Taylor\u2019s Orientation Party Freshman Registration'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Content */}
                {result ? (
                    /* SUCCESS SCREEN */
                    <div className="py-6 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl font-bold mb-4">
                            ✓
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            {result.type === 'main'
                                ? 'You\u2019ve Secured a Pass!'
                                : `Waitlist Position #${result.waitlistNumber}`}
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 px-4">{result.message}</p>

                        {result.slotDetails && (
                            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left border border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Ticket Collection Venue & Time:
                                </p>
                                <p className="text-base font-bold text-gray-900 mt-1">
                                    {result.slotDetails.venue === 'TGH'
                                        ? "Taylor's Grand Hall (TGH)"
                                        : 'Lecture Theatre 1 (LT1)'}
                                </p>
                                <p className="text-sm text-gray-700 mt-0.5">
                                    {formatDate(result.slotDetails.slotDate)}
                                </p>
                                <p className="text-sm font-medium text-amber-600">
                                    {formatTime(result.slotDetails.startTime)} – {formatTime(result.slotDetails.endTime)}
                                </p>
                            </div>
                        )}

                        <div className="mt-4 rounded-lg bg-gray-100 p-3 text-xs text-gray-600 text-left">
                            <p><strong>Student ID:</strong> {studentId.toUpperCase()}</p>
                            <p><strong>Taylor's Email:</strong> {taylorsEmail.toLowerCase()}</p>
                            <p><strong>Personal Email:</strong> {personalEmail.toLowerCase()}</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    /* REGISTRATION FORM */
                    <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                        {errorMessage && (
                            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                                {errorMessage}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Student ID (SID) *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 0345893"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black uppercase"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Full Name (English Letters Only) *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Alex Tan Wei Ming"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Taylor's Student Email *
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="e.g. alex@sd.taylors.edu.my"
                                value={taylorsEmail}
                                onChange={(e) => setTaylorsEmail(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Personal Email *
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="e.g. alex.personal@gmail.com"
                                value={personalEmail}
                                onChange={(e) => setPersonalEmail(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {/* Collection Slot Selection (Only if Main Queue) */}
                        {!isWaitlistOnly && (
                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Select Physical Ticket Collection Slot *
                                </label>

                                {loadingSlots ? (
                                    <div className="py-4 text-center text-xs text-gray-500">
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
                                                    className={`cursor-pointer rounded-xl border p-3 transition flex items-center justify-between ${isFull
                                                        ? 'opacity-40 bg-gray-100 border-gray-200 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'border-black bg-gray-50 ring-1 ring-black'
                                                            : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-900">
                                                            {slot.venue === 'TGH' ? "Taylor's Grand Hall (TGH)" : 'LT1'} •{' '}
                                                            {formatDate(slot.slot_date)}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-0.5">
                                                            {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        {isFull ? (
                                                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                                                FULL
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] font-semibold text-green-600">
                                                                {spotsLeft} spots left
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || (!isWaitlistOnly && !selectedSlotId)}
                                className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400 transition flex items-center gap-2"
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
    );
}