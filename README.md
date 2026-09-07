<img width="1366" height="768" alt="Elysium Logo" src="https://github.com/user-attachments/assets/00dddc98-d899-4228-b4a6-e2c1ae31e0f0" />

# Elysium: Orientation Party 2026 Ticketing Platform

A high-concurrency, whitelist-verified ticketing and event operations platform built for Taylor's University Orientation Party 2026 (Elysium). The platform manages the entire lifecycle of student registration, physical ticket pickup timeslot reservations, on-ground wristband binding, and event-night gate admission.

---

## 1. System Overview & Core Objectives

Elysium 2026 is designed to handle high-traffic registration surges while strictly enforcing capacity limits, eliminating duplicate passes, and securing physical ticket distribution:

* **Capacity Target:** Strictly capped at 1,500 main passes and 200 sequential waitlist spots.
* **Intake Verification:** Pre-loaded university freshmen directory whitelist to prevent non-freshmen or bot entries.
* **Physical Ticket Binding:** Two-step verification where Orientation Leaders (OLs) physically bind a unique Ticket ID (TID) to a verified Student ID (SID).
* **Gate Admission Control:** Real-time lookup and attendance stamping to prevent duplicate ticket pass-back fraud on event night.

---

## 2. Technology Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
* **Backend & Database:** Supabase (PostgreSQL 15+), PostgREST
* **Security & Access Control:** PostgreSQL Row Level Security (RLS), `SECURITY DEFINER` Remote Procedure Calls (RPCs)
* **Hosting & CDN:** Vercel (Single Page Application with client-side routing rewrites)
* **Load & Stress Testing:** Grafana k6

---

## 3. Architecture & Operational Flow

### Phase 1: Online Registration (`Home.tsx` / `QueueingSystem.tsx`)
1. The student enters their official Student ID (SID), Full Name (English alphabets only), Taylor's Student Email, and Personal Email.
2. The database validates the SID against the `freshmen_directory` whitelist.
3. If valid and under the 1,500 main limit, the student selects an available physical ticket collection timeslot (Taylor's Grand Hall on Sep 15 or Lecture Theatre 1 on Sep 17).
4. An atomic row-level lock (`SELECT ... FOR UPDATE`) prevents slot overbooking.
5. Once 1,500 main spots are filled, the system locks main registration and unlocks `register_waitlist`, assigning collision-free sequential waitlist ranks (#1 to #500).

### Phase 2: Physical Collection & Wristband Binding (`Binding.tsx`)
1. The freshman arrives at the venue during their designated pickup window with their physical Student ID card.
2. An Orientation Leader searches the student by SID.
3. The OL takes a physical ticket/wristband, enters its unique Ticket ID (TID), and calls `bind_ticket_to_student`.
4. The system validates that the TID is unique and not previously issued, updating the student's status to `collected` and `bound` with a timestamp and staff audit trail.

### Phase 3: Event Night Gate Check-In (`Regi.tsx`)
1. At the entrance to Taylor's Grand Hall, gate ushers search the attendee by either SID or TID.
2. The system displays the student profile and bound TID.
3. The usher verifies the physical card and marks attendance via `toggle_student_attendance`.
4. If a ticket is scanned twice, the system immediately flags an "Already Attended" warning with the exact entry timestamp to prevent pass-back entry.

---

4. Project Contributors

  - Yusri Arman
  - Tan Ming Reo
  - Wong Ki Hurn

5. License

This project is developed for the Taylor's University Orientation Leader
Committee (Orientation Party 2026). All rights reserved.

