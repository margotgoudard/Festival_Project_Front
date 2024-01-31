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
    @Inject(MAT_DIALOG_DATA) public data: { creneaux: Creneau[] },
    private inscriptionService: InscriptionService
  ) {}


  onCancelClick(): void {
    this.dialogRef.close(); 
  }

  onSaveClick(creneau: Creneau): void {
    console.log("newcreneau",creneau)
      this.inscriptionService.addCreneau(creneau).subscribe(() => {
        this.dialogRef.close();
      });
  } 


  onEditClick(): void {
    this.isEditing = true;
    this.newCreneau = { ...this.selectedCreneau };
  }

  onDeleteClick(): void {
    if (this.selectedCreneau) {
      this.inscriptionService.deleteCreneau(this.selectedCreneau.idC).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onModifClick(creneau : Creneau): void {
    this.inscriptionService.updateCreneau(creneau).subscribe(() => {
      this.dialogRef.close();
    });
  }

}

