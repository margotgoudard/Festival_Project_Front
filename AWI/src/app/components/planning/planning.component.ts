import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionComponent } from '../inscription/inscription.component';
import { InscriptionService } from 'src/app/services/inscription.service';
import { AnimationJeuPlanningComponent } from './animation-jeu-planning/animation-jeu-planning.component';
import { HttpClient } from '@angular/common/http';
import { Espace } from 'src/app/interfaces/espace.interface';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  weekend: string[] = ['Samedi', 'Dimanche'];
  private posteselect?: Poste = undefined;
  @Input() postes: Poste[] | Espace[] = [];
  @Input() creneaux: Creneau[] = [];
  espaces: Espace[] = [];

  posteDisponibles: { [postId: number]: { [creneau: string]: string | number } } = {};



  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpClient: HttpClient 
  ) {}

  ngOnInit() {
    // Fetch postes and creneaux from the backend when the component is initialized
    this.fetchPostes();
    this.fetchCreneaux();
    this.fetchEspaces();
  }

  initializePosteDisponibles() {
    this.postes.forEach(poste => {
      this.posteDisponibles[poste.id] = {};
      this.creneaux.forEach(creneau => {
        this.posteDisponibles[poste.id][creneau.heureDebut] = poste.placedisponible;
      });
    });
  }

  fetchPostes() {
    // Make a GET request to your backend API to fetch postes
    this.httpClient.get<Poste[]>('your-backend-api-url/postes').subscribe(
      (data: Poste[]) => {
        this.postes = data;
        this.initializePosteDisponibles();
      },
      (error) => {
        console.error('Error fetching postes:', error);
      }
    );
  }

  fetchCreneaux() {
    // Make a GET request to your backend API to fetch creneaux
    this.httpClient.get<Creneau[]>('your-backend-api-url/creneaux').subscribe(
      (data: Creneau[]) => {
        this.creneaux = data;
      },
      (error) => {
        console.error('Error fetching creneaux:', error);
      }
    );
  }

  fetchEspaces() {
    this.httpClient.get<Espace[]>('your-backend-api-url/espaces').subscribe(
      (data: Espace[]) => {
        this.espaces = data;
      },
      (error) => {
        console.error('Error fetching espaces:', error);
      }
    );
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

onButtonClick(jour: string, creneau: Creneau, posteId: number, heureDebut: string, poste: Poste): void {
  console.log(`creneau=${JSON.stringify(creneau)}`)
  console.log(`poste=${JSON.stringify(poste)}`)
  this.posteselect = poste
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
  } 
  if (poste.espaces && poste.espaces.length > 1) {
      // Ouvrir le composant AnimationJeuPlanningComponent avec les espaces spécifiques
      this.router.navigate(['/animation-jeu-planning']);
    } 
    else {
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