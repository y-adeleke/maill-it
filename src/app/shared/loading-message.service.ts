import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarMessageBoxComponent } from './snackbar-message-box/snackbar-message-box.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingMessageService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(private _snackbar: MatSnackBar) {}

  showLoading() {
    this.isLoading.next(true);
  }
  hideLoading() {
    this.isLoading.next(false);
  }

  openSnackBarMessage(message: string) {
    this._snackbar.openFromComponent(SnackBarMessageBoxComponent, {
      duration: 5000,
      data: { message: message },
    });
  }
}
