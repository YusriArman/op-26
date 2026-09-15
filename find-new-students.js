// find-new-students.js
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const OLD_CSV_PATH = path.join(__dirname, 'old.csv');
const NEW_CSV_PATH = path.join(__dirname, 'new.csv');
const OUTPUT_CSV_PATH = path.join(__dirname, 'new_students_only.csv');

// Standardized 21-column header required by Supabase freshmen_directory
const SUPABASE_TARGET_HEADER =
    'student_id,name,nationality,locality,student_level,school,faculty,programme,taylors_email,personal_email,contact_no,flame_mentor_name,flame_mentor_email,flame_mentor_school,parents_name,correspondence_email,parent_email,parent_email_2,guardian_email,created_at_top,last_sync_from_cms';

// Helper to parse a CSV line accounting for quoted fields with commas
function parseCSVLine(text) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
            inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
            result.push(cur);
            cur = '';
        } else {
            cur += c;
        }
    }
    result.push(cur);
    return result.map(col => col.trim().replace(/^"|"$/g, ''));
}

async function extractNewStudents() {
    if (!fs.existsSync(OLD_CSV_PATH)) {
        console.error(`Error: Could not find "${OLD_CSV_PATH}". Please place your exported DB CSV as old.csv`);
        return;
    }
    if (!fs.existsSync(NEW_CSV_PATH)) {
        console.error(`Error: Could not find "${NEW_CSV_PATH}". Please place your new CMS file as new.csv`);
        return;
    }

    console.log('Reading existing student IDs from old.csv...');
    const existingIds = new Set();

    // 1. Read all Student IDs from old.csv
    const oldStream = fs.createReadStream(OLD_CSV_PATH);
    const oldRl = readline.createInterface({ input: oldStream, crlfDelay: Infinity });

    let oldIdIndex = 0;
    let isFirstOldLine = true;

    for await (const line of oldRl) {
        if (!line.trim()) continue;
        const cols = parseCSVLine(line.replace(/^\uFEFF/, ''));

        if (isFirstOldLine) {
            isFirstOldLine = false;
            const foundIdx = cols.findIndex(col =>
                col.toLowerCase().replace(/[^a-z0-9]/g, '') === 'studentid'
            );
            if (foundIdx !== -1) oldIdIndex = foundIdx;
            continue;
        }

        const sid = cols[oldIdIndex];
        if (sid) {
            existingIds.add(sid.trim().toUpperCase());
        }
    }

    console.log(`Loaded ${existingIds.size} existing student IDs from database.`);

    // 2. Scan new.csv and collect only students NOT in existingIds
    console.log('Comparing against new.csv...');
    const newStream = fs.createReadStream(NEW_CSV_PATH);
    const newRl = readline.createInterface({ input: newStream, crlfDelay: Infinity });

    // Pre-load the output with the exact standardized Supabase header
    const outputLines = [SUPABASE_TARGET_HEADER];

    let newIdIndex = 0;
    let isFirstNewLine = true;
    let totalInNew = 0;
    let newStudentsCount = 0;

    for await (const line of newRl) {
        if (!line.trim()) continue;
        totalInNew++;

        if (isFirstNewLine) {
            isFirstNewLine = false;
            // Discard the unformatted CMS header from new.csv
            const cols = parseCSVLine(line.replace(/^\uFEFF/, ''));
            const foundIdx = cols.findIndex(col =>
                col.toLowerCase().replace(/[^a-z0-9]/g, '') === 'studentid'
            );
            if (foundIdx !== -1) newIdIndex = foundIdx;
            continue;
        }

        const cols = parseCSVLine(line);
        const sid = cols[newIdIndex] ? cols[newIdIndex].trim().toUpperCase() : null;

        if (sid && !existingIds.has(sid)) {
            outputLines.push(line.replace(/^\uFEFF/, ''));
            existingIds.add(sid); // Avoid duplicate rows within new.csv itself
            newStudentsCount++;
        }
    }

    // 3. Write out new_students_only.csv
    fs.writeFileSync(OUTPUT_CSV_PATH, outputLines.join('\n'), 'utf8');

    console.log('----------------------------------------------------');
    console.log(`Comparison Complete:`);
    console.log(`- Total records in new CMS file: ${totalInNew - 1}`);
    console.log(`- Already registered in database: ${existingIds.size - newStudentsCount}`);
    console.log(`- Brand-new students extracted: ${newStudentsCount}`);
    console.log(`- Formatted file saved to: ${OUTPUT_CSV_PATH}`);
    console.log('----------------------------------------------------');
}

extractNewStudents();