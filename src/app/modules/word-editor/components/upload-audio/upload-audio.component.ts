import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AudioService } from '../../../../services/audio.service';
import { MatIconModule } from '@angular/material/icon';
import { IWord } from '../../../../shared/interfaces';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-upload-audio',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './upload-audio.component.html',
  styleUrl: './upload-audio.component.scss',
})
export class UploadAudioComponent {
  selectedFile: File | null = null;

  @Input() word?: IWord;

  @Output() updatedWord = new EventEmitter<IWord>();

  constructor(
    private audioService: AudioService,
    private snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, duration = 4000, isError = false): void {
    this.snackBar.open(message, 'Ok', {
      duration,
      panelClass: isError ? 'red-snack' : 'green-snack',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files?.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  onUploadAudio(): void {
    const wordId = this.word?._id;
    if (this.selectedFile && wordId) {
      this.audioService
        .uploadAudio(this.selectedFile, wordId)
        .pipe(
          catchError((err) => {
            this.openSnackBar(
              err?.error?.message || 'Ошибка сохранения аудио',
              5000,
              true
            );
            return throwError(() => err);
          })
        )
        .subscribe((word: IWord) => {
          this.updatedWord.emit(word);
          this.openSnackBar('Аудио сохранено');
        });
    }
  }

  onDeleteAudio(): void {
    const wordId = this.word?._id;
    if (wordId) {
      this.audioService
        .deleteAudio(wordId)
        .pipe(
          catchError((err) => {
            this.openSnackBar(
              err?.error?.message || 'Ошибка удаления аудио',
              5000,
              true
            );
            return throwError(() => err);
          })
        )
        .subscribe((word: IWord) => {
          this.updatedWord.emit(word);
          this.openSnackBar('Аудио удалено');
        });
    }
  }
}
