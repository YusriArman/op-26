// test_stress_6000.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import exec from 'k6/execution';

// Custom Metrics
const mainSuccess = new Counter('main_passes_booked');
const waitlistSuccess = new Counter('waitlist_passes_booked');
const slotFullCount = new Counter('slot_full_fallbacks');
const rpcDuration = new Trend('rpc_response_time_ms');

// ⚙️ Configuration
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://niojloywzraaxxtrvdka.supabase.co';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pb2psb3l3enJhYXh4dHJ2ZGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODU2MDcsImV4cCI6MjEwMzE2MTYwN30.Fub3dR2AiMK-Djnr_f7hXX01xo-enlXTa8D8To4V1Iw';

export const options = {
    scenarios: {
        mega_stress_6000: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 1000 },  // Step 1: Ramp to 1,000 VUs
                { duration: '1m', target: 3000 },  // Step 2: Ramp to 3,000 VUs
                { duration: '2m', target: 6000 },  // Step 3: Ramp to 6,000 VUs
                { duration: '100h', target: 6000 }, // Step 4: SUSTAIN 6,000 VUs indefinitely until Ctrl + C!
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
    // Safe cyclic index across our 9,999 seeded mock students
    const studentIndex = (exec.scenario.iterationInTest % 9990) + 1;
    const paddedId = String(studentIndex).padStart(4, '0');
    const studentId = `TEST${paddedId}`;
    const fullName = 'Test Student Student';
    const taylorsEmail = `test${paddedId}@sd.taylors.edu.my`;
    const personalEmail = `personal${paddedId}@gmail.com`;

    // ---------------------------------------------------------------------------
    // 1. Visit Homepage (Poll live metrics)
    // ---------------------------------------------------------------------------
    const metricsRes = http.get(
        `${SUPABASE_URL}/rest/v1/admin_overall_metrics?select=total_queue_claimed,total_waitlisted`,
        { headers }
    );

    check(metricsRes, { 'Home metrics 200': (r) => r.status === 200 });

    // Human thinking delay (2 to 4 seconds)
    sleep(Math.random() * 2 + 2);

    // ---------------------------------------------------------------------------
    // 2. Open Modal & Fetch Timeslots
    // ---------------------------------------------------------------------------
    const slotsRes = http.get(
        `${SUPABASE_URL}/rest/v1/available_slots?select=*&order=slot_date.asc,start_time.asc`,
        { headers }
    );

    let chosenSlotId = null;
    if (slotsRes.status === 200) {
        try {
            const slots = JSON.parse(slotsRes.body);
            const openSlot = slots.find((s) => s.spots_left > 0);
            if (openSlot) {
                chosenSlotId = openSlot.id;
            }
        } catch {
            // fallback
        }
    }

    // Human form filling delay (3 to 5 seconds)
    sleep(Math.random() * 2 + 3);

    // ---------------------------------------------------------------------------
    // 3. Submit Registration (Main Queue or Waitlist)
    // ---------------------------------------------------------------------------
    if (chosenSlotId) {
        const start = Date.now();
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
        rpcDuration.add(Date.now() - start);

        if (regRes.status === 200) {
            const body = JSON.parse(regRes.body);

            if (body.success === true && body.type === 'main') {
                mainSuccess.add(1);
                sleep(4);
                return;
            } else if (body.code === 'SLOT_FULL' || body.code === 'EVENT_FULL') {
                slotFullCount.add(1);
            }
        }
    }

    // ---------------------------------------------------------------------------
    // 4. Fallback to Waitlist
    // ---------------------------------------------------------------------------
    const wlStart = Date.now();
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
    rpcDuration.add(Date.now() - wlStart);

    if (wlRes.status === 200) {
        const body = JSON.parse(wlRes.body);
        if (body.success === true) {
            waitlistSuccess.add(1);
        }
    }

    // Paced rest before next user loop
    sleep(Math.random() * 3 + 2);
}