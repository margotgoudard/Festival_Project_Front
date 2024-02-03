// poste-creneau.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, map, switchMap } from 'rxjs';
import { Creneau } from '../interfaces/creaneau.interface';
import { Poste } from '../interfaces/poste.interface';
import { Espace } from '../interfaces/espace.interface';
import { PlanningItem } from '../interfaces/planning-item.interface';
import { PosteDialogComponent } from '../components/poste-dialog/poste-dialog.component';
import { CreneauDialogComponent } from '../components/creneau-dialog/creneau-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private baseUrl = 'your-backend-api-url'; // Replace with your actual backend API URL

  constructor(private http: HttpClient, private dialog: MatDialog) {}
  
  getPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(`${this.baseUrl}/postes`);
  }


  getEspaces(): Observable<Espace[]> {
    return this.http.get<Espace[]>(`${this.baseUrl}/espaces`);
  }

  getCreneaux(): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(`${this.baseUrl}/creneaux`);
  }

  // Function to add a new creneau
  addCreneau(creneau: Creneau): Observable<Creneau> {
    // Open a dialog to get new information for the creneau
    const dialogRef = this.dialog.open(CreneauDialogComponent, {
      width: '400px',
      data: { creneau: { ...creneau } } // Pass the current creneau data to the dialog
    });

    return dialogRef.afterClosed().pipe(
      switchMap(newCreneau => {
        if (newCreneau) {
          // Send the newCreneau to the backend
          const url = `${this.baseUrl}/creneaux`;
          return this.http.post<Creneau>(url, newCreneau);
        } else {
          return EMPTY; // Return an empty observable if the user cancels the operation
        }
      })
    );
  }

  // Function to remove a creneau
  removeCreneau(creneau: Creneau): Observable<void> {
    const url = `${this.baseUrl}/creneaux/${creneau.heureDebut}`;
    return this.http.delete<void>(url);
  }

  // Function to add a new poste
  addPoste(poste: Poste): Observable<Poste> {
    // Open a dialog to get new information for the poste
    const dialogRef = this.dialog.open(PosteDialogComponent, {
      width: '400px',
      data: { poste: { ...poste } } // Pass the current poste data to the dialog
    });

    return dialogRef.afterClosed().pipe(
      switchMap(newPoste => {
        if (newPoste) {
          // Send the newPoste to the backend
          const url = `${this.baseUrl}/postes`;
          return this.http.post<Poste>(url, newPoste);
        } else {
          return EMPTY;; // Return an empty observable if the user cancels the operation
        }
      })
    );
  }

  // Function to remove a poste
  removePoste(poste: Poste): Observable<void> {
    const url = `${this.baseUrl}/postes/${poste.idP}`;
    return this.http.delete<void>(url);
  }

  // Function to update a poste
  updatePoste(poste: Poste): Observable<Poste> {
    const url = `${this.baseUrl}/postes/${poste.idP}`;
    return this.http.put<Poste>(url, poste);
  }

  // Function to update a creneau
  updateCreneau(creneau: Creneau): Observable<Creneau> {
    const url = `${this.baseUrl}/creneaux/${creneau.heureDebut}`;
    return this.http.put<Creneau>(url, creneau);
  }
}