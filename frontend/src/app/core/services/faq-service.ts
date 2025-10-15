import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FaqCategoryModel, FaqModel } from '@shared/models/faq.model';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { PaginatedResponse } from '@shared/models/paginated-response';
import { ParamsService } from './params.service';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);

  faqs = signal<FaqModel[]>([]);
  totalRecords = signal(0);
  categories = signal<FaqCategoryModel[]>([]);
  loading = signal(false);

  constructor(public paramsService: ParamsService) {}

  fetch(params: {}): Observable<PaginatedResponse<FaqModel>> {
    this.loading.set(true);
    return this.http
      .get<PaginatedResponse<FaqModel>>('faqs', {
        params: this.paramsService.toHttpParams(params),
      })
      .pipe(
        tap((response: PaginatedResponse<FaqModel>) => {
          this.totalRecords.set(response.meta.total);
          this.faqs.set(response.data);
          this.loading.set(false);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  fetchCategories(): Observable<FaqCategoryModel[]> {
    return this.http.get<FaqCategoryModel[]>('faq-categories').pipe(
      tap((response: FaqCategoryModel[]) => {
        this.categories.set(response);
      })
    );
  }

  create(faq: FaqModel): Observable<boolean> {
    return this.http.post<FaqModel>('faqs', faq).pipe(
      tap(() => {
        this.faqs.set([faq, ...this.faqs()]);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  update(faqId: number, faq: FaqModel): Observable<boolean> {
    return this.http.put<FaqModel>(`faqs/${faqId}`, faq).pipe(
      tap(() => {
        this.faqs.set(this.faqs().map((f) => (f.id === faqId ? { ...f, ...faq } : f)));
      }),
      map(() => true),
      catchError((error) => {
        console.error('Update FAQ failed', error);
        return of(false);
      })
    );
  }

  delete(faqId: number): Observable<boolean> {
    return this.http.delete(`faqs/${faqId}`).pipe(
      tap(() => this.faqs.set(this.faqs().filter((faq) => faq.id !== faqId))),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
