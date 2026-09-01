import { useState } from "react";
import Header from "../../components/Header";
import BindingSearch from "./BindingSearch";
import BindingResult from "./BindingResult";
import { buildTimeSlotLabel } from "../../utils/timeSlot";
import { searchStudentForBinding, bindTicketToStudent, type BindingPageType } from "../../services/ticketService";
import type { StudentBindingRecord } from "../../types/student";

interface BindingPageProps {
  title: string;
  description: string;
  type: BindingPageType;
}

function BindingPage({ title, description, type }: BindingPageProps) {
  const [student, setStudent] = useState<StudentBindingRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [binding, setBinding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSearch = async (studentId: string) => {
    setSearching(true);
    setFeedback(null);
    setNotFound(false);
    setMismatch(false);

    try {
      const result = await searchStudentForBinding(studentId, type);

      if (!result.found) {
        setStudent(null);
        setNotFound(true);
        return;
      }

      setStudent(result.student);
      setMismatch(result.mismatch);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleBind = async (ticketId: string) => {
    if (!student) return;

    setBinding(true);
    setFeedback(null);

    try {
      const result = await bindTicketToStudent(student.student_id, ticketId);

      if (!result.success) {
        setFeedback(result.message);
        return;
      }

      setStudent({
        ...student,
        binding_status: "bound",
        ticket_status: "collected",
        ticket_id: result.ticket_id ?? ticketId.trim().toUpperCase(),
      });
      setFeedback(result.message);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Binding failed. Please try again.");
    } finally {
      setBinding(false);
    }
  };

  return (
    <>
      <Header title={title} description={description} />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Search Student</h2>
          <BindingSearch onSearch={handleSearch} />
        </section>

        <section className="mt-6">
          {searching && (
            <div className="glass-card rounded-2xl border-dashed p-8 text-center text-sm text-[#8592B4]">
              Searching...
            </div>
          )}

          {!searching && notFound && (
            <div className="rounded-2xl border border-[#F87171]/20 bg-[#F87171]/10 p-6 text-sm text-[#F87171]">
              No registration found for that Student ID.
            </div>
          )}

          {!searching && mismatch && student && (
            <div className="rounded-2xl border border-[#FBBF24]/20 bg-[#FBBF24]/10 p-6 text-sm text-[#FBBF24]">
              {student.full_name} is registered under a different queue (
              {student.reg_type === "waitlist" ? "Waitlist" : student.venue}) and can't be bound here.
            </div>
          )}

          {!searching && !notFound && !mismatch && student && (
            <BindingResult
              studentId={student.student_id}
              fullName={student.full_name}
              email={student.email}
              status={student.binding_status === "bound" ? "Bound" : "Unbound"}
              onBind={handleBind}
              binding={binding}
              timeSlotLabel={buildTimeSlotLabel(student.slot_start_time, student.slot_end_time)}
            />
          )}

          {!searching && !student && !notFound && (
            <div className="glass-card rounded-2xl border-dashed p-8 text-center text-sm text-[#8592B4]">
              Search for a student to view their registration.
            </div>
          )}

          {feedback && <p className="mt-4 text-sm text-[#8592B4]">{feedback}</p>}
        </section>
      </main>
    </>
  );
}

export default BindingPage;