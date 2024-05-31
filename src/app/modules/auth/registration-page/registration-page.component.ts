import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../../../shared/components/loader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { InfoDialogComponent } from '../../../shared/components/info-dialog/info-dialog.component';
import { RouterLink } from '@angular/router';
import { IUser } from '../../../shared/interfaces';

@Component({
  selector: 'app-registration-page',
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
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent {
  form: FormGroup;
  isLoading = false;
  isPasswordVisible = false;
  isComfPasswordVisible = false;
  currentTitle = '';
  isEnglish = false;

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {
    this.title.setTitle('Регистрация');

    this.form = this.fb.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onChangePasswordVisible(event: MouseEvent, isConfirm = false): void {
    event.preventDefault();
    isConfirm
      ? (this.isComfPasswordVisible = !this.isComfPasswordVisible)
      : (this.isPasswordVisible = !this.isPasswordVisible);
    this.cdRef.markForCheck();
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
      .registration(params)
      .pipe(
        catchError((err) => {
          this.isLoading = false;
          this.matDialog.open(InfoDialogComponent, {
            width: '400px',
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
