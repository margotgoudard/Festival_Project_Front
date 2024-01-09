// votre-composant.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { User } from 'src/app/model/user.model';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-planning-general',
  templateUrl: './planning-general.component.html',
  styleUrls: ['./planning-general.component.scss']
})
export class PlanningGeneralComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['prenom', 'email', 'poste', 'espace', 'jour', 'creneau'];

  constructor(private planningService: InscriptionService ,private userService: UserService, private router: Router) {}

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
          benevolePseudo: registration.benevolePseudo,
          espaceId: registration.espaceId,
          creneauId: registration.creneauId,
        })); 

        this.dataSource.data = mappedUsers;

        this.fetchAdditionalUserInfo(mappedUsers);
      },
      (error) => {
        console.error('Error loading users', error);
      }
    );
  }

  fetchAdditionalUserInfo(users: any[]) {
    users.forEach(user => {
      this.userService.getUserByPseudo(user.benevolePseudo).subscribe(
        (benevoleInfo) => {
          console.log('Benevole Info:', benevoleInfo);
        },
        (error) => {
          console.error('Error fetching benevole info', error);
        }
      );

      this.planningService.getCreneauById(user.creneauId).subscribe(
        (creneauInfo) => {
          // Handle the creneau information, e.g., update the user object with creneauInfo
          console.log('Creneau Info:', creneauInfo);
        },
        (error) => {
          console.error('Error fetching creneau info', error);
        }
      );

      this.planningService.getEspaceById(user.espaceId).subscribe(
        (espaceInfo) => {
          // Handle the espace information, e.g., update the user object with espaceInfo
          console.log('Espace Info:', espaceInfo);
        },
        (error) => {
          console.error('Error fetching espace info', error);
        }
      );
    });
  }



  /*onSortAttributeChange(event: any) {
    // Update the current sorting attribute
    this.currentSortAttribute = event.value;

    // Apply sorting based on the selected attribute
    this.applySorting();
  }*/

  /*
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
  }*/

  afficherPlanningIndividuel(user: any) {
    // Check if user is defined and if the user.idUtilisateur is defined
    if (user && user.pseudo) {
      const userPseudo = user.pseudo;
      this.userService.setUserPseudo(userPseudo); // Set the userId in the service
      this.router.navigate(['planning-individuel', userPseudo]);
    } else {
      console.error('Données utilisateur incorrectes :', user);
    }
  }
}
