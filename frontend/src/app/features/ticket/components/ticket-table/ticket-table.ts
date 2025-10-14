import { Component, Input, OnInit, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TicketService } from '../../../../core/services/ticket-service';
import { AccordionModule } from 'primeng/accordion';
import { TicketDetail } from '../ticket-detail/ticket-detail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-table',
  imports: [TableModule, AccordionModule, TicketDetail, CommonModule],
  templateUrl: './ticket-table.html',
})
export class TicketTable implements OnInit {
  @Input() status: any = {
    label: '',
    value: '',
  };

  tickets = signal<any[]>([]);
  payload = signal({ 'page[currentPage]': 1, 'filter[status]': '' });
  isInitialized = signal(false);
  showTicketDetailDialog: boolean = false;
  selectedTicketId: number = 0;
  loading = signal(false);

  onTicketClicked(ticketId: number) {
    this.selectedTicketId = ticketId;
    this.showTicketDetailDialog = true;
  }

  constructor(public ticketService: TicketService) {}

  ngOnInit(): void {
    this.payload.set({ 'page[currentPage]': 1, 'filter[status]': this.status.value });
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    return this.ticketService.fetch(this.payload()).subscribe(() => {
      if (!this.isInitialized()) {
        this.initializeVirtualScrollData();
        this.isInitialized.set(true);
      } else {
        this.updateTicketData();
      }

      this.loading.set(false);
    });
  }

  initializeVirtualScrollData() {
    const totalRecords = this.ticketService.totalRecords();
    const placeholderArray = Array.from({ length: totalRecords }, () => ({}));

    this.tickets.set(placeholderArray);
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const currentPage = event.first! / event.rows! + 1;

    if (!isNaN(currentPage)) {
      this.payload.set({
        ...this.payload(),
        'page[currentPage]': currentPage,
      });

      this.fetchData();
    }
  }

  private updateTicketData() {
    const currentTickets = this.tickets();
    const newlyFetchedTickets = this.ticketService.tickets();

    const updatedTickets = [...currentTickets];

    const startIndex = (this.payload()['page[currentPage]'] - 1) * newlyFetchedTickets.length;

    updatedTickets.splice(startIndex, newlyFetchedTickets.length, ...newlyFetchedTickets);

    this.tickets.set(updatedTickets);
  }
}
