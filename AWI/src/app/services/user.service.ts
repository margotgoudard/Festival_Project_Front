import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';

@Injectable()
export class UserService {
  private apiUrl = 'URL_de_votre_API'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<User> {
    // Effectuez une requête HTTP vers votre API backend pour récupérer les données de l'utilisateur par son ID.
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  updateUserProfile(userData: any): Observable<any> {
    // Effectuez une requête HTTP vers votre API backend pour mettre à jour le profil de l'utilisateur.
    return this.http.put(`${this.apiUrl}/user/update-profile`, userData);
  }
}