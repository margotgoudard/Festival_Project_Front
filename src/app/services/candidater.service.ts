// candidater.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidaterService {
//private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com'; 
private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  candidaterVolunteer(benevolePseudo: string, creneauId: number, idF: number): Observable<any> {
    const url = `${this.apiUrl}/candidature/${benevolePseudo}/${creneauId}/${idF}`;
    return this.http.post(url, {});
  }

  updateCandidature(benevolePseudo: string, creneauId: number, espaceId: number, idF: number): Observable<void> {
    const url = `${this.apiUrl}/candidature/${benevolePseudo}/${creneauId}/${espaceId}/${idF}`;
    return this.http.put<void>(url, {});
  }

 
}
