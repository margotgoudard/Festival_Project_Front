import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { Role } from '../model/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com/'; // Remplacez par l'URL de votre API.
  private currentUserPseudo: string = ''; // Declare currentUser property

  constructor(private http: HttpClient) {}

  login(pseudo: string, password: string): Observable<User> {
    // Envoyez les informations de connexion au serveur pour validation
    const loginData = { pseudo, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('jwtToken', response.token);
          this.setLoggedInUserPseudo(pseudo);
        }
      }),
      catchError((error) => {
        // Gérer les erreurs d'authentification ici
        throw error;
      })
    );
  }

  getLoggedInUserPseudo(): string | null {
    return this.currentUserPseudo;
  }

  setLoggedInUserPseudo(pseudo: string): void {
    this.currentUserPseudo = pseudo;
  }

  /*
  
  private getUserDetails(pseudo: string): Observable<User> {
    // Récupérez les détails du bénévole en fonction du pseudo
    return this.http.get<any>(`${this.apiUrl}/benevoles/${pseudo}`).pipe(
      tap((userDetails) => {
        console.log('Valeur de userDetails :', userDetails);
      }),
      switchMap((userDetails) => {
        // Assuming userDetails contains roles property representing associated roles
        if (userDetails && userDetails.role) {
          // Map roles from the response to Role objects
          const role: Role = userDetails.role.map(
            (role: any) => new Role(role.idR, role.libelleRole),
          );
  
          // Create a new User object with the received details
          const user = new User(
            userDetails.idB,
            userDetails.prenom,
            userDetails.nom,
            userDetails.pseudo,
            userDetails.associations,
            userDetails.email,
            userDetails.password,
            userDetails.numTel,
            userDetails.chercheLogement,
            userDetails.taille,
            userDetails.vegetarian,
            userDetails.photoDeProfil,
            role,
            userDetails.token,
          );
  
          // Stockez les détails du bénévole dans une variable currentUser
          this.setCurrentUser(user);
  
          return of(user);
        } else {
          return throwError('Réponse du serveur invalide');
        }
      }),
    );
  }

  */

  register(userData: User): Observable<any> {
    console.log(userData)
    return this.http.post(`${this.apiUrl}/registration`, userData).pipe(
      catchError((error: any) => {
        let errorMessage = 'Erreur lors de l\'inscription.';
        
        if (error.status === 400) {
          errorMessage = 'Ce pseudo est déjà utilisé. Veuillez en choisir un autre.';
        } else if (error.status === 500) {
          errorMessage = 'Une erreur interne du serveur s\'est produite. Veuillez réessayer plus tard.';
        }
        
        return throwError(errorMessage);
      })
    );
  }


  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isUserLoggedIn(): boolean {
    // Vérifiez la présence du token JWT dans le stockage local.
    const token = localStorage.getItem('jwtToken');
    return !!token; // Renvoie true si le token JWT est présent, sinon false.
  }

  logout(): void {
    const isConfirmed = window.confirm('Êtes-vous sûr de vous déconnecter ?');

    if (isConfirmed) {
      localStorage.removeItem('jwtToken');
      this.setLoggedInUserPseudo('');

      console.log('Déconnexion effectuée');
    }
  }
}
