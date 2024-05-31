import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  template: `<main>
    @if(currentUser) {
    <h1>Ласкаво просимо!</h1>
    } @else {
    <h1>Увага!</h1>
    <h3>
      Даний веб-сайт створений для вивчення німецької мови,<br />і право
      користування їм надано лише зареєстрованим користувачам<br />
    </h3>
    }
  </main>`,
  styles: `@import "../../../../assets/scss/variables.scss";
    h1 {
      margin-bottom: 20px;
      color: $purple-1;
    };
    h3 {
      color: $purple-2;
      text-align: center;
      line-height: 2;
    }`,
})
export class WelcomePageComponent {
  currentUser = this.authService.getUserData().user;

  constructor(private title: Title, private authService: AuthService) {
    this.title.setTitle('Ласкаво просимо!');
  }
}
