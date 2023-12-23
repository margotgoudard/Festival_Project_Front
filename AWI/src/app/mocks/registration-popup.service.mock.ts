// registration-popup.service.mock.ts
import { of } from 'rxjs';

export class RegistrationPopupServiceMock {
  openRegistrationPopup() {
    // Return an observable that emulates the result when the registration popup is closed
    return of({
      // Mock registration data, you can customize this based on your actual data structure
      username: 'mockUsername',
      email: 'mock@example.com',
      // ... other mock properties
    });
  }
}