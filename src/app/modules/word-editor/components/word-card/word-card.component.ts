import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWord } from '../../../../shared/interfaces';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

type ACTION = 'delete' | 'add' | 'add-known' | 'remove-known';

@Component({
  selector: 'app-word-card',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './word-card.component.html',
  styleUrl: './word-card.component.scss',
})
export class WordCardComponent {
  @Input() word?: IWord;
  @Input() isSuperAdmin = false;
  @Input() isAdmin = false;

  @Output() action = new EventEmitter<{
    wordId: string;
    action: ACTION;
  }>();

  onAction(event: MouseEvent, action: ACTION): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    const wordId = this.word?._id;

    if (wordId) {
      this.action.emit({ wordId, action });
    }
  }
}
