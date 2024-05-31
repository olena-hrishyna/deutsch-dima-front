import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../../shared/components/loader.component';
import { catchError, throwError } from 'rxjs';
import { InfoDialogComponent } from '../../../shared/components/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { IUser } from '../../../shared/interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    LoaderComponent,
    RouterLink,
  ],
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  form: FormGroup;
  isLoading = false;
  isPasswordVisible = false;

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {
    this.title.setTitle('Логин');
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onChangePasswordVisible(event: MouseEvent): void {
    event.preventDefault();
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const params = {
      login: this.form.value.login?.trim(),
      password: this.form.value.password?.trim(),
    } as IUser;

    this.authService
      .login(params)
      .pipe(
        catchError((err) => {
          this.isLoading = false;
          this.matDialog.open(InfoDialogComponent, {
            width: '400px',
            disableClose: true,
            panelClass: 'my-dialog',
            data: {
              title: err?.error?.message || 'Что-то пошло не так',
              confirmButtonColor: 'warn',
            },
          });
          return throwError(() => err);
        })
      )
      .subscribe((res) => {
        this.isLoading = false;
        this.authService.saveUserData(res);
        this.authService.setUserData(res);
        this.authService.redirect('/vocabulary-trainer/traiter');
      });
  }
}
