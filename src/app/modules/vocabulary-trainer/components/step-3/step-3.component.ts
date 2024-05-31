import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ITestTask } from '../../../../shared/interfaces';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { AudioPlayerComponent } from '../../../../shared/components/audio-player/audio-player.component';

@Component({
  selector: 'app-step-3',
  standalone: true,
  imports: [
    NgClass,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    AudioPlayerComponent,
  ],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.scss',
})
export class Step3Component implements AfterViewInit {
  currTests: ITestTask[] = [];
  currMistakeId = '';
  currAnswer = '';
  isTestRunning = true;

  @Input() set testTasks(tests: ITestTask[]) {
    if (tests.length) {
      this.currTests = tests;
    }
  }

  @Output() mistake = new EventEmitter<string>();
  @Output() end = new EventEmitter<void>();

  @ViewChild('input') inputRef?: ElementRef;

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    if (event.key === 'Enter' && this.currAnswer) {
      this.onNext();
    }
  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  setFocus(): void {
    setTimeout(() => {
      this.inputRef?.nativeElement.focus();
    }, 100);
  }

  getPreparedWord(word: string): string {
    return word.toLowerCase().trim();
  }

  onNext(): void {
    if (this.isTestRunning) {
      this.isTestRunning = false;
      const firstElem = this.currTests[0];

      if (firstElem) {
        const corrAnswer = this.getPreparedWord(firstElem.testAnswer as string);
        const currAnswer = this.getPreparedWord(this.currAnswer);
        const isMistake = corrAnswer !== currAnswer;

        if (isMistake && firstElem) {
          this.currMistakeId = firstElem?.trainingId;
          this.mistake.emit(this.currMistakeId);
          this.currTests.push(firstElem);
        }
      }
    } else {
      this.currTests.shift();
      this.currMistakeId = '';
      this.currAnswer = '';

      if (!this.currTests.length) {
        this.end.emit();
      } else {
        this.isTestRunning = true;
        this.setFocus();
      }
    }
  }
}
