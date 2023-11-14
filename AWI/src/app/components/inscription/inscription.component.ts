import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { MockInscriptionService } from 'src/app/mocks/inscription.service.mock';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PosteDetailsComponent } from '../poste-details/poste-details.component';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {

  posteDetails: any; // Adjust the type based on your data structure
  referentDetails: any; // Adjust the type based on your data structure
  previousVolunteers: any[] = []; // Adjust the type based on your data structure

  
  constructor(
    public dialogRef: MatDialogRef<InscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private inscriptionService: MockInscriptionService, private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Fetch référent and previous volunteers details from the backend
    this.inscriptionService.getPosteReferent(this.data.poste.id)
      .subscribe((referentData) => {
        this.referentDetails = referentData;
      });

    this.inscriptionService.getPreviousVolunteers(this.data.jour, this.data.creneau, this.data.poste.id)
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
  
      this.dialogRef.close({ success: true, jour, creneau, poste: this.data.poste });
    }
  }

  onDetailsClick() {
    const posteDetails = {
      nom: this.data.poste.nom,
      description: this.data.poste.description,
      placedisponible: this.data.poste.placedisponible
      // Add any other details you want to display
    };
  
    const dialogRef = this.dialog.open(PosteDetailsComponent, {
      width: '400px',
      data: { description: this.data.poste.description },
    });
      
     

  }
}