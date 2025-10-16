import { Component, EventEmitter, inject, Input, model, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TicketModel } from '@shared/models/ticket.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '@core/services/ticket-service';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.html',
  imports: [ButtonModule, DialogModule, SelectModule, ReactiveFormsModule],
})
export class TicketForm {
  @Output() saved = new EventEmitter<TicketModel>();

  private _ticket?: TicketModel;
  @Input()
  set ticket(value: TicketModel | undefined) {
    this._ticket = value;
    if (value) {
      this.ticketForm.patchValue(value);
    } else {
      this.ticketForm.reset();
    }
  }
  get ticket(): TicketModel | undefined {
    return this._ticket;
  }
  private formBuilder = inject(FormBuilder);

  ticketService = inject(TicketService);
  visible = model(false);
  ticketForm: FormGroup;

  constructor() {
    this.ticketForm = this.createForm();
  }
  private createForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      ticket_category_id: ['', [Validators.required]],
    });
  }

  onCancel(): void {
    this.visible.update(() => false);
  }

  onSave(): void {
    if (this.ticketForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const ticketData: TicketModel = {
      ...this.ticket,
      ...this.ticketForm.value,
    };

    const saveObservable = this.ticket
      ? this.ticketService.update(this.ticket.id, ticketData)
      : this.ticketService.create(ticketData);

    saveObservable.subscribe((success) => {
      if (success) {
        this.saved.emit(ticketData);
        this.visible.update(() => false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ticketForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.ticketForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    }
    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.ticketForm.controls).forEach((key) => {
      this.ticketForm.get(key)?.markAsTouched();
    });
  }
}
