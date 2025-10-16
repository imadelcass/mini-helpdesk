import { Component, computed, inject, Input, model, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TicketService } from '@core/services/ticket-service';
import { TicketCommentModel, TicketModel } from '@shared/models/ticket.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ticket-detail',
  imports: [DialogModule, FormsModule, CommonModule, ButtonModule],
  templateUrl: './ticket-detail.html',
})
export class TicketDetail {
  newComment: any;
  ticketService = inject(TicketService);
  visible = model(false);
  ticket = signal<TicketModel | null>(null);

  @Input()
  set ticketId(value: number) {
    this.fetchTicket(value);
  }

  fetchTicket(id: number): void {
    if (!id) return;
    this.ticketService
      .fetchById(id)
      .subscribe()
      .add(() => {
        this.ticket.set(this.ticketService.activeTicket());
      });
  }

  onCancel(): void {
    this.visible.update(() => false);
  }
  addComment() {
    const comment = {
      content: this.newComment,
      ticket_id: this.ticket()?.id,
    } as TicketCommentModel;

    this.ticketService.createComment(comment).subscribe((success) => {
      if (success) {
        this.fetchTicket(comment.ticket_id);
        this.newComment = null;
      }
    });
  }
}
