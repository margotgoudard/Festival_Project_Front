// votre-composant.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-planning-general',
  templateUrl: './planning-general.component.html',
  styleUrls: ['./planning-general.component.scss']
})
export class PlanningGeneralComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  currentSortAttribute: string = 'nomUtilisateur';

  displayedColumns: string[] = ['nomUtilisateur', 'prenom', 'email', 'poste', 'zone', 'espace', 'jour', 'creneau'];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  

  loadUsers() {
    this.userService.getUsersRegistration().subscribe(
      (userRegistrations) => {
        // Map UserRegistration objects to a format suitable for display
        const mappedUsers = userRegistrations.map(registration => ({
          idUtilisateur: registration.user.id,
          nomUtilisateur: registration.user.nom,
          prenom: registration.user.prenom,
          email: registration.user.email,
          idPoste: registration.poste.id,
          poste: registration.poste.nom, // Assuming 'poste' has a 'nom' property
          idZone: registration.zone.id,
          zone: registration.zone.nom, // Assuming 'poste' has a 'zone' property with 'nom'
          idEspace: registration.espace.id,
          espace: registration.espace.nom, // Assuming 'poste' has 'espaces' array and 'nom' property
          jour: registration.creneau.jour,
          idCreneau: registration.creneau,
          creneau: registration.creneau.heureDebut + ' - ' + registration.creneau.heureFin
        }));
  
        this.dataSource.data = mappedUsers;
      },
      (error) => {
        console.error('Error loading users', error);
      }
    );
  }

  onSortAttributeChange(event: any) {
    // Update the current sorting attribute
    this.currentSortAttribute = event.value;

    // Apply sorting based on the selected attribute
    this.applySorting();
  }

  applySorting() {
    // Check if dataSource and sort are defined
    if (this.dataSource && this.dataSource.sort) {
      // Sort the data based on the current attribute and direction
      this.dataSource.sort.sort({
        id: this.currentSortAttribute,
        start: 'asc', // Initial direction or 'asc' as needed
        disableClear: false,
      });
    } else {
      console.error('dataSource or sort is null');
    }
  }

  afficherPlanningIndividuel(user: any) {
    // Check if user is defined and if the user.idUtilisateur is defined
    if (user && user.idUtilisateur) {
      const userId = user.idUtilisateur;
      this.userService.setUserId(userId); // Set the userId in the service
      this.router.navigate(['planning-individuel', userId]);
    } else {
      console.error('Données utilisateur incorrectes :', user);
    }
  }
}
