import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jeu } from '../model/jeu.model';

@Injectable({
  providedIn: 'root'
})
export class JeuService {


  private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com/';
  
  constructor(private http: HttpClient) {}

  getJeuxByEspace(idEspace: number): Observable<Jeu[]> {
    const url = `${this.apiUrl}/jeux/${idEspace}`; 
    return this.http.get<Jeu[]>(url);
  }
  
}
