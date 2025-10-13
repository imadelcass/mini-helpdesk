import { Component, OnInit, signal } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { FaqService } from '../../../core/services/faq-service';

@Component({
  selector: 'app-faq-list-public',
  imports: [TableModule, AccordionModule],
  templateUrl: './faq-list-public.html',
})
export class FaqListPublic implements OnInit {
  allFaqs!: any[];
  payload = signal({ 'page[currentPage]': 1 });

  constructor(public faqService: FaqService) {}

  ngOnInit(): void {
    this.fetchFaqs().add(() => {
      this.allFaqs = [
        ...this.faqService.faqs(),
        ...Array.from({ length: this.faqService.totalRecords() - this.faqService.faqs().length }),
      ];
    });
  }

  fetchFaqs() {
    return this.faqService.fetch(this.payload()).subscribe();
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const currentPage = event.first! / event.rows! + 1;

    if (!isNaN(currentPage) && currentPage != 1) {
      this.payload.set({
        ...this.payload(),
        'page[currentPage]': currentPage,
      });

      // Update the data
      this.fetchFaqs().add(() => {
        this.allFaqs = [
          ...this.allFaqs.slice(0, event.first!),
          ...this.faqService.faqs(),
          ...this.allFaqs.slice(event.first! + event.rows!),
        ];
      });
    }
  }
}
