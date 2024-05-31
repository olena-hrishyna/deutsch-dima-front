import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-choice-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './choice-card.component.html',
  styleUrl: './choice-card.component.scss',
})
export class ChoiceCardComponent {
  @Input() link = '';
  @Input() linkTitle = '';
}
