import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { PaginatedResponse } from '../../app/shared/models/paginated-response';
import { TicketModel, TicketCategoryModel } from '../../app/shared/models/ticket.model';
import { TicketStatusEnum, TicketStatusLabels } from '../../app/shared/enums/ticket-status';
import { TicketPriorityEnum, TicketPriorityLabels } from '../../app/shared/enums/ticket-priority';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  tickets = signal<TicketModel[]>([]);
  totalRecords = signal(0);
  categories = signal<TicketCategoryModel[]>([]);
  loading = signal(false);

  getStatusLabel(value: TicketStatusEnum): string {
    return TicketStatusLabels[value];
  }

  getPriorityLabel(value: TicketPriorityEnum): string {
    return TicketPriorityLabels[value];
  }
  
  getStatuses() {    
    return Object.entries(TicketStatusLabels).map(([value, label]) => ({
      value: value,
      label: label,
    }));
  }
  
  getPriorities() {
    return Object.entries(TicketPriorityLabels).map(([value, label]) => ({
      value: value,
      label: label,
    }));
  }


  fetch(params: {}): Observable<PaginatedResponse<TicketModel>> {
    this.loading.set(true);
    return this.http.get<PaginatedResponse<TicketModel>>('tickets', { params }).pipe(
      tap((response: PaginatedResponse<TicketModel>) => {
        this.totalRecords.set(response.meta.total);
        this.tickets.set(response.data);
        this.loading.set(false);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  fetchCategories(): Observable<TicketCategoryModel[]> {
    return this.http.get<TicketCategoryModel[]>('ticket-categories').pipe(
      tap((response: TicketCategoryModel[]) => {
        this.categories.set(response);
      })
    );
  }

  create(ticket: TicketModel): Observable<boolean> {
    return this.http.post<TicketModel>('tickets', ticket).pipe(
      tap((createdTicket) => {
        this.tickets.set([createdTicket, ...this.tickets()]);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  update(ticketId: number, ticket: TicketModel): Observable<boolean> {
    return this.http.put<TicketModel>(`tickets/${ticketId}`, ticket).pipe(
      tap(() => {
        this.tickets.set(this.tickets().map((t) => (t.id === ticketId ? { ...t, ...ticket } : t)));
      }),
      map(() => true),
      catchError((error) => {
        console.error('Update Ticket failed', error);
        return of(false);
      })
    );
  }

  delete(ticketId: number): Observable<boolean> {
    return this.http.delete(`tickets/${ticketId}`).pipe(
      tap(() => this.tickets.set(this.tickets().filter((t) => t.id !== ticketId))),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
