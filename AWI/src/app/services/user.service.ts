// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UserRegistration } from '../interfaces/user-registration.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; 
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
    const url = `${this.apiUrl}/users/${user.id}`;
    return this.http.put(url, user);
  }

  getUserRegistrations(pseudo: string): Observable<UserRegistration[]> {
    const url = `${this.apiUrl}/inscriptions/${pseudo}`;
    return this.http.get<UserRegistration[]>(url);
  }

  getUsersRegistration(): Observable<UserRegistration[]> {
    const url = `${this.apiUrl}/user-registrations`;
    return this.http.get<UserRegistration[]>(url);
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


}
