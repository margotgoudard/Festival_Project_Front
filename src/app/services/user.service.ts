// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UserRegistration } from '../interfaces/user-registration.interface';
import { Inscription } from '../interfaces/inscription.interfaces';
import { Festival } from '../interfaces/festival.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com'; 
  //private apiUrl = 'http://localhost:3000'; 

  public userPseudo : string ='';
  public userId : number = 0;

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.get<User>(url);
  }

  setUserPseudo(pseudo: string): void {
    this.userPseudo = pseudo;
  }  

  updateUserProfile(user: User): Observable<any> {
    const url = `${this.apiUrl}/benevole/${user}`;
    return this.http.put(url, user);
  }

  getUserRegistrations(pseudo: string, idF: number): Observable<UserRegistration[]> {
    const url = `${this.apiUrl}/inscriptions/${pseudo}/${idF}`;
    return this.http.get<UserRegistration[]>(url);
  }

  getUsersRegistration(idF: number): Observable<Inscription[]> {
    const url = `${this.apiUrl}/users-registrations/${idF}`;
    return this.http.get<Inscription[]>(url);
  }

  getUsersRegistrationByAdmin(idF: number): Observable<Inscription[]> {
    const url = `${this.apiUrl}/users-registrations-admin/${idF}`;
    return this.http.get<any[]>(url);
  }

  getUserRegistrationWaiting(pseudo: string, idF: number): Observable<Inscription[]> {
    const url = `${this.apiUrl}/user-registrations-admin/${pseudo}/${idF}`;
    return this.http.get<Inscription[]>(url);
  }

  getCandidatureWaiting(pseudo: string, idF: number): Observable<Inscription[]> {
    const url = `${this.apiUrl}/candidature/${pseudo}/${idF}`;
    return this.http.get<Inscription[]>(url);
  }

  getAllCandidaturesWainting(idF: number): Observable<Inscription[]> {
    const url = `${this.apiUrl}/candidatures/${idF}`;
    return this.http.get<Inscription[]>(url);
  }
  
  getUserByPseudo(pseudo: string): Observable<User> {
    const url = `${this.apiUrl}/users?pseudo=${pseudo}`;
    return this.http.get<User>(url);
  }

  getUserPseudo(userId: number): Observable<string> {
    const url = `${this.apiUrl}/users/${userId}/pseudo`;
    return this.http.get<string>(url);
  }


  getUserRole(pseudo: string): Observable<number> {
    const url = `${this.apiUrl}/roleBenevole/${pseudo}`;
    return this.http.get<number>(url);
  }

  getUserAssociations(pseudo: string): Observable<string> {
    const url = `${this.apiUrl}/associationBenevole/${pseudo}`;
    return this.http.get<string>(url);
  }

  deleteUserRegistration(id: number): Observable<any> {
    const url = `${this.apiUrl}/inscriptions/${id}`;
    return this.http.delete(url);
  }

  deleteUserCandidature(id: number): Observable<any> {
    const url = `${this.apiUrl}/candidature/${id}`;
    return this.http.delete(url);
  }

  getAllUsers(idF: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/benevoles/${idF}`)
  }

  updateRoleReferent(pseudo: string): Observable<any> {
    const url = `${this.apiUrl}/referent/${pseudo}`;
   return this.http.put(url, null);
  }

  updateRoleGestionnaire(pseudo: string): Observable<any> {
    const url = `${this.apiUrl}/gestionnaire/${pseudo}`;
   return this.http.put(url, null);
  }

  nonReferentRole(pseudo: string): Observable<any> {
    const url = `${this.apiUrl}/non-referent/${pseudo}`;
   return this.http.put(url, null);
  }

  nonGestionnaireRole(pseudo: string): Observable<any> {
    const url = `${this.apiUrl}/non-gestionnaire/${pseudo}`;
   return this.http.put(url, null);
  }


  getUserFestivals(pseudo: string): Observable<Festival[]> {
    const url = `${this.apiUrl}/user-festivals/${pseudo}`;
    return this.http.get<Festival[]>(url);
  }

  getUsersRegistrationWithFilters(idF: number, idC : number, idEspace: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usersRegistrationWithFilters/${idF}/${idC}/${idEspace}`);
  }


}
