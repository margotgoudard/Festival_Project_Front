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

@Component({
  selector: 'app-inscription-attente-benevole',
  templateUrl: './inscription-attente-benevole.component.html',
  styleUrls: ['./inscription-attente-benevole.component.scss']
})
export class InscriptionAttenteBenevoleComponent implements OnInit {

  
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatSort) sort!: MatSort;
  
    displayedColumns: string[] = ['prenom', 'nom', 'email', 'tel', 'espace', 'jour', 'creneau', 'action'];
    usersLoaded = false; 
    selectedSearchField: string = 'prenom';
    pseudo: string ='';
  
    constructor(private dialog: MatDialog, private authService: AuthService, private planningService: InscriptionService, private userService: UserService, private router: Router) {}

    ngOnInit() {
      const loggedInUserPseudo = this.authService.getLoggedInUserPseudo();
      this.pseudo = loggedInUserPseudo !== null ? loggedInUserPseudo : '';
      this.loadUsers();
    }
  
  
    loadUsers() {
      this.userService.getUserRegistrationWaiting(this.pseudo).subscribe(
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
                    inscriptionId: userRegistrations[index].id,
                    inscriptionEspaceId: userRegistrations[index].espaceId,
                    inscriptionCreneauId: userRegistrations[index].creneauId,
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