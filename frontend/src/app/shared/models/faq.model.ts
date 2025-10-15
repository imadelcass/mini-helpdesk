export interface FaqModel {
  id: number;
  question: string;
  answer: string;
  faq_category_id: number;
  category: FaqCategoryModel;
  created_at: string;
}

export interface FaqCategoryModel {
  id: number;
  name: string;
  slug: string;
}
