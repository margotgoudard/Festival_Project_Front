// Importez les modules nécessaires d'Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacerService {
  private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
  //private apiUrl = 'http://localhost:3000'; 


  constructor(private http: HttpClient) {}

  // Fonction pour récupérer le nombre de places dans la table Placer pour chaque espace et créneau
  getNombrePlacesPourEspaces(espaceId: number, creneauId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/places?espaceId=${espaceId}&creneauId=${creneauId}`);
  }

  updatePlaces(espaceId: number, creneauId: number, newNumberOfPlaces: number): Observable<any> {
    const payload = { espaceId, creneauId, newNumberOfPlaces };

    return this.http.put(`${this.apiUrl}/places`, payload);
  }
 

}
