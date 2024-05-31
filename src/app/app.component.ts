import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { IUser } from './shared/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header
      [currentUser]="currentUser$ | async"
      (logout)="onLogout()"
    ></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: `
  @import "../assets/scss/variables.scss";

  ::ng-deep .red-snack {
    .mdc-snackbar__surface {
      background-color: $red-3 !important;
    }

    .mat-mdc-snack-bar-label {
      color: $red-9 !important;
    }
  }

  ::ng-deep .green-snack {
    .mdc-snackbar__surface {
      background-color: $green-0 !important;
    }

    .mat-mdc-snack-bar-label {
      color: $green-21 !important;
    }
  }`,
})
export class AppComponent {
  currentUser$: Observable<IUser | null> = this.authService.getCurrentUser();
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkUserData();
  }

  onLogout(): void {
    this.authService.deleteUserData('/welcome');
  }
}
