export interface TicketModel {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  user_id: number;
  ticket_category_id: number;
  category: TicketCategoryModel;
  comments: TicketCommentModel[];
  created_at: string;
}

export interface TicketCategoryModel {
  id: number;
  name: string;
  slug: string;
}

export interface TicketCommentModel {
  id: number;
  content: string;
  ticket_id: number;
  user_id: number;
  parent_id: number | null;
  created_at: string;
}
