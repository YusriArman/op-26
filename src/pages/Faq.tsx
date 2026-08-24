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
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Header
        title="Frequently Asked Questions"
        align="center"
      />

      <p className="mb-6 text-center text-sm text-gray-600">
        Contact us if you have any issues at Elysium_OrientationParty2026@gmail.com
      </p>

      {loading && (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      )}

      <div className="space-y-3">
        {faqItems.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQ;