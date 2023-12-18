import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlanningComponent } from '../planning.component';
import { Poste } from 'src/app/interfaces/poste.interface';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { PlanningService } from 'src/app/services/poste-creneau.service';

@Component({
  selector: 'app-planning-inscription',
  templateUrl: './planning-inscription.component.html',
  styleUrls: ['./planning-inscription.component.scss']
})
export class PlanningInscriptionComponent extends PlanningComponent {
  postes: Poste[] = []; 

  constructor(
    dialog: MatDialog,
    router: Router,
    httpClient: HttpClient, // Add this line to include httpClient
    authService: AuthService,
    planningService: PlanningService,
    private userService: UserService,
  ) {
    super(dialog, router, httpClient, authService, planningService); // Ensure to call the parent's constructor
  }
}