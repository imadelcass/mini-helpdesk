import { Component, OnInit, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule, TableFilterEvent } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { FaqService } from '../../../core/services/faq-service';
import { InputTextModule } from 'primeng/inputtext';
import { TableHelperService, ParsedTableEvent } from '../../../core/services/table-helper.service';

@Component({
  selector: 'app-faq-list-public',
  imports: [TableModule, AccordionModule, InputTextModule],
  templateUrl: './faq-list-public.html',
})
export class FaqListPublic {
  allFaqs = signal<any[]>([]);
  isInitialized = signal(false);

  constructor(
    public faqService: FaqService,
    private tableHelper: TableHelperService
  ) {}

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
}