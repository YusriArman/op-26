import { supabase } from "../utils/supabase";
import type { Announcement } from "../types/announcement";

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("active_announcements")
    .select("id, title, content, category, is_pinned, publish_at, expires_at, created_at")
    .order("is_pinned", { ascending: false })
    .order("publish_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}