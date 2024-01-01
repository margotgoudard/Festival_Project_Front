import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inscription-reussi-dialog',
  templateUrl: './inscription-reussi-dialog.component.html',
  styleUrls: ['./inscription-reussi-dialog.component.scss']
})
export class InscriptionReussiDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }, private dialogRef: MatDialogRef<InscriptionReussiDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
