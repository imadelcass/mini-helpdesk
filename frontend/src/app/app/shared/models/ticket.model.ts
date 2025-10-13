export interface TicketModel {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  ticket_category_id: number;
  category: TicketCategoryModel;
  created_at: string;
}

export interface TicketCategoryModel {
  id: number;
  name: string;
  slug: string;
}
