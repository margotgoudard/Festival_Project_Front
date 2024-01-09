// votre-composant.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Inscription } from 'src/app/interfaces/inscription.interfaces';
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
    usersLoaded = false; // Variable pour suivre si les utilisateurs ont été chargés
  
    constructor(private planningService: InscriptionService, private userService: UserService, private router: Router) {}
  
    ngOnInit() {
      // Charge les utilisateurs uniquement si ce n'est pas déjà fait
      if (!this.usersLoaded) {
        this.loadUsers();
      }
    }
  
    ngAfterViewInit() {
      // Applique le tri uniquement si les utilisateurs ont été chargés
      if (this.usersLoaded) {
        this.dataSource.sort = this.sort;
      }
    }
  
    loadUsers() {
      this.userService.getUsersRegistration().subscribe(
        (userRegistrations) => {
          const mappedUsers = userRegistrations.map(registration => ({
            benevolePseudo: registration.benevolePseudo,
            espaceId: registration.espaceId,
            creneauId: registration.creneauId,
            isAffected: registration.isAffected,
            isAccepted: registration.isAccepted
          })); 
    
          // Use forkJoin to wait for all requests to complete
          forkJoin(mappedUsers.map(user => 
            forkJoin({
              benevoleInfo: this.userService.getUserByPseudo(user.benevolePseudo),
              creneauInfo: this.planningService.getCreneauById(user.creneauId),
              espaceInfo: this.planningService.getEspaceById(user.espaceId),
            })
            )).subscribe(
              (results) => {
                // Update the user objects with fetched information
                this.dataSource.data = results.map((result, index) => {
                  const posteInfo = this.planningService.getPosteById(result.espaceInfo.posteId);
                  console.log('Poste Info:', posteInfo); // Log posteInfo to the console
                  console.log('Benevole Info:', result.benevoleInfo);

            
                  return {
                    benevoleInfo: result.benevoleInfo,
                    creneauInfo: result.creneauInfo,
                    espaceInfo: result.espaceInfo,
                    posteInfo: posteInfo,
                    ...mappedUsers[index]
                  };
                });
           
                this.usersLoaded = true;
              },
              (error) => {
                console.error('Error loading additional user info', error);
              }
            );
            }
  )}            
  
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

  afficherPlanningIndividuel(pseudo: string) {
    console.log("pseudo", pseudo)
    this.router.navigate(['planning-individuel-admin', pseudo]);
}

}
