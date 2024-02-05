import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Association } from '../model/association.model';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

//private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
  private apiUrl = 'http://localhost:3000'; 
  
   constructor( private http: HttpClient) { }

 getUserAssociation(pseudo: string): Observable<Association> {
   const url = `${this.apiUrl}/associationByBenevole/${pseudo}`;
   return this.http.get<Association>(url);
 }

 updateAssociation(association: Association): Observable<any> {
  const url = `${this.apiUrl}/association/${association}`;
  return this.http.put(url, association);
}

}
