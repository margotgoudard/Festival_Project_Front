// poste-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Espace } from 'src/app/interfaces/espace.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';


@Component({
  selector: 'app-poste-dialog',
  templateUrl: './poste-dialog.component.html',
})
export class PosteDialogComponent {
  selectedPoste: Poste = { idP: 0, libellePoste: '', espaces: [] };
  newPoste: Poste = { idP: 0, libellePoste: '', espaces:[] };
  isEditing: boolean = false; 
  selectedEspace: Espace = { idEspace: 0, libelleEspace: '', posteId:0 };
  newEspace: Espace = { idEspace: 0, libelleEspace: '', posteId:0 };
  addingEspace: boolean = false;
  newEspaceLibelle: string = '';
  updatedLibelle: string = '';
  isEditingPoste: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<PosteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postes : Poste[], espaces : Espace[] },
    private inscriptionService: InscriptionService
  ) { }


  onCancelClick() {
    this.dialogRef.close(); // Close the dialog without any action
  }

  onEditPosteClick(selectedPoste: Poste) {
    this.isEditingPoste = true;
    if (selectedPoste) {
      this.newPoste = { ...this.selectedPoste };
    }
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
  
  onEditEspaceClick(espace: Espace) {
    this.isEditing = true;
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

  onCancelEditEspaceClick(espace: Espace) {
    this.isEditing = false;
  }

  onAddEspaceClick() {
    this.addingEspace = true;
  }

  onSaveNewEspaceClick() {
    if (this.selectedPoste) {
      const newEspace: Espace = { idEspace: 0, libelleEspace: this.newEspaceLibelle, posteId: this.selectedPoste.idP };
      this.inscriptionService.addEspace(newEspace).subscribe((savedEspace) => {
        this.selectedPoste?.espaces.push(savedEspace);
        this.addingEspace = false;
        this.newEspaceLibelle = '';
      });
    }
  }
  

  onCancelAddEspaceClick() {
    this.addingEspace = false;
    this.newEspaceLibelle = '';
  }
}

