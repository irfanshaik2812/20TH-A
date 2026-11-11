export interface SiteSettings {
  id?: string;
  site_title: string;
  parents_names: string;
  anniversary_date: string;
  welcome_heading: string;
  welcome_subtitle: string;
  welcome_tagline: string;
  welcome_photo_url: string;
  background_music_url: string;
  background_music_title: string;
  music_enabled: boolean;
  cake_message_title: string;
  cake_message_subtitle: string;
  surprise_heading: string;
  surprise_button_text: string;
  surprise_video_url: string;
  surprise_message: string;
  surprise_photos: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TimelineEvent {
  id: string;
  milestone_date: string;
  title: string;
  description: string;
  photo_url?: string | null;
  video_url?: string | null;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PhotoAlbum = 'all' | 'wedding' | 'family' | 'travel' | 'special';

export interface GalleryPhoto {
  id: string;
  title: string;
  caption?: string | null;
  photo_url: string;
  album: 'wedding' | 'family' | 'travel' | 'special';
  date_taken?: string | null;
  display_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface Letter {
  id: string;
  author: string;
  relationship: string;
  title: string;
  message: string;
  audio_recording_url?: string | null;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoveReason {
  id: string;
  title: string;
  message: string;
  icon_name: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
}

export interface GuestbookEntry {
  id: string;
  visitor_name: string;
  relationship: string;
  message: string;
  photo_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SiteMedia {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  bucket_name: string;
  file_size?: number;
  created_at?: string;
}

export interface AdminAnalytics {
  photoCount: number;
  milestoneCount: number;
  letterCount: number;
  pendingWishesCount: number;
  approvedWishesCount: number;
  publishedCount: number;
}
