// planning-inscription.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poste } from 'src/app/interfaces/poste.interface';
import { Creneau } from 'src/app/interfaces/creaneau.interface';

@Component({
  selector: 'app-planning-inscription',
  templateUrl: './planning-inscription.component.html',
  styleUrls: ['./planning-inscription.component.css']
})
export class PlanningInscriptionComponent implements OnInit {
  postes: Poste[] = []; // Replace 'any[]' with the actual type of your postes
  creneaux: Creneau [] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Call a function to fetch postes when the component initializes
    this.fetchPostes();
    this.fetchCreneaux();
  }

  fetchPostes() {
    // Replace 'your-backend-api-url/postes' with the actual API endpoint for fetching postes
    this.http.get<any[]>('your-backend-api-url/postes').subscribe(
      (data) => {
        this.postes = data;
      },
      (error) => {
        console.error('Error fetching postes:', error);
      }
    );
  }

  fetchCreneaux() {
    this.http.get<any[]>('your-backend-api-url/creneaux').subscribe(
      (data) => {
        this.creneaux = data;
      },
      (error) => {
        console.error('Error fetching creneaux:', error);
      }
    );
  }


  // Other component logic...
}