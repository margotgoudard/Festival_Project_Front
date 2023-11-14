// planning-inscription.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poste } from 'src/app/interfaces/poste.interface';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { PosteCreneauService } from 'src/app/services/poste-creneau.service';
import { MockPosteCreneauService } from 'src/app/mocks/poste-creneau.service.mock';
import { PlanningComponent } from '../planning.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MockAuthService } from 'src/app/mocks/auth.service.mock';
import { MockUserService } from 'src/app/mocks/user.service.mock';

@Component({
  selector: 'app-planning-inscription',
  templateUrl: './planning-inscription.component.html',
  styleUrls: ['./planning-inscription.component.scss']
})
export class PlanningInscriptionComponent extends PlanningComponent implements OnInit {
  postes: Poste[] = []; // Replace 'any[]' with the actual type of your postes

  constructor(
    dialog: MatDialog,
    router: Router,
    httpClient: HttpClient, // Add this line to include httpClient
    authService: MockAuthService,
    planningService: MockPosteCreneauService,
    private userService: MockUserService,
  ) {
    super(dialog, router, httpClient, authService, planningService); // Ensure to call the parent's constructor
  }

  override ngOnInit() {
    // Call a function to fetch postes when the component initializes
    super.fetchData();
    this.fetchCreneaux();
  }

  fetchCreneaux() {
    this.planningService.getCreneaux().subscribe(
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