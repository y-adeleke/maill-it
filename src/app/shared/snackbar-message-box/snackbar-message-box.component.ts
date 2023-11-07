import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snackbarmessage-box',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatButtonModule, MatIconModule],
  templateUrl: './snackbar-message-box.component.html',
  styleUrls: ['./snackbar-message-box.component.scss'],
})
export class SnackBarMessageBoxComponent {
  constructor(
    @Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any,
    @Optional()
    private _snackbarRef: MatSnackBarRef<SnackBarMessageBoxComponent>
  ) {}

  close() {
    if (this._snackbarRef) {
      this._snackbarRef.dismiss();
    }
  }
}
