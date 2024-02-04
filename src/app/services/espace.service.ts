import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Espace } from '../interfaces/espace.interface';
import {Jeu} from '../model/jeu.model';

@Injectable({
  providedIn: 'root'
})
export class EspaceService {


  private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
  //private apiUrl = 'http://localhost:3000'; 

    
  constructor(private http: HttpClient) {}

  createEspace(espace: Espace): Observable<Espace> {
    const url = `${this.apiUrl}/espace`;
    return this.http.post<Espace>(url, {
      "idEspace"          : espace.idEspace,
      "libelle": espace.libelleEspace,
      "isAnimation" : espace.isAnimation
    });
  }
  
}
