export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}


interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}
