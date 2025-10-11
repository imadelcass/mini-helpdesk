import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FaqModel } from '../../app/shared/models/faq.model';
import { Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../../app/shared/models/paginated-response';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);

  faqs = signal<FaqModel[]>([]);

  fetch(params: {}): Observable<PaginatedResponse<FaqModel>> {
    return this.http.get<PaginatedResponse<FaqModel>>('faqs', { params }).pipe(
      tap((response: PaginatedResponse<FaqModel>) => {
        this.faqs.set(response.data);
      })
    );
  }
}
