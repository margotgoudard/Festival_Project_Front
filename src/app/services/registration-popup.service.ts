// registration-popup.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { RegistrationComponent } from '../components/registration/registration.component';
import { User } from '../model/user.model';


@Injectable({
  providedIn: 'root',
})
export class RegistrationPopupService {
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  openRegistrationPopup() {
    const dialogRef = this.dialog.open(RegistrationComponent, {
      width: '400px', // Set the width as needed
      panelClass: 'registration-popup-container',
    });
  }
}