import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../../core/services/faq-service';

@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './faq-list.html'
})
export class FaqList implements OnInit {
  search = signal('');
  category = signal('');

  constructor(public faqService: FaqService) {}

  ngOnInit(): void {
    console.log("ngOnInit");
    
    this.faqService.fetch({}).subscribe();
  }

  loadFaqs(): void {
    // this.faqService.loadFaqs(this.search(), this.category(), 1).subscribe();
  }

  onSearch(): void {
    // this.loadFaqs();
  }

  onScroll(event: Event): void {
    // const element = event.target as HTMLElement;
    // const bottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    
    // if (bottom) {
    //   this.faqService.loadMore(this.search(), this.category());
    // }
  }
}