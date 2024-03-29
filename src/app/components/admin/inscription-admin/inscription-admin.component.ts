import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PosteDetailsComponent } from '../../poste-details/poste-details.component';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { InscriptionReussiDialogComponent } from '../../inscription-reussi-dialog/inscription-reussi-dialog.component';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription-admin.component.html',
  styleUrls: ['./inscription-admin.component.scss']
})
export class InscriptionAdminComponent {

  posteDetails: any; 
  referents: User[] = []; 
  previousVolunteers: User[] = []; 

  
  constructor( private authService : AuthService, private userService:UserService, 
    public dialogRef: MatDialogRef<InscriptionAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private inscriptionService: InscriptionService, private dialog: MatDialog
  ) {}

  ngOnInit() {

    const espace = this.data.posteEspacesMapping[0];
    const idEspace = espace ? espace.idEspace : null;
    
    this.inscriptionService.getPosteReferent(idEspace)
      .subscribe((referentData) => {
        this.referents = referentData;
      });
      
    
        this.inscriptionService.getPreviousVolunteers(this.data.creneau.idC, idEspace)
      .subscribe((volunteersData) => {
        this.previousVolunteers = volunteersData;
      });
  } 



  
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onInscriptionClick() {
    const espace = this.data.posteEspacesMapping[0];
    const idEspace = espace ? espace.idEspace : null;
    const creneau = this.data.creneau;
    console.log("creneau", creneau);
    const poste = this.data.poste;
    const benevolePseudo = this.data.user.pseudo;
  
    if (this.data.totalPlaces > 0) {
      if (idEspace !== null && benevolePseudo !== null) {
        // Check if the user is already registered for the specified creneau and espace
        this.userService.getUserRegistrations(benevolePseudo, creneau.idF).subscribe(
          (registrations) => {
            const isAlreadyRegistered = registrations.some(registration =>
              registration.Creneau.idC === creneau.idC
            );
  
            if (!isAlreadyRegistered) {
              // If not already registered, proceed with the inscription
              this.inscriptionService.inscrireByAdmin(benevolePseudo, creneau.idC, idEspace, creneau.idF).subscribe(
                  (response) => {
                      // Gérez la réussite de l'inscription ici
                      console.log('Inscription réussie :', response);
                      
                      // Open the success dialog
                      this.openSuccessDialog('Inscription réussie');
                      
                      this.dialogRef.close({ success: true, creneau, poste: this.data.poste });
                  },
                  (error) => {
                      // Gérez les erreurs d'inscription ici
                      console.error('Erreur lors de l\'inscription :', error);
                  }
              );
          } else {
              // Handle case where user is already registered
              console.error('Erreur lors de l\'inscription : L\'utilisateur est déjà inscrit à ce creneau et cet espace.');
              // You may want to show an error message to the user
            }
          },
          (error) => {
            // Handle error fetching user registrations
            console.error('Erreur lors de la récupération des inscriptions de l\'utilisateur :', error);
          }
        );
      }
    }
  }

  openSuccessDialog(message: string): void {
    const dialogRef = this.dialog.open(InscriptionReussiDialogComponent, {
        data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
        // Handle actions after the dialog is closed, if needed
    });
}

}