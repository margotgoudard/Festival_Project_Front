// creneau-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { InscriptionService } from 'src/app/services/inscription.service';

@Component({
  selector: 'app-creneau-dialog',
  templateUrl: './creneau-dialog.component.html',
  styleUrls: ['./creneau-dialog.component.scss'],


})
export class CreneauDialogComponent {
  selectedCreneau: Creneau = { idC: 0, heureDebut: '', heureFin: '', jourCreneau: '', idF: 0 };
  newCreneau: Creneau = { idC: 0, heureDebut: '', heureFin: '', jourCreneau: '', idF: 0 };
  isEditing: boolean = false; 


  constructor(
    public dialogRef: MatDialogRef<CreneauDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { creneaux: Creneau[], selectedFestival: number },
    private inscriptionService: InscriptionService
  ) {}


  onCancelClick(): void {
    this.dialogRef.close(); 
  }


  onEditClick(): void {
    this.isEditing = true;
    this.newCreneau = { ...this.selectedCreneau };
  }


 
  onSaveClick(creneau: Creneau): void {
    creneau.idF = this.data.selectedFestival;
    
    // Add the new creneau to the creneaux array
    this.data.creneaux.push(creneau);
    
    this.inscriptionService.addCreneau(creneau, creneau.idF).subscribe(() => {
      this.dialogRef.close(this.data.creneaux);
    });
  } 

  // ...

  onDeleteClick(): void {
    if (this.selectedCreneau) {
      const index = this.data.creneaux.findIndex(c => c.idC === this.selectedCreneau.idC);
      if (index !== -1) {
        this.data.creneaux.splice(index, 1);
      }

      this.inscriptionService.deleteCreneau(this.selectedCreneau.idC).subscribe(() => {
        this.dialogRef.close(this.data.creneaux);
      });
    }
  }

  // ...

  onModifClick(creneau : Creneau): void {
    this.inscriptionService.updateCreneau(creneau).subscribe(() => {
      // Update the creneau in the creneaux array
      const index = this.data.creneaux.findIndex(c => c.idC === creneau.idC);
      if (index !== -1) {
        this.data.creneaux[index] = { ...creneau };
      }
      
      this.dialogRef.close(this.data.creneaux);
    });
  }

}

