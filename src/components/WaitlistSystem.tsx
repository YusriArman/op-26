// src/components/WaitlistSystem.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface WaitlistSystemProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface WaitlistResult {
    message: string;
    waitlistNumber: number;
}

const ENGLISH_NAME_REGEX = /^[a-zA-Z\s'/@.-]+$/;

export default function WaitlistSystem({
    isOpen,
    onClose,
    onSuccess,
}: WaitlistSystemProps) {
    // Form State
    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [taylorsEmail, setTaylorsEmail] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');

    // UI State
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [result, setResult] = useState<WaitlistResult | null>(null);

    // Lock background scrolling while modal is open & reset on open
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';
        setStudentId('');
        setFullName('');
        setTaylorsEmail('');
        setPersonalEmail('');
        setErrorMessage(null);
        setResult(null);

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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

        setSubmitting(true);

        try {
            const { data, error } = await supabase.rpc('register_waitlist', {
                p_student_id: cleanSid,
                p_full_name: cleanName,
                p_taylors_email: cleanTaylorsEmail,
                p_personal_email: cleanPersonalEmail,
            });

            if (error) {
                setErrorMessage(error.message || 'An error occurred during submission.');
                setSubmitting(false);
                return;
            }

            if (!data.success) {
                setErrorMessage(data.message || 'Waitlist submission was unsuccessful.');
                setSubmitting(false);
                return;
            }

            setResult({
                message: data.message,
                waitlistNumber: data.waitlist_number,
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
            <div className="w-full max-w-lg rounded-none p-[1px] bg-gradient-to-r from-[#E000FF]/70 via-[#FA26A0]/70 to-[#00F0FF]/70 shadow-[0_0_35px_rgba(224,0,255,0.25)] relative text-white my-8">
                <div className="w-full h-full bg-[#090520]/95 backdrop-blur-xl p-6 sm:p-8">
                    {/* Tech Corner Accents */}
                    <div className="absolute top-0 left-0 h-3.5 w-3.5 border-t-2 border-l-2 border-[#E000FF]" />
                    <div className="absolute top-0 right-0 h-3.5 w-3.5 border-t-2 border-r-2 border-[#E000FF]" />
                    <div className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-[#E000FF]" />
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-[#E000FF]" />

                    {/* Modal Header */}
                    <div className="flex items-start justify-between border-b border-pink-500/20 pb-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-futura-heavy font-bold uppercase tracking-[0.18em] text-[#FA26A0] drop-shadow-[0_0_8px_rgba(250,38,160,0.6)]">
                                {result ? 'Waitlist Confirmed!' : 'Join Elysium Waiting List'}
                            </h3>
                            <p className="text-xs font-futura-book text-gray-300 mt-1 tracking-wide">
                                First-come, first-served pass for uncollected ticket drops.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-none p-1.5 text-gray-400 hover:text-[#FA26A0] hover:bg-pink-950/40 transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Modal Content */}
                    {result ? (
                        /* SUCCESS SCREEN */
                        <div className="py-6 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border border-pink-400 bg-pink-500/20 text-[#FA26A0] text-2xl font-bold mb-4 shadow-[0_0_15px_rgba(250,38,160,0.6)]">
                                ✓
                            </div>

                            <h4 className="text-base font-futura-heavy font-bold text-pink-400 uppercase tracking-wider">
                                Waitlist Position #{result.waitlistNumber}
                            </h4>
                            <p className="mt-2 text-xs font-futura-book text-gray-200 px-4 leading-relaxed">
                                {result.message}
                            </p>

                            {/* Collection Policy Info Box */}
                            <div className="mt-5 rounded-none p-[1px] bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-cyan-400/50 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                <div className="w-full h-full bg-[#160b38]/90 p-4 text-left space-y-1.5">
                                    <p className="text-[11px] font-futura-heavy font-bold text-[#FA26A0] uppercase tracking-[0.15em]">
                                        How Waitlist Collection Works:
                                    </p>
                                    <p className="text-xs font-futura-book text-gray-200 leading-relaxed">
                                        • Uncollected passes will be released on a <strong>first-come, first-served</strong> basis.
                                    </p>
                                    <p className="text-xs font-futura-book text-gray-200 leading-relaxed">
                                        • <strong>Collection Drop Date:</strong> Thursday, 17th September 2026 at Lecture Theatre 1 (LT1) &amp; D-Day Booth.
                                    </p>
                                    <p className="text-xs font-futura-book text-gray-300">
                                        • Bring your official Student ID card to claim any leftover passes.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-none p-[1px] bg-gradient-to-r from-purple-500/30 to-pink-500/30">
                                <div className="bg-[#160b38]/60 p-3 text-xs font-futura-book text-gray-300 text-left space-y-1">
                                    <p><strong className="text-pink-300">Student ID:</strong> {studentId.toUpperCase()}</p>
                                    <p><strong className="text-pink-300">Taylor's Email:</strong> {taylorsEmail.toLowerCase()}</p>
                                    <p><strong className="text-pink-300">Personal Email:</strong> {personalEmail.toLowerCase()}</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-6 w-full rounded-none bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-purple-500 py-3 text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_20px_rgba(250,38,160,0.4)] transition"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        /* WAITLIST REGISTRATION FORM */
                        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                            {/* Info Notice */}
                            <div className="rounded-none bg-purple-950/40 border border-purple-500/30 p-3 text-xs font-futura-book text-gray-300 leading-relaxed">
                                <span className="font-bold text-[#FA26A0]">Note:</span> You do not need to choose a timeslot. Waitlist admissions are subject to uncollected ticket availability at collection venues.
                            </div>

                            {errorMessage && (
                                <div className="rounded-none bg-red-950/70 border border-red-500/50 p-3 text-xs font-futura-book text-red-200">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-futura-heavy font-bold text-pink-300 uppercase tracking-wider">
                                    Student ID (SID) *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40">
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
                                <label className="block text-xs font-futura-heavy font-bold text-pink-300 uppercase tracking-wider">
                                    Full Name (English Letters Only) *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40">
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
                                <label className="block text-xs font-futura-heavy font-bold text-pink-300 uppercase tracking-wider">
                                    Taylor's Student Email *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40">
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
                                <label className="block text-xs font-futura-heavy font-bold text-pink-300 uppercase tracking-wider">
                                    Personal Email *
                                </label>
                                <div className="mt-1 p-[1px] rounded-none bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40">
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

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-pink-500/20">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={submitting}
                                    className="rounded-none border border-pink-500/40 px-4 py-2.5 text-xs font-futura-medium text-gray-300 hover:text-white hover:bg-pink-900/30 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-none bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-purple-500 px-6 py-2.5 text-xs font-futura-heavy font-bold uppercase tracking-[0.15em] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(250,38,160,0.4)] transition flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Confirm & Join Waitlist'
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