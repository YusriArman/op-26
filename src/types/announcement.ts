export interface Announcement {
    id: string;
    title: string;
    content: string;
    category: 'urgent' | 'event' | 'warning' | 'promo' | 'info';
    is_pinned: boolean;
    publish_at: string;
    expires_at: string | null;
    created_at: string;
}