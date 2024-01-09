import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Espace } from 'src/app/interfaces/espace.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { PlacerService } from 'src/app/services/placerService';

@Component({
  selector: 'app-modifier-places-dialog',
  templateUrl: './modifier-places-dialog.component.html',
  styleUrls: ['./modifier-places-dialog.component.scss']
})
export class ModifierPlacesDialogComponent {
  selectedEspace: Espace | null = null;
  selectedCreneau: Creneau | null = null;
  newNumberOfPlaces: number | null = null;

  constructor( private placerService: PlacerService,
    public dialogRef: MatDialogRef<ModifierPlacesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { espaces: Espace[], creneaux: Creneau[] }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.selectedEspace && this.selectedCreneau && this.newNumberOfPlaces !== null) {
      const espaceId = this.selectedEspace.idEspace;
      const creneauId = this.selectedCreneau.idC;
  
      this.placerService.updatePlaces(espaceId, creneauId, this.newNumberOfPlaces)
        .subscribe(updatedPlaces => {
          console.log('Mise à jour du nombre de places effectuée avec succès:', updatedPlaces);
          this.dialogRef.close();
        }, error => {
          console.error('Erreur lors de la mise à jour du nombre de places:', error);
          // Handle the error accordingly
        });
    } else {
      console.error('Sélections invalides ou nombre de places non défini.');
    }
  }
}
