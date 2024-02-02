import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, map, switchMap } from 'rxjs';
import { Poste } from '../interfaces/poste.interface';
import { Creneau } from '../interfaces/creaneau.interface';
import { PosteDialogComponent } from '../components/poste-dialog/poste-dialog.component';
import { Espace } from '../interfaces/espace.interface';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  //private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
  private apiUrl = 'http://localhost:3000'; 
  
  constructor(private dialog: MatDialog, private http: HttpClient) { }

  inscrire(benevolePseudo: string, creneauId: number, espaceId: number, idF: number) {
    const url = `${this.apiUrl}/inscription/${benevolePseudo}/${creneauId}/${espaceId}/${idF}`;
    return this.http.post(url, {});
}

  updateRegistration(benevolePseudo: string, creneauId: number, espaceId: number): Observable<void> {
    const url = `${this.apiUrl}/inscription-update/${benevolePseudo}/${creneauId}/${espaceId}`;
    return this.http.put<void>(url, {});
  }

  inscrireByAdmin(benevolePseudo: string, creneauId: number, espaceId: number, idF: number) {
    const url = `${this.apiUrl}/inscriptionByAdmin/${benevolePseudo}/${creneauId}/${espaceId}/${idF}`;
    return this.http.post(url, {});
  }

  getPosteReferent(espaceId: number): Observable<User[]> {
    const url = `${this.apiUrl}/getPosteReferent/${espaceId}`; 
    return this.http.get<User[]>(url);

  }

  getPosteById(idP : number): Observable<Poste> {
    return this.http.get<Poste>(`${this.apiUrl}/poste/${idP}`);
  }

  getPreviousVolunteers(creneauId: number, espaceId: number): Observable<User[]> {
    const url = `${this.apiUrl}/volontairesPrecedents/${creneauId}/${espaceId}`; 
    return this.http.get<User[]>(url);
  }

  getPlanningInscription(): Observable<any> {
    return this.http.get(`${this.apiUrl}/planningInscription`);
  }

  getPostes(idF: number): Observable<Poste[]> {
    return this.http.get<Poste[]>(`${this.apiUrl}/postes/${idF}`);
  }


  getEspaces(idF: number): Observable<Espace[]> {
    return this.http.get<Espace[]>(`${this.apiUrl}/espaces/${idF}`);
  }

  getCreneaux(idF: number): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(`${this.apiUrl}/creneaux/${idF}`);
  }
  
  // Function to add a new creneau
  addCreneau(creneau: Creneau, idF: number): Observable<Creneau> {
          const url = `${this.apiUrl}/creneau/${creneau.heureDebut}/${creneau.heureFin}/${creneau.jourCreneau}/${idF}`;
          return this.http.post<Creneau>(url, {});
  }

  // Function to remove a creneau
  removeCreneau(creneau: Creneau): Observable<void> {
    const url = `${this.apiUrl}/creneaux/${creneau.heureDebut}`;
    return this.http.delete<void>(url);
  }

  // Function to add a new poste
  addPoste(poste: Poste, idF: number): Observable<Poste> {
    const url = `${this.apiUrl}/creer-poste/${poste.libellePoste}/${idF}`;
    return this.http.post<Poste>(url, poste);
  }

  // Function to update a poste
  updatePoste(poste: Poste | null): Observable<any> {
    if (poste) {
      const url = `${this.apiUrl}/poste/${poste.idP}`;
      return this.http.put<any>(url, poste);
    } else {
      return new Observable(); 
    }
  }

  deletePoste(poste: Poste): Observable<void> {
    const url = `${this.apiUrl}/poste/${poste.idP}`;
    return this.http.delete<void>(url);
  }

  deleteEspace(espace: Espace): Observable<void> {
    const url = `${this.apiUrl}/delete-espace/${espace.idEspace}`;
    return this.http.delete<void>(url);
  }

  updateEspace(espace: Espace): Observable<Espace> {
    const url = `${this.apiUrl}/update-espace/${espace.idEspace}`;
    return this.http.put<Espace>(url, espace);
  }

  addEspace(espace: Espace, idF: number): Observable<Espace> {
    const url = `${this.apiUrl}/creer-espace/${idF}`;
    return this.http.post<Espace>(url, {espace});
  }

  // Function to update a creneau
  updateCreneau(creneau: Creneau): Observable<Creneau> {
    const url = `${this.apiUrl}/creneau/${creneau.idC}`;
    return this.http.put<Creneau>(url, creneau);
  }

  getAllEspacesByPosteId(posteId: number): Observable<any[]> {
    const url = `${this.apiUrl}/espaces/${posteId}`;  
    return this.http.get<any[]>(url);
  }

  getCreneauById(creneauId: number): Observable<Creneau> {
    return this.http.get<any>(`${this.apiUrl}/creneau/${creneauId}`);
  }

  getEspaceById(espaceId: number): Observable<Espace> {
    return this.http.get<any>(`${this.apiUrl}/espace/${espaceId}`);
  }

  deleteCreneau(creneauId: number): Observable<void> {
    const url = `${this.apiUrl}/creneau/${creneauId}`;
    return this.http.delete<void>(url);
  }

  getPosteByLibelle(poste: Poste, idF: number): Observable<Poste> {
    const url = `${this.apiUrl}/poste/${poste.libellePoste}/${idF}`;
    return this.http.get<Poste>(url);
  }
}