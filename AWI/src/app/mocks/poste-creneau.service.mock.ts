import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { Creneau } from '../interfaces/creaneau.interface';
import { Poste } from '../interfaces/poste.interface';
import { PlanningItem } from '../interfaces/planning-item.interface';
import { Espace } from '../interfaces/espace.interface';
import { PosteDialogComponent } from '../components/poste-dialog/poste-dialog.component';
import { CreneauDialogComponent } from '../components/creneau-dialog/creneau-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Jour } from '../enumeration/jour.enum';

@Injectable({
  providedIn: 'root'
})
export class MockPlanningService {
  // Mock data for testing purposes
  private mockPlanningInscription = { /* mock planningInscription data */ };
  private mockCreneaux: Creneau[] = [{heureDebut: '10h', heureFin: '11h' ,jour : Jour.Samedi}, {heureDebut: '11h', heureFin: '12h' ,jour : Jour.Dimanche}];
  private mockPostes: Poste[] = [
    {
        id: 1,
        nom: 'poste1',
        description: 'description du poste1',
        placedisponible: 5,
        zones: [{
            id: 1,
            nom: 'zone1',
            description: 'description zone1',
            placedisponible: 5,
            espaces: [
              {
                  id: 1,
                  nom: 'espace1',
                  description: 'description du espace1',
                  placedisponible: 5,
              }
            ]
            
        }]
    }
];

private mockEspaces: Espace[] = [
  {
      id: 1,
      nom: 'espace1',
      description: 'description du espace1',
      placedisponible: 5,
  }
];


private mockData: (Poste | Espace)[] = [];

constructor(private dialog: MatDialog) {
  // Initialize your service
}

getItems(): Observable<(Espace | Poste)[]> {
  // Determine the type based on the structure of the first item in mockPostes

  if (this.mockPostes.length > 0 && 'espaces' in this.mockPostes[0]) {
    // If the first item in mockPostes has properties specific to Poste, return mockPostes
    return of(this.mockPostes);
  } else {
    // If the first item in mockEspaces has properties specific to Espace, return mockEspaces
    return of(this.mockEspaces);
  }
}

// New method to fetch creneaux
getCreneaux(): Observable<Creneau[]> {
  console.log('MockPlanningService - Creneaux:', this.mockCreneaux);
  return of(this.mockCreneaux);
}

// New method to fetch postes
getPostes(): Observable<Poste[]> {
  return of(this.mockPostes);
}
  getPlanningInscription(): Observable<any> {
    // Return mock planningInscription data
    return of(this.mockPlanningInscription);
  }

  addCreneau(creneau: Creneau): Observable<Creneau> {
    // Open a dialog to get new information for the creneau
    const dialogRef = this.dialog.open(CreneauDialogComponent, {
      width: '400px',
      data: { creneau: { ...creneau } } // Pass the current creneau data to the dialog
    });
  
    return dialogRef.afterClosed().pipe(
      switchMap(newCreneau => {
        if (newCreneau) {
          // Simulate a successful addition of the creneau
          this.mockCreneaux.push(newCreneau);
          return of(newCreneau);
        } else {
          return EMPTY; // Return an empty observable if the user cancels the operation
        }
      })
    );
  }

  removeCreneau(creneau: Creneau): Observable<void> {
    // Simulate a successful removal of a creneau
    const index = this.mockCreneaux.findIndex(c => c.heureDebut === creneau.heureDebut);
    if (index !== -1) {
      this.mockCreneaux.splice(index, 1);
    }
    return of();
  }

  addPoste(poste: Poste): Observable<Poste> {
    // Open a dialog to get new information for the poste
    const dialogRef = this.dialog.open(PosteDialogComponent, {
      width: '400px',
      data: { poste: { ...poste } } // Pass the current poste data to the dialog
    });
  
    return dialogRef.afterClosed().pipe(
      switchMap(newPoste => {
        if (newPoste) {
          // Simulate a successful addition of the poste
          this.mockPostes.push(newPoste);
          return of(newPoste);
        } else {
          return EMPTY; // Return an empty observable if the user cancels the operation
        }
      })
    );
  }

  removePoste(poste: Poste): Observable<void> {
    // Simulate a successful removal of a poste
    const index = this.mockPostes.findIndex(p => p.id === poste.id);
    if (index !== -1) {
      this.mockPostes.splice(index, 1);
    }
    return of();
  }

  updatePoste(poste: Poste): Observable<Poste> {
    // Simulate a successful update of a poste
    const index = this.mockPostes.findIndex(p => p.id === poste.id);
    if (index !== -1) {
      this.mockPostes[index] = poste;
    }
    return of(poste);
  }

  updateCreneau(creneau: Creneau): Observable<Creneau> {
    // Simulate a successful update of a creneau
    const index = this.mockCreneaux.findIndex(c => c.heureDebut === creneau.heureDebut);
    if (index !== -1) {
      this.mockCreneaux[index] = creneau;
    }
    return of(creneau);
  }
}
