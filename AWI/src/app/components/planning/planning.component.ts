import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionComponent } from '../inscription/inscription.component';


// Modèles de données (jours, créneaux horaires, postes, etc.) - Comme précédemment

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  weekend: string[] = ['Samedi', 'Dimanche'];

  creneaux: Creneau[] = [
    {heureDebut: '9h', heureFin: '11h',},
    {heureDebut: '11h', heureFin: '14h',},
    {heureDebut: '14h', heureFin: '17h',},
    {heureDebut: '17h', heureFin: '20h',}
  ];

  postes: Poste[] = [
    { nom: 'AnimationJeu', description: 'Animation de jeux' },
    { nom: 'Accueil', description: 'Accueil des participants' },
    { nom: 'VenteRestauration', description: 'Vente de restauration' },
    { nom: 'Cuisine', description: 'Préparation de repas' },
    { nom: 'Tombola', description: 'Gestion de la tombola' },
    { nom: 'ForumAssociation', description: 'Stand du forum des associations' },
  ];


  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openInscriptionDialog(jour: string, creneau: Creneau, poste: Poste): void {
    const dialogRef = this.dialog.open(InscriptionComponent, {
      width: '400px', // Personnalisez la largeur de la boîte de dialogue selon vos besoins
      data: { jour, creneau, poste } // Passez des données nécessaires à la boîte de dialogue
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Traitez les données d'inscription ici (par exemple, enregistrer dans une liste d'inscriptions)
      }
    });
  }
}