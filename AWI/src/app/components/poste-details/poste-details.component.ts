// poste-details.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-poste-details',
  templateUrl: './poste-details.component.html',
  styleUrls: ['./poste-details.component.scss']
})
export class PosteDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public posteDetails: any,  public dialogRef: MatDialogRef<PosteDetailsComponent>) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

}