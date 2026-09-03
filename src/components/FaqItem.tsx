import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-[#00F0FF]/40 bg-[#090520]/75 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-bold text-cyan-300">
          {question}
        </span>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00F0FF] text-sm text-[#090520] transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 text-xs leading-relaxed text-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
}

export default FAQItem;