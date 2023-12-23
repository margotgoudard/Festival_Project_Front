import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockInscriptionService {
  // Mock data for testing purposes
  private mockData = {
    posteReferent: { /* mock posteReferent data */ },
    previousVolunteers: [{ /* mock volunteer data */ }, { /* mock volunteer data */ }]
  };

  inscrire(jour: string, creneau: string, poste: string): Observable<any> {
    // Simulate a successful inscription
    const inscriptionData = { jour, creneau, poste };
    return of(inscriptionData);
  }

  getPosteReferent(posteId: number): Observable<any> {
    // Return mock posteReferent data
    return of(this.mockData.posteReferent);
  }

  getPreviousVolunteers(jour: string, creneau: any, posteId: number): Observable<any> {
    // Return mock previousVolunteers data
    return of(this.mockData.previousVolunteers);
  }
}