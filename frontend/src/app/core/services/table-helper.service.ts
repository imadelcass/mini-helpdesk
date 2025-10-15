import { Injectable } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';

export interface ParsedTableEvent {
  page: {
    currentPage: number;
  };
  filter: Record<string, any>;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TableHelperService {
  parseFilters(filters: any): Record<string, any> {
    if (!filters) return {};

    const result: Record<string, any> = {};

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const filterMeta = filters[key];
        // Single filter
        if (filterMeta.value) {
          result[key] = filterMeta.value;
        }
      }
    }

    return result;
  }

  calculateCurrentPage(first: number = 0, rows: number = 10): number {
    return Math.floor(first / rows) + 1;
  }

  parseSort(sortField?: string, sortOrder?: number): string | undefined {
    if (!sortField || !sortOrder) return undefined;

    return `${sortOrder === 1 ? '' : '-'}${sortField}`;
  }

  parseTableEvent(event: TableLazyLoadEvent): ParsedTableEvent {
    const currentPage = this.calculateCurrentPage(event.first, event.rows!);
    const filters = this.parseFilters(event.filters);
    const sort = this.parseSort(event.sortField as string, event.sortOrder as number);

    const result: ParsedTableEvent = {
      page: {
        currentPage: isNaN(currentPage) ? 1 : currentPage,
      },
      filter: filters,
    };

    if (sort) {
      result.sort = sort;
    }

    return result;
  }
}
