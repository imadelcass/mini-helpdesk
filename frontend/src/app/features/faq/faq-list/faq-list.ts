import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../../core/services/faq-service';
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
import { FaqForm } from '../components/faq-form/faq-form';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-faq-list',
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
    FaqForm,
    ConfirmPopupModule,
  ],
  templateUrl: './faq-list.html',
})
export class FaqList implements OnInit {
  search = signal('');
  category = signal('');
  searchQuery = signal('');
  payload = signal({ 'page[currentPage]': 1 });
  showFaqForm = false;
  selectedFaq?: any;

  constructor(
    public faqService: FaqService,
    public authService: Auth,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    // Fetch FAQS categories
    this.faqService.fetchCategories().subscribe();

    this.fetchFaqs();
  }

  loadMore(): void {
    this.payload.set({
      ...this.payload(),
      'page[currentPage]': this.payload()['page[currentPage]'] + 1,
    });

    this.fetchFaqs();
  }

  cols = [
    { field: 'question', header: 'Question' },
    { field: 'answer', header: 'Answer' },
    { field: 'category', header: 'Category' },
    { field: 'created_at', header: 'Created At' },
    { field: 'actions', header: 'Actions' },
  ];

  fetchFaqs(): void {
    this.faqService.fetch(this.payload()).subscribe();
  }

  onPage(event: TableLazyLoadEvent): void {
    const currentPage = event.first! / event.rows! + 1;

    this.payload.set({
      ...this.payload(),
      'page[currentPage]': currentPage,
    });

    this.fetchFaqs();
  }

  onSearch(): void {
    // this.fetchFaqs();
  }

  openCreateDialog(): void {
    this.selectedFaq = undefined;
    this.showFaqForm = true;
  }

  onEdit(faq: any): void {
    this.selectedFaq = faq;
    this.showFaqForm = true;
  }

  onDelete(faqId: number): void {
    this.faqService.delete(faqId).subscribe();
  }

  onFaqSaved(savedFaq: any): void {
    // Refresh your FAQ list
    console.log('FAQ saved:', savedFaq);
  }
}
