// test_spike_100.js
import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

// Custom Metrics to track concurrency outcomes
const successfulRegistrations = new Counter('successful_registrations');
const rejectedSlotFull = new Counter('rejected_slot_full');
const rejectedAlreadyRegistered = new Counter('rejected_already_registered');
const rejectedNotEligible = new Counter('rejected_not_eligible');
const serverErrors = new Counter('server_errors');

// ⚙️ Configuration (Can be passed via -e or set directly)
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://niojloywzraaxxtrvdka.supabase.co';
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pb2psb3l3enJhYXh4dHJ2ZGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1ODU2MDcsImV4cCI6MjEwMzE2MTYwN30.Fub3dR2AiMK-Djnr_f7hXX01xo-enlXTa8D8To4V1Iw';

// Target Slot 1 (TGH 5:30 PM - 6:30 PM)
const TARGET_SLOT_ID = __ENV.SLOT_ID || 'b0000000-0000-0000-0000-000000000001';

export const options = {
    scenarios: {
        instant_100_spike: {
            executor: 'per-vu-iterations',
            vus: 100,             // Exactly 100 concurrent students
            iterations: 1,        // Each VU fires exactly 1 request simultaneously
            maxDuration: '15s',   // Finishes in a few seconds
        },
    },
};

export default function () {
    // Start from TEST1002 to TEST1101 (skips TEST1001)
    const studentNum = 1101 + __VU;
    const paddedId = String(studentNum).padStart(4, '0');
    const studentId = `TEST${paddedId}`;

    // Pure English alphabet name (passes check_english_name constraint)
    const fullName = 'Test Student Student';
    const taylorsEmail = `test${paddedId}@sd.taylors.edu.my`;
    const personalEmail = `personal${paddedId}@gmail.com`;

    const url = `${SUPABASE_URL}/rest/v1/rpc/register_freshman`;

    const payload = JSON.stringify({
        p_student_id: studentId,
        p_full_name: fullName,
        p_taylors_email: taylorsEmail,
        p_personal_email: personalEmail,
        p_slot_id: TARGET_SLOT_ID,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
    };

    // Fire atomic registration request
    const res = http.post(url, payload, params);

    // Parse and record metrics
    if (res.status === 200) {
        try {
            const body = JSON.parse(res.body);

            if (body.success === true) {
                successfulRegistrations.add(1);
            } else if (body.code === 'SLOT_FULL') {
                rejectedSlotFull.add(1);
            } else if (body.code === 'ALREADY_REGISTERED') {
                rejectedAlreadyRegistered.add(1);
            } else if (body.code === 'NOT_ELIGIBLE') {
                rejectedNotEligible.add(1);
            } else {
                console.log(`[VU ${__VU}] Other response: ${body.message}`);
            }
        } catch {
            serverErrors.add(1);
            console.error(`[VU ${__VU}] Failed to parse JSON response:`, res.body);
        }
    } else {
        serverErrors.add(1);
        console.error(`[VU ${__VU}] HTTP ${res.status} error:`, res.body);
    }

    check(res, {
        'HTTP status is 200': (r) => r.status === 200,
    });
}