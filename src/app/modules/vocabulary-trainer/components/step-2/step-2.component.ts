import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Step2LetterItemComponent } from '../step-2-letter-item/step-2-letter-item.component';
import { ITestTask } from '../../../../shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { SelectArticleComponent } from '../../../../shared/components/select-article/select-article.component';
import { isGermanAlphabetLetter, mixArray } from '../../../../shared/handlers';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioPlayerComponent } from '../../../../shared/components/audio-player/audio-player.component';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    Step2LetterItemComponent,
    MatButtonModule,
    SelectArticleComponent,
    AudioPlayerComponent,
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss',
})
export class Step2Component {
  currTests: ITestTask[] = [];
  currMistakeId = '';
  isButtonVisible = false;
  correctAnswerIndex = 0;
  mistakeAnswerIndex = -1;

  @Input() set testTasks(tests: ITestTask[]) {
    if (tests.length) {
      this.currTests = tests;
    }
  }

  @Output() mistake = new EventEmitter<string>();
  @Output() end = new EventEmitter<void>();

  @ViewChild(SelectArticleComponent)
  selectArticleComponent?: SelectArticleComponent;
  @ViewChild(AudioPlayerComponent) audioPlayerComponent?: AudioPlayerComponent;

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    const key = event.key;
    const isTestEnd =
      this.correctAnswerIndex === this.currTests[0].testAnswer.length;

    if (key === 'Escape') {
      this.onRemoveError();
    } else if (key === 'Enter' && isTestEnd) {
      this.onNext();
    } else if (!isTestEnd && (isGermanAlphabetLetter(key) || key === ' ')) {
      this.onAction(key);
    }
  }

  onNext(): void {
    this.isButtonVisible = false;
    this.correctAnswerIndex = 0;
    const firstElem = this.currTests.shift();

    if (this.currMistakeId && firstElem) {
      this.mistake.emit(this.currMistakeId);
      this.currTests.push({
        ...firstElem,
        testLetters: mixArray(firstElem.testAnswer as string[]),
      });
    }

    this.onRemoveError();
    if (this.selectArticleComponent) {
      this.selectArticleComponent.resetComponent();
    }

    if (!this.currTests.length) {
      this.end.emit();
    }
  }

  onArticleMistake(): void {
    this.currMistakeId = this.currTests[0].trainingId;
  }

  onAction(l: string): void {
    const letter = l.toLowerCase();
    const test = this.currTests[0];
    const answer = test.testAnswer;
    const answerLetter = answer[this.correctAnswerIndex]?.toLowerCase();

    if (letter === answerLetter) {
      this.correctAnswerIndex++;
      this.removeLetter(letter);
    } else {
      this.mistakeAnswerIndex = this.correctAnswerIndex;
      this.currMistakeId = test.trainingId;

      setTimeout(() => {
        this.mistakeAnswerIndex = -1;
      }, 500);
    }

    if (this.correctAnswerIndex === answer.length) {
      this.isButtonVisible = true;
      this.audioPlayerComponent?.onPlay();
    }
  }

  onRemoveError(): void {
    this.currMistakeId = '';
  }

  removeLetter(letter: string): void {
    const letters = this.currTests[0].testLetters || [];
    const index = letters.map((l) => l.toLowerCase()).indexOf(letter);
    if (index !== -1) {
      letters.splice(index, 1);
    }
  }
}
