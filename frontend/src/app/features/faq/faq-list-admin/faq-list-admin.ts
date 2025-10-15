import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../../core/services/faq-service';
import { TableModule, TableLazyLoadEvent, TableFilterEvent } from 'primeng/table';
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
import { ParsedTableEvent, TableHelperService } from '@core/services/table-helper.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-faq-list-admin',
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
    SelectModule,
  ],
  templateUrl: './faq-list-admin.html',
})
export class FaqListAdmin implements OnInit {
  search = signal('');
  category = signal('');
  searchQuery = signal('');
  showFaqForm = false;
  selectedFaq?: any;
  allFaqs = signal<any[]>([]);
  isInitialized = signal(false);

  constructor(
    public faqService: FaqService,
    public authService: Auth,
    private tableHelper: TableHelperService
  ) {}

  ngOnInit(): void {
    // Fetch FAQS categories
    this.faqService.fetchCategories().subscribe();
  }

  fetchData(parsedEvent: ParsedTableEvent) {
    this.faqService.fetch(parsedEvent).subscribe(() => {
      if (!this.isInitialized()) {
        this.initializeVirtualScrollData();
        this.isInitialized.set(true);
      }
      this.updateFaqData(parsedEvent);
    });
  }

  initializeVirtualScrollData() {
    const totalRecords = this.faqService.totalRecords();
    const placeholderArray = Array.from({ length: totalRecords }, () => ({}));

    this.allFaqs.set(placeholderArray);
  }

  private updateFaqData(parsedEvent: ParsedTableEvent) {
    const currentFaqs = this.allFaqs();
    const newlyFetchedFaqs = this.faqService.faqs();

    const updatedFaqs = [...currentFaqs];

    const startIndex = (parsedEvent.page.currentPage - 1) * newlyFetchedFaqs.length;

    updatedFaqs.splice(startIndex, newlyFetchedFaqs.length, ...newlyFetchedFaqs);

    this.allFaqs.set(updatedFaqs);
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const parsedEvent = this.tableHelper.parseTableEvent(event);
    this.fetchData(parsedEvent);
  }

  onFilter($event: TableFilterEvent) {
    this.isInitialized.set(false);
  }

  cols = [
    { field: 'question', header: 'Question', isSortable: true },
    { field: 'answer', header: 'Answer', isSortable: true },
    { field: 'category', header: 'Category' },
    { field: 'created_at', header: 'Created At', isSortable: true },
    { field: 'actions', header: 'Actions', isFrozen: true, alignFrozen: 'right' },
  ];

  onSearch(): void {}

  openCreateDialog(): void {
    this.selectedFaq = undefined;
    this.showFaqForm = true;
  }

  onEdit(faq: any): void {
    this.selectedFaq = faq;
    this.showFaqForm = true;
  }

  onDelete(faqId: number): void {
    this.faqService.delete(faqId).subscribe(() => {
      this.fetchData({} as ParsedTableEvent);
    });
  }

  onFaqSaved(): void {
    // Refresh your FAQ list
    this.fetchData({} as ParsedTableEvent);
  }
}
