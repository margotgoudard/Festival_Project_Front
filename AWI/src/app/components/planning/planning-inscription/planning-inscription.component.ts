import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MockAuthService } from 'src/app/mocks/auth.service.mock';
import { MockPlanningService } from 'src/app/mocks/poste-creneau.service.mock';
import { MockUserService } from 'src/app/mocks/user.service.mock';

import { PlanningComponent } from '../planning.component';
import { Poste } from 'src/app/interfaces/poste.interface';

@Component({
  selector: 'app-planning-inscription',
  templateUrl: './planning-inscription.component.html',
  styleUrls: ['./planning-inscription.component.scss']
})
export class PlanningInscriptionComponent extends PlanningComponent {
  postes: Poste[] = []; // Replace 'any[]' with the actual type of your postes

  constructor(
    dialog: MatDialog,
    router: Router,
    httpClient: HttpClient, // Add this line to include httpClient
    authService: MockAuthService,
    planningService: MockPlanningService,
    private userService: MockUserService,
  ) {
    super(dialog, router, httpClient, authService, planningService); // Ensure to call the parent's constructor
  }
}