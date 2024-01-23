import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { InscriptionReussiDialogComponent } from '../../inscription-reussi-dialog/inscription-reussi-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Inscription } from 'src/app/interfaces/inscription.interfaces';
import { CandidaterService } from 'src/app/services/candidater.service';

@Component({
  selector: 'app-inscription-attente',
  templateUrl: './inscription-attente.component.html',
  styleUrls: ['./inscription-attente.component.scss']
})
export class InscriptionAttenteComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['prenom', 'nom', 'email', 'tel', 'espace', 'jour', 'creneau', 'action'];
  usersLoaded = false; 
  selectedSearchField: string = 'prenom';

  constructor(private dialog: MatDialog,private candidatureService: CandidaterService, private planningService: InscriptionService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Charge les utilisateurs uniquement si ce n'est pas déjà fait
    if (!this.usersLoaded) {
      this.loadData();    }
  }

  ngAfterViewInit() {
    // Applique le tri uniquement si les utilisateurs ont été chargés
    if (this.usersLoaded) {
      this.dataSource.sort = this.sort;
    }
  }

  loadData() {
    const userRegistrations$ = this.userService.getUsersRegistrationByAdmin();
    const candidatureWaiting$ = this.userService.getAllCandidaturesWainting();
  
    forkJoin({ userRegistrations$, candidatureWaiting$ }).subscribe(
      (result: { userRegistrations$: Inscription[]; candidatureWaiting$: Inscription[] }) => {
        const userRegistrations = result.userRegistrations$;
        const candidatureWaiting = result.candidatureWaiting$;
  
        const mappedUserRegistrations = userRegistrations.map(registration => ({
          benevolePseudo: registration.benevolePseudo,
          espaceId: registration.espaceId,
          creneauId: registration.creneauId,
          isAffected: registration.isAffected,
          isAccepted: registration.isAccepted,
          isRegistration: true,
        }));
  
        const mappedCandidatureWaiting = candidatureWaiting.map(candidature => ({
          benevolePseudo: candidature.benevolePseudo,
          espaceId: candidature.espaceId,
          creneauId: candidature.creneauId,
          isAffected: candidature.isAffected,
          isAccepted: candidature.isAccepted,
          isRegistration: false,
        }));
  
        const combinedData = [...mappedUserRegistrations, ...mappedCandidatureWaiting];
  
        forkJoin(
          combinedData.map(data =>
            forkJoin({
              benevoleInfo: this.userService.getUserByPseudo(data.benevolePseudo),
              creneauInfo: this.planningService.getCreneauById(data.creneauId),
              espaceInfo: this.planningService.getEspaceById(data.espaceId),
            })
          )
        ).subscribe(
          (results) => {
            this.dataSource.data = results.map((result, index) => {
              const posteInfo = this.planningService.getPosteById(result.espaceInfo.posteId);
  
              return {
                benevoleInfo: result.benevoleInfo,
                creneauInfo: result.creneauInfo,
                espaceInfo: result.espaceInfo,
                posteInfo: posteInfo,
                inscriptionId: candidatureWaiting[index]?.id,
                inscriptionEspaceId: candidatureWaiting[index]?.espaceId,
                inscriptionCreneauId: candidatureWaiting[index]?.creneauId,
                ...mappedCandidatureWaiting[index],
                // Add properties for candidatureWaiting as needed
              };
            });
  
            this.usersLoaded = true;
          },
          (error) => {
            console.error('Error loading additional user info', error);
          }
        );
      },
      (error) => {
        console.error('Error loading data', error);
      }
    );
  }
  
  validerCandidature(benevolePseudo: string, creneauId: number, espaceId: number): void {
    this.candidatureService.updateCandidature(benevolePseudo, creneauId, espaceId).subscribe(
      () => {
        const dialogRef = this.dialog.open(InscriptionReussiDialogComponent, {
          data: { message: 'Inscription réussie' }
        });

        // After the dialog is closed, trigger ngOnInit
        dialogRef.afterClosed().subscribe(result => {
          this.ngOnInit();
        });
      },
      (error) => {
        console.error('Erreur lors de la validation de l\'inscription', error);
      }
    );
  }

  supprimerCandidature(id: number): void {
    this.userService.deleteUserCandidature(id).subscribe({
      next: (response) => {
        console.log('Suppression réussie :', response);
        const dialogRef = this.dialog.open(InscriptionReussiDialogComponent, {
          data: { message: 'Suppression réussie' }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.ngOnInit();
        });
      },
      error: (error) => {
        console.error('Error deleting user registration', error);
      }
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

afficherPlanningIndividuel(pseudo: string) {
  console.log("pseudo", pseudo)
  this.router.navigate(['planning-individuel-admin', pseudo]);
}

applyFilterNom(event: any) {
const filterValue = event.target.value.trim().toLowerCase();
this.dataSource.data = this.dataSource.data.filter(item =>
  item.benevoleInfo.nom.toLowerCase().includes(filterValue)
);
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
