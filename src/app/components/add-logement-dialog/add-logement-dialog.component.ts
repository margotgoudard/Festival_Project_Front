import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Hebergement } from 'src/app/model/herbegement.model';
import { HebergementService } from 'src/app/services/hebergement.service';
import { InscriptionReussiDialogComponent } from '../inscription-reussi-dialog/inscription-reussi-dialog.component';

@Component({
  selector: 'app-add-logement-dialog',
  templateUrl: './add-logement-dialog.component.html',
  styleUrls: ['./add-logement-dialog.component.scss']
})
export class AddLogementDialogComponent {

  addresseHebergement: string = '';
  nbPlaces: number = 0;
  hebergement : Hebergement = {idH : 0, adresseHebergement : '', nbPlaces : 0, pseudo: ''};

  constructor(
    public dialogRef: MatDialogRef<AddLogementDialogComponent>,
    private dialog: MatDialog,
    private hebergementService: HebergementService,
    @Inject(MAT_DIALOG_DATA) public data: { pseudo: string }

  ) {}

  onSubmit() {
    // Vérifiez si l'adresse et la capacité sont renseignées
    if (this.addresseHebergement && this.nbPlaces > 0) {
      this.hebergement.adresseHebergement= this.addresseHebergement;
      this.hebergement.nbPlaces= this.nbPlaces;
      // Enregistrez le logement en base de données en utilisant le service
      this.hebergementService.addHebergement(this.hebergement, this.data.pseudo)
        .subscribe(response => {
          // Vous pouvez traiter la réponse si nécessaire
          console.log('Logement ajouté avec succès:', response);

          this.openSuccessDialog('Ajout réussi');

          this.dialogRef.close(this.hebergement);
        }, error => {
          console.error('Erreur lors de l\'ajout du logement:', error);
        });                      
    } else {
      console.error('Veuillez remplir tous les champs.');
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
