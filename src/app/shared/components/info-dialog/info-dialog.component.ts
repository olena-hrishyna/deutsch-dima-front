import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IDialogData } from '../../interfaces';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private matDialogRef: MatDialogRef<InfoDialogComponent>
  ) {}

  onClose(confirm = false): void {
    this.matDialogRef.close(confirm);
  }
}
