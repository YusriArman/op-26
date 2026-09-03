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
    <div className="p-[1px] rounded-xl bg-gradient-to-r from-[#3cf6f7]/50 via-[#e139fa]/50 to-[#6045f4]/50 shadow-[0_0_15px_rgba(0,0,0,0.3)] transition duration-300">
      <div className="rounded-[11px] bg-[#090520]/90 backdrop-blur-md overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-5 py-4 sm:py-5 text-left gap-4 cursor-pointer"
        >
          <span className="text-base sm:text-lg font-futura-heavy font-bold text-[#3cf6f7] drop-shadow-[0_0_6px_rgba(60,246,247,0.5)]">
            {question}
          </span>

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3cf6f7] text-sm font-bold text-[#090520] transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#e139fa] text-white" : ""
              }`}
          >
            ↓
          </span>
        </button>

        {isOpen && (
          <div className="px-5 pb-5 pt-1 text-sm sm:text-base font-futura-book leading-relaxed text-gray-200 border-t border-[#3cf6f7]/20">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQItem;