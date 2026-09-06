// test_load_test2.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Custom Metrics
const mainRegistrations = new Counter('main_registrations_success');
const waitlistRegistrations = new Counter('waitlist_registrations_success');
const slotFullRetries = new Counter('slot_full_retries');
const rpcLatency = new Trend('rpc_latency_ms');

// ⚙️ Configuration
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://niojloywzraaxxtrvdka.supabase.co';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pb2psb3l3enJhYXh4dHJ2ZGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODU2MDcsImV4cCI6MjEwMzE2MTYwN30.Fub3dR2AiMK-Djnr_f7hXX01xo-enlXTa8D8To4V1Iw';

export const options = {
    scenarios: {
        sustained_flow: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 100 },  // Ramp-up to 100 active users
                { duration: '2m', target: 200 },  // Sustained rush of 200 users claiming slots
                { duration: '1m', target: 100 },  // Overflow into waitlist
                { duration: '30s', target: 0 },    // Ramp-down
            ],
            gracefulRampDown: '10s',
        },
    },
};

const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export default function () {
    // Generate a distinct mock student ID based on unique iteration count:
    // Starts from TEST1200 up to TEST2000
    const uniqueId = 1200 + (__VU * 10) + __ITER;
    if (uniqueId > 2000) return; // Stay within our 2,000 seeded mock directory

    const paddedId = String(uniqueId).padStart(4, '0');
    const studentId = `TEST${paddedId}`;
    const fullName = 'Test Student Student';
    const taylorsEmail = `test${paddedId}@sd.taylors.edu.my`;
    const personalEmail = `personal${paddedId}@gmail.com`;

    // ---------------------------------------------------------------------------
    // STEP 1: Poll live metrics (Simulate visiting Home.tsx)
    // ---------------------------------------------------------------------------
    const metricsRes = http.get(
        `${SUPABASE_URL}/rest/v1/admin_overall_metrics?select=total_queue_claimed,total_waitlisted`,
        { headers }
    );

    check(metricsRes, {
        'Metrics poll status 200': (r) => r.status === 200,
    });

    // Simulate reading the page for 1-2 seconds
    sleep(Math.random() * 1.5 + 0.5);

    // ---------------------------------------------------------------------------
    // STEP 2: Fetch available collection slots (Simulate opening registration modal)
    // ---------------------------------------------------------------------------
    const slotsRes = http.get(
        `${SUPABASE_URL}/rest/v1/available_slots?select=*&order=slot_date.asc,start_time.asc`,
        { headers }
    );

    let chosenSlotId = null;
    if (slotsRes.status === 200) {
        try {
            const slots = JSON.parse(slotsRes.body);
            // Pick the first slot with open capacity
            const openSlot = slots.find((s) => s.spots_left > 0);
            if (openSlot) {
                chosenSlotId = openSlot.id;
            }
        } catch {
            // Fallback if parsing fails
        }
    }

    // Simulate typing in the form (1 to 2 seconds)
    sleep(Math.random() * 1.5 + 1);

    // ---------------------------------------------------------------------------
    // STEP 3: Attempt Main Registration or Fallback to Waitlist
    // ---------------------------------------------------------------------------
    if (chosenSlotId) {
        const startTime = Date.now();
        const regRes = http.post(
            `${SUPABASE_URL}/rest/v1/rpc/register_freshman`,
            JSON.stringify({
                p_student_id: studentId,
                p_full_name: fullName,
                p_taylors_email: taylorsEmail,
                p_personal_email: personalEmail,
                p_slot_id: chosenSlotId,
            }),
            { headers }
        );
        rpcLatency.add(Date.now() - startTime);

        if (regRes.status === 200) {
            const body = JSON.parse(regRes.body);

            if (body.success === true && body.type === 'main') {
                mainRegistrations.add(1);
                return;
            } else if (body.code === 'SLOT_FULL' || body.code === 'EVENT_FULL') {
                slotFullRetries.add(1);
                // Slot filled up while typing -> Fallback to Waitlist
            }
        }
    }

    // ---------------------------------------------------------------------------
    // STEP 4: Fallback to Waitlist (When main slots are 100% full)
    // ---------------------------------------------------------------------------
    const wlStartTime = Date.now();
    const wlRes = http.post(
        `${SUPABASE_URL}/rest/v1/rpc/register_waitlist`,
        JSON.stringify({
            p_student_id: studentId,
            p_full_name: fullName,
            p_taylors_email: taylorsEmail,
            p_personal_email: personalEmail,
        }),
        { headers }
    );
    rpcLatency.add(Date.now() - wlStartTime);

    if (wlRes.status === 200) {
        const body = JSON.parse(wlRes.body);
        if (body.success === true) {
            waitlistRegistrations.add(1);
        }
    }

    // Background pause before next user loop
    sleep(2);
}