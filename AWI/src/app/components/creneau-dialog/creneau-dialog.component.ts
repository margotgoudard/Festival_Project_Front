// creneau-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';


@Component({
  selector: 'app-creneau-dialog',
  templateUrl: './creneau-dialog.component.html',
})
export class CreneauDialogComponent {

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  constructor(
    public dialogRef: MatDialogRef<CreneauDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { creneau: Creneau }
  ) {}

  onSaveClick(): void {
    this.dialogRef.close(this.data.creneau); // Pass the updated creneau back to the caller
  }

  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without saving changes
  }
}