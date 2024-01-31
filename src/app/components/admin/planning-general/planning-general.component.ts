// votre-composant.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Festival } from 'src/app/interfaces/festival.interface';
import { Inscription } from 'src/app/interfaces/inscription.interfaces';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { User } from 'src/app/model/user.model';
import { FestivalService } from 'src/app/services/festival.service';
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
  
    displayedColumns: string[] = ['prenom', 'nom', 'email', 'tel', 'espace', 'jour', 'creneau'];
    usersLoaded = false; 
    selectedSearchField: string = 'prenom';
    recherche: string = '';
    selectedFestival: number = 0;
    festivals: Festival[] = []; 

  
    constructor(private festivalService: FestivalService, private planningService: InscriptionService, private userService: UserService, private router: Router) {}
  
    ngOnInit(): void {
      this.loadFestivals();
      this.loadUsers();
    }
  
  
    ngAfterViewInit() {
      // Applique le tri uniquement si les utilisateurs ont été chargés
      if (this.usersLoaded) {
        this.dataSource.sort = this.sort;
      }
    }

    loadFestivals() {
      this.festivalService.getFestivals().subscribe(
        (festivals: Festival[]) => {
          this.festivals = festivals;
    
          // Trouver le festival dont l'année correspond à l'année actuelle
          const currentYear = new Date().getFullYear();
          const defaultFestival = this.festivals.find(festival => festival.annee === currentYear);
        
          if (defaultFestival) {
            this.selectedFestival = defaultFestival.idF;
          } else {
            // Si aucun festival correspondant n'est trouvé, utilisez le premier festival de la liste (s'il y en a un)
            this.selectedFestival = this.festivals.length > 0 ? this.festivals[0].idF : 0;
          }
    
          // Charger les données pour le festival sélectionné par défaut
          this.loadUsers();
        },
        (error) => {
          console.error('Error loading festivals', error);
        }
      );
    }
  
    onFestivalChange(event: MatSelectChange) {
      // Réinitialiser la source de données avec un tableau vide
      this.dataSource.data = [];
    
      // Reload data when the selected festival changes
      this.selectedFestival = event.value;
      this.loadUsers();
    }
  
  
    loadUsers() {
      this.userService.getUsersRegistration(this.selectedFestival).subscribe(
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
                  console.log('Poste Info:', posteInfo); 
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

applyFilterNom(event: any) {
  console.log("data", this.dataSource.data)
  if (this.recherche.trim() !== '') {
  this.dataSource.data = this.dataSource.data.filter(item =>
    item.benevoleInfo.nom.toLowerCase().includes(this.recherche.toLowerCase()) ||
    item.benevoleInfo.prenom.toLowerCase().includes(this.recherche.toLowerCase())
  );
  } else {
    this.dataSource.data = this.dataSource.data; 
  }  
}

applyFilterEspace(event: any) {
  const filterValue = event.target.value.trim().toLowerCase();
  this.dataSource.data = this.dataSource.data.filter(item =>
    item.espaceInfo.libelleEspace.toLowerCase().includes(filterValue)
  );
}

applyFilterJour(event: any) {
  const filterValue = event.target.value.trim().toLowerCase();
  // Filtrer dans le champ 'jour' si nécessaire
  this.dataSource.data = this.dataSource.data.filter(item =>
    item.creneauInfo.jourCreneau.toLowerCase().includes(filterValue)
  );
}

applyFilterCreneau(event: any) {
  const filterValue = event.target.value.trim().toLowerCase();
  // Filtrer dans le champ 'creneau' si nécessaire
  this.dataSource.data = this.dataSource.data.filter(item =>
    item.creneau.heureDebut.toLowerCase().includes(filterValue)
  );
}


}
