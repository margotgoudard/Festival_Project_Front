import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Jeu } from '../model/jeu.model';

@Injectable({
  providedIn: 'root'
})
export class JeuService {


  private apiUrl = 'http://localhost:3000';
  
  constructor(private http: HttpClient) {}

  getJeuxByEspace(idEspace: number): Observable<Jeu[]> {
    const url = `${this.apiUrl}/jeux/${idEspace}`; 
    return this.http.get<Jeu[]>(url);
  }
  
}
