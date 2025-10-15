import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent, TableFilterEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Auth } from '@core/services/auth';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { TicketForm } from '../components/ticket-form/ticket-form';
import { ConfirmationService } from 'primeng/api';
import { TicketService } from '@core/services/ticket-service';
import { ParsedTableEvent, TableHelperService } from '@core/services/table-helper.service';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-ticket-list-admin',
  standalone: true,
  providers: [ConfirmationService],
  imports: [
    FormsModule,
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    TagModule,
    SkeletonModule,
    ConfirmDialogModule,
    ToastModule,
    DividerModule,
    TicketForm,
    ConfirmPopupModule,
    SelectModule,
  ],
  templateUrl: './ticket-list-admin.html',
})
export class TicketListAdmin implements OnInit {
  search = signal('');
  category = signal('');
  searchQuery = signal('');
  showTicketForm = false;
  selectedTicket?: any;
  allTickets = signal<any[]>([]);
  isInitialized = signal(false);

  constructor(
    public ticketService: TicketService,
    public authService: Auth,
    private tableHelper: TableHelperService
  ) {}
  ngOnInit(): void {
    // Fetch Tickets categories
    this.ticketService.fetchCategories().subscribe();
  }

  fetchData(parsedEvent: ParsedTableEvent) {
    this.ticketService.fetch(parsedEvent).subscribe(() => {
      if (!this.isInitialized()) {
        this.initializeVirtualScrollData();
        this.isInitialized.set(true);
      }
      this.updateTicketData(parsedEvent);
    });
  }

  initializeVirtualScrollData() {
    const totalRecords = this.ticketService.totalRecords();
    const placeholderArray = Array.from({ length: totalRecords }, () => ({}));

    this.allTickets.set(placeholderArray);
  }

  private updateTicketData(parsedEvent: ParsedTableEvent) {
    const currentTickets = this.allTickets();
    const newlyFetchedTickets = this.ticketService.tickets();

    const updatedTickets = [...currentTickets];

    const startIndex = (parsedEvent.page.currentPage - 1) * newlyFetchedTickets.length;

    updatedTickets.splice(startIndex, newlyFetchedTickets.length, ...newlyFetchedTickets);

    this.allTickets.set(updatedTickets);
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const parsedEvent = this.tableHelper.parseTableEvent(event);
    this.fetchData(parsedEvent);
  }

  onFilter($event: TableFilterEvent) {
    this.isInitialized.set(false);
  }

  cols = [
    { field: 'title', header: 'Title', isSortable: true },
    { field: 'description', header: 'Descriptionn', isSortable: true },
    { field: 'priority', header: 'Priority', isSortable: true },
    { field: 'status', header: 'Status', isSortable: true },
    { field: 'category', header: 'Category' },
    { field: 'created_at', header: 'Created At', isSortable: true },
    { field: 'actions', header: 'Actions', isFrozen: true, alignFrozen: 'right' },
  ];

  onSearch(): void {}

  openCreateDialog(): void {
    this.selectedTicket = undefined;
    this.showTicketForm = true;
  }

  onEdit(ticket: any): void {
    this.selectedTicket = ticket;
    this.showTicketForm = true;
  }

  onDelete(dt: any, ticketId: number): void {
    this.ticketService.delete(ticketId).subscribe(() => {
      this.fetchData({} as ParsedTableEvent);
    });
  }

  onTicketSaved(): void {
    // Refresh your Ticket list
    this.fetchData({} as ParsedTableEvent);
  }
}
