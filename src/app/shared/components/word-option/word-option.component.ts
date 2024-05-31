import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ITestWord } from '../../interfaces';

@Component({
  selector: 'app-word-option',
  standalone: true,
  imports: [NgClass],
  templateUrl: './word-option.component.html',
  styleUrl: './word-option.component.scss',
})
export class WordOptionComponent {
  isChecked = false;
  isCorrectAnswer? = false;

  @Input() mode: 'first' | 'second' = 'first';
  @Input() index?: number;
  @Input() word?: ITestWord;
  @Input() isSelected = false;

  @Output() mistake = new EventEmitter<string>();
  @Output() correct = new EventEmitter<void>();
  @Output() answer = new EventEmitter<string>();

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    switch (event.key) {
      case '1':
        if (this.index === 1) {
          this.onAction();
        }
        break;
      case '2':
        if (this.index === 2) {
          this.onAction();
        }
        break;
      case '3':
        if (this.index === 3) {
          this.onAction();
        }
        break;
      case '4':
        if (this.index === 4) {
          this.onAction();
        }
        break;
    }
  }

  onAction(): void {
    switch (this.mode) {
      case 'first':
        this.isChecked = true;
        this.isCorrectAnswer = this.word?.isCorrect;

        if (this.isCorrectAnswer) {
          this.correct.emit();
        }
        this.mistake.emit(
          (!this.isCorrectAnswer && this.word?.trainingId) || ''
        );
        break;
      case 'second':
        if (this.word?.isCorrect) {
          return;
        }
        this.answer.emit(this.word?.trainingId);
        break;
    }
  }
}
