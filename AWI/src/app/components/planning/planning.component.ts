import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionComponent } from '../inscription/inscription.component';
import { InscriptionService } from 'src/app/services/inscription.service';


// Modèles de données (jours, créneaux horaires, postes, etc.) - Comme précédemment

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  weekend: string[] = ['Samedi', 'Dimanche'];


  postes: Poste[] = [
    { id: 1, nom: 'AnimationJeu', description: 'Animation de jeux', placedisponible: 5 },
    { id: 2, nom: 'Accueil', description: 'Accueil des participants', placedisponible: 5 },
    { id: 3, nom: 'VenteRestauration', description: 'Vente de restauration', placedisponible: 5 },
    { id: 4, nom: 'Cuisine', description: 'Préparation de repas', placedisponible: 5 },
    { id: 5, nom: 'Tombola', description: 'Gestion de la tombola', placedisponible: 5 },
    { id: 6, nom: 'ForumAssociation', description: 'Stand du forum des associations', placedisponible: 5 },
  ];

  creneaux: Creneau[] = [
    { heureDebut: '9h', heureFin: '11h' },
    { heureDebut: '11h', heureFin: '14h' },
    { heureDebut: '14h', heureFin: '17h' },
    { heureDebut: '17h', heureFin: '20h' },
  ];
  planningData: any[][] = [];
  posteDisponibles: { [postId: number]: { [creneau: string]: number } } = {};
  
  constructor(private dialog: MatDialog, private inscriptionService: InscriptionService) {
    this.initializePosteDisponibles();
  }

  ngOnInit() {}

  initializePosteDisponibles() {
    this.postes.forEach(poste => {
      this.posteDisponibles[poste.id] = {};
      this.creneaux.forEach(creneau => {
        this.posteDisponibles[poste.id][creneau.heureDebut] = poste.placedisponible;
      });
    });
  }

  // Inside PlanningComponent class
multipleSelection = false;
selectedButtons: { posteId: number, heureDebut: string }[] = [];

toggleMultipleSelection(): void {
  // Toggle the multiple selection mode
  this.multipleSelection = !this.multipleSelection;

  // Clear the selected buttons list when switching modes
  this.selectedButtons = [];
}

onButtonClick(jour: string, creneau: Creneau, posteId: number, heureDebut: string): void {
  if (this.multipleSelection) {
    // Multiple selection mode is active, add the button to the selected list
    const isSelected = this.isSelected(posteId, heureDebut);
    if (isSelected) {
      // Button is already selected, remove it from the list
      this.selectedButtons = this.selectedButtons.filter(button => !(button.posteId === posteId && button.heureDebut === heureDebut));
    } else {
      // Button is not selected, add it to the list
      this.selectedButtons.push({ posteId, heureDebut });
    }

    // Log the selected buttons to the console
    console.log('Selected Buttons:', this.selectedButtons);
  } else {
    // Your existing logic for handling button click
    const posteSelectionne = this.postes.find(p => p.id === posteId);
    if (posteSelectionne) {
      const creneauSelectionne = creneau;
      const jourSelectionne = jour;

      const dialogRef = this.dialog.open(InscriptionComponent, {
        width: '400px',
        data: { jour: jourSelectionne, creneau: creneauSelectionne, poste: posteSelectionne }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          // Update available slots and re-render the button
          posteSelectionne.placedisponible--;
        }
      });
    }
  }
}

isSelected(posteId: number, heureDebut: string): boolean {
  return this.selectedButtons.some(button => button.posteId === posteId && button.heureDebut === heureDebut);
}

inscrireATousLesPostes() {

  if (this.selectedButtons.length === 0) {
    // Affichez une alerte si aucun poste n'est sélectionné
    alert('Aucun poste sélectionné');
    return;
  }
  // Logique pour inscrire à tous les postes sélectionnés
  console.log("Inscription à tous les postes :", this.selectedButtons);
}

}