import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Hebergement } from '../model/herbegement.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HebergementService {

   // private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
  private apiUrl = 'http://localhost:3000'; 
  
    constructor( private http: HttpClient) { }

    addHebergement(logement: Hebergement, pseudo: string): Observable<Hebergement> {
      const url = `${this.apiUrl}/hebergement/${pseudo}`;
      return this.http.post<Hebergement>(url, logement);
    }
    

  getLogementsProposes(pseudo: string): Observable<Hebergement> {
    const url = `${this.apiUrl}/hebergementByBenevole/${pseudo}`;
    return this.http.get<Hebergement>(url);
  }

  deleteHebergement(idH: number): Observable<void> {
    const url = `${this.apiUrl}/hebergement/${idH}`;
    return this.http.delete<void>(url);
  }

  getAllHerbergements(): Observable<Hebergement[]> {
    const url = `${this.apiUrl}/hebergements`;
    return this.http.get<Hebergement[]>(url);
  }
}
