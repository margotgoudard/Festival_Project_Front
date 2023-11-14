import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Creneau } from '../interfaces/creaneau.interface';
import { Poste } from '../interfaces/poste.interface';

@Injectable({
  providedIn: 'root'
})
export class MockPosteCreneauService {
  // Mock data for testing purposes
  private mockPlanningInscription = { /* mock planningInscription data */ };
  private mockCreneaux: Creneau[] = [{heureDebut: "10h", heureFin: "11h" ,jour : "Samedi"}];
  private mockPostes: Poste[] = [
    {
        id: 1,
        nom: 'poste1',
        description: 'description du poste1',
        placedisponible: 5,
        espaces: [{
            id: 1,
            nom: 'espace1',
            description: 'description espace1',
            placedisponible: 5
        }]
    }
];

  getPlanningInscription(): Observable<any> {
    // Return mock planningInscription data
    return of(this.mockPlanningInscription);
  }

  addCreneau(creneau: Creneau): Observable<Creneau> {
    // Simulate a successful addition of a creneau
    this.mockCreneaux.push(creneau);
    return of(creneau);
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
    // Simulate a successful addition of a poste
    this.mockPostes.push(poste);
    return of(poste);
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
