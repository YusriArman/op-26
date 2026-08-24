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

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedStudentId = studentId.trim();

    if (!trimmedStudentId) {
      return;
    }

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
        onChange={(event) =>
          setStudentId(event.target.value)
        }
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}

export default BindingSearch;