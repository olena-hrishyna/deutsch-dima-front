import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IDialogData } from '../../interfaces';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private matDialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  onClose(confirm = false): void {
    this.matDialogRef.close(confirm);
  }
}
