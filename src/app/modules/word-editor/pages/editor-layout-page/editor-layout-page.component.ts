import { Component } from '@angular/core';
import { ChoiceCardComponent } from '../../../../shared/components/choice-card/choice-card.component';

@Component({
  selector: 'app-editor-layout-page',
  standalone: true,
  imports: [ChoiceCardComponent],
  templateUrl: './editor-layout-page.component.html',
  styleUrl: './editor-layout-page.component.scss'
})
export class EditorLayoutPageComponent {

  links = [
    {
      link: 'add-word',
      linkTitle: 'Add word'
    },
    {
      link: 'word-list',
      linkTitle: 'Word list'
    }
  ]
}
