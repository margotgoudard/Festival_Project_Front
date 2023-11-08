import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../model/user.model';
import * as jwt from 'jsonwebtoken'; // Importez jsonwebtoken ici

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

  getLoggedInUserId(): string | null {
    const token = localStorage.getItem('jwtToken');
  
    if (token) {
      // Vous devez décoder le token JWT pour obtenir les informations de l'utilisateur.
      // La structure du token JWT dépend de votre application.
      // Voici un exemple de décodage d'un token JWT avec la bibliothèque jsonwebtoken.
      
      // Assurez-vous d'importer jsonwebtoken en haut de votre fichier :
      // import * as jwt from 'jsonwebtoken';
  
      // Remplacez 'YOUR_SECRET_KEY' par la clé secrète utilisée pour signer les tokens JWT.
      const secretKey = 'YOUR_SECRET_KEY';
  
      try {
        const decodedToken: any = jwt.verify(token, secretKey);
  
        // Si votre token JWT contient l'ID de l'utilisateur, vous pouvez le renvoyer.
        // Par exemple, si l'ID de l'utilisateur est stocké dans le champ 'userId' du token :
        if (decodedToken && decodedToken.userId) {
          return decodedToken.userId;
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT :', error);
      }
    }
  
    // Si le token est absent ou s'il ne contient pas l'ID de l'utilisateur, renvoyez null.
    return null;
  }
}