import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ARTICLE } from '../../interfaces';

@Component({
  selector: 'app-select-article',
  standalone: true,
  imports: [NgClass],
  templateUrl: './select-article.component.html',
  styleUrl: './select-article.component.scss',
})
export class SelectArticleComponent {
  selectedArticle: ARTICLE | null = null;
  articles = ARTICLE;
  mistakeAntworts: ARTICLE[] = [];
  correctAntwort: ARTICLE | null = null;

  @Input() correctArticle?: ARTICLE;

  @Output() mistake = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    switch (event.key) {
      case '1':
        this.onArticle(ARTICLE.der);
        break;
      case '2':
        this.onArticle(ARTICLE.die);
        break;
      case '3':
        this.onArticle(ARTICLE.das);
        break;
    }
  }

  onArticle(article: ARTICLE): void {
    this.selectedArticle = article;

    if (article === this.correctArticle) {
      this.correctAntwort = article;
    } else {
      this.mistakeAntworts.push(article);
      this.mistake.emit();
    }
  }

  resetComponent(): void {
    this.selectedArticle = null;
    this.correctAntwort = null;
    this.mistakeAntworts = [];
  }
}
