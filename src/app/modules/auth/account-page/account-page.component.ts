import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../../shared/components/loader.component';
import {
  IAuthData,
  IDeleteResponce,
  IDialogData,
  IUser,
} from '../../../shared/interfaces';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    LoaderComponent,
  ],
})
export class AccountPageComponent {
  currentTitle = '';
  currentUser?: IUser;
  isEditMode = false;
  isLoading = false;
  form: FormGroup;

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {
    this.title.setTitle('Особистий кабінет');
    this.form = this.fb.group({
      login: '',
      password: '',
    });

    this.currentUser = this.authService.getUserData().user;
    this.patchForm(this.currentUser?.login);
  }

  onEdit(state: boolean): void {
    this.isEditMode = state;
    if (state) {
      this.form.enable();
    } else {
      this.patchForm(this.currentUser?.login);
    }
  }

  patchForm(login?: string): void {
    if (login) {
      this.form.patchValue({ login });
      this.form.disable();
    }
  }

  openSnackBar(message: string, duration = 4000, isError = false): void {
    this.snackBar.open(message, 'Ok', {
      duration,
      panelClass: isError ? 'red-snack' : 'green-snack',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const data: IDialogData = {
      confirmButtonColor: 'warn',
      title: 'Зберегти зміни?',
      confirmButton: 'Зберегти',
      unConfirmButton: 'Відмінити',
    };

    this.matDialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        disableClose: true,
        panelClass: 'my-dialog',
        data,
      })
      .afterClosed()
      .pipe(
        switchMap((confirm: boolean) => {
          this.isLoading = confirm;

          return confirm
            ? this.authService.updateMyAccount(this.form.value)
            : of(null);
        }),
        catchError((err) => {
          this.isLoading = false;
          this.openSnackBar(
            err?.error?.message || 'Щось пішло не так',
            5000,
            true
          );
          return throwError(() => err);
        })
      )
      .subscribe((data: IAuthData | null) => {
        if (data) {
          this.authService.saveUserData(data);
          this.authService.setUserData(data);
          this.onEdit(false);
          this.isLoading = false;
          this.openSnackBar('Зміни збережені', 5000);
        }
      });
  }

  onDeleteAccount(): void {
    const data: IDialogData = {
      confirmButtonColor: 'warn',
      title: 'Видалення акаунта',
      text: 'Ви впевнені, що хочете видалити видалити ваш обліковий запис назавжди? Відновлення облікового запису буде неможливо',
      confirmButton: 'Видалити',
      unConfirmButton: 'Відмінити',
    };
    this.matDialog
      .open(ConfirmDialogComponent, {
        width: '400px',
        disableClose: true,
        panelClass: 'my-dialog',
        data,
      })
      .afterClosed()
      .pipe(
        switchMap((confirm: boolean) => {
          this.isLoading = confirm;
          return confirm ? this.authService.deleteMyAccount() : of(null);
        }),
        catchError((err) => {
          this.openSnackBar('Помилка видалення облікового запису', 5000, true);
          this.isLoading = false;
          return throwError(() => err);
        })
      )
      .subscribe((resp: IDeleteResponce | null) => {
        this.isLoading = false;
        const message = resp?.message;
        if (message) {
          this.openSnackBar(message, 6000);
          this.authService.deleteUserData('/welcome');
        }
      });
  }
}
