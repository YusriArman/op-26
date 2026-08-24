import { supabase } from "../utils/supabase";
import type { FaqRecord } from "../types/faq";

export async function fetchFaqs(): Promise<FaqRecord[]> {
    const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer, display_order")
        .order("display_order", { ascending: true });

    if (error) throw error;

    return data ?? [];
}