import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { TicketForm } from '../components/ticket-form/ticket-form';
import { ConfirmationService } from 'primeng/api';
import { TicketService } from '../../../core/services/ticket-service';
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
  ],
  templateUrl: './ticket-list-admin.html',
})
export class TicketListAdmin implements OnInit {
  search = signal('');
  category = signal('');
  searchQuery = signal('');
  payload = signal({ 'page[currentPage]': 1 });
  showTicketForm = false;
  selectedTicket?: any;
  allTickets!: any[];

  constructor(public ticketService: TicketService, public authService: Auth) {}
  ngOnInit(): void {
    // Fetch Tickets categories
    this.ticketService.fetchCategories().subscribe();

    this.fetchTickets().add(() => {
      this.allTickets = [
        ...this.ticketService.tickets(),
        ...Array.from({
          length: this.ticketService.totalRecords() - this.ticketService.tickets().length,
        }),
      ];
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const currentPage = event.first! / event.rows! + 1;

    if (!isNaN(currentPage) && currentPage != 1) {
      this.payload.set({
        ...this.payload(),
        'page[currentPage]': currentPage,
      });

      // Update the data
      this.fetchTickets().add(() => {
        this.allTickets = [
          ...this.allTickets.slice(0, event.first!),
          ...this.ticketService.tickets(),
          ...this.allTickets.slice(event.first! + event.rows!),
        ];
      });
    }
  }

  cols = [
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'priority', header: 'Priority' },
    { field: 'status', header: 'Status' },
    { field: 'category', header: 'Category' },
    { field: 'created_at', header: 'Created At' },
    { field: 'actions', header: 'Actions' },
  ];

  fetchTickets() {
    return this.ticketService.fetch(this.payload()).subscribe();
  }

  onSearch(): void {
    // this.fetchTickets();
  }

  openCreateDialog(): void {
    this.selectedTicket = undefined;
    this.showTicketForm = true;
  }

  onEdit(ticket: any): void {
    this.selectedTicket = ticket;
    this.showTicketForm = true;
  }

  onDelete(ticketId: number): void {
    this.ticketService.delete(ticketId).subscribe();
  }

  onTicketSaved(savedTicket: any): void {
    // Refresh your Ticket list
    console.log('Ticket saved:', savedTicket);
  }
}
