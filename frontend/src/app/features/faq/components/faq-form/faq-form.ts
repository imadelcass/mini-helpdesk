import { Component, EventEmitter, inject, Input, model, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FaqModel } from '../../../../app/shared/models/faq.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaqService } from '../../../../core/services/faq-service';

@Component({
  selector: 'app-faq-form',
  templateUrl: './faq-form.html',
  imports: [ButtonModule, DialogModule, SelectModule, ReactiveFormsModule],
})
export class FaqForm {
  @Output() saved = new EventEmitter<FaqModel>();

  private _faq?: FaqModel;
  @Input()
  set faq(value: FaqModel | undefined) {
    this._faq = value;
    // This runs every time faq input changes
    if (value) {
      console.log('FAQ received in form:', value);
      this.faqForm.patchValue(value);
    } else {
      console.log('Resetting form for new FAQ');
      this.faqForm.reset();
    }
  }
  get faq(): FaqModel | undefined {
    return this._faq;
  }
  private formBuilder = inject(FormBuilder);

  faqService = inject(FaqService);
  visible = model(false);
  faqForm: FormGroup;

  constructor() {
    this.faqForm = this.createForm();
  }
  private createForm(): FormGroup {
    return this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      answer: ['', [Validators.required, Validators.minLength(10)]],
      faq_category_id: ['', [Validators.required]],
    });
  }

  onCancel(): void {
    this.visible.update(() => false);
  }

  onSave(): void {
    if (this.faqForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const faqData: FaqModel = {
      ...this.faq,
      ...this.faqForm.value,
    };

    const saveObservable = this.faq
      ? this.faqService.update(this.faq.id, faqData)
      : this.faqService.create(faqData);

    saveObservable.subscribe((success) => {
      if (success) {
        this.saved.emit(faqData);
        this.visible.update(() => false);
      } else {
        // Handle error (e.g., show a notification)
        console.error('Failed to save FAQ');
      }
    });
  }

  // Helper methods for template validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.faqForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.faqForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    }
    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.faqForm.controls).forEach((key) => {
      this.faqForm.get(key)?.markAsTouched();
    });
  }
}
