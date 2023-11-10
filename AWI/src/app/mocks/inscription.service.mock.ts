import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Importez HttpClient si nécessaire
import { InscriptionResponse } from '../interfaces/message-inscription.interface';
import { Creneau } from '../interfaces/creaneau.interface';
import { Poste } from '../interfaces/poste.interface';


@Injectable({
  providedIn: 'root',
})
export class MockInscriptionService {
    // Simuler une inscription réussie
    inscrire(utilisateur: any, creneau: Creneau, poste: Poste): Observable<any> {
      // Vous pouvez personnaliser la réponse factice si nécessaire
      const response = {
        success: true,
        message: 'Inscription réussie',
        // Autres données que vous souhaitez renvoyer
      };
      return of(response);
    }
  }