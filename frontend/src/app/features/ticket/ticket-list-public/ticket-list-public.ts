import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TicketTable } from '../components/ticket-table/ticket-table';
import { TicketService } from '@core/services/ticket-service';
import { TicketForm } from '../components/ticket-form/ticket-form';
import { Auth } from '@core/services/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ticket-list-public',
  imports: [TableModule, TicketTable, TicketForm, ButtonModule],
  templateUrl: './ticket-list-public.html',
})
export class TicketListPublic implements OnInit {
  @ViewChildren('datatable') datatables: QueryList<TicketTable> | undefined;

  onTicketSaved($event: any) {
    this.datatables?.forEach((table) => {
      if (table.status.value === $event.status) table.onTicketSaved();
    });
  }
  showTicketForm = false;
  selectedTicket?: any;

  constructor(public ticketService: TicketService, public authService: Auth) {}

  ngOnInit(): void {
    // Fetch Tickets categories
    this.ticketService.fetchCategories().subscribe();
  }

  openCreateDialog(): void {
    this.selectedTicket = undefined;
    this.showTicketForm = true;
  }
}
