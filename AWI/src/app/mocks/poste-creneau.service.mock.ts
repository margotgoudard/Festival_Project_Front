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
import { Zone } from '../interfaces/zone.interface';

@Injectable({
  providedIn: 'root'
})
export class MockPlanningService {
  // Mock data for testing purposes
  private mockPlanningInscription: { [jour in Jour]?: Creneau[] } = {};
  private mockCreneaux: Creneau[] = [{id: 1, heureDebut: '10h', heureFin: '11h' ,jour : Jour.Samedi}, {id: 2,heureDebut: '11h', heureFin: '12h' ,jour : Jour.Dimanche}];
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


private mockData: (Poste | Espace | Zone)[] = [];

constructor(private dialog: MatDialog) {
  // Initialize your service
}

getItems(): Observable<(Espace | Poste | Zone)[]> {
  // Determine the type based on the structure of the first item in mockPostes

  if (this.mockPostes.length > 0 && 'zones' in this.mockPostes[0]) {
    // If the first item in mockPostes has properties specific to Poste, return mockPostes
    return of(this.mockPostes);
  } else {
      if (this.mockPostes.length > 0 && 'espaces' in this.mockPostes[0]) {
      // If the first item in mockEspaces has properties specific to Espace, return mockEspaces
        return of(this.mockPostes[0].zones);
      }
      else { return of (this.mockPostes[0].zones[0].espaces)};
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
   // Dans la méthode getPlanningInscription de MockPlanningService
   getPlanningInscription(jour: Jour): Observable<Creneau[]> {
    // Filtrer les créneaux en fonction de la journée demandée
    const creneauxForDay = this.mockPlanningInscription[jour] || [];
    return of(creneauxForDay);
  }

  addCreneau(creneau: Creneau): Observable<Creneau> {
    // Check if the creneau already exists
    const existingCreneau = this.mockCreneaux.find(c => c.jour === creneau.jour && c.heureDebut === creneau.heureDebut && c.heureFin === creneau.heureFin);
  
    if (existingCreneau) {
      // If the creneau already exists, return it
      return of(existingCreneau);
    }
  
    // Generate a unique ID for the new creneau
    const uniqueId = this.generateUniqueId();
  
    // Assign the unique ID to the creneau
    const newCreneau: Creneau = { ...creneau, id: uniqueId };
  
    // Open a dialog to get new information for the creneau
    const dialogRef = this.dialog.open(CreneauDialogComponent, {
      width: '400px',
      data: { creneau: { ...newCreneau } } // Pass the current creneau data to the dialog
    });

    // Ajouter le créneau à la journée appropriée dans mockPlanningInscription
    if (creneau.jour in this.mockPlanningInscription) {
      // Assurez-vous que this.mockPlanningInscription[creneau.jour] est défini avant d'y accéder
      this.mockPlanningInscription[creneau.jour] = this.mockPlanningInscription[creneau.jour] || [];
      this.mockPlanningInscription[creneau.jour]?.push(creneau);
    } else {
      this.mockPlanningInscription[creneau.jour] = [creneau];
    }
  
    return dialogRef.afterClosed().pipe(
      switchMap((result: Creneau) => {
        if (result) {
          // Simulate a successful addition of the creneau with the unique ID
          this.mockCreneaux.push(result);
          return of(result);
        } else {
          return EMPTY; // Return an empty observable if the user cancels the operation
        }
      })
    );
  }
  
  generateUniqueId(): number {
    // Find the maximum ID in the existing creneaux
    const maxId = Math.max(...this.mockCreneaux.map(creneau => creneau.id), 0);
  
    // Generate a new unique ID by incrementing the maximum ID
    return maxId + 1;
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
