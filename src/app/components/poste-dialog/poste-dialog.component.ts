// poste-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { switchMap } from 'rxjs';
import { Espace } from 'src/app/interfaces/espace.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';


@Component({
  selector: 'app-poste-dialog',
  templateUrl: './poste-dialog.component.html',
  styleUrls: ['./poste-dialog.component.scss']

})
export class PosteDialogComponent{
  selectedPoste: Poste = { idP: 0, libellePoste: '', espaces: [] };
  newPoste: Poste = { idP: 0, libellePoste: '', espaces:[] };
  isEditing: boolean = false; 
  selectedEspace: Espace = { idEspace: 0, libelleEspace: '', posteId:0, isAnimation: false };
  newEspace: Espace = { idEspace: 0, libelleEspace: '', posteId:0, isAnimation: false };
  isAddingEspace: boolean = false;
  newEspaceLibelle: string = '';
  updatedLibelle: string = '';
  isEditingPoste: boolean = false;
  isAddingPoste: boolean = false;
  espaces: Espace[] = [];


  constructor(
    public dialogRef: MatDialogRef<PosteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postes : Poste[], espaces : Espace[], idF: number },
    private inscriptionService: InscriptionService
  ) { }

  onCancelClick() {
    this.dialogRef.close(); // Close the dialog without any action
  }

  onPosteChange(event: MatSelectChange) {
    this.selectedPoste = event.value;
  }

  onEspaceChange(event: MatSelectChange) {
    this.selectedEspace = event.value;
  }

  onEditPosteClick(selectedPoste: Poste) {
    this.isEditingPoste = true;
    this.isAddingPoste = false;
    if (selectedPoste) {
      this.newPoste = { ...this.selectedPoste };
    }
  }

  onEditEspaceClick(selectedEspace: Espace) {
    this.isEditing = true;
    if (selectedEspace) {
      this.newEspace = { ...this.selectedEspace };
    }
  }

  onAjouterPosteClick() {
    this.isAddingPoste = true;
    this.isEditingPoste = true
  }
  
  onDeletePosteClick(selectedPoste: Poste) {
    if (selectedPoste) {
      this.inscriptionService.deletePoste(selectedPoste).subscribe(() => {
        this.data.postes = this.data.postes.filter(poste => poste.idP !== selectedPoste.idP);
        this.selectedPoste = { idP: 0, libellePoste: '', espaces: [] };
      });
    }
  }

  onSavePosteClick(poste: Poste): void{
    this.inscriptionService.updatePoste(poste).subscribe(() => {
      this.dialogRef.close();
    });
  }

  onCancelEditPosteClick() {
    this.isEditingPoste = false;
  }
  
  getEspacesForSelectedPoste(): Espace[] {
    if (this.selectedPoste) {
      const selectedPosteId = this.selectedPoste.idP;
      return this.data.espaces.filter(espace => espace.posteId === selectedPosteId);
    }
    return [];
  }
  
  

  onDeleteEspaceClick(espace: Espace) {
    this.inscriptionService.deleteEspace(espace).subscribe(() => {
      if (this.selectedPoste) {
        this.selectedPoste.espaces = this.selectedPoste.espaces?.filter(e => e.idEspace !== espace.idEspace);
      }         
    });
  }

  onSaveEspaceClick(espace: Espace) {
    this.inscriptionService.updateEspace(espace).subscribe(() => {
      this.isEditing = false;
    });
  }

  onCancelEditEspaceClick() {
    this.isEditing = false;
  }

  onAddEspaceClick() {
    this.isAddingEspace = true;
  }

  onCancelAddEspaceClick() {
    this.isAddingEspace = false;
    this.newEspaceLibelle = '';
  }

  onSaveNewPosteClick(): void {
    this.inscriptionService.addPoste(this.newPoste, this.data.idF).subscribe((savedPoste) => {
      // Si un espace existant est sélectionné
      if (this.selectedEspace.idEspace != 0) {
        this.selectedEspace.posteId = savedPoste.idP; // Mettez à jour posteId pour l'espace existant
        this.inscriptionService.updateEspace(this.selectedEspace).subscribe(() => {
          savedPoste.espaces = [this.selectedEspace]; // Ajoutez l'espace existant à la liste d'espaces du poste
          this.data.postes.push(savedPoste); // Ajoutez le nouveau poste à la liste de postes
          this.resetFormFields();
        });
      } else if (this.newEspace.libelleEspace) {
        this.inscriptionService.getPosteByLibelle(this.newPoste, this.data.idF).pipe(
          switchMap((poste: Poste) => {
            this.newEspace.posteId = poste.idP;
            return this.inscriptionService.addEspace(this.newEspace, this.data.idF);
          })
        ).subscribe((savedEspace) => {
          savedPoste.espaces = [savedEspace];
          this.data.postes.push(savedPoste);
          this.resetFormFields();
        });
      }
    });
  }
  
  // Fonction pour réinitialiser les champs du formulaire
  private resetFormFields(): void {
    this.newPoste = { idP: 0, libellePoste: '', espaces: [] };
    this.selectedEspace = { idEspace: 0, libelleEspace: '', posteId: 0, isAnimation: false };
    this.newEspace = { idEspace: 0, libelleEspace: '', posteId: 0, isAnimation: false };
    this.isAddingEspace = false;
    this.newEspaceLibelle = '';
  }

  onSaveNewEspaceClick(): void {
      if (this.selectedEspace.idEspace != 0) {
        this.selectedEspace.posteId = this.selectedPoste.idP; // Mettez à jour posteId pour l'espace existant
        this.inscriptionService.updateEspace(this.selectedEspace).subscribe(() => {
          this.selectedPoste.espaces = [this.selectedEspace]; // Ajoutez l'espace existant à la liste d'espaces du poste
          this.data.postes.push(this.selectedPoste); // Ajoutez le nouveau poste à la liste de postes
          this.resetFormFields();
        });
      } else if (this.newEspace.libelleEspace) {
        this.inscriptionService.getPosteByLibelle(this.newPoste, this.data.idF).pipe(
          switchMap((poste: Poste) => {
            this.newEspace.posteId = poste.idP;
            return this.inscriptionService.addEspace(this.newEspace, this.data.idF);
          })
        ).subscribe((savedEspace) => {
          this.selectedPoste.espaces = [savedEspace];
          this.data.postes.push(this.selectedPoste);
          this.resetFormFields();
        });
      }

  }
  

}

