import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { PosteCreneauService } from 'src/app/services/poste-creneau.service';

@Component({
  selector: 'app-modify-dialog',
  templateUrl: './modify-dialog.component.html',
  styleUrls: ['./modify-dialog.component.scss']
})
export class ModifyDialogComponent {
  creneaux: Creneau[];
  postes: Poste[];
  selectedPoste: Poste | null = null;
  selectedCreneau: Creneau | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private posteCreneauService: PosteCreneauService // Inject your service
  ) {
    this.creneaux = data.creneaux;
    this.postes = data.postes;
  }

  // Function to handle editing a specific poste
  onEditPoste(poste: Poste): void {
    this.selectedPoste = { ...poste };
  }

  // Function to handle saving changes to a poste
  onSavePosteChanges(): void {
    if (this.selectedPoste) {
      const updatedPoste: Poste = {
        id: this.selectedPoste.id || 0,
        nom: this.selectedPoste.nom || '',
        description: this.selectedPoste.description || '',
        placedisponible: this.selectedPoste.placedisponible || 0,
        espaces: this.selectedPoste.espaces || []
      };
  
      this.posteCreneauService.updatePoste(updatedPoste).subscribe(
        () => {
          // Update the local postes array after a successful update
          const index = this.postes.findIndex(p => p.id === this.selectedPoste?.id);
          if (index !== -1) {
            this.postes[index] = { ...updatedPoste }; // Update the local array
          }
  
          // Reset selectedPoste to null after saving changes
          this.selectedPoste = null;
        },
        error => {
          console.error('Error updating poste:', error);
        }
      );
    }
  }

  // Function to handle editing a specific creneau
  onEditCreneau(creneau: Creneau): void {
    this.selectedCreneau = { ...creneau };
  }

  // Function to handle saving changes to a creneau
  onSaveCreneauChanges(): void {
    if (this.selectedCreneau) {
      const updatedCreneau: Creneau = {
        heureDebut: this.selectedCreneau.heureDebut || '', // Provide a default value if undefined
        heureFin: this.selectedCreneau.heureFin || '',     // Provide a default value if undefined
        jour: this.selectedCreneau.jour || ''              // Provide a default value if undefined
      };
  
      this.posteCreneauService.updateCreneau(updatedCreneau).subscribe(
        () => {
          // Update the local creneaux array after a successful update
          const index = this.creneaux.findIndex(c => c.heureDebut === this.selectedCreneau?.heureDebut);
          if (index !== -1) {
            this.creneaux[index] = { ...updatedCreneau }; // Update the local array
          }
  
          // Reset selectedCreneau to null after saving changes
          this.selectedCreneau = null;
        },
        error => {
          console.error('Error updating creneau:', error);
        }
      );
    }
  }
  // Function to handle adding a new creneau
onAddCreneau(): void {
  // Placeholder logic to add a new creneau
  const newCreneau: Creneau = {
    heureDebut: '', // Replace with the actual default value
    heureFin: '',   // Replace with the actual default value
    jour: ''       // Replace with the actual default value
  };

  this.posteCreneauService.addCreneau(newCreneau).subscribe(
    (addedCreneau) => {
      // Update the local creneaux array after a successful addition
      this.creneaux.push(addedCreneau);
    },
    (error) => {
      console.error('Error adding creneau:', error);
    }
  );
}

// Function to handle removing a creneau
onRemoveCreneau(creneau: Creneau): void {
  // Placeholder logic to remove the selected creneau
  this.posteCreneauService.removeCreneau(creneau).subscribe(
    () => {
      // Update the local creneaux array after a successful removal
      this.creneaux = this.creneaux.filter(c => c !== creneau);
    },
    (error) => {
      console.error('Error removing creneau:', error);
    }
  );
}

// Function to handle adding a new poste
onAddPoste(): void {
  // Placeholder logic to add a new poste
  const newPoste: Poste = {
    id: this.postes.length + 1,                // Replace with the actual logic to generate a unique ID
    nom: '',                          // Replace with the actual default value
    description: '',   // Replace with the actual default value
    placedisponible: 0,                       // Replace with the actual default value
    espaces: []                                // Replace with the actual default value
  };

  this.posteCreneauService.addPoste(newPoste).subscribe(
    (addedPoste) => {
      // Update the local postes array after a successful addition
      this.postes.push(addedPoste);
    },
    (error) => {
      console.error('Error adding poste:', error);
    }
  );
}

// Function to handle removing a poste
onRemovePoste(poste: Poste): void {
  // Placeholder logic to remove the selected poste
  this.posteCreneauService.removePoste(poste).subscribe(
    () => {
      // Update the local postes array after a successful removal
      this.postes = this.postes.filter(p => p !== poste);
    },
    (error) => {
      console.error('Error removing poste:', error);
    }
  );
}
  // Function to close the dialog
  onClose(): void {
    this.dialogRef.close();
  }
}