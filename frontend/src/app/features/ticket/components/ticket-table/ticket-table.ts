import { Component, Input, OnInit, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TicketService } from '@core/services/ticket-service';
import { AccordionModule } from 'primeng/accordion';
import { TicketDetail } from '../ticket-detail/ticket-detail';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TicketForm } from '../ticket-form/ticket-form';
import { TicketModel } from '@shared/models/ticket.model';
import { Auth } from '@core/services/auth';
import { TicketStatusEnum } from '@shared/enums/ticket-status';
import { TicketPriorityEnum } from '@shared/enums/ticket-priority';

@Component({
  selector: 'app-ticket-table',
  imports: [TableModule, AccordionModule, ButtonModule, TicketDetail, CommonModule, TicketForm],
  templateUrl: './ticket-table.html',
})
export class TicketTable implements OnInit {
  @Input() status: any = {
    label: '',
    value: '',
  };

  // Properties
  showTicketForm: boolean = false;
  selectedTicket: TicketModel | undefined;
  tickets = signal<any[]>([]);
  payload = signal({ 'page[currentPage]': 1, 'filter[status]': '' });
  isInitialized = signal(false);
  showTicketDetailDialog: boolean = false;
  selectedTicketId: number = 0;
  loading = signal(false);

  // Constructor
  constructor(public ticketService: TicketService, public authService: Auth) {}

  // Methods
  canUpdateTicket(ticket: any) {
    return (
      this.authService.isAdmin() ||
      this.authService.isAgent() ||
      (this.authService.isUser() &&
        ticket.user_id === this.authService.currentUser().id &&
        ticket.status === TicketStatusEnum.OPEN)
    );
  }

  canDeleteTicket(ticket: any) {
    return (
      this.authService.isAdmin() ||
      (this.authService.isUser() && ticket.user_id === this.authService.currentUser().id)
    );
  }

  onTicketClicked(ticketId: number) {
    this.selectedTicketId = ticketId;
    this.showTicketDetailDialog = true;
  }

  ngOnInit(): void {
    this.payload.set({ 'page[currentPage]': 1, 'filter[status]': this.status.value });
    this.fetchData();
  }

  public fetchData() {
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

  public onTicketSaved() {
    console.log('onTicketSaved called', this.status);

    this.showTicketForm = false;
    this.fetchData();
  }

  onEditTicket(ticket: TicketModel) {
    this.selectedTicket = ticket;
    this.showTicketForm = true;
  }

  onDeleteTicket(ticket: TicketModel) {
    this.ticketService.delete(ticket.id).subscribe(() => {
      console.log('onDeleteTicket called');

      this.fetchData();
    });
  }

  getTicketPriorityClass(ticket: any) {        
    switch (ticket.priority) {
      case TicketPriorityEnum.LOW:
        return 'text-yellow-700 border border-yellow-200 bg-yellow-50';
      case TicketPriorityEnum.MEDIUM:
        return 'text-blue-700 border border-blue-200 bg-blue-50';
      case TicketPriorityEnum.HIGH:
        return 'text-red-700 border border-red-200 bg-red-50';
      default:
        return '';
    }
  }
}
