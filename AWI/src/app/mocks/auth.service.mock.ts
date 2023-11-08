import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockAuthService {
  login(username: string, password: string): Observable<any> {
    // Ici, vous pouvez simuler une réponse réussie ou une erreur en fonction des informations d'identification.
    // Par exemple, si les informations d'identification sont correctes :
    if (username === 'utilisateur' && password === 'motdepasse') {
      return of({ token: 'votre-jwt-token-simule' });
    } else {
      // Si les informations d'identification sont incorrectes, simulez une erreur.
      return new Observable(observer => {
        observer.error({ status: 401 });
      });
    }
  }

  // Ajoutez d'autres méthodes du service AuthService simulées au besoin.
}