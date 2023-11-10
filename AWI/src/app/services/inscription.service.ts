import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) { }

  inscrire(jour: string, creneau: string, poste: string) {
    // Effectuez une requête HTTP pour enregistrer l'inscription dans la base de données
    const inscriptionData = { jour, creneau, poste };
    return this.http.post(`${this.apiUrl}/inscription`, inscriptionData);
  }

  // Define the getPosteReferent method
  getPosteReferent(posteId: number): Observable<any> {
    const url = `${this.apiUrl}/getPosteReferent/${posteId}`; // Replace with your actual API endpoint
    return this.http.get(url);
  }

  // Define the getPreviousVolunteers method
  getPreviousVolunteers(jour: string, creneau: any, posteId: number): Observable<any> {
    const url = `${this.apiUrl}/getPreviousVolunteers/${jour}/${creneau}/${posteId}`; // Replace with your actual API endpoint
    return this.http.get(url);
  }
}