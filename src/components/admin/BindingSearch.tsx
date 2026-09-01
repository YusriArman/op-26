import { useState } from "react";

interface BindingSearchProps {
  onSearch: (studentId: string) => void;
  placeholder?: string;
  stacked?: boolean;
}

function BindingSearch({
  onSearch,
  placeholder = "Search Student ID",
  stacked = false,
}: BindingSearchProps) {
  const [studentId, setStudentId] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedStudentId = studentId.trim();
    if (!trimmedStudentId) return;
    onSearch(trimmedStudentId);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 ${stacked ? "" : "sm:flex-row"}`}
    >
      <input
        type="text"
        value={studentId}
        onChange={(event) => setStudentId(event.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-[#5b6785] outline-none focus:border-[#4C7CFF]"
      />
      <button
        type="submit"
        className="rounded-lg bg-[#4C7CFF] px-6 py-3 text-white shadow-[0_0_20px_rgba(76,124,255,0.35)] transition hover:bg-[#3D68E0]"
      >
        Search
      </button>
    </form>
  );
}

export default BindingSearch;