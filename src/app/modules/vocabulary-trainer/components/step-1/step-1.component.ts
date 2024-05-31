import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ITestTask } from '../../../../shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioPlayerComponent } from '../../../../shared/components/audio-player/audio-player.component';
import { WordOptionComponent } from '../../../../shared/components/word-option/word-option.component';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    WordOptionComponent,
    AudioPlayerComponent,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    NgClass,
  ],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss',
})
export class Step1Component {
  allTests: ITestTask[] = [];
  currTest: ITestTask | null = null;
  currMistakeId = '';
  isButtonVisible = false;
  counter = 1;

  @Input() mode: 'ru' | 'de' = 'de';
  @Input() set testTasks(tests: ITestTask[]) {
    if (tests.length) {
      this.allTests = tests;
      this.currTest = { ...tests[0] };
    }
  }
  @Output() mistake = new EventEmitter<string>();
  @Output() deleteTraining = new EventEmitter<string>();
  @Output() end = new EventEmitter<void>();

  @ViewChildren(WordOptionComponent)
  wordOptionComponent: WordOptionComponent[] = [];
  @ViewChild(AudioPlayerComponent) audioPlayerComponent?: AudioPlayerComponent;

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    const key = event.key;
    if (key === 'Escape') {
      this.onRemoveError();
    } else if (this.isButtonVisible && key === 'Enter') {
      this.onNext();
    }
  }

  onCorrectAntwort(): void {
    if (this.mode !== 'de') {
      this.audioPlayerComponent?.onPlay();
    }
  }

  onMistake(trainingId: string): void {
    if (trainingId) {
      this.currMistakeId = trainingId;
    } else {
      this.isButtonVisible = true;
    }
  }

  onNext(): void {
    this.wordOptionComponent.forEach((el) => {
      el.isChecked = false;
    });
    this.currTest = null;
    this.isButtonVisible = false;
    const firstElem = this.allTests.shift();

    if (this.currMistakeId && firstElem) {
      this.mistake.emit(this.currMistakeId);
      this.allTests.push(firstElem);
    }
    this.currMistakeId = '';

    if (this.allTests.length) {
      this.currTest = this.allTests[0];
    } else {
      this.end.emit();
    }

    this.counter++;
  }

  onDeleteTraining(): void {
    this.deleteTraining.emit(this.currTest?.trainingId);
  }

  onRemoveError(): void {
    this.currMistakeId = '';
  }
}
