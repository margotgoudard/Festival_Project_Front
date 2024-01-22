// poste-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Poste } from 'src/app/interfaces/poste.interface';


@Component({
  selector: 'app-poste-dialog',
  templateUrl: './poste-dialog.component.html',
})
export class PosteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PosteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { poste: Poste }
  ) {}

  onSaveClick(): void {
    this.dialogRef.close(this.data.poste); // Pass the updated poste back to the caller
  }

  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without saving changes
  }
}