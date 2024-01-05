import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PosteDetailsComponent } from '../poste-details/poste-details.component';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {

  posteDetails: any; 
  referents: User[] = []; 
  previousVolunteers: User[] = []; 

  
  constructor(
    public dialogRef: MatDialogRef<InscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private inscriptionService: InscriptionService, private dialog: MatDialog
  ) {}

  ngOnInit() {

    const espace = this.data.posteEspacesMapping[0];
    const idEspace = espace ? espace.idEspace : null;
    
    this.inscriptionService.getPosteReferent(idEspace)
      .subscribe((referentData) => {
        this.referents = referentData;
        console.log('Référents du poste:', this.referents);
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
    const jour = this.data.jour;
    const creneau = this.data.creneau;
    const poste = this.data.poste;
  
    if (poste.placedisponible > 0) {
      // Effectuez l'inscription
      this.inscriptionService.inscrire(jour, creneau, poste).subscribe(
        (response) => {
          // Gérez la réussite de l'inscription ici
          console.log('Inscription réussie :', response);
        },
        (error) => {
          // Gérez les erreurs d'inscription ici
          console.error('Erreur lors de l\'inscription :', error);
        });
  
      this.dialogRef.close({ success: true, creneau, poste: this.data.poste });
    }
  }

}