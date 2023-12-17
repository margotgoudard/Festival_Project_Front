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
  private apiUrl = 'http://localhost:3000'; // Replace with your actual backend API URL
  private userId: number | null = null;

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.get<User>(url);
  }

  updateUserProfile(user: User): Observable<any> {
    const url = `${this.apiUrl}/users/${user.id}`;
    return this.http.put(url, user);
  }

  getUserRegistrations(userId: number): Observable<UserRegistration[]> {
    const url = `${this.apiUrl}/user-registrations?userId=${userId}`;
    return this.http.get<UserRegistration[]>(url);
  }

  getUsersRegistration(): Observable<UserRegistration[]> {
    const url = `${this.apiUrl}/user-registrations`;
    return this.http.get<UserRegistration[]>(url);
  }

  setUserId(userId: number | null) {
    this.userId = userId;
  }

  getUserId(): number | null {
    return this.userId;
  }
}
