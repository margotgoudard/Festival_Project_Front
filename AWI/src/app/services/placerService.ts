// Importez les modules nécessaires d'Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacerService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer le nombre de places dans la table Placer pour chaque espace et créneau
  getNombrePlacesPourEspaces(espaceIds: number[], creneauId: number): Observable<any[]> {
    const endpoint = `${this.baseUrl}/nombre-places`;
    return this.http.post<any[]>(endpoint, { espaceIds, creneauId });
  }
 

}
