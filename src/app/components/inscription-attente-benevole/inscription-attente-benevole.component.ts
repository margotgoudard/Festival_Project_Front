import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { InscriptionReussiDialogComponent } from '../inscription-reussi-dialog/inscription-reussi-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Festival } from 'src/app/interfaces/festival.interface';
import { FestivalService } from 'src/app/services/festival.service';
import { MatSelectChange } from '@angular/material/select';
import { Poste } from 'src/app/interfaces/poste.interface';

@Component({
  selector: 'app-inscription-attente-benevole',
  templateUrl: './inscription-attente-benevole.component.html',
  styleUrls: ['./inscription-attente-benevole.component.scss']
})
export class InscriptionAttenteBenevoleComponent implements OnInit {

  
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatSort) sort!: MatSort;
  
    displayedColumns: string[] = ['prenom', 'nom', 'email', 'tel', 'poste', 'espace', 'jour', 'creneau', 'action'];
    usersLoaded = false; 
    selectedSearchField: string = 'prenom';
    pseudo: string ='';
    selectedFestival: number = 0;
    festivals: Festival[] = []; 
    poste: Poste = {idP: 0, libellePoste:'', espaces:[]};

  
    constructor(private festivalService: FestivalService, private dialog: MatDialog, private authService: AuthService, private planningService: InscriptionService, private userService: UserService, private router: Router) {}

    ngOnInit() {
      this.loadFestivals();
      const loggedInUserPseudo = this.authService.getLoggedInUserPseudo();
      this.pseudo = loggedInUserPseudo !== null ? loggedInUserPseudo : '';
      this.loadData();
    }
  
  
    loadData() {
      const userRegistrations$ = this.userService.getUserRegistrationWaiting(this.pseudo, this.selectedFestival);
      const candidatureWaiting$ = this.userService.getCandidatureWaiting(this.pseudo, this.selectedFestival);
    
      forkJoin({
        userRegistrations: userRegistrations$,
        candidatureWaiting: candidatureWaiting$
      }).subscribe(
        ({ userRegistrations, candidatureWaiting }) => {
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
                this.planningService.getPosteById(result.espaceInfo.posteId).subscribe(
                  (poste: Poste) => {
                    this.poste = poste;
    
                    // Move the return statement inside the subscription callback
                    this.dataSource.data = results.map((result, index) => {
                      return {
                        benevoleInfo: result.benevoleInfo,
                        creneauInfo: result.creneauInfo,
                        espaceInfo: result.espaceInfo,
                        posteInfo: this.poste,
                        inscriptionId: userRegistrations[index]?.id,
                        inscriptionEspaceId: userRegistrations[index]?.espaceId,
                        inscriptionCreneauId: userRegistrations[index]?.creneauId,
                        ...mappedUserRegistrations[index],
                      };
                    });
    
                    this.usersLoaded = true;
                  },
                  (error) => {
                    console.error('Error loading poste', error);
                  }
                );
              });
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
          this.loadData();
        },
        (error) => {
          console.error('Error loading festivals', error);
        }
      );
    }
  
    onFestivalChange(event: MatSelectChange) {
      this.selectedFestival = event.value;
      this.loadData();
    }
  
    

  validerInscription(benevolePseudo: string, creneauId: number, espaceId: number): void {
    this.planningService.updateRegistration(benevolePseudo, creneauId, espaceId).subscribe(
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

  refuserInscription(id: number): void {
    this.userService.deleteUserRegistration(id).subscribe({
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
    
}
