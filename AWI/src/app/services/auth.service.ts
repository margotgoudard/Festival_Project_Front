import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'URL_DE_VOTRE_API'; // Remplacez par l'URL de votre API.

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // Effectuez une requête HTTP vers votre API backend pour vérifier les identifiants et obtenir un token JWT.
    const loginData = { username, password };
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      catchError((error: any) => {
        // En cas d'erreur, renvoyez un message d'erreur.
        let errorMessage = 'Erreur lors de la connexion.';
        
        if (error.status === 401) {
          errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        } else if (error.status === 500) {
          errorMessage = 'Une erreur interne du serveur s\'est produite. Veuillez réessayer plus tard.';
        }
        
        return throwError(errorMessage);
      }),
      tap((response: any) => {
        // Stockez le token JWT dans le stockage local en cas de réussite.
        localStorage.setItem('jwtToken', response.token);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    // Effectuez une requête HTTP vers votre API backend pour enregistrer un nouvel utilisateur.
    // Par exemple, utilisez http.post() pour envoyer les données d'inscription au backend.
    const userData = { username, email, password };
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    // Supprimez le token JWT du stockage local.
    localStorage.removeItem('jwtToken');
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isUserLoggedIn(): boolean {
    // Vérifiez la présence du token JWT dans le stockage local.
    const token = localStorage.getItem('jwtToken');
    return !!token; // Renvoie true si le token JWT est présent, sinon false.
  }

  getUserById(userId: string): Observable<User> {
    // Effectuez une requête HTTP vers votre API backend pour récupérer les données de l'utilisateur par son ID.
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

}