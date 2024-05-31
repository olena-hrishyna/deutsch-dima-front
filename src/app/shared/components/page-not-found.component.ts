import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouteHistoryService } from '../../services/route-history.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: `<main>
    <h1>{{ currentTitle }}</h1>
    <mat-icon class="big">sentiment_very_dissatisfied</mat-icon>
    <a class="link" [routerLink]="historyService.previousUrl || '/'">
      <button>
        Повернутися назад
        <mat-icon class="follow">follow_the_signs</mat-icon>
      </button>
    </a>
  </main> `,
  styles: `@import "../../../assets/scss/variables.scss";
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
      margin-bottom: 25px;
      color: $purple-1;
    }

    .big {
      transform: scale(2);
      margin-bottom: 40px;
    }

    .follow {
      margin-left: 6px;
    }

    button {
      font-size: 24px;
    }
  }`,
})
export class PageNotFoundComponent {
  currentTitle = 'Сторінка не знайдена';

  constructor(
    private title: Title,
    public historyService: RouteHistoryService
  ) {
    this.title.setTitle(this.currentTitle);
  }
}
