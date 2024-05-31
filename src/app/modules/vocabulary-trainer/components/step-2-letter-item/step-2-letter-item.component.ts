import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-2-letter-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './step-2-letter-item.component.html',
  styleUrl: './step-2-letter-item.component.scss'
})
export class Step2LetterItemComponent {
  @Input() mode: 'answer' | 'variants' = 'answer';
  @Input() letter = '';
  @Input() isCorrect = false;
  @Input() isMistake = false;

  @Output() action = new EventEmitter<string>();

  onAction(): void {
    if (this.mode === 'variants') {
      this.action.emit(this.letter);
    }
  }
}
