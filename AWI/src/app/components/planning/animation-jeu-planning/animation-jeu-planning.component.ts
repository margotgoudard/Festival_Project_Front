import { Component, Input } from '@angular/core';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { PlanningComponent } from '../planning.component';
import { Espace } from 'src/app/interfaces/espace.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-animation-jeu-planning',
  templateUrl: './animation-jeu-planning.component.html',
  styleUrls: ['./animation-jeu-planning.component.scss']
})
export class AnimationJeuPlanningComponent {
  espaces : Espace[] = []; // Replace 'any[]' with the actual type of your postes
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
        this.espaces = data;
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
