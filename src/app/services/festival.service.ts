import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Festival } from '../interfaces/festival.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FestivalService {

    //private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
    private apiUrl = 'http://localhost:3000'; 

    constructor(private http: HttpClient) {}

    getFestivals(): Observable<Festival[]> {
      const url = `${this.apiUrl}/festivals`;
      return this.http.get<Festival[]>(url);
    }

    deleteFestival(idF: number): Observable<void> {
      const url = `${this.apiUrl}/festival/${idF}`;
      return this.http.delete<void>(url);
    }

    addFestival(festival: Festival): Observable<Festival> {
      const url = `${this.apiUrl}/festival`;
      return this.http.post<Festival>(url, festival);
    }
}
