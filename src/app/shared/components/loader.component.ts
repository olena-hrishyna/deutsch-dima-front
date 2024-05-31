import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  template: `<mat-spinner cdkFocusInitial></mat-spinner>`,
  standalone: true,
  styles: `@import "../../../assets/scss/variables.scss";
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      z-index: 5000;
      background: $grey-1;
      opacity: 0.8;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
  }`,
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class LoaderComponent {}
