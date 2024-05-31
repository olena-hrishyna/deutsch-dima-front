import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Subscription,
  SubscriptionLike,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchSub: SubscriptionLike = Subscription.EMPTY;

  @Input() isBorder = false;
  @Input() isBackground = true;
  @Input() isLoading = false;
  @Input() placeholder = 'Поиск';
  @Input() set query(query: string) {
    this.searchControl.setValue(query || '');
  }

  @Output() searchChanged = new EventEmitter<string | null>();

  ngOnInit(): void {
    this.searchSub = this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query: string | null) => this.searchChanged.emit(query));
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }

  reset(): void {
    this.searchControl.reset();
  }
}
