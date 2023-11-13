// registration-popup.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { RegistrationComponent } from '../components/registration/registration.component';


@Injectable({
  providedIn: 'root',
})
export class RegistrationPopupService {
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  openRegistrationPopup() {
    const dialogRef = this.dialog.open(RegistrationComponent, {
      width: '400px', // Set the width as needed
    });

    // Handle the result when the registration popup is closed
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The registration dialog was closed', result);

      // If the result is not undefined (i.e., the user clicked the "Register" button in the dialog)
      if (result) {
        // Call the register method from the AuthService to send data to the backend
        this.authService.register(result).subscribe(
          (response) => {
            // Registration successful, handle any additional actions
            console.log('Registration successful', response);
          },
          (error) => {
            // Handle registration error
            console.error('Registration failed', error);
          }
        );
      }
    });
  }
}