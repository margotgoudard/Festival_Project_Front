// creneau-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Jour } from 'src/app/enumeration/jour.enum';
import { Creneau } from 'src/app/interfaces/creaneau.interface';


@Component({
  selector: 'app-creneau-dialog',
  templateUrl: './creneau-dialog.component.html',
})
export class CreneauDialogComponent {

  jours = [Jour.Samedi, Jour.Dimanche];
  constructor(
    public dialogRef: MatDialogRef<CreneauDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { creneau: Creneau }
  ) {}

  onSaveClick(): void {
    console.log(this.data.creneau);
    this.dialogRef.close(this.data.creneau); // Pass the updated creneau back to the caller
  }

  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without saving changes
  }
}