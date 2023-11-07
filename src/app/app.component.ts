import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SnackBarMessageBoxComponent } from './shared/snackbar-message-box/snackbar-message-box.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, SnackBarMessageBoxComponent, LoadingSpinnerComponent],
})
export class AppComponent {
  title = 'mail-it';

  constructor() {}
}
