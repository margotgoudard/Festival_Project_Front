import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Jour } from 'src/app/enumeration/jour.enum';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';

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
    private PlanningService: InscriptionService, 
    private cdr: ChangeDetectorRef,
    private router: Router,
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
        idP: this.selectedPoste.idP || 0,
        libellePoste: this.selectedPoste.libellePoste || '',
        espaces: this.selectedPoste.espaces || [],
      };
  
      this.PlanningService.updatePoste(updatedPoste).subscribe(
        () => {
          // Update the local postes array after a successful update
          const index = this.postes.findIndex(p => p.idP === this.selectedPoste?.idP);
          if (index !== -1) {
            this.postes[index] = { ...updatedPoste }; // Update the local array
          }
  
          // Reset selectedPoste to null after saving changes
          this.selectedPoste = null;
           // Close the dialog with the updated data
           this.dialogRef.close(updatedPoste);
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
        idC: this.selectedCreneau.idC,
        heureDebut: this.selectedCreneau.heureDebut || '', // Provide a default value if undefined
        heureFin: this.selectedCreneau.heureFin || '',     // Provide a default value if undefined
        jourCreneau: this.selectedCreneau.jourCreneau,
        idF: this.selectedCreneau.idF
      };
  
      this.PlanningService.updateCreneau(updatedCreneau).subscribe(
        () => {
          // Update the local creneaux array after a successful update
          const index = this.creneaux.findIndex(c => c.heureDebut === this.selectedCreneau?.heureDebut);
          if (index !== -1) {
            this.creneaux[index] = { ...updatedCreneau }; // Update the local array
          }
  
          // Reset selectedCreneau to null after saving changes
          this.selectedCreneau = null;
          this.dialogRef.close(updatedCreneau);
        },
        error => {
          console.error('Error updating creneau:', error);
        }
      );
    }
  }
  // Function to handle adding a new creneau
  onAddCreneau(): void {
    const newCreneau: Creneau = {
      idC: 0,
      heureDebut: '', 
      heureFin: '',   
      jourCreneau: Jour.Samedi ,
      idF: 0    
    };
  
    this.PlanningService.addCreneau(newCreneau, newCreneau.idF).subscribe(
      (addedCreneau) => {
        // Update the local creneaux array after a successful addition
        this.creneaux.push(addedCreneau);
  
        // Manually trigger change detection
        this.cdr.detectChanges();
  
        // Reload the current route
        this.router.navigate([this.router.url]);
      },
      (error) => {
        console.error('Error adding creneau:', error);
      }
    );
  }
  
  // Function to handle removing a creneau
  onRemoveCreneau(creneau: Creneau): void {
    // Placeholder logic to remove the selected creneau
    this.PlanningService.removeCreneau(creneau).subscribe(
      () => {
        // Update the local creneaux array after a successful removal
        this.creneaux = this.creneaux.filter(c => c !== creneau);
  
        // Reload the current route
        this.router.navigate([this.router.url]);
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
    idP: this.postes.length + 1, // Replace with the actual logic to generate a unique ID
    espaces: [] // Replace with the actual default value                             // Replace with the actual default value
    ,
    libellePoste: ''
  };

  this.PlanningService.addPoste(newPoste).subscribe(
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
  this.PlanningService.deletePoste(poste).subscribe(
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