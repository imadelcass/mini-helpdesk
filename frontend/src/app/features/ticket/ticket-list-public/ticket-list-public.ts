import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TicketTable } from '../components/ticket-table/ticket-table';
import { TicketService } from '../../../core/services/ticket-service';

@Component({
  selector: 'app-ticket-list-public',
  imports: [TableModule, TicketTable],
  templateUrl: './ticket-list-public.html',
})
export class TicketListPublic {
  constructor(public ticketService: TicketService) {}
}
