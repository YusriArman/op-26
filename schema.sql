-- =============================================================================
-- ELYSIUM 2026 TICKETING SYSTEM - COMPLETE PRODUCTION DATABASE SETUP
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE binding_status_enum AS ENUM ('unbound', 'bound');
    CREATE TYPE registration_type_enum AS ENUM ('main', 'waitlist');
    CREATE TYPE ticket_status_enum AS ENUM ('pending_collection', 'collected', 'cancelled');
    CREATE TYPE venue_location_enum AS ENUM ('TGH', 'LT1', 'DDay_Booth');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. SEQUENCES
-- -----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS waitlist_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 500
    NO CYCLE;

-- -----------------------------------------------------------------------------
-- 3. FRESHMEN DIRECTORY (21-Column University Whitelist Table)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS freshmen_directory (
    student_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    locality VARCHAR(100),
    student_level VARCHAR(50),
    school VARCHAR(150),
    faculty VARCHAR(150),
    programme VARCHAR(255),
    taylors_email VARCHAR(255),
    personal_email VARCHAR(255),
    contact_no VARCHAR(50),
    flame_mentor_name VARCHAR(255),
    flame_mentor_email VARCHAR(255),
    flame_mentor_school VARCHAR(150),
    parents_name VARCHAR(255),
    correspondence_email VARCHAR(255),
    parent_email VARCHAR(255),
    parent_email_2 VARCHAR(255),
    guardian_email VARCHAR(255),
    created_at_top VARCHAR(100),
    last_sync_from_cms VARCHAR(100),
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. TICKET COLLECTION SLOTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS collection_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue venue_location_enum NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT NOT NULL DEFAULT 500,
    booked_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. STUDENTS / REGISTRATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) UNIQUE NOT NULL REFERENCES freshmen_directory(student_id),
    full_name VARCHAR(255) NOT NULL,
    taylors_email VARCHAR(255) UNIQUE NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    reg_type registration_type_enum NOT NULL DEFAULT 'main',
    slot_id UUID REFERENCES collection_slots(id) ON DELETE SET NULL,
    ticket_status ticket_status_enum NOT NULL DEFAULT 'pending_collection',
    
    -- Physical Ticket Binding
    ticket_id VARCHAR(100) UNIQUE,
    binding_status binding_status_enum NOT NULL DEFAULT 'unbound',
    timestamp_of_binding TIMESTAMP WITH TIME ZONE,
    bound_by UUID REFERENCES auth.users(id),
    
    -- Waitlist Sequential Ranking (#1 to #500)
    waitlist_number INT,
    
    -- Event Attendance Check-in Flags
    is_attended BOOLEAN NOT NULL DEFAULT FALSE,
    attended_at TIMESTAMP WITH TIME ZONE,
    checked_in_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- English Alphabet Name Constraint
    CONSTRAINT check_english_name CHECK (full_name ~* '^[a-zA-Z\s''/@.-]+$')
);

-- Performance Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_ticket_id ON students(ticket_id);
CREATE INDEX IF NOT EXISTS idx_students_reg_type ON students(reg_type);
CREATE INDEX IF NOT EXISTS idx_students_ticket_status ON students(ticket_status);
CREATE INDEX IF NOT EXISTS idx_students_is_attended ON students(is_attended);
CREATE INDEX IF NOT EXISTS idx_students_slot_id ON students(slot_id);

-- -----------------------------------------------------------------------------
-- 6. FAQs & PRIZES TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prizes_and_merch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00,
    image_path VARCHAR(500) NOT NULL,
    item_type VARCHAR(50) DEFAULT 'merch', -- 'merch' or 'prize'
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. ADMIN / OL USER PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ol_crew',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 8. REAL-TIME ADMIN ANALYTICS VIEWS
-- =============================================================================

-- View 1: Complete Student Roster & Live Status
CREATE OR REPLACE VIEW admin_students_overview AS
SELECT 
    s.id,
    s.student_id,
    s.full_name,
    s.taylors_email,
    s.personal_email,
    s.reg_type,
    s.ticket_status,
    s.ticket_id,
    s.binding_status,
    s.timestamp_of_binding,
    s.waitlist_number,
    s.is_attended,
    s.attended_at,
    s.created_at AS registered_at,
    cs.slot_date,
    cs.venue,
    cs.start_time,
    cs.end_time,
    fd.faculty,
    fd.programme,
    fd.contact_no,
    CASE 
        WHEN s.is_attended = TRUE THEN 'ATTENDED'
        WHEN s.binding_status = 'bound' AND s.is_attended = FALSE THEN 'COLLECTED_UNATTENDED'
        WHEN s.reg_type = 'main' AND s.binding_status = 'unbound' THEN 'PENDING_COLLECTION'
        WHEN s.reg_type = 'waitlist' THEN 'WAITLISTED'
        ELSE 'UNKNOWN'
    END AS live_status
FROM students s
LEFT JOIN freshmen_directory fd ON fd.student_id = s.student_id
LEFT JOIN collection_slots cs ON cs.id = s.slot_id;

-- View 2: Timeslot-by-Timeslot Analytics (Collected vs Uncollected No-Shows)
CREATE OR REPLACE VIEW admin_timeslot_analytics AS
SELECT 
    cs.id AS slot_id,
    cs.slot_date,
    cs.venue,
    cs.start_time,
    cs.end_time,
    cs.max_capacity,
    cs.booked_count,
    COUNT(s.id) FILTER (WHERE s.ticket_status = 'collected') AS collected_count,
    COUNT(s.id) FILTER (WHERE s.ticket_status = 'pending_collection') AS uncollected_count,
    COUNT(s.id) FILTER (WHERE s.is_attended = TRUE) AS attended_count,
    CASE 
        WHEN cs.booked_count > 0 
        THEN ROUND((COUNT(s.id) FILTER (WHERE s.ticket_status = 'collected')::NUMERIC / cs.booked_count::NUMERIC) * 100, 1)
        ELSE 0 
    END AS collection_rate_pct
FROM collection_slots cs
LEFT JOIN students s ON s.slot_id = cs.id
GROUP BY cs.id, cs.slot_date, cs.venue, cs.start_time, cs.end_time, cs.max_capacity, cs.booked_count
ORDER BY cs.slot_date ASC, cs.start_time ASC;

-- View 3: Executive Summary Dashboard Metrics
CREATE OR REPLACE VIEW admin_overall_metrics AS
SELECT 
    1500 AS target_capacity,
    500 AS waitlist_capacity,
    COUNT(*) FILTER (WHERE reg_type = 'main') AS total_main_registered,
    COUNT(*) FILTER (WHERE reg_type = 'waitlist') AS total_waitlisted,
    COUNT(*) AS total_total_registrations,
    COUNT(*) FILTER (WHERE ticket_status = 'collected') AS total_tickets_collected_and_bound,
    COUNT(*) FILTER (WHERE ticket_status = 'pending_collection' AND reg_type = 'main') AS total_main_uncollected,
    COUNT(*) FILTER (WHERE is_attended = TRUE) AS total_students_attended,
    COUNT(*) FILTER (WHERE is_attended = FALSE AND ticket_status = 'collected') AS total_collected_but_absent,
    GREATEST(0, 1500 - COUNT(*) FILTER (WHERE ticket_status = 'collected')) AS open_dday_slots,
    CASE 
        WHEN COUNT(*) FILTER (WHERE reg_type = 'main') > 0 
        THEN ROUND((COUNT(*) FILTER (WHERE ticket_status = 'collected')::NUMERIC / COUNT(*) FILTER (WHERE reg_type = 'main')::NUMERIC) * 100, 1)
        ELSE 0 
    END AS overall_collection_rate_pct,
    CASE 
        WHEN COUNT(*) FILTER (WHERE ticket_status = 'collected') > 0 
        THEN ROUND((COUNT(*) FILTER (WHERE is_attended = TRUE)::NUMERIC / COUNT(*) FILTER (WHERE ticket_status = 'collected')::NUMERIC) * 100, 1)
        ELSE 0 
    END AS attendance_turnout_rate_pct
FROM students;

-- =============================================================================
-- 9. CORE RPC FUNCTIONS
-- =============================================================================

-- RPC 1: Atomic Freshman Registration (Locks slots, checks 1500 cap, assigns sequence)
CREATE OR REPLACE FUNCTION register_freshman(
    p_student_id VARCHAR,
    p_full_name VARCHAR,
    p_taylors_email VARCHAR,
    p_personal_email VARCHAR,
    p_slot_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_main_count INT;
    v_slot_capacity INT;
    v_slot_booked INT;
    v_new_student_id UUID;
    v_assigned_wl_num INT;
    v_clean_sid VARCHAR;
    v_clean_name VARCHAR;
    v_clean_t_email VARCHAR;
    v_clean_p_email VARCHAR;
BEGIN
    v_clean_sid := TRIM(UPPER(p_student_id));
    v_clean_name := TRIM(p_full_name);
    v_clean_t_email := LOWER(TRIM(p_taylors_email));
    v_clean_p_email := LOWER(TRIM(COALESCE(p_personal_email, '')));

    -- 1. Name English Alphabet Validation
    IF v_clean_name !~* '^[a-zA-Z\s''/@.-]+$' THEN
        RETURN jsonb_build_object('success', false, 'code', 'INVALID_NAME', 'message', 'Name must contain English alphabet letters only.');
    END IF;

    -- 2. Whitelist Verification
    IF NOT EXISTS (
        SELECT 1 FROM freshmen_directory 
        WHERE UPPER(student_id) = v_clean_sid AND is_eligible = TRUE
    ) THEN
        RETURN jsonb_build_object('success', false, 'code', 'NOT_ELIGIBLE', 'message', 'Student ID is not found in the eligible freshman directory.');
    END IF;

    -- 3. Duplicate Check
    IF EXISTS (
        SELECT 1 FROM students 
        WHERE UPPER(student_id) = v_clean_sid 
           OR LOWER(taylors_email) = v_clean_t_email 
           OR (v_clean_p_email <> '' AND LOWER(personal_email) = v_clean_p_email)
    ) THEN
        RETURN jsonb_build_object('success', false, 'code', 'ALREADY_REGISTERED', 'message', 'You have already registered for Elysium.');
    END IF;

    -- 4. Check Main Registration Count (< 1500)
    SELECT COUNT(*) INTO v_main_count FROM students WHERE reg_type = 'main';

    -- 5. PATH A: Main Registration
    IF v_main_count < 1500 THEN
        IF p_slot_id IS NULL THEN
            RETURN jsonb_build_object('success', false, 'code', 'SLOT_REQUIRED', 'message', 'Please select a physical ticket collection timeslot.');
        END IF;

        -- Row Lock chosen slot
        SELECT max_capacity, booked_count INTO v_slot_capacity, v_slot_booked 
        FROM collection_slots 
        WHERE id = p_slot_id FOR UPDATE;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'code', 'INVALID_SLOT', 'message', 'Invalid timeslot selected.');
        END IF;

        IF v_slot_booked >= v_slot_capacity THEN
            RETURN jsonb_build_object('success', false, 'code', 'SLOT_FULL', 'message', 'Selected slot is full. Please choose an alternate slot.');
        END IF;

        UPDATE collection_slots SET booked_count = booked_count + 1 WHERE id = p_slot_id;

        INSERT INTO students (
            student_id, full_name, taylors_email, personal_email, reg_type, slot_id, ticket_status
        ) VALUES (
            v_clean_sid, v_clean_name, v_clean_t_email, v_clean_p_email, 'main', p_slot_id, 'pending_collection'
        ) RETURNING id INTO v_new_student_id;

        RETURN jsonb_build_object('success', true, 'type', 'main', 'message', 'Registration confirmed! See you at ticket collection.', 'id', v_new_student_id);

    -- 6. PATH B: Waitlist Registration (Auto-incremented atomically via sequence)
    ELSE
        BEGIN
            v_assigned_wl_num := nextval('waitlist_seq');
        EXCEPTION
            WHEN sequence_generator_limit_exceeded THEN
                RETURN jsonb_build_object('success', false, 'code', 'EVENT_FULL', 'message', 'Both main registration and waitlist are completely full.');
        END;

        INSERT INTO students (
            student_id, full_name, taylors_email, personal_email, reg_type, waitlist_number, ticket_status
        ) VALUES (
            v_clean_sid, v_clean_name, v_clean_t_email, v_clean_p_email, 'waitlist', v_assigned_wl_num, 'pending_collection'
        ) RETURNING id INTO v_new_student_id;

        RETURN jsonb_build_object(
            'success', true, 
            'type', 'waitlist', 
            'waitlist_number', v_assigned_wl_num, 
            'message', 'Main passes are full. You have been placed on the Waitlist at position #' || v_assigned_wl_num, 
            'id', v_new_student_id
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC 2: Physical Ticket Binding (Binding.tsx)
CREATE OR REPLACE FUNCTION bind_ticket_to_student(
    p_student_id VARCHAR,
    p_ticket_id VARCHAR
) RETURNS JSONB AS $$
DECLARE
    v_clean_sid VARCHAR;
    v_clean_tid VARCHAR;
    v_existing_sid VARCHAR;
    v_current_binding binding_status_enum;
    v_student_name VARCHAR;
BEGIN
    v_clean_sid := TRIM(UPPER(p_student_id));
    v_clean_tid := TRIM(UPPER(p_ticket_id));

    SELECT student_id INTO v_existing_sid FROM students WHERE ticket_id = v_clean_tid;
    IF v_existing_sid IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Ticket ID [' || v_clean_tid || '] is already bound to Student ID: ' || v_existing_sid);
    END IF;

    SELECT full_name, binding_status INTO v_student_name, v_current_binding 
    FROM students 
    WHERE student_id = v_clean_sid;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Student ID [' || v_clean_sid || '] is not registered for Elysium.');
    END IF;

    IF v_current_binding = 'bound' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Student ' || v_student_name || ' already has a physical ticket bound.');
    END IF;

    UPDATE students 
    SET ticket_id = v_clean_tid,
        binding_status = 'bound',
        ticket_status = 'collected',
        timestamp_of_binding = NOW(),
        bound_by = auth.uid()
    WHERE student_id = v_clean_sid;

    RETURN jsonb_build_object(
        'success', true,
        'student_id', v_clean_sid,
        'student_name', v_student_name,
        'ticket_id', v_clean_tid,
        'timestamp', NOW(),
        'message', 'Successfully bound physical ticket [' || v_clean_tid || '] to ' || v_student_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC 3: Event Day Check-in (Regi.tsx)
CREATE OR REPLACE FUNCTION toggle_student_attendance(
    p_query VARCHAR,
    p_is_attended BOOLEAN
) RETURNS JSONB AS $$
DECLARE
    v_clean_query VARCHAR;
    v_student RECORD;
BEGIN
    v_clean_query := TRIM(UPPER(p_query));

    SELECT * INTO v_student 
    FROM students 
    WHERE student_id = v_clean_query OR ticket_id = v_clean_query;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'No registration record found for: ' || v_clean_query);
    END IF;

    UPDATE students
    SET is_attended = p_is_attended,
        attended_at = CASE WHEN p_is_attended THEN NOW() ELSE NULL END,
        checked_in_by = CASE WHEN p_is_attended THEN auth.uid() ELSE NULL END
    WHERE id = v_student.id;

    RETURN jsonb_build_object(
        'success', true,
        'student_id', v_student.student_id,
        'full_name', v_student.full_name,
        'ticket_id', v_student.ticket_id,
        'is_attended', p_is_attended,
        'attended_at', CASE WHEN p_is_attended THEN NOW() ELSE NULL END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 10. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- =============================================================================
ALTER TABLE freshmen_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prizes_and_merch ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public Select Policies
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read prizes" ON prizes_and_merch;
CREATE POLICY "Public read prizes" ON prizes_and_merch FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read slots" ON collection_slots;
CREATE POLICY "Public read slots" ON collection_slots FOR SELECT USING (true);

-- Authenticated Staff Policies
DROP POLICY IF EXISTS "Staff all on students" ON students;
CREATE POLICY "Staff all on students" ON students FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff all on freshmen" ON freshmen_directory;
CREATE POLICY "Staff all on freshmen" ON freshmen_directory FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff all on slots" ON collection_slots;
CREATE POLICY "Staff all on slots" ON collection_slots FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff all on faqs" ON faqs;
CREATE POLICY "Staff all on faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff all on prizes" ON prizes_and_merch;
CREATE POLICY "Staff all on prizes" ON prizes_and_merch FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff read admin_users" ON admin_users;
CREATE POLICY "Staff read admin_users" ON admin_users FOR SELECT TO authenticated USING (true);

-- RPC Grants
GRANT EXECUTE ON FUNCTION register_freshman TO anon, authenticated;
GRANT EXECUTE ON FUNCTION bind_ticket_to_student TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_student_attendance TO authenticated;

-- =============================================================================
-- 11. INSERT OFFICIAL COLLECTION TIMESLOTS (400 x 3 TGH + 300 x 1 LT1 = 1,500)
-- =============================================================================
INSERT INTO collection_slots (venue, slot_date, start_time, end_time, max_capacity, booked_count)
VALUES
    ('TGH', '2026-09-15', '17:30:00', '18:30:00', 400, 0),
    ('TGH', '2026-09-15', '18:30:00', '19:30:00', 400, 0),
    ('TGH', '2026-09-15', '19:30:00', '20:30:00', 400, 0),
    ('LT1', '2026-09-17', '17:30:00', '18:30:00', 300, 0)
ON CONFLICT DO NOTHING;