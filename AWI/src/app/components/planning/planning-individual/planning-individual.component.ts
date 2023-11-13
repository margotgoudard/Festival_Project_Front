// planning-individual.component.ts
import { Component, OnInit } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { InscriptionService } from 'src/app/services/inscription.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';

@Component({
  selector: 'app-planning-individual',
  templateUrl: './planning-individual.component.html',
  styleUrls: ['./planning-individual.component.scss'],
})
export class PlanningIndividualComponent extends PlanningComponent implements OnInit {
  userRegistrations: UserRegistration[] = [];

  constructor(
    dialog: MatDialog,
    router: Router,
    httpClient: HttpClient, // Add this line to include httpClient
    private userService: UserService,
  ) {
    super(dialog, router, httpClient); // Ensure to call the parent's constructor
  }

  override ngOnInit() {
    super.ngOnInit(); // Call the parent's ngOnInit method
    const userId = 'userId';
    this.fetchUserRegistrations(userId);
  }

  fetchUserRegistrations(userId: string) {
    this.userService.getUserRegistrations(userId).subscribe(
      (data) => {
        // Process user registrations and update the userRegistrations
        this.userRegistrations = data; // Adjust this based on your actual data structure
      },
      (error) => {
        console.error('Error fetching user registrations:', error);
      }
    );
  }

  isUserRegistered(postId: number, jour: string, heureDebut: string): boolean {
    // Assuming userRegistrations is an array of objects with postId, jour, and heureDebut properties
   return this.userRegistrations.some(
      (registration) =>
        registration.posteId === postId && registration.jour === jour && registration.heureDebut === heureDebut
    );
  }

}