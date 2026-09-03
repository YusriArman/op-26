import { useEffect, useState } from "react";
import Header from "../components/Header";
import FAQItem from "../components/FaqItem";
import { fetchFaqs } from "../services/faqService";
import type { FaqRecord } from "../types/faq";

function FAQ() {
  const [faqItems, setFaqItems] = useState<FaqRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs()
      .then(setFaqItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_bottom,rgba(0,8,27,0.58),rgba(0,8,27,0.50),rgba(0,8,27,0.65)),url('/bg.png')] bg-cover bg-center bg-fixed text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Header
          title="Frequently Asked Questions"
          align="center"
        />

        <p className="mt-6 sm:mt-8 mb-10 text-center text-base sm:text-lg font-futura-medium text-gray-200 tracking-wide">
          Contact us if you have any issues at{" "}
          <a
            href="mailto:op.elysium2026@gmail.com"
            className="text-[#3cf6f7] hover:underline drop-shadow-[0_0_8px_rgba(60,246,247,0.6)]"
          >
            op.elysium2026@gmail.com
          </a>
        </p>

        {loading && (
          <p className="text-center text-sm text-gray-400">Loading...</p>
        )}

        <div className="space-y-2.5">
          {faqItems.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;