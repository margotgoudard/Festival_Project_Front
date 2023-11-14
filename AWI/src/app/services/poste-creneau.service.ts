// poste-creneau.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Creneau } from '../interfaces/creaneau.interface';
import { Poste } from '../interfaces/poste.interface';
import { Espace } from '../interfaces/espace.interface';
import { PlanningItem } from '../interfaces/planning-item.interface';


@Injectable({
  providedIn: 'root'
})
export class PosteCreneauService {
  private baseUrl = 'your-backend-api-url'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  getPlanningInscription(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planningInscription`);
  }

  getItems(): Observable<PlanningItem[]> {
    return this.http.get<PlanningItem[]>(`${this.baseUrl}/items`);
  }

  // Function to add a new creneau
  addCreneau(creneau: Creneau): Observable<Creneau> {
    const url = `${this.baseUrl}/creneaux`;
    return this.http.post<Creneau>(url, creneau);
  }

  // Function to remove a creneau
  removeCreneau(creneau: Creneau): Observable<void> {
    const url = `${this.baseUrl}/creneaux/${creneau.heureDebut}`;
    return this.http.delete<void>(url);
  }

  // Function to add a new poste
  addPoste(poste: Poste): Observable<Poste> {
    const url = `${this.baseUrl}/postes`;
    return this.http.post<Poste>(url, poste);
  }

  // Function to remove a poste
  removePoste(poste: Poste): Observable<void> {
    const url = `${this.baseUrl}/postes/${poste.id}`;
    return this.http.delete<void>(url);
  }

  // Function to update a poste
  updatePoste(poste: Poste): Observable<Poste> {
    const url = `${this.baseUrl}/postes/${poste.id}`;
    return this.http.put<Poste>(url, poste);
  }

  // Function to update a creneau
  updateCreneau(creneau: Creneau): Observable<Creneau> {
    const url = `${this.baseUrl}/creneaux/${creneau.heureDebut}`;
    return this.http.put<Creneau>(url, creneau);
  }

  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(`${this.baseUrl}/postes`);
  }

  getEspacess(): Observable<Espace[]> {
    return this.http.get<Espace[]>(`${this.baseUrl}/espaces`);
  }

  getCreneaux(): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(`${this.baseUrl}/creneaux`);
  }
}