import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockAuthService {

  login(username: string, password: string): Observable<any> {
    // Here, you can simulate a successful response or an error based on the credentials.
    // For example, if the credentials are correct:
    if (username === 'utilisateur' && password === 'password') {
      const simulatedResponse = {
        token: 'your-simulated-jwt-token',
        user: {
          role: 'admin', // Set the role here (e.g., 'user' or 'admin')
        },
      };
      return of(simulatedResponse);
    } else {
      // If the credentials are incorrect, simulate an error.
      return new Observable((observer) => {
        observer.error({ status: 401 });
      });
    }
  }

  private loggedInUserId: number | null = null;

  // Méthode pour définir l'ID de l'utilisateur connecté.
  setLoggedInUserId(userId: number | null): void {
    this.loggedInUserId = userId;
  }

  // Méthode pour obtenir l'ID de l'utilisateur connecté.
    getLoggedInUserId(): number | null {
    return this.loggedInUserId;
  }

  getCurrentUser(): Observable<any> {
    // Simulate an HTTP request to get the current user
    console.log('Fetching current user');

    // Return the mock user
    return of(this.mockUser);
  }
  mockUser(mockUser: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  // Ajoutez d'autres méthodes du service AuthService simulées au besoin.
}