// Tipos pra success stories
export interface SuccessStory {
  id: string;
  freelancer_id: string;
  title: string;
  before_price: number;
  after_price: number;
  before_month: string;
  after_month: string;
  story: string; // markdown
  video_url?: string;
  status: 'draft' | 'pending_approval' | 'published';
  featured: boolean;
  featured_until?: Date;
  created_at: Date;
  approved_at?: Date;
  views: number;
}
