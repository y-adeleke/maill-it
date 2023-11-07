import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingMessageService } from '../loading-message.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="overlay" *ngIf="isLoading | async">
    <span class="loader"></span>
  </div>`,
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  isLoading = this.loadingMessageService.isLoading;
  constructor(private loadingMessageService: LoadingMessageService) {}
}
